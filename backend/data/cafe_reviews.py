# backend/data/cafe_reviews.py
"""
애견카페 리뷰 및 별점 저장·조회 모듈 (SQLite 기반)
- review 테이블에 별점(rating)과 리뷰(review_text)를 저장
- Flask Blueprint를 통해 API 제공
"""
import sqlite3
import os
from datetime import datetime
from flask import Blueprint, request, jsonify

# DB 경로 설정
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'cafes_reviews.db')

# 데이터베이스 초기화
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cafe_name TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            review_text TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# 리뷰 추가 함수
def add_review(cafe_name, rating, review_text):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.utcnow().isoformat()
    c.execute('''
        INSERT INTO reviews (cafe_name, rating, review_text, created_at)
        VALUES (?, ?, ?, ?)
    ''', (cafe_name, rating, review_text, now))
    conn.commit()
    conn.close()

# 특정 카페 리뷰 조회 함수
def get_reviews(cafe_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        SELECT rating, review_text, created_at
        FROM reviews
        WHERE cafe_name = ?
        ORDER BY created_at DESC
    ''', (cafe_name,))
    rows = c.fetchall()
    conn.close()
    # dict 형태로 반환
    return [
        {"rating": r[0], "review": r[1], "created_at": r[2]}
        for r in rows
    ]

# Flask Blueprint 정의
cafe_reviews_bp = Blueprint('cafe_reviews_bp', __name__)

# DB 초기화
init_db()

@cafe_reviews_bp.route('/api/cafe_reviews/<cafe_name>', methods=['GET'])
def fetch_reviews(cafe_name):
    """
    GET: 해당 애견카페의 리뷰 리스트 반환
    URL 경로 변수: cafe_name
    """
    reviews = get_reviews(cafe_name)
    return jsonify({
        "cafe_name": cafe_name,
        "count": len(reviews),
        "reviews": reviews
    })

@cafe_reviews_bp.route('/api/cafe_reviews/<cafe_name>', methods=['POST'])
def submit_review(cafe_name):
    """
    POST: 해당 애견카페에 별점과 리뷰를 추가
    요청 JSON 예시: { "rating": 4, "review": "아주 좋아요!" }
    """
    data = request.get_json() or {}
    rating = data.get('rating')
    review_text = data.get('review')
    # 입력 검증
    if not isinstance(rating, int) or not (1 <= rating <= 5):
        return jsonify({"error": "rating은 1~5 정수여야 합니다."}), 400
    if not review_text or not isinstance(review_text, str):
        return jsonify({"error": "review(텍스트)가 필요합니다."}), 400
    add_review(cafe_name, rating, review_text)
    return jsonify({"message": "리뷰 등록 성공", "cafe_name": cafe_name}), 201
