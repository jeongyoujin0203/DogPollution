"""
카페 리뷰 API
- 경로 우선순위: os.environ['REVIEWS_DB_PATH'] -> current_app.config['REVIEWS_DB_PATH'] -> data/cafe_reviews.db
- DB 초기화는 블루프린트 등록 시점에 1회만 실행 (record_once)
"""
from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
import sqlite3
from datetime import datetime
import os

cafe_reviews_bp = Blueprint("cafe_reviews_bp", __name__, url_prefix="/api/cafe_reviews")

def _db_path() -> str:
    """
    .env / app.config 기반 경로 결정
    """
    base_default = os.path.join(os.path.abspath(os.path.dirname(__file__)), "cafe_reviews.db")
    path = (os.getenv("REVIEWS_DB_PATH")
            or (current_app.config.get("REVIEWS_DB_PATH") if current_app else None)
            or base_default)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path

def _init_db(path: str) -> None:
    with sqlite3.connect(path) as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                cafe_name TEXT NOT NULL,
                rating INTEGER NOT NULL,
                review_text TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()

@cafe_reviews_bp.record_once
def _init_on_register(setup_state):
    _init_db(_db_path())

@cafe_reviews_bp.get("/<cafe_name>")
@login_required
def get_reviews(cafe_name: str):
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT rating, review_text, created_at
            FROM reviews
            WHERE cafe_name=?
            ORDER BY id DESC
        """, (cafe_name,))
        rows = c.fetchall()
    return jsonify({
        "cafe_name": cafe_name,
        "reviews": [{"rating": r[0], "review": r[1], "created_at": r[2]} for r in rows]
    })

@cafe_reviews_bp.post("/<cafe_name>")
@login_required
def add_review(cafe_name: str):
    data = request.get_json(silent=True) or {}
    rating, review = data.get("rating"), data.get("review")
    if not isinstance(rating, int) or not review:
        return jsonify({"code": 400, "message": "rating(int), review(text) 필수"}), 400

    now = datetime.utcnow().isoformat()
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO reviews (user_id, cafe_name, rating, review_text, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (current_user.id, cafe_name, rating, review, now))
        conn.commit()
    return jsonify({"message": "리뷰 등록 완료"}), 201
