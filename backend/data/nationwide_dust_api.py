from flask import Blueprint, current_app, jsonify
import requests

bp = Blueprint('nationwide_dust', __name__, url_prefix='/api/dust/nationwide')

def fetch_station_list():
    """전국 측정소 이름 리스트 반환"""
    service_key = current_app.config['AIRKOREA_SERVICE_KEY']
    url = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList"
    params = {
        "serviceKey": service_key,
        "returnType": "json",
        "numOfRows": 1000,
        "pageNo": 1
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    items = resp.json().get('response', {}).get('body', {}).get('items', {}).get('item', [])
    # stationName 추출
    return [station['stationName'] for station in items]

def fetch_realtime_for(station_name):
    """단일 측정소 이름 기준 실시간 농도 조회"""
    service_key = current_app.config['AIRKOREA_SERVICE_KEY']
    url = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty"
    params = {
        "serviceKey": service_key,
        "returnType": "json",
        "numOfRows": 1,
        "pageNo": 1,
        "stationName": station_name,
        "dataTerm": "DAILY"
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    items = resp.json().get('response', {}).get('body', {}).get('items', [])
    return items[0] if items else None

@bp.route('/realtime')
def get_nationwide_realtime():
    """
    전국 모든 측정소의 실시간 미세먼지(PM10/PM2.5) 농도를 반환
    """
    try:
        station_names = fetch_station_list()
        results = []
        for name in station_names:
            try:
                data = fetch_realtime_for(name)
            except requests.HTTPError as e:
                current_app.logger.warning(f"Station {name} fetch failed: {e}")
                continue
            if not data:
                continue

            results.append({
                "stationName": name,
                "pm10": data.get("pm10Value"),
                "pm25": data.get("pm25Value"),
                "dataTime": data.get("dataTime")
            })

        return jsonify({
            "count": len(results),
            "items": results
        })

    except requests.HTTPError as e:
        current_app.logger.error(f"Air Korea API error: {e}")
        return jsonify({"error": "API 호출 실패", "detail": str(e)}), 502
    except Exception as e:
        current_app.logger.error(f"Internal server error: {e}")
        return jsonify({"error": "서버 내부 오류", "detail": str(e)}), 500
