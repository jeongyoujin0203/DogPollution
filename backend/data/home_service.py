"""
홈 요약 API (Home Summary Service)
---------------------------------
- 메인 화면(홈)에서 한 번의 호출로 "지금 무엇을 해야 하는지" 요약 제공
- WHO 단계 기반 시각 속성(라벨/색상/아이콘) + 산책 가능/불가 판정 + 행동 팁 + CTA
- 위치(lat/lon)가 있으면 air_summary_service로 PM10/PM2.5를 자동 확보(전국/모바일 대응)
- 위치가 없거나, 프론트가 직접 pm10/pm25를 넘겨주면 그대로 사용(네트워크 절약)
- 판정 결과에 따라 실외/실내 추천을 함께 반환(실외: walking_places / 실내: pet_cafe_db)

추가:
- 외부 API 키(.env): KAKAO_ADMIN_KEY, SEOUL_API_KEY, AIRKOREA_SERVICE_KEY가 있어야
  lat/lon만으로도 PM 요약이 가능.
"""

from flask import Blueprint, request, jsonify, make_response
from typing import Optional

# WHO 매핑/판정/팁 재사용
from .guides_service import _classify, _decision, _tips

# 좌표 -> PM 요약 (서울/전국)
from .air_summary_service import get_pm_summary

# 추천 소스
from .pet_cafe_db import get_cafes_by_location
try:
    from .walking_places import search_walking_places as _search_outdoor
except Exception:
    _search_outdoor = None

home_bp = Blueprint("home_bp", __name__, url_prefix="/api/home")


def _recommend_outdoor(lat: float, lon: float, radius_km: float):
    if _search_outdoor:
        try:
            return _search_outdoor(lat, lon, radius_km)
        except Exception:
            return []
    return []

def _recommend_indoor(lat: float, lon: float, radius_km: float):
    try:
        return get_cafes_by_location(lat, lon, radius_km)
    except Exception:
        return []

def _build_cta(decision: str) -> dict:
    if decision == "OK":
        return {"text": "가까운 공원 보기", "href": "/walk?tab=outdoor", "priority": "primary"}
    if decision == "CAUTION":
        return {"text": "짧은 산책 코스 보기", "href": "/walk?tab=outdoor&mode=short", "priority": "warning"}
    if decision == "AVOID":
        return {"text": "실내 대체 활동 보기", "href": "/places?tab=indoor", "priority": "danger"}
    return {"text": "측정값 다시 확인", "href": "/refresh", "priority": "neutral"}

def _classify_and_summarize(pm10: float, pm25: float, sensitivity: str):
    visual = _classify(pm10, pm25)  # {"label","level","color","icon"}
    decision = _decision(visual.get("level"), sensitivity)
    tips = _tips(decision, sensitivity)
    headline = f"현재 상태: {visual['label']}" if visual.get("label") else "현재 상태: 정보없음"
    return {
        "primary": {
            "label": visual.get("label"),
            "level": visual.get("level"),
            "color": visual.get("color"),
            "icon": visual.get("icon"),
        },
        "decision": decision,  # OK|CAUTION|AVOID|UNKNOWN
        "headline": headline,
        "tips": tips,
        "cta": _build_cta(decision),
    }

def _parse_pm_from_query() -> Optional[dict]:
    try:
        pm10 = float(request.args.get("pm10"))
        pm25 = float(request.args.get("pm25"))
        return {"pm10": pm10, "pm25": pm25, "source": "client"}
    except (TypeError, ValueError):
        return None


@home_bp.get("/summary")
def summary():
    """
    홈 요약
    ---
    parameters:
      - in: query
        name: pm10
        schema: {type: number}
        required: false
        description: 프론트가 이미 알고 있는 PM10 값(㎍/m³)
      - in: query
        name: pm25
        schema: {type: number}
        required: false
        description: 프론트가 이미 알고 있는 PM2.5 값(㎍/m³)
      - in: query
        name: lat
        schema: {type: number}
        required: false
        description: 사용자 위도(없으면 pm 값만 사용)
      - in: query
        name: lon
        schema: {type: number}
        required: false
        description: 사용자 경도(없으면 pm 값만 사용)
      - in: query
        name: sensitivity
        schema: {type: string, enum: [normal, sensitive]}
        required: false
        description: 민감 반려견 모드(보수적 판단)
      - in: query
        name: radius
        schema: {type: number, default: 3}
        required: false
        description: 추천 반경(km)
    responses:
      200:
        description: 홈 요약 응답
    """
    sensitivity = (request.args.get("sensitivity") or "normal").lower()
    if sensitivity not in ("normal", "sensitive"):
        sensitivity = "normal"

    # 1) 프론트가 pm10/pm25를 주면 그대로 사용(네트워크 절약)
    pm = _parse_pm_from_query()
    source = "client"
    lat_f = lon_f = None

    # 2) 없으면 lat/lon으로 백엔드에서 요약 확보(전국/모바일 대응)
    if pm is None:
        try:
            lat = request.args.get("lat")
            lon = request.args.get("lon")
            if lat is not None and lon is not None:
                lat_f = float(lat)
                lon_f = float(lon)
        except (TypeError, ValueError):
            lat_f = lon_f = None

        if lat_f is not None and lon_f is not None:
            data = get_pm_summary(lat_f, lon_f, use_cache=True)
            if data.get("ok"):
                pm = {"pm10": float(data["pm10"]), "pm25": float(data["pm25"])}
                source = data.get("source", "provider")
            else:
                pm = None  # 여전히 없음

    # 3) 요약 생성 (+ 추천)
    try:
        radius = float(request.args.get("radius", 3.0))
    except ValueError:
        radius = 3.0

    if pm is None:
        # 최소 정보(UNKNOWN)
        summary = _classify_and_summarize(pm10=0.0, pm25=0.0, sensitivity=sensitivity)
        summary["decision"] = "UNKNOWN"
        summary["primary"].update({"label": "정보없음", "color": "#bdc3c7", "icon": "walk-unknown"})
        summary["headline"] = "현재 상태: 정보없음"
        summary["tips"] = ["측정값을 불러오지 못했습니다. 잠시 후 다시 시도하세요."]
        payload = {
            **summary, "source": "unknown",
            "recommendations": {"outdoor": [], "indoor": []}
        }
        resp = make_response(jsonify(payload), 200)
        resp.headers["Cache-Control"] = "private, max-age=30"
        return resp

    # pm이 확보된 경우
    summary = _classify_and_summarize(pm["pm10"], pm["pm25"], sensitivity)
    outdoor = indoor = []
    if lat_f is not None and lon_f is not None:
        if summary["decision"] in ("OK", "CAUTION"):
            outdoor = _recommend_outdoor(lat_f, lon_f, radius)
        if summary["decision"] in ("CAUTION", "AVOID"):
            indoor = _recommend_indoor(lat_f, lon_f, max(radius, 3.0))

    payload = {
        **summary,
        "source": source,
        "recommendations": {"outdoor": outdoor, "indoor": indoor}
    }
    resp = make_response(jsonify(payload), 200)
    resp.headers["Cache-Control"] = "public, max-age=60"
    return resp
