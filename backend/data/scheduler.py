""""
알림 트리거 자동화 모듈
- APScheduler를 사용해 정기적으로 미세먼지 농도를 확인하고
  구독자에게 카카오톡 알림을 자동 전송
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .customer_db import get_subscribed_customers
from .kakao_notify import send_kakao_alert
from ..app.config import Config
import requests, xmltodict, pandas as pd

scheduler = None

def fetch_seoul_air_quality():
    url = f'http://openAPI.seoul.go.kr:8088/{Config.SEOUL_API_KEY}/xml/ListAirQualityByDistrictService/1/25/'
    resp = requests.get(url)
    if resp.status_code != 200:
        return pd.DataFrame()
    data = xmltodict.parse(resp.content)
    items = data.get('ListAirQualityByDistrictService', {}).get('row', [])
    return pd.DataFrame(items)

def notify_job():
    df = fetch_seoul_air_quality()
    if df.empty:
        print(f"{datetime.now()} - 데이터 없음")
        return
    subscribers = get_subscribed_customers()
    for cust in subscribers:
        pollutant = cust['pollutant']
        threshold = cust['threshold']
        avg_val = pd.to_numeric(df[pollutant], errors="coerce").mean()
        if avg_val and avg_val >= threshold:
            success, _ = send_kakao_alert(pollutant, int(avg_val))
            print(f"{datetime.now()} - 고객 {cust['id']} 알림 전송 {'성공' if success else '실패'}")

def start_scheduler(app=None):
    global scheduler
    if scheduler:  # 이미 실행중이면 무시
        return scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(notify_job, 'cron', minute=0)
    scheduler.start()
    if app:
        @app.teardown_appcontext
        def shutdown_scheduler(exception=None):
            if scheduler:
                scheduler.shutdown()
    return scheduler
