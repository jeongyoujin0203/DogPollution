import pandas as pd
import xmltodict
import folium
import requests

# API 키
API_KEY = '6b67705043796f7535306673774764'

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


# 시각화 함수
def visualize_seoul_air_quality(pollutant):
    """서울 25개 구의 미세먼지 데이터를 지도에 시각화"""
    df = fetch_seoul_air_quality()
    if df is None or df.empty:
        print("데이터 없음")
        return

    if pollutant not in ['PM10', 'PM25']:
        print("잘못된 입력: 'PM10' 또는 'PM25'만 선택 가능")
        return

    # 지도 초기화 (서울 중심)
    m = folium.Map(location=[37.5665, 126.9780], zoom_start=11, tiles='CartoDB positron')

    # 지도에 색칠하기
    folium.Choropleth(
        geo_data=SEOUL_GEOJSON,
        name=pollutant,
        data=df,
        columns=['MSRSTENAME', pollutant],
        key_on="feature.properties.name",
        fill_color="YlOrRd",
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name=f"{pollutant} 농도 (㎍/m³)"
    ).add_to(m)

    # 지도 저장
    file_name = f'seoul_dust_Map_{pollutant}.html'
    m.save(file_name)
    print(f"서울 {pollutant} 미세먼지 지도 생성 완료: {file_name}")


# 실행
visualize_seoul_air_quality('PM10')  # PM10 지도 생성
visualize_seoul_air_quality('PM25')  # PM2.5 지도 생성
