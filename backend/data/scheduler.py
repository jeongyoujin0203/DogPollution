# backend/data/scheduler.py
"""
알림 트리거 자동화 모듈
- APScheduler를 사용해 정기적으로 미세먼지 농도를 확인하고
  구독자에게 카카오톡 알림을 자동 전송
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import pandas as pd
import xmltodict
import requests
from .customer_db import get_subscribed_customers
from .kakao_notify import send_kakao_alert
from ..app.config import Config

# 서울 미세먼지 데이터 요청 함수
def fetch_seoul_air_quality():
    url = f'http://openAPI.seoul.go.kr:8088/{Config.API_KEY}/xml/ListAirQualityByDistrictService/1/25/'
    resp = requests.get(url)
    if resp.status_code != 200:
        return pd.DataFrame()
    data = xmltodict.parse(resp.content)
    items = data.get('ListAirQualityByDistrictService', {}).get('row', [])
    df = pd.DataFrame(items)
    for col in ['PM10', 'PM25']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    return df[['MSRSTENAME', 'PM10', 'PM25']]

# 알림 전송 작업
def notify_job():
    """
    정기 작업: 구독자 목록을 조회하고, 각 구독 기준에 맞춰 알림 전송
    """
    df = fetch_seoul_air_quality()
    if df.empty:
        print(f"{datetime.now()} - 미세먼지 데이터 없음, 작업 취소")
        return

    subscribers = get_subscribed_customers()
    for cust in subscribers:
        pollutant = cust['pollutant']
        threshold = cust['threshold']
        # 서울 평균 또는 특정 구가 아닌 전체 평균? 여기서는 전체 평균
        avg_value = int(df[pollutant].dropna().mean())
        if avg_value >= threshold:
            # 발송
            success, result = send_kakao_alert(pollutant, avg_value)
            if success:
                print(f"{datetime.now()} - 알림 전송 성공: 고객 {cust['id']}")
            else:
                print(f"{datetime.now()} - 알림 전송 실패: 고객 {cust['id']} - {result}")

# 스케줄러 설정 함수
def start_scheduler(app=None):
    """
    APScheduler 배경 스케줄러 시작
    """
    scheduler = BackgroundScheduler()
    # 매시간 0분에 실행
    scheduler.add_job(notify_job, 'cron', minute=0)
    scheduler.start()
    print(f"{datetime.now()} - 스케줄러 시작, 매시간 알림 작업 예정")

    # Flask 앱 컨텍스트에서 실행할 때 종료 시 스케줄러도 종료
    if app:
        @app.teardown_appcontext
        def shutdown_scheduler(exception=None):
            scheduler.shutdown()
