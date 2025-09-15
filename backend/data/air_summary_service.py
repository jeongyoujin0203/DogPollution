from flask import Blueprint, request, jsonify, make_response
import os, requests

air_summary_bp = Blueprint("air_summary_bp", __name__, url_prefix="/api/air")
AIR_TIMEOUT = 5.0

AIR_BASE = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc"
# 시도별 실시간: /getCtprvnRltmMesureDnsty
# 가까운 측정소:   /getNearbyMsrstnList (별도 서비스 MsrstnInfoInqireSvc로 제공되는 경우도 있음)
MSRSTN_BASE = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc"
SERVICE_KEY = os.getenv("AIRKOREA_SERVICE_KEY")

def _air_params(extra: dict):
    base = {"serviceKey": SERVICE_KEY, "returnType": "json"}
    base.update(extra)
    return base

@air_summary_bp.get("/summary")
def summary():
    """
    전국 요약: level=sido (기본), sidoName=서울 등
    - level=sido일 때 sidoName 없으면 기본 목록(서울, 부산 ... )을 프론트에서 순회 호출 권장
      (에어코리아 API 특성상 '전체 시/도 리스트' 엔드포인트가 별도로 없음)
    """
    level = request.args.get("level", default="sido")
    pollutant = request.args.get("pollutant", default="PM10")
    sido_name = request.args.get("sidoName")  # 예: "서울"

    if level != "sido":
        return jsonify({"code": 400, "message": "현재는 level=sido만 지원합니다."}), 400
    if not sido_name:
        return jsonify({"code": 400, "message": "sidoName 쿼리를 전달하세요. (예: 서울, 부산)"}), 400

    url = f"{AIR_BASE}/getCtprvnRltmMesureDnsty"
    params = _air_params({
        "sidoName": sido_name,
        "pageNo": 1,
        "numOfRows": 100,
        "ver": "1.0"
    })
    try:
        r = requests.get(url, params=params, timeout=AIR_TIMEOUT)
        r.raise_for_status()
        items = (r.json().get("response", {}).get("body", {}).get("items", [])) or []
        # 모바일용 경량 응답: 필요한 필드만
        slim = []
        for it in items:
            obj = {
                "stationName": it.get("stationName"),
                "dataTime": it.get("dataTime"),
                "PM10": it.get("pm10Value"),
                "PM25": it.get("pm25Value")
            }
            slim.append(obj)

        resp = make_response(jsonify({
            "level": "sido",
            "sidoName": sido_name,
            "items": slim
        }), 200)
        resp.headers["Cache-Control"] = "public, max-age=60"
        return resp
    except requests.RequestException as e:
        return jsonify({"code": 502, "message": "AirKorea API 호출 실패"}), 502

@air_summary_bp.get("/nearby")
def nearby():
    """
    좌표 기준 가까운 측정소 목록 + 간단 값
    Query: lat, lon
    """
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)
    if lat is None or lon is None:
        return jsonify({"code": 400, "message": "lat/lon이 필요합니다."}), 400

    # 1) Kakao transcoord로 WGS84 → WTM 변환 (AirKorea Nearby는 TM 좌표 요구하는 경우가 많음)
    #    NOTE: Kakao transcoord는 Local API 문서 참조. (여기서는 nearby를 단순화하여 역지오코딩 없이 호출)
    #    실제로는 WTM 변환이 필요하면 Kakao Local의 변환 API를 호출하세요. (문서: Local API Reference)
    # 2) AirKorea 가까운 측정소
    try:
        # (단순화) 위경도를 바로 TM으로 쓰는 경우도 있으므로, 먼저 nearby 호출을 시도
        url = f"{MSRSTN_BASE}/getNearbyMsrstnList"
        params = _air_params({"tmX": lon, "tmY": lat})  # 필요 시 TM 변환 결과로 교체
        r = requests.get(url, params=params, timeout=AIR_TIMEOUT)
        r.raise_for_status()
        stations = (r.json().get("response", {}).get("body", {}).get("items", [])) or []
    except requests.RequestException:
        stations = []

    # 응답 경량화
    slim = [{"stationName": s.get("stationName"),
             "addr": s.get("addr"),
             "tm": {"x": s.get("tmX"), "y": s.get("tmY")}} for s in stations]

    resp = make_response(jsonify({"items": slim}), 200)
    resp.headers["Cache-Control"] = "public, max-age=60"
    return resp
