"""
강아지 용품 더미 API
실제 판매 기능이 아니라, 서비스 데모를 위해 기본 상품 목록만 내려줌.
"""
from flask import Blueprint, jsonify

products_bp = Blueprint("products_bp", __name__, url_prefix="/api/products")

# 샘플 상품 데이터 (DB 없이 메모리에서 제공)
PRODUCTS = [
    {
        "id": 1,
        "name": "강아지 사료",
        "price": 25000,
        "image": "/static/images/dogfood.png",
        "description": "건강에 좋은 프리미엄 사료"
    },
    {
        "id": 2,
        "name": "산책용 목줄",
        "price": 15000,
        "image": "/static/images/leash.png",
        "description": "튼튼하고 가벼운 산책 목줄"
    },
    {
        "id": 3,
        "name": "강아지 장난감",
        "price": 8000,
        "image": "/static/images/toy.png",
        "description": "스트레스 해소용 귀여운 장난감"
    }
]

@products_bp.route("", methods=["GET"])
def list_products():
    """
    강아지 용품 목록 조회
    ---
    tags:
      - Products
    responses:
      200:
        description: 강아지 용품 리스트
    """
    return jsonify(PRODUCTS)

@products_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    """
    특정 상품 상세 조회
    ---
    tags:
      - Products
    parameters:
      - name: product_id
        in: path
        type: integer
        required: true
        description: 상품 ID
    responses:
      200:
        description: 선택한 상품 상세 정보
      404:
        description: 상품을 찾을 수 없음
    """
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        return jsonify({"code": 404, "message": "상품을 찾을 수 없습니다."}), 404
    return jsonify(product)
