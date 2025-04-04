from urllib.request import urlopen
from urllib.parse import urlencode
import pandas as pd
import xmltodict
import folium

# API 키
API_KEY = 'NJYC1dEe%2Fs39fDNJdiJY4SNdYXhUohF7SYGftskQS2EFuJv8a%2FlAKRz4Bs50HK8PkFVXoavfYsbMg2%2F5BSVtPQ%3D%3D'

# 대한민국 행정구역 GeoJson
geo_json = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_geo_simple.json'


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


# 시각화 함수
def visualization(item_code):
    """미세먼지 데이터를 지도에 시각화하는 함수"""
    data = fetch_data(item_code)

    if not data:
        print("Data is empty.")
        return

    df = pd.DataFrame(data)
    df.drop(columns=['itemCode', 'dataGubun'], inplace=True, errors='ignore')
    df.set_index('dataTime', inplace=True)
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0).astype(int)

    region = pd.DataFrame(df.mean(axis=0), columns=[f'avg_{item_code}']).reset_index()
    kor = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시',
           '울산광역시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도',
           '제주특별자치도', '세종특별자치시']

    region['name'] = kor
    region.drop(columns=['index'], inplace=True, errors='ignore')
    region[f'avg_{item_code}'] = region[f'avg_{item_code}'].astype(int)

    # 지도 시각화
    m = folium.Map(location=[36.9788, 127.8622], tiles='CartoDB positron', zoom_start=7)

    folium.Choropleth(
        geo_data=geo_json,
        name='choropleth',
        data=region,
        columns=['name', f'avg_{item_code}'],
        key_on='feature.properties.name',
        fill_color='YlOrRd',
        fill_opacity=0.7,
        line_opacity=0.2,
        legend_name=f'평균 {item_code} 농도 (㎍/m³)'
    ).add_to(m)

    # 파일 저장
    file_name = f'dust_Map_{item_code}.html'
    m.save(file_name)
    print(f"{file_name} 파일이 생성되었습니다.")


# 사용 방법
visualization('PM10') # PM10 지도 생성
visualization('PM25') # PM2.5 지도 생성

