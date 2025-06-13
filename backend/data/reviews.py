# 사용자 리뷰 관리 (내 리뷰 조회/추가/수정/삭제)

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..app.models import Review, db

bp = Blueprint('reviews', __name__, url_prefix='/api')

@bp.route('/users/me/reviews', methods=['GET'])
@login_required
def list_my_reviews():
    """현재 사용자가 작성한 모든 리뷰 조회"""
    reviews = Review.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': r.id,
            'place_id': r.place_id,
            'rating': r.rating,
            'review': r.review,
            'created_at': r.created_at.isoformat()
        }
        for r in reviews
    ]), 200

@bp.route('/places/<int:place_id>/reviews', methods=['POST'])
@login_required
def add_review(place_id):
    """특정 장소에 대한 새로운 리뷰 등록"""
    data = request.get_json() or {}
    rating = data.get('rating')
    text = data.get('review')

    if rating is None or text is None:
        return jsonify({'error': 'Rating and review text are required'}), 400

    review = Review(
        user_id=current_user.id,
        place_id=place_id,
        rating=rating,
        review=text
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review created', 'review_id': review.id}), 201

@bp.route('/reviews/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    """내 리뷰 수정"""
    review = Review.query.filter_by(id=review_id, user_id=current_user.id).first()
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    data = request.get_json() or {}
    review.rating = data.get('rating', review.rating)
    review.review = data.get('review', review.review)
    db.session.commit()
    return jsonify({'message': 'Review updated'}), 200

@bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """내 리뷰 삭제"""
    review = Review.query.filter_by(id=review_id, user_id=current_user.id).first()
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'}), 200