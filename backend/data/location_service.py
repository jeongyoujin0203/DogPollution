from flask import Blueprint, request, jsonify, current_app, make_response
import os, requests

location_bp = Blueprint("location_bp", __name__, url_prefix="/api/location")

KAKAO_LOCAL_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json"
KAKAO_TIMEOUT = 3.0

DEFAULT_SIDO = {"code": None, "name": "서울특별시"}
DEFAULT_SIGUNGU = {"code": None, "name": "종로구"}

def _kakao_headers():
    token = os.getenv("KAKAO_ACCESS_TOKEN")
    return {"Authorization": f"KakaoAK {token}"} if token else {}

@location_bp.get("/resolve")
def resolve_location():
    """
    모바일 브라우저에서 위치 권한 허용/거부, 정확도에 따라 기본 지역/실제 지역 반환
    Query: lat, lon, accuracy (선택)
    """
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    accuracy = request.args.get("accuracy", type=float)

    status, source, hint = "ok", "gps", None
    result = {
        "sido": DEFAULT_SIDO,
        "sigungu": DEFAULT_SIGUNGU,
        "source": source,
        "status": status,
        "hint": hint
    }

    # 좌표가 없으면 기본 지역 안내
    if lat is None or lon is None:
        result.update({"source": "default", "status": "ok",
                       "hint": "위치 권한을 허용하거나 지역을 선택하세요."})
        resp = make_response(jsonify(result), 200)
        resp.headers["Cache-Control"] = "public, max-age=30"
        return resp

    # 정확도 너무 낮을 때(예: >150m): 부분 응답
    if accuracy and accuracy > 150:
        result.update({"source": "gps", "status": "partial",
                       "hint": "정확도가 낮아 기본 지역으로 안내합니다. 지역을 선택하세요."})
        # 좌표는 들어왔으니 역지오코딩은 시도하되 실패해도 partial 유지
    try:
        r = requests.get(KAKAO_LOCAL_URL, headers=_kakao_headers(),
                         params={"x": lon, "y": lat}, timeout=KAKAO_TIMEOUT)
        r.raise_for_status()
        docs = r.json().get("documents", [])
        if docs:
            # 행정구역(법정동) 기준: region_1depth_name(시/도), 2depth_name(구/군)
            region = docs[0]
            sido_name = region.get("region_1depth_name")
            sigungu_name = region.get("region_2depth_name")
            if sido_name:
                result["sido"] = {"code": None, "name": sido_name}
            if sigungu_name:
                result["sigungu"] = {"code": None, "name": sigungu_name}
    except requests.RequestException as e:
        # 역지오코딩 실패 시 기본값 유지
        result.setdefault("hint", "위치 확인 실패로 기본 지역을 안내합니다.")

    code = 206 if result["status"] == "partial" else 200
    resp = make_response(jsonify(result), code)
    resp.headers["Cache-Control"] = "public, max-age=30"
    return resp
