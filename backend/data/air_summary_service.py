"""
공기질 요약 서비스 (좌표 -> PM10/PM2.5 요약)
------------------------------------------------
- 위도/경도(lat/lon)로 사용자의 행정구역(시/도, 구/군)을 판별
- 서울특별시: 서울 25개 구 스냅샷의 평균값 반환
- 타 시/도: AirKorea 시도별 최근 1주(일평균) 평균값 반환
- 모든 외부 호출은 타임아웃/예외 처리, 간단한 TTL 캐시 적용
- .env/Config에서 API 키 사용 (KAKAO_ADMIN_KEY / SEOUL_API_KEY / AIRKOREA_SERVICE_KEY)

공개 함수:
- get_pm_summary(lat: float, lon: float, use_cache: bool = True) -> dict

테스트/프론트용 엔드포인트:
- GET /api/air/summary?lat=<float>&lon=<float>&nocache=true|false
"""

from __future__ import annotations
import os
import time
import logging
from typing import Optional, Dict, Any

import requests
import xmltodict
import pandas as pd
from flask import Blueprint, request, jsonify, current_app, make_response

logger = logging.getLogger(__name__)

air_summary_bp = Blueprint("air_summary_bp", __name__, url_prefix="/api/air")

# ---------------------------
# Config helpers
# ---------------------------
def _cfg(name: str, default: Optional[str] = None) -> Optional[str]:
    """환경변수 -> app.config 순으로 조회"""
    return os.getenv(name) or (current_app.config.get(name) if current_app else None) or default

# ---------------------------
# TTL Cache (아주 단순한 인메모리 캐시)
# ---------------------------
_CACHE: Dict[str, Dict[str, Any]] = {}
# TTL: 역지오코딩은 길게, 대기질 데이터는 짧게
TTL_REVERSE_GEOCODE = 60 * 60 * 24  # 24h
TTL_SEOUL_SNAPSHOT  = 60 * 5       # 5m
TTL_AIRKOREA_WEEK   = 60 * 30      # 30m

def _cache_get(key: str, ttl: int) -> Optional[Any]:
    item = _CACHE.get(key)
    if not item:
        return None
    if time.time() - item["ts"] > ttl:
        _CACHE.pop(key, None)
        return None
    return item["val"]

def _cache_set(key: str, val: Any) -> None:
    _CACHE[key] = {"ts": time.time(), "val": val}

# ---------------------------
# Kakao 역지오코딩 (WGS84)
# ---------------------------
def _reverse_geocode(lat: float, lon: float, use_cache: bool = True) -> Dict[str, Optional[str]]:
    """
    Kakao Local API: 좌표 -> (시/도, 구/군)
    실패/키누락 시 None 반환
    """
    kakao_key = _cfg("KAKAO_ADMIN_KEY")
    if not kakao_key:
        return {"sido": None, "sigungu": None, "provider": "kakao", "ok": False, "reason": "KAKAO_ADMIN_KEY missing"}

    cache_key = f"revgeo:{round(lat,4)}:{round(lon,4)}"
    if use_cache:
        cached = _cache_get(cache_key, TTL_REVERSE_GEOCODE)
        if cached:
            return cached

    url = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json"
    headers = {"Authorization": f"KakaoAK {kakao_key}"}
    params = {"x": f"{lon}", "y": f"{lat}"}

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        docs = data.get("documents", [])
        if not docs:
            res = {"sido": None, "sigungu": None, "provider": "kakao", "ok": False, "reason": "no_documents"}
            if use_cache: _cache_set(cache_key, res)
            return res
        doc = next((d for d in docs if d.get("region_type") == "H"), docs[0])
        res = {"sido": doc.get("region_1depth_name"), "sigungu": doc.get("region_2depth_name"),
               "provider": "kakao", "ok": True}
        if use_cache: _cache_set(cache_key, res)
        return res
    except Exception as e:
        logger.exception("reverse geocode error: %s", e)
        return {"sido": None, "sigungu": None, "provider": "kakao", "ok": False, "reason": "exception"}

# ---------------------------
# 서울 25개 구 스냅샷 평균
# ---------------------------
def _fetch_seoul_snapshot_mean(use_cache: bool = True) -> Optional[Dict[str, float]]:
    key = _cfg("SEOUL_API_KEY")
    if not key:
        return None

    cache_key = "seoul_snapshot_mean"
    if use_cache:
        cached = _cache_get(cache_key, TTL_SEOUL_SNAPSHOT)
        if cached:
            return cached

    url = f"http://openAPI.seoul.go.kr:8088/{key}/xml/ListAirQualityByDistrictService/1/25/"
    try:
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = xmltodict.parse(resp.content)
        rows = data.get("ListAirQualityByDistrictService", {}).get("row", [])
        if not rows:
            return None
        df = pd.DataFrame(rows)
        df["PM10"] = pd.to_numeric(df.get("PM10"), errors="coerce")
        df["PM25"] = pd.to_numeric(df.get("PM25"), errors="coerce")
        pm10_mean = float(df["PM10"].mean(skipna=True))
        pm25_mean = float(df["PM25"].mean(skipna=True))
        val = {"pm10": pm10_mean, "pm25": pm25_mean}
        if use_cache: _cache_set(cache_key, val)
        return val
    except Exception as e:
        logger.exception("seoul snapshot error: %s", e)
        return None

