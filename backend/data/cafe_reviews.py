from flask import Blueprint, request, jsonify

# 간단한 리뷰 저장소 (글로벌 변수)
CAFE_REVIEWS = {
    # "애견카페 이름": [리뷰 리스트]
}

def add_review(cafe_name, review_text):
    """
    주어진 애견카페 이름에 대해 리뷰(review_text)를 추가하는 함수
    """
    if cafe_name in CAFE_REVIEWS:
        CAFE_REVIEWS[cafe_name].append(review_text)
    else:
        CAFE_REVIEWS[cafe_name] = [review_text]
    return True

def get_reviews(cafe_name):
    """
    주어진 애견카페 이름에 대한 리뷰 리스트를 반환하는 함수
    """
    return CAFE_REVIEWS.get(cafe_name, [])

# Flask Blueprint 생성 및 엔드포인트 정의
cafe_reviews_bp = Blueprint('cafe_reviews_bp', __name__)

@cafe_reviews_bp.route('/api/cafe_reviews/<cafe_name>', methods=['GET'])
def fetch_reviews(cafe_name):
    """
    GET 요청: 주어진 애견카페 이름에 대한 리뷰 리스트를 JSON으로 반환하는 엔드포인트
    """
    reviews = get_reviews(cafe_name)
    return jsonify({
        "cafe_name": cafe_name,
        "reviews": reviews
    })

@cafe_reviews_bp.route('/api/cafe_reviews/<cafe_name>', methods=['POST'])
def submit_review(cafe_name):
    """
    POST 요청: 주어진 애견카페 이름에 대한 리뷰를 추가하는 엔드포인트
    요청 JSON 예시: { "review": "리뷰 내용" }
    """
    data = request.get_json()
    if not data or "review" not in data:
        return jsonify({"error": "리뷰 내용이 필요합니다."}), 400
    review_text = data["review"]
    add_review(cafe_name, review_text)
    return jsonify({
        "message": "리뷰가 추가되었습니다.",
        "cafe_name": cafe_name,
        "review": review_text
    })