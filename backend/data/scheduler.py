"""
알림 트리거 자동화
- APScheduler로 주기적 작업 실행
- 서울 대기질 기준 단순 임계치 비교(확장 시 AirKorea 요약 기반으로 교체/보완 가능)
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .customer_db import get_subscribed_customers
from .kakao_notify import send_kakao_alert
import requests, xmltodict, pandas as pd
import os
import logging

logger = logging.getLogger(__name__)
scheduler = None

def fetch_seoul_air_quality():
    """
    서울 25개 구 대기질 조회
    반환: pandas.DataFrame (row 항목 그대로)
    """
    api_key = os.getenv("SEOUL_API_KEY")
    if not api_key:
        logger.warning("SEOUL_API_KEY missing")
        return pd.DataFrame()

    url = f"http://openAPI.seoul.go.kr:8088/{api_key}/xml/ListAirQualityByDistrictService/1/25/"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            logger.warning("Seoul API non-200: %s", resp.status_code)
            return pd.DataFrame()
        data = xmltodict.parse(resp.content)
        items = data.get("ListAirQualityByDistrictService", {}).get("row", [])
        return pd.DataFrame(items)
    except Exception as e:
        logger.exception("Seoul API error: %s", e)
        return pd.DataFrame()

def notify_job():
    """
    구독자별 임계치 비교 후 카카오 알림 발송
    """
    df = fetch_seoul_air_quality()
    if df.empty:
        logger.warning("%s - air-quality dataframe empty", datetime.now())
        return

    subscribers = get_subscribed_customers()
    for cust in subscribers:
        pollutant = cust.get("pollutant")  # 'PM10' or 'PM25'
        threshold = cust.get("threshold")
        try:
            avg_val = pd.to_numeric(df[pollutant], errors="coerce").mean()
        except Exception:
            avg_val = None

        if avg_val is not None and pd.notna(avg_val) and float(avg_val) >= float(threshold):
            success, _ = send_kakao_alert(pollutant, int(avg_val))
            logger.info("%s - 고객 %s 알림 전송 %s", datetime.now(), cust.get("id"), "성공" if success else "실패")

def start_scheduler(app=None):
    """
    스케줄러 시작 (중복 시작 방지)
    - 매 정각(minute=0)마다 notify_job 실행
    - 앱 컨텍스트 종료 시 안전 종료
    """
    global scheduler
    if scheduler:
        return scheduler

    scheduler = BackgroundScheduler()
    scheduler.add_job(notify_job, "cron", minute=0)
    scheduler.start()

    if app:
        @app.teardown_appcontext
        def shutdown_scheduler(exception=None):
            if scheduler:
                scheduler.shutdown()
    return scheduler
