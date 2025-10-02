"""
산책 가능/불가 판정 + 대체 장소 추천 API
- WHO 권고(단계화) 기반의 단순화 규칙
- 민감군(sensitive) 모드 지원
- 야외(공원 등) / 실내(애견카페) 대체 추천
"""
from flask import Blueprint, request, jsonify
from math import isnan

# 실외/실내 추천: 내부 DB/모듈 재사용
# 실내(카페): pet_cafe_db 사용
from .pet_cafe_db import get_cafes_by_location
# 실외(산책 장소): 기존 모듈에 탐색 함수가 없을 수 있어 안전한 fallback 제공
try:
    # 만약 네 walking_places.py에 검색 함수가 있다면 임포트 (예: search_walking_places)
    from .walking_places import search_walking_places as _search_outdoor
except Exception:
    _search_outdoor = None

guides_bp = Blueprint("guides_bp", __name__, url_prefix="/api/guides")

# ---- WHO 기반 등급(단순화) ----
# 색상/아이콘은 프론트에서 그대로 활용 가능
WHO_MAP = [
    {"label": "매우좋음", "level": 0, "pm10": (0, 20),  "pm25": (0, 10),  "color": "#2ecc71", "icon": "walk-okay"},
    {"label": "좋음",   "level": 0, "pm10": (20, 50), "pm25": (10, 25), "color": "#27ae60", "icon": "walk-okay"},
    {"label": "보통",   "level": 1, "pm10": (50, 100),"pm25": (25, 50), "color": "#f1c40f", "icon": "walk-caution"},
    {"label": "나쁨",   "level": 2, "pm10": (100,150),"pm25": (50, 75), "color": "#e67e22", "icon": "walk-avoid"},
    {"label": "매우나쁨","level": 3, "pm10": (150,1e9),"pm25": (75,1e9),"color": "#e74c3c", "icon": "walk-avoid"},
]

def _bucket(value, ranges):
    if value is None or (isinstance(value, float) and isnan(value)):
        return None
    for b in ranges:
        lo, hi = b["pm10"]
        if lo <= value < hi:
            return b
    return ranges[-1]

def _bucket_pm25(value, ranges):
    if value is None or (isinstance(value, float) and isnan(value)):
        return None
    for b in ranges:
        lo, hi = b["pm25"]
        if lo <= value < hi:
            return b
    return ranges[-1]

def _classify(pm10: float, pm25: float):
    """
    pm10/pm25 각각의 등급 중 '더 나쁜' 쪽을 종합 등급으로 선택
    """
    b10 = _bucket(pm10, WHO_MAP)
    b25 = _bucket_pm25(pm25, WHO_MAP)
    if b10 is None and b25 is None:
        return {"label": "정보없음", "level": None, "color": "#bdc3c7", "icon": "walk-unknown"}
    if b10 is None: return b25
    if b25 is None: return b10
    return b10 if b10["level"] >= b25["level"] else b25

def _decision(level: int, sensitivity: str = "normal"):
    """
    산책결정:
      - normal: level 0~1 OK/CAUTION, level 2~3 AVOID
      - sensitive(고령/기저 질환/어린 반려견): level 1부터 CAUTION, level 2~3 AVOID
    """
    if level is None:
        return "UNKNOWN"
    if sensitivity == "sensitive":
        if level <= 0: return "OK"
        if level == 1: return "CAUTION"
        return "AVOID"
    else:
        if level <= 1: return "OK" if level == 0 else "CAUTION"
        return "AVOID"

def _tips(decision: str, sensitivity: str):
    base = []
    if decision == "OK":
        base = ["일반 산책 가능", "산책 후 물 충분히 제공"]
    elif decision == "CAUTION":
        base = ["짧은 산책 권장", "마스크/보호장비 고려", "귀·눈 세정 등 사후 관리"]
    elif decision == "AVOID":
        base = ["실외 활동 자제", "실내 놀이/카페 등 대체 활동 권장", "공기청정기 사용"]
    else:
        base = ["측정값 확인 불가. 잠시 후 다시 시도하세요."]
    if sensitivity == "sensitive":
        base.append("민감 반려견은 실외 활동 시간을 더 축소하세요.")
    return base

def _recommend_outdoor(lat, lon, radius_km):
    if _search_outdoor:
        # 프로젝트에 구현되어 있다면 내부 함수 사용
        try:
            return _search_outdoor(lat, lon, radius_km)
        except Exception:
            return []
    # 안전한 Fallback: 일단 없음
    return []

def _recommend_indoor(lat, lon, radius_km):
    try:
        return get_cafes_by_location(lat, lon, radius_km)
    except Exception:
        return []

@guides_bp.get("/walkability")
def walkability():
    """
    GET /api/guides/walkability?pm10=..&pm25=..&sensitivity=normal|sensitive&lat=..&lon=..&radius=3
    - pm10/pm25: 필수
    - sensitivity: 선택(기본 normal)
    - lat/lon/radius: 선택(제공 시 대체 장소 추천 포함)
    """
    try:
        pm10 = float(request.args.get("pm10"))
        pm25 = float(request.args.get("pm25"))
    except (TypeError, ValueError):
        return jsonify({"code": 400, "message": "pm10/pm25는 필수(숫자)"}), 400

    sensitivity = (request.args.get("sensitivity") or "normal").lower()
    if sensitivity not in ("normal", "sensitive"):
        sensitivity = "normal"

    # 종합 등급 및 시각 속성
    visual = _classify(pm10, pm25)
    decision = _decision(visual["level"], sensitivity)
    tip_list = _tips(decision, sensitivity)

    # 선택적 추천
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    radius = float(request.args.get("radius", 3.0))
    outdoor, indoor = [], []

    if lat and lon:
        try:
            lat = float(lat); lon = float(lon)
            if decision in ("OK", "CAUTION"):
                # 실외 추천 먼저
                outdoor = _recommend_outdoor(lat, lon, radius)
            if decision in ("CAUTION", "AVOID"):
                # 실내 대체(애견카페)
                indoor = _recommend_indoor(lat, lon, max(radius, 3.0))
        except ValueError:
            pass

    return jsonify({
        "decision": decision,
        "visual": {k: visual[k] for k in ("label", "level", "color", "icon")},
        "tips": tip_list,
        "recommendations": {
            "outdoor": outdoor,
            "indoor": indoor
        }
    })
