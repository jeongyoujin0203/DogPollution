from flask import Blueprint, request, jsonify
from .location_service import SEOUL_DISTRICTS
from .guides_service import walkability

home_bp = Blueprint("home_bp", __name__, url_prefix="/api/home")

@home_bp.route("/summary", methods=["GET"])
def summary():
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    # TODO: 실제 연동 (seoul_dust.py 등) → 현재는 더미 데이터
    pm10, pm25 = 30, 15
    label = "보통"

    return jsonify({
        "primary": {"label":label,"color":"#f1c40f","icon":"walk-caution","level":1},
        "headline": f"현재 상태: {label}",
        "cta": {"text":"산책 가이드 보기","href":"/guide"},
        "location": {"area":"종로구","source":"default","hint":"위치 권한 허용시 자동 갱신"}
    })
