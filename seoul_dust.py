from urllib.request import urlopen
import pandas as pd
import xmltodict
import requests

# API 키
API_KEY = '6b67705043796f7535306673774764'


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
    cols_to_numeric = ['PM10', 'PM25']
    for col in cols_to_numeric:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    return df


# 특정 행정구역의 미세먼지 농도 조회
def pollutant(adm_code, pollutant_type):
    """특정 행정구역 코드에 대한 PM10 또는 PM25 값을 조회"""
    df = fetch_seoul_air_quality()
    if df is None or df.empty:
        print("데이터 없음")
        return

    if pollutant_type not in ['PM10', 'PM25']:
        print("잘못된 입력: 'PM10' 또는 'PM25'만 선택 가능")
        return

    result = df[df['MSRADMCODE'] == str(adm_code)][['MSRDATE', pollutant_type]]

    if result.empty:
        print("해당 행정구역 코드의 데이터가 없음")
        return

    return result.to_dict(orient='records')[0]


# 실행 예시
adm_code = '111121'  # 중구 행정구역 코드
print(pollutant(adm_code, 'PM10'))  # PM10 데이터 조회
print(pollutant(adm_code, 'PM25'))  # PM2.5 데이터 조회
