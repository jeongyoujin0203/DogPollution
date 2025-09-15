from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
import sqlite3, os
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'cafe_reviews.db')

cafe_reviews_bp = Blueprint('cafe_reviews_bp', __name__, url_prefix="/api/cafe_reviews")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            cafe_name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            review_text TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@cafe_reviews_bp.get("/<cafe_name>")
@login_required
def get_reviews(cafe_name):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT rating, review_text, created_at FROM reviews WHERE cafe_name=?", (cafe_name,))
    rows = c.fetchall()
    conn.close()
    return jsonify({"cafe_name": cafe_name, "reviews": [
        {"rating": r[0], "review": r[1], "created_at": r[2]} for r in rows
    ]})

@cafe_reviews_bp.post("/<cafe_name>")
@login_required
def add_review(cafe_name):
    data = request.get_json() or {}
    rating, review = data.get("rating"), data.get("review")
    if not isinstance(rating, int) or not review:
        return jsonify({"code": 400, "message": "rating(int), review(text) 필수"}), 400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    now = datetime.utcnow().isoformat()
    c.execute("INSERT INTO reviews (user_id,cafe_name,rating,review_text,created_at) VALUES (?,?,?,?,?)",
              (current_user.id, cafe_name, rating, review, now))
    conn.commit()
    conn.close()
    return jsonify({"message": "리뷰 등록 완료"}), 201