# ---------------------------
# AirKorea 시도별 최근 1주 평균
# ---------------------------
REGION_COL_MAP = {
    "서울특별시": "seoul", "부산광역시": "busan", "대구광역시": "daegu", "인천광역시": "incheon",
    "광주광역시": "gwangju", "대전광역시": "daejeon", "울산광역시": "ulsan", "경기도": "gyeonggi",
    "강원도": "gangwon", "충청북도": "chungbuk", "충청남도": "chungnam", "전라북도": "jeonbuk",
    "전라남도": "jeonnam", "경상북도": "gyeongbuk", "경상남도": "gyeongnam",
    "제주특별자치도": "jeju", "세종특별자치시": "sejong",
}

def _airkorea_week_mean(item_code: str, use_cache: bool = True) -> Optional[pd.Series]:
    key = _cfg("AIRKOREA_SERVICE_KEY")
    if not key:
        return None

    cache_key = f"airkorea:{item_code}"
    if use_cache:
        cached = _cache_get(cache_key, TTL_AIRKOREA_WEEK)
        if isinstance(cached, pd.Series):
            return cached

    url = ("http://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst"
           f"?serviceKey={key}&numOfRows=50&pageNo=1&itemCode={item_code}"
           "&dataGubun=DAILY&searchCondition=WEEK")
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = xmltodict.parse(resp.text)
        items = data.get("response", {}).get("body", {}).get("items", {}).get("item", [])
        if not items:
            return None
        df = pd.DataFrame(items)
        for col in REGION_COL_MAP.values():
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
        cols = [c for c in REGION_COL_MAP.values() if c in df.columns]
        if not cols:
            return None
        means = df[cols].mean(axis=0, skipna=True)
        if use_cache: _cache_set(cache_key, means)
        return means
    except Exception as e:
        logger.exception("airkorea week mean error: %s", e)
        return None

def _fetch_province_mean(sido_name: str, use_cache: bool = True) -> Optional[Dict[str, float]]:
    col = REGION_COL_MAP.get(sido_name)
    if not col:
        return None
    pm10_means = _airkorea_week_mean("PM10", use_cache=use_cache)
    pm25_means = _airkorea_week_mean("PM25", use_cache=use_cache)
    if pm10_means is None or pm25_means is None:
        return None
    if col not in pm10_means.index or col not in pm25_means.index:
        return None
    try:
        return {"pm10": float(pm10_means[col]), "pm25": float(pm25_means[col])}
    except Exception:
        return None

# ---------------------------
# 공개: 좌표 -> 요약
# ---------------------------
def get_pm_summary(lat: float, lon: float, use_cache: bool = True) -> Dict[str, Any]:
    """
    좌표를 받아 PM10/PM2.5 요약값을 반환
    - 서울특별시: 서울 스냅샷 평균
    - 기타: 시도별 최근 1주 평균
    """
    region = _reverse_geocode(lat, lon, use_cache=use_cache)
    sido = region.get("sido")
    sigungu = region.get("sigungu")

    # 서울: 스냅샷 평균
    if sido == "서울특별시":
        seoul = _fetch_seoul_snapshot_mean(use_cache=use_cache)
        if seoul:
            return {
                "pm10": round(seoul["pm10"], 1),
                "pm25": round(seoul["pm25"], 1),
                "source": "seoul_avg",
                "region": {"sido": sido, "sigungu": sigungu},
                "region_provider": region.get("provider"),
                "ok": True
            }

    # 그 외: 시도 평균
    if sido:
        prov = _fetch_province_mean(sido, use_cache=use_cache)
        if prov:
            return {
                "pm10": round(prov["pm10"], 1),
                "pm25": round(prov["pm25"], 1),
                "source": "airkorea_province_avg",
                "region": {"sido": sido, "sigungu": sigungu},
                "region_provider": region.get("provider"),
                "ok": True
            }

    # 실패/키 누락 등
    return {
        "pm10": None,
        "pm25": None,
        "source": "unknown",
        "region": {"sido": sido, "sigungu": sigungu},
        "region_provider": region.get("provider"),
        "ok": False,
        "reason": region.get("reason", "no_data")
    }

# ---------------------------
# HTTP 엔드포인트 (테스트/프론트)
# ---------------------------
@air_summary_bp.get("/summary")
def http_get_pm_summary():
    """
    좌표 기반 공기질 요약 조회
    GET /api/air/summary?lat=<float>&lon=<float>&nocache=true|false
    """
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
    except (TypeError, ValueError):
        return jsonify({"code": 400, "message": "lat/lon 필수(숫자)"}), 400

    no_cache = str(request.args.get("nocache", "false")).lower() == "true"
    data = get_pm_summary(lat, lon, use_cache=not no_cache)

    # 모바일 고려 캐시
    resp = make_response(jsonify(data), 200)
    resp.headers["Cache-Control"] = "public, max-age=60"
    return resp
