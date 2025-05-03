# backend/data/pet_cafe_info.py
from flask import Blueprint, request, jsonify
from pet_cafe_db import init_db, get_cafes_by_location

pet_cafe_info_bp = Blueprint('pet_cafe_info_bp', __name__)

# 앱 시작 시 DB 초기화 (한 번만 실행)
init_db()

@pet_cafe_info_bp.route('/api/pet_cafe_info', methods=['GET'])
def pet_cafe_info():
    """
    GET 요청: 사용자의 위치 정보를 받아 반경 내 애견카페 정보 및 댓글을 JSON으로 반환
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

    # DB에서 반경 내 카페만 조회
    cafes = get_cafes_by_location(lat, lon, radius)

    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "radius_km": radius,
        "count": len(cafes),
        "pet_cafes": cafes
    })
