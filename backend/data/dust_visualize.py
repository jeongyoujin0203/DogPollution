from urllib.request import urlopen
from urllib.parse import urlencode
import pandas as pd
import xmltodict
import folium
from flask import Blueprint, request, Response

# API 키
API_KEY = ''

# 대한민국 행정구역 GeoJSON
GEO_JSON = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_geo_simple.json'


# 데이터 요청 함수
def fetch_data(item_code):
    """API에서 미세먼지 데이터를 가져오는 함수"""
    url = f'http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst?serviceKey={API_KEY}&'
    queryParams = urlencode({
        'numOfRows': '31',
        'pageNo': '1',
        'itemCode': item_code,
        'dataGubun': 'DAILY',
        'searchCondition': 'WEEK'
    })
    response = urlopen(url + queryParams)
    results = response.read().decode("utf-8")
    data = xmltodict.parse(results)
    return data.get('response', {}).get('body', {}).get('items', {}).get('item', [])


def get_dust_visualization_html(item_code):
    """미세먼지 데이터를 지도에 시각화하고 HTML 문자열로 반환하는 함수"""
    data = fetch_data(item_code)
    if not data:
        return "<h3>데이터 없음</h3>"

    df = pd.DataFrame(data)
    df.drop(columns=['itemCode', 'dataGubun'], inplace=True, errors='ignore')
    df.set_index('dataTime', inplace=True)
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0).astype(int)

    # 지역별 평균 계산
    region = pd.DataFrame(df.mean(axis=0), columns=[f'avg_{item_code}']).reset_index()

    # 행정구역 명칭 매핑
    kor = ['서울특별시', '부산광역시', '대구광역시', '인천광역시',
           '광주광역시', '대전광역시', '울산광역시', '경기도',
           '강원도', '충청북도', '충청남도', '전라북도',
           '전라남도', '경상북도', '경상남도', '제주특별자치도', '세종특별자치시']
    region['name'] = kor
    region.drop(columns=['index'], inplace=True, errors='ignore')
    region[f'avg_{item_code}'] = region[f'avg_{item_code}'].astype(int)

    # 지도 초기화 (대한민국 중심)
    m = folium.Map(location=[36.9788, 127.8622], tiles='CartoDB positron', zoom_start=7)

    # Choropleth 생성 (평균 미세먼지 농도 기준 색상 표시)
    choropleth = folium.Choropleth(
        geo_data=GEO_JSON,
        name='choropleth',
        data=region,
        columns=['name', f'avg_{item_code}'],
        key_on='feature.properties.name',
        fill_color='YlOrRd',
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name=f'평균 {item_code} 농도 (㎍/m³)'
    ).add_to(m)

    # 각 행정구역의 평균 미세먼지 농도 추가
    for feature in choropleth.geojson.data['features']:
        region_name = feature['properties']['name']
        match = region.loc[region['name'] == region_name, f'avg_{item_code}']
        if not match.empty:
            feature['properties'][f'avg_{item_code}'] = int(match.values[0])
        else:
            feature['properties'][f'avg_{item_code}'] = 0

    # GeoJsonTooltip 추가: 클릭 시 지역명과 미세먼지 농도 표시
    choropleth.geojson.add_child(
        folium.features.GeoJsonTooltip(
            fields=['name', f'avg_{item_code}'],
            aliases=['지역명', f'{item_code} 농도'],
            localize=True
        )
    )

    # HTML 문자열로 지도 반환
    return m.get_root().render()


# Flask Blueprint 생성 및 엔드포인트 정의
dust_viz_bp = Blueprint('dust_viz_bp', __name__)

@dust_viz_bp.route('/api/dust/province/<item_code>', methods=['GET'])
def province_dust(item_code):
    """GET 요청: 전국 평균 미세먼지 지도를 HTML로 제공하는 엔드포인트
       URL 경로 변수:
         - item_code: 'PM10' 또는 'PM25'
    """
    if item_code not in ['PM10', 'PM25']:
        return Response("<h3>잘못된 입력: 'PM10' 또는 'PM25'만 선택 가능</h3>", mimetype='text/html')
    html_content = get_dust_visualization_html(item_code)
    return Response(html_content, mimetype='text/html')


# 기존 사용 예시 실행 코드는 제거 (Flask 앱에서 Blueprint를 등록하여 사용)
