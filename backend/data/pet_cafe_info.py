"""
애견카페 기본 정보 조회 API
- 좌표/반경으로 DB 내 카페 필터링
- DB 초기화는 임포트 시점이 아니라 '블루프린트 등록' 시 1회 실행(record_once)
"""
from flask import Blueprint, request, jsonify
from .pet_cafe_db import init_db, get_cafes_by_location

pet_cafe_info_bp = Blueprint("pet_cafe_info_bp", __name__)

@pet_cafe_info_bp.record_once
def _init_db_on_register(setup_state):
    # 블루프린트가 앱에 등록될 때 1회 실행 (임포트 부작용 방지)
    init_db()

@pet_cafe_info_bp.route("/api/pet_cafe_info", methods=["GET"])
def pet_cafe_info():
    """
    GET: /api/pet_cafe_info?lat=<float>&lon=<float>&radius=<float:km,default=5>
    """
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
    except (TypeError, ValueError):
        return jsonify({"code": 400, "message": "lat/lon 필수(숫자)"}), 400

    try:
        radius = float(request.args.get("radius", 5))
    except ValueError:
        radius = 5.0

    cafes = get_cafes_by_location(lat, lon, radius)
    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "radius_km": radius,
        "count": len(cafes),
        "pet_cafes": cafes
    })
