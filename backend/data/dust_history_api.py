"""
미세먼지 월별·연별 통계 API 모듈
- SQLite 기반 히스토리 DB에서 구별 평균값 집계
- API 엔드포인트:
    GET /api/dust/history/monthly?year={YYYY}&pollutant={PM10|PM25}
    GET /api/dust/history/yearly?start_year={YYYY}&end_year={YYYY}&pollutant={PM10|PM25}
"""
import os
import sqlite3
import pandas as pd
from flask import Blueprint, request, jsonify

# 히스토리 DB 경로
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'dust_history.db')

# DB 초기화 함수
def init_history_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS history (
            date TEXT NOT NULL,
            region TEXT NOT NULL,
            PM10 REAL,
            PM25 REAL,
            PRIMARY KEY(date, region)
        )
    ''')
    conn.commit()
    conn.close()

# 월별 평균값 조회 함수
def get_monthly_avg(year: str, pollutant: str) -> list:
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query(
        f"SELECT date, region, {pollutant} FROM history WHERE substr(date,1,4)=?",
        conn, params=(year,)
    )
    conn.close()
    if df.empty:
        return []
    df['month'] = df['date'].str[5:7].astype(int)
    result = []
    for region, grp in df.groupby('region'):
        monthly = []
        for m in range(1, 13):
            val = grp.loc[grp['month']==m, pollutant].mean()
            monthly.append(None if pd.isna(val) else round(val,2))
        result.append({'region': region, 'monthly': monthly})
    return result

# 연별 평균값 조회 함수
def get_yearly_avg(start_year: str, end_year: str, pollutant: str) -> list:
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query(
        f"SELECT date, region, {pollutant} FROM history WHERE substr(date,1,4) BETWEEN ? AND ?",
        conn, params=(start_year, end_year)
    )
    conn.close()
    if df.empty:
        return []
    df['year'] = df['date'].str[0:4]
    result = []
    years = sorted({str(y) for y in range(int(start_year), int(end_year)+1)})
    for region, grp in df.groupby('region'):
        yearly = []
        for y in years:
            val = grp.loc[grp['year']==y, pollutant].mean()
            yearly.append(None if pd.isna(val) else round(val,2))
        result.append({'region': region, 'yearly': yearly})
    return {'years': years, 'data': result}

# Flask Blueprint
history_bp = Blueprint('history_bp', __name__)

# DB 초기화
init_history_db()

@history_bp.route('/api/dust/history/monthly', methods=['GET'])
def monthly_stats():
    year = request.args.get('year')
    pollutant = request.args.get('pollutant')
    if not year or not pollutant:
        return jsonify({'error': 'year과 pollutant 파라미터가 필요합니다.'}), 400
    if pollutant not in ['PM10', 'PM25']:
        return jsonify({'error': "pollutant은 'PM10' 또는 'PM25'만 허용됩니다."}), 400
    data = get_monthly_avg(year, pollutant)
    return jsonify({'year': year, 'pollutant': pollutant, 'data': data})

@history_bp.route('/api/dust/history/yearly', methods=['GET'])
def yearly_stats():
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    pollutant = request.args.get('pollutant')
    if not (start_year and end_year and pollutant):
        return jsonify({'error': 'start_year, end_year, pollutant 파라미터가 필요합니다.'}), 400
    if pollutant not in ['PM10', 'PM25']:
        return jsonify({'error': "pollutant은 'PM10' 또는 'PM25'만 허용됩니다."}), 400
    stats = get_yearly_avg(start_year, end_year, pollutant)
    return jsonify({'start_year': start_year, 'end_year': end_year, 'pollutant': pollutant, **stats})
