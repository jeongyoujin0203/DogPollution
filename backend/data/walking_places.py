"""
실외 산책 장소 추천 API
-----------------------
- 위도/경도와 반경(km)을 받아 주변 산책 장소를 거리 기준으로 필터링/정렬하여 반환
- guides_service.py 에서 직접 호출 가능한 search_walking_places() 유틸 제공
- 외부 API 미사용(키 필요 없음). 기본 데이터는 로컬 상수로 제공하며
  추후 DB/외부 API(카카오 플레이스 등) 연동 시 이 모듈 내부 함수만 교체하면 됨.

엔드포인트:
- GET /api/walking_places?lat=<float>&lon=<float>&radius=<float,km>&q=<opt keyword>

반환 스키마(예):
{
  "latitude": 37.56,
  "longitude": 126.98,
  "radius": 3.0,
  "count": 3,
  "places": [
    {"name":"서울숲","latitude":..., "longitude":..., "distance_km":0.74, "tags":["공원","야외"], "rating":4.6, "description":"..."},
    ...
  ]
}
"""

from flask import Blueprint, request, jsonify
import math

# 기본 샘플 데이터 (필요 시 DB/외부 API로 대체)
WALKING_PLACES = [
    {
        "name": "서울숲",
        "latitude": 37.5440,
        "longitude": 127.0370,
        "description": "넓은 공원과 산책로가 있는 서울숲",
        "tags": ["공원", "야외", "산책로"],
        "rating": 4.6
    },
    {
        "name": "남산 공원",
        "latitude": 37.5510,
        "longitude": 126.9880,
        "description": "서울 도심의 대표 공원, 다양한 산책로 제공",
        "tags": ["공원", "야외", "뷰"],
        "rating": 4.5
    },
    {
        "name": "한강 시민공원",
        "latitude": 37.5190,
        "longitude": 126.9640,
        "description": "한강을 따라 조성된 산책로",
        "tags": ["강변", "야외", "자전거"],
        "rating": 4.4
    },
]

# ---------------------------
# 내부 유틸
# ---------------------------
def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """두 좌표 간 거리를 km로 반환"""
    R = 6371.0  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def _filter_and_rank(lat: float, lon: float, radius_km: float, keyword: str | None):
    """반경 내 장소만 필터링하고 거리순 정렬. keyword가 있으면 이름/태그에서 부분일치 필터."""
    results = []
    kw = (keyword or "").strip().lower()

    for place in WALKING_PLACES:
        dist = _haversine(lat, lon, place["latitude"], place["longitude"])
        if dist <= radius_km:
            if kw:
                name_hit = kw in place["name"].lower()
                tag_hit = any(kw in t.lower() for t in place.get("tags", []))
                if not (name_hit or tag_hit):
                    continue
            item = {
                "name": place["name"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "distance_km": round(dist, 2),
                "tags": place.get("tags", []),
                "rating": place.get("rating"),
                "description": place.get("description", "")
            }
            results.append(item)

    results.sort(key=lambda x: (x["distance_km"], -(x["rating"] or 0)))
    return results

# ---------------------------
# guides_service 에서 사용하는 공개 함수
# ---------------------------
def search_walking_places(lat: float, lon: float, radius_km: float = 3.0, keyword: str | None = None):
    """
    guides_service.py 에서 직접 호출하는 검색 유틸.
    - 반환: places 리스트 (거리순 정렬, 반경 필터 적용)
    """
    return _filter_and_rank(lat, lon, radius_km, keyword)

# ---------------------------
# Flask Blueprint
# ---------------------------
walking_places_bp = Blueprint("walking_places_bp", __name__)

@walking_places_bp.route("/api/walking_places", methods=["GET"])
def walking_places():
    """
    GET /api/walking_places
      - lat: 위도 (필수)
      - lon: 경도 (필수)
      - radius: 검색 반경 km (선택, 기본 5)
      - q: 키워드 (선택, 장소명/태그 부분일치)
    """
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
    except (TypeError, ValueError):
        return jsonify({"code": 400, "message": "lat/lon 필수(숫자)"}), 400

    try:
        radius = float(request.args.get("radius", 5.0))
    except ValueError:
        radius = 5.0

    keyword = request.args.get("q")
    places = _filter_and_rank(lat, lon, radius, keyword)

    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "radius": radius,
        "count": len(places),
        "places": places
    }), 200
