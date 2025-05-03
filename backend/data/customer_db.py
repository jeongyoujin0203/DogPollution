# backend/data/customer_db.py
import sqlite3
import os

# DB 파일 경로: backend/data/customers.db
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'customers.db')

def init_db():
    """
    데이터베이스 초기화: customers 테이블 생성
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            kakao_token TEXT NOT NULL,
            pollutant TEXT NOT NULL,     -- 'PM10' or 'PM25'
            threshold INTEGER NOT NULL,  -- 알림 임계치
            active INTEGER NOT NULL DEFAULT 1  -- 구독 활성화 여부 (1=활성, 0=비활성)
        )
    ''')
    conn.commit()
    conn.close()

def add_customer(name, kakao_token, pollutant, threshold):
    """
    고객 등록 및 구독 설정 추가
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO customers (name, kakao_token, pollutant, threshold)
        VALUES (?, ?, ?, ?)
    ''', (name, kakao_token, pollutant, threshold))
    conn.commit()
    customer_id = c.lastrowid
    conn.close()
    return customer_id

def update_subscription(customer_id, pollutant=None, threshold=None, active=None):
    """
    구독 설정 수정 (오직 전달된 필드만)
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    fields = []
    args = []
    if pollutant is not None:
        fields.append('pollutant = ?')
        args.append(pollutant)
    if threshold is not None:
        fields.append('threshold = ?')
        args.append(threshold)
    if active is not None:
        fields.append('active = ?')
        args.append(1 if active else 0)
    args.append(customer_id)
    c.execute(f'''
        UPDATE customers
        SET {', '.join(fields)}
        WHERE id = ?
    ''', args)
    conn.commit()
    conn.close()

def get_customer(customer_id):
    """
    단일 고객 정보 조회
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, name, kakao_token, pollutant, threshold, active FROM customers WHERE id = ?', (customer_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        return None
    return dict(
        id=row[0], name=row[1], kakao_token=row[2],
        pollutant=row[3], threshold=row[4], active=bool(row[5])
    )

def delete_customer(customer_id):
    """
    구독 해지 (active = 0)
    """
    update_subscription(customer_id, active=False)

def get_subscribed_customers():
    """
    활성화(active=1)된 모든 고객 리스트 반환
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, name, kakao_token, pollutant, threshold FROM customers WHERE active = 1')
    rows = c.fetchall()
    conn.close()
    return [
        dict(id=r[0], name=r[1], kakao_token=r[2], pollutant=r[3], threshold=r[4])
        for r in rows
    ]

# 모듈 임포트 시 DB 초기화
init_db()
