"""
고객/구독자 DB 액세스 유틸
- 경로 우선순위: os.environ -> current_app.config -> data/ 하위 기본 파일
- 임포트 시 DB 초기화(부작용) 없음: 호출부에서 init_db()를 명시적/등록 시점(record_once)으로 실행
- 제공 함수:
    - init_db()
    - add_subscription(user_id, pollutant, threshold, kakao_id) -> int (row id)
    - get_subscribed_customers() -> List[dict]
    - update_subscription(sub_id, **fields)
    - delete_subscription(sub_id)
"""
import os
import sqlite3
from typing import List, Dict, Optional
from flask import current_app

def _db_path() -> str:
    """
    DB 경로 결정:
      1) 환경변수 CUSTOMER_DB_PATH
      2) app.config['CUSTOMER_DB_PATH']
      3) data/ 하위 기본 파일
    """
    base_default = os.path.join(os.path.abspath(os.path.dirname(__file__)), "customers.db")
    path = (os.getenv("CUSTOMER_DB_PATH")
            or (current_app.config.get("CUSTOMER_DB_PATH") if current_app else None)
            or base_default)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path

def init_db() -> None:
    """
    테이블 생성 (존재하면 무시)
    """
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        # 구독자/알림 설정 테이블
        c.execute("""
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                pollutant TEXT NOT NULL,   -- 'PM10' | 'PM25'
                threshold REAL NOT NULL,   -- 임계값
                kakao_id TEXT,             -- 카카오 수신자 식별자 등
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.commit()

def add_subscription(user_id: Optional[int],
                     pollutant: str,
                     threshold: float,
                     kakao_id: Optional[str]) -> int:
    """
    구독 추가
    """
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        c.execute("""
            INSERT INTO subscriptions (user_id, pollutant, threshold, kakao_id)
            VALUES (?,?,?,?)
        """, (user_id, pollutant, float(threshold), kakao_id))
        conn.commit()
        return int(c.lastrowid)

def get_subscribed_customers() -> List[Dict]:
    """
    알림 작업에서 사용하는 구독자 목록 반환
    반환 형태 예:
      [{"id": 1, "user_id": 10, "pollutant": "PM10", "threshold": 80.0, "kakao_id": "abc"}, ...]
    """
    with sqlite3.connect(_db_path()) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("""SELECT id, user_id, pollutant, threshold, kakao_id
                     FROM subscriptions""")
        rows = c.fetchall()
    return [dict(r) for r in rows]

def update_subscription(sub_id: int, **fields) -> bool:
    """
    구독 수정 (pollutant/threshold/kakao_id 중 일부 갱신)
    """
    allowed = {"pollutant", "threshold", "kakao_id", "user_id"}
    updates = {k: v for k, v in fields.items() if k in allowed}
    if not updates:
        return False
    sets = ", ".join([f"{k}=?" for k in updates.keys()])
    values = list(updates.values()) + [sub_id]
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        c.execute(f"UPDATE subscriptions SET {sets} WHERE id=?", values)
        conn.commit()
        return c.rowcount > 0

def delete_subscription(sub_id: int) -> bool:
    with sqlite3.connect(_db_path()) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM subscriptions WHERE id=?", (sub_id,))
        conn.commit()
        return c.rowcount > 0
