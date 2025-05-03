# backend/data/seoul_visualize.py
"""
서울 미세먼지 데이터 JSON API 모듈
- 기존 Folium 시각화 대신, 지역별 미세먼지 수치를 JSON으로 전달
"""
import pandas as pd
import xmltodict
import requests
from flask import Blueprint, jsonify

# API 키
API_KEY = '6b67705043796f7535306673774764'

# 서울 미세먼지 데이터 요청 함수

def fetch_seoul_air_quality():
    """
    서울 25개 구의 미세먼지 데이터를 API에서 가져오는 함수
    반환: pandas.DataFrame (MSRSTENAME, PM10, PM25 컬럼 포함)
    """
    url = f'http://openAPI.seoul.go.kr:8088/{API_KEY}/xml/ListAirQualityByDistrictService/1/25/'
    resp = requests.get(url)
    if resp.status_code != 200:
        return pd.DataFrame()
    data = xmltodict.parse(resp.content)
    items = data.get('ListAirQualityByDistrictService', {}).get('row', [])
    df = pd.DataFrame(items)
    # 숫자형 변환
    for col in ['PM10', 'PM25']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    return df[['MSRSTENAME', 'PM10', 'PM25']]

# Flask Blueprint 정의
seoul_viz_bp = Blueprint('seoul_viz_bp', __name__)

@seoul_viz_bp.route('/api/dust/seoul/<pollutant>', methods=['GET'])
def seoul_dust(pollutant):
    """
    GET: 서울 미세먼지 지역별 데이터 JSON 반환
      - pollutant: 'PM10' 또는 'PM25'
    응답 예시:
      {
        "pollutant": "PM10",
        "data": [
          {"region": "종로구", "value": 45},
          ...
        ]
      }
    """
    if pollutant not in ['PM10', 'PM25']:
        return jsonify({'error': "잘못된 pollutant: 'PM10' 또는 'PM25'만 허용"}), 400
    df = fetch_seoul_air_quality()
    if df.empty:
        return jsonify({'error': '데이터 없음'}), 500
    result = []
    for _, row in df.iterrows():
        val = None if pd.isna(row[pollutant]) else int(row[pollutant])
        result.append({'region': row['MSRSTENAME'], 'value': val})
    return jsonify({'pollutant': pollutant, 'data': result})


# backend/data/dust_visualize.py
"""
전국 평균 미세먼지 데이터 JSON API 모듈
- 기존 Folium 시각화 대신, 도/광역시별 평균 수치를 JSON으로 전달
"""
from urllib.request import urlopen
from urllib.parse import urlencode
import pandas as pd
import xmltodict
from flask import Blueprint, jsonify

# API 키
API_KEY = 'NJYC1dEe%2Fs39fDNJdiJY4SNdYXhUohF7SYGftskQS2EFu%2FlAKRz4Bs50HK8PkFVXoavfYsbMg2%2F5BSVtPQ%3D%3D'

# 전국 행정구역 리스트
REGION_NAMES = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시',
    '광주광역시', '대전광역시', '울산광역시', '경기도',
    '강원도', '충청북도', '충청남도', '전라북도',
    '전라남도', '경상북도', '경상남도', '제주특별자치도', '세종특별자치시'
]

# 데이터 요청 함수
def fetch_data(item_code):
    url = (
        f'http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst'
        f'?serviceKey={API_KEY}'
        f'&numOfRows=31&pageNo=1&itemCode={item_code}'
        f'&dataGubun=DAILY&searchCondition=WEEK'
    )
    with urlopen(url) as resp:
        xml = resp.read().decode('utf-8')
    data = xmltodict.parse(xml)
    items = data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
    return items

# 평균 계산 함수
def calculate_avg(item_code):
    items = fetch_data(item_code)
    if not items:
        return []
    df = pd.DataFrame(items)
    df.drop(columns=['itemCode', 'dataGubun'], inplace=True, errors='ignore')
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    means = df.mean(axis=0)
    result = []
    for name, val in zip(REGION_NAMES, means):
        result.append({'region': name, 'value': int(val)})
    return result

# Flask Blueprint 정의
dust_viz_bp = Blueprint('dust_viz_bp', __name__)

@dust_viz_bp.route('/api/dust/province/<item_code>', methods=['GET'])
def province_dust(item_code):
    """
    GET: 전국 평균 미세먼지 데이터 JSON 반환
      - item_code: 'PM10' 또는 'PM25'
    응답 예시:
      {
        "item_code": "PM25",
        "data": [
          {"region": "서울특별시", "value": 50},
          ...
        ]
      }
    """
    if item_code not in ['PM10', 'PM25']:
        return jsonify({'error': "잘못된 item_code: 'PM10' 또는 'PM25'만 허용"}), 400
    data = calculate_avg(item_code)
    if not data:
        return jsonify({'error': '데이터 없음'}), 500
    return jsonify({'item_code': item_code, 'data': data})
