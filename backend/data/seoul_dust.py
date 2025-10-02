import os
from dotenv import load_dotenv
import pandas as pd
import xmltodict
import requests

# .env 파일에서 환경변수를 읽어들이도록 초기화
load_dotenv()

# 환경변수 SEOUL_API_KEY 사용
API_KEY = os.getenv('SEOUL_API_KEY')
if not API_KEY:
    raise RuntimeError("환경변수 SEOUL_API_KEY가 설정되지 않았습니다.")

def fetch_seoul_air_quality():
    """서울 25개 구의 미세먼지 데이터를 API에서 가져오는 함수"""
    url = f'http://openAPI.seoul.go.kr:8088/{API_KEY}/xml/ListAirQualityByDistrictService/1/25/'
    response = requests.get(url)
    response.raise_for_status()

    data = xmltodict.parse(response.content)
    items = data.get('ListAirQualityByDistrictService', {}).get('row', [])
    df = pd.DataFrame(items)

    # 숫자형 데이터 변환
    cols_to_numeric = ['PM10', 'PM25']
    for col in cols_to_numeric:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    return df

def pollutant(adm_code, pollutant_type):
    """특정 행정구역 코드에 대한 PM10 또는 PM25 값을 조회"""
    df = fetch_seoul_air_quality()
    if df is None or df.empty:
        print("데이터 없음")
        return None

    if pollutant_type not in ['PM10', 'PM25']:
        raise ValueError("pollutant_type은 'PM10' 또는 'PM25'만 가능합니다.")

    result = df[df['MSRADMCODE'] == str(adm_code)][['MSRDATE', pollutant_type]]
    if result.empty:
        print("해당 행정구역 코드의 데이터가 없습니다.")
        return None

    return result.to_dict(orient='records')[0]

# 실행 예시
if __name__ == '__main__':
    adm_code = '111121'  # 중구 행정구역 코드
    print(pollutant(adm_code, 'PM10'))
    print(pollutant(adm_code, 'PM25'))