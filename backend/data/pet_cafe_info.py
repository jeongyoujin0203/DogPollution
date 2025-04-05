from flask import Blueprint, request, jsonify

# 애견카페 정보 예시 데이터
PET_CAFES = [
    {
        "name": "도그카페 해피독",
        "latitude": 37.565, "longitude": 126.976,
        "restrictions": "소형견만 입장 가능",
        "operating_hours": "10:00 ~ 22:00",
        "price": "커피 5,000원, 디저트 7,000원",
        "comments": ["깔끔해요", "친절한 직원"]
    },
    {
        "name": "퍼피라운지",
        "latitude": 37.570, "longitude": 126.982,
        "restrictions": "견종 제한 없음",
        "operating_hours": "09:00 ~ 20:00",
        "price": "음료 6,000원, 스낵 4,000원",
        "comments": ["애견 전용 공간이 좋음", "가격이 조금 비싸요"]
    }
]

def get_pet_cafe_info(latitude, longitude, radius=5):
    """
    주어진 위치와 반경(radius, 단위: km) 내 애견카페 정보를 반환하는 함수
    인자:
      - latitude: 위도
      - longitude: 경도
      - radius: 검색 반경 (기본값 5km)
    """
    # 간단 예시: 모든 애견카페 정보를 반환 (실제 서비스에서는 거리 계산 후 필터링)
    return PET_CAFES

# Flask Blueprint 생성 및 엔드포인트 정의
pet_cafe_info_bp = Blueprint('pet_cafe_info_bp', __name__)

@pet_cafe_info_bp.route('/api/pet_cafe_info', methods=['GET'])
def pet_cafe_info():
    """
    GET 요청: 사용자의 위치 정보를 받아 애견카페 정보 및 댓글 목록을 JSON으로 반환하는 엔드포인트
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
    cafes = get_pet_cafe_info(lat, lon, radius)
    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "radius": radius,
        "pet_cafes": cafes
    })