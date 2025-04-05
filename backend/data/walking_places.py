from flask import Blueprint, request, jsonify

# 산책 장소 정보 예시 (실제 서비스에서는 DB나 외부 API 연동 고려)
WALKING_PLACES = [
    {"name": "서울숲", "latitude": 37.544, "longitude": 127.037, "description": "넓은 공원과 산책로가 있는 서울숲"},
    {"name": "남산 공원", "latitude": 37.551, "longitude": 126.988, "description": "서울 도심의 대표 공원, 다양한 산책로 제공"},
    {"name": "한강 시민공원", "latitude": 37.519, "longitude": 126.964, "description": "한강을 따라 조성된 산책로"}
]

def get_walking_places(latitude, longitude, radius=5):
    """
    주어진 위치와 반경(radius, 단위: km) 내 산책 장소 정보를 반환하는 함수
    인자:
      - latitude: 위도
      - longitude: 경도
      - radius: 검색 반경 (기본값 5km)
    """
    # 간단 예시: 모든 장소를 반환 (실제 서비스에서는 거리 계산 후 필터링)
    return WALKING_PLACES

# Flask Blueprint 생성 및 엔드포인트 정의
walking_places_bp = Blueprint('walking_places_bp', __name__)

@walking_places_bp.route('/api/walking_places', methods=['GET'])
def walking_places():
    """
    GET 요청: 사용자의 위치 정보를 받아 산책 장소 목록을 JSON으로 반환하는 엔드포인트
    쿼리 파라미터:
      - lat: 위도 (필수)
      - lon: 경도 (필수)
      - radius: 검색 반경 (선택, 기본값 5km)
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
    except (TypeError, ValueError):
        return jsonify({"error": "위도(lat)와 경도(lon)는 필수이며, 숫자 형식이어야 합니다."}), 400
    try:
        radius = float(request.args.get('radius', 5))
    except ValueError:
        radius = 5
    places = get_walking_places(lat, lon, radius)
    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "radius": radius,
        "places": places
    })