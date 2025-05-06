"""
서울시 구별 월별·연별 미세먼지 통계 API 모듈
- Data.go.kr에서 제공되는 CSV 파일을 기반으로, JSON API로 노출
- 파일 위치:
    - data/seoul_monthly.csv  (서울특별시_월별_평균_대기오염도_정보.csv)
    - data/seoul_yearly.csv   (서울특별시_연도별_평균_대기오염도_정보.csv)

엔드포인트:
    GET /api/dust/seoul/history/monthly?year={YYYY}&pollutant={PM10|PM25}
    GET /api/dust/seoul/history/yearly?start_year={YYYY}&end_year={YYYY}&pollutant={PM10|PM25}
"""
import os
import pandas as pd
from flask import Blueprint, request, jsonify

# CSV 파일 경로 설정
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MONTHLY_CSV = os.path.join(BASE_DIR, '..', 'data', 'seoul_monthly.csv')
YEARLY_CSV = os.path.join(BASE_DIR, '..', 'data', 'seoul_yearly.csv')

seoul_history_bp = Blueprint('seoul_history_bp', __name__)

@seoul_history_bp.route('/api/dust/seoul/history/monthly', methods=['GET'])
def seoul_monthly_history():
    """
    서울시 구별 월별 미세먼지 평균 조회
    Query params:
      - year: YYYY
      - pollutant: PM10 또는 PM25
    """
    year = request.args.get('year')
    pollutant = request.args.get('pollutant')
    if not year or pollutant not in ['PM10', 'PM25']:
        return jsonify({'error': 'year 및 pollutant(PM10/PM25) 파라미터가 필요합니다.'}), 400

    try:
        df = pd.read_csv(MONTHLY_CSV)
    except Exception:
        return jsonify({'error': '월별 CSV 파일 로드 실패'}), 500

    df = df[df['Year'] == int(year)]
    data = []
    for region, grp in df.groupby('District'):
        monthly = []
        for m in range(1,13):
            row = grp[grp['Month'] == m]
            if row.empty:
                monthly.append(None)
            else:
                val = row.iloc[0][pollutant]
                monthly.append(None if pd.isna(val) else float(val))
        data.append({'region': region, 'monthly': monthly})

    return jsonify({'year': year, 'pollutant': pollutant, 'data': data})

@seoul_history_bp.route('/api/dust/seoul/history/yearly', methods=['GET'])
def seoul_yearly_history():
    """
    서울시 구별 연별 미세먼지 평균 조회
    Query params:
      - start_year: YYYY
      - end_year: YYYY
      - pollutant: PM10 또는 PM25
    """
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    pollutant = request.args.get('pollutant')
    if not (start_year and end_year) or pollutant not in ['PM10', 'PM25']:
        return jsonify({'error': 'start_year, end_year 및 pollutant(PM10/PM25) 파라미터가 필요합니다.'}), 400

    try:
        df = pd.read_csv(YEARLY_CSV)
    except Exception:
        return jsonify({'error': '연별 CSV 파일 로드 실패'}), 500

    df = df[df['Year'].between(int(start_year), int(end_year))]
    years = [str(y) for y in range(int(start_year), int(end_year)+1)]
    data = []
    for region, grp in df.groupby('District'):
        yearly = []
        for y in years:
            row = grp[grp['Year'] == int(y)]
            if row.empty:
                yearly.append(None)
            else:
                val = row.iloc[0][pollutant]
                yearly.append(None if pd.isna(val) else float(val))
        data.append({'region': region, 'yearly': yearly})

    return jsonify({'start_year': start_year, 'end_year': end_year, 'pollutant': pollutant, 'years': years, 'data': data})
