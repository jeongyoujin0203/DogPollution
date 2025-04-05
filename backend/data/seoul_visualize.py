import pandas as pd
import xmltodict
import folium
import requests
from flask import Blueprint, request, Response

# API 키
API_KEY = ''

# 서울 행정구역 GeoJSON
SEOUL_GEOJSON = 'https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json'


# 데이터 요청 함수
def fetch_seoul_air_quality():
    """서울 25개 구의 미세먼지 데이터를 API에서 가져오는 함수"""
    url = f'http://openAPI.seoul.go.kr:8088/{API_KEY}/xml/ListAirQualityByDistrictService/1/25/'
    response = requests.get(url)

    if response.status_code != 200:
        print("API 요청 실패")
        return None

    data = xmltodict.parse(response.content)

    # XML 파싱 후 데이터 정리
    items = data.get('ListAirQualityByDistrictService', {}).get('row', [])
    df = pd.DataFrame(items)

    # 숫자형 데이터 변환
    cols_to_numeric = ['MAXINDEX', 'PM10', 'PM25', 'NITROGEN', 'OZONE', 'CARBON', 'SULFUROUS']
    for col in cols_to_numeric:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    return df


def get_seoul_air_quality_html(pollutant):
    """서울 25개 구의 미세먼지 데이터를 지도에 시각화하고 HTML 문자열로 반환하는 함수"""
    df = fetch_seoul_air_quality()
    if df is None or df.empty:
        return "<h3>데이터 없음</h3>"

    if pollutant not in ['PM10', 'PM25']:
        return "<h3>잘못된 입력: 'PM10' 또는 'PM25'만 선택 가능</h3>"

    # 지도 초기화 (서울 중심)
    m = folium.Map(location=[37.5665, 126.9780], zoom_start=11, tiles='CartoDB positron')

    # 툴팁에는 NaN 대신 "점검중"을 보여주기 위해 문자열 형태로 저장할 컬럼 생성
    df['ValueForTooltip'] = df[pollutant].apply(lambda x: '점검중' if pd.isna(x) else str(int(x)))

    # Choropleth 생성 (색칠 기준은 원본 numeric 값 사용)
    choropleth = folium.Choropleth(
        geo_data=SEOUL_GEOJSON,
        name=pollutant,
        data=df,
        columns=['MSRSTENAME', pollutant],
        key_on="feature.properties.name",
        fill_color="YlOrRd",
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name=f"{pollutant} 농도 (㎍/m³)",
        nan_fill_color='white'
    )
    choropleth.add_to(m)

    # 각 지역의 tooltip에 미세먼지 수치 추가 (NaN일 경우 '점검중' 표시)
    for feature in choropleth.geojson.data['features']:
        region_name = feature['properties']['name']
        tooltip_value = df.loc[df['MSRSTENAME'] == region_name, 'ValueForTooltip']
        if not tooltip_value.empty:
            feature['properties']['tooltip_text'] = tooltip_value.values[0]
        else:
            feature['properties']['tooltip_text'] = '점검중'

    choropleth.geojson.add_child(
        folium.features.GeoJsonTooltip(
            fields=['name', 'tooltip_text'],
            aliases=['구 이름', f'{pollutant} 농도']
        )
    )

    # HTML 문자열로 지도 반환
    return m.get_root().render()


# Flask Blueprint 생성 및 엔드포인트 정의
seoul_viz_bp = Blueprint('seoul_viz_bp', __name__)

@seoul_viz_bp.route('/api/dust/seoul/<pollutant>', methods=['GET'])
def seoul_dust(pollutant):
    """GET 요청: 서울 미세먼지 지도를 HTML로 제공하는 엔드포인트
       URL 경로 변수:
         - pollutant: 'PM10' 또는 'PM25'
    """
    if pollutant not in ['PM10', 'PM25']:
        return Response("<h3>잘못된 입력: 'PM10' 또는 'PM25'만 선택 가능</h3>", mimetype='text/html')
    html_content = get_seoul_air_quality_html(pollutant)
    return Response(html_content, mimetype='text/html')


# 기존 실행 코드는 제거 (Flask 앱에서 Blueprint를 등록하여 사용)
