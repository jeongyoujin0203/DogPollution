"""
애견카페 DB 액세스 모듈
- 경로는 .env/Config 값(PET_CAFE_DB_PATH) 우선 사용
- 기본 시드 데이터 삽입
- Haversine 거리로 반경 필터링
"""
import sqlite3
import os
import math
from flask import current_app

DEFAULT_CAFES = [
    {
        "name": "도그카페 해피독",
        "latitude": 37.565,
        "longitude": 126.976,
        "restrictions": "소형견만 입장 가능",
        "operating_hours": "10:00 ~ 22:00",
        "price": "커피 5,000원, 디저트 7,000원"
    },
    {
        "name": "퍼피라운지",
        "latitude": 37.570,
        "longitude": 126.982,
        "restrictions": "견종 제한 없음",
        "operating_hours": "09:00 ~ 20:00",
        "price": "음료 6,000원, 스낵 4,000원"
    }
]

def _db_path():
    # .env 또는 app.config 값 우선, 없으면 data/ 하위 기본 파일
    base_default = os.path.join(os.path.abspath(os.path.dirname(__file__)), "pet_cafes.db")
    path = (os.getenv("PET_CAFE_DB_PATH")
            or (current_app.config.get("PET_CAFE_DB_PATH") if current_app else None)
            or base_default)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path

def init_db():
    """
    데이터베이스 초기화 및 테이블 생성, 기본 데이터 시드
    """
    path = _db_path()
    with sqlite3.connect(path) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cafes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                restrictions TEXT,
                operating_hours TEXT,
                price TEXT
            )
        """)
        conn.commit()

        # 기본 데이터 시드 (테이블 비어 있을 때만)
        cursor.execute("SELECT COUNT(*) FROM cafes")
        count = cursor.fetchone()[0]
        if count == 0:
            for cafe in DEFAULT_CAFES:
                cursor.execute("""
                    INSERT INTO cafes (name, latitude, longitude, restrictions, operating_hours, price)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (cafe["name"], cafe["latitude"], cafe["longitude"],
                      cafe["restrictions"], cafe["operating_hours"], cafe["price"]))
            conn.commit()

def add_cafe(name, latitude, longitude, restrictions, operating_hours, price):
    with sqlite3.connect(_db_path()) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO cafes (name, latitude, longitude, restrictions, operating_hours, price)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (name, latitude, longitude, restrictions, operating_hours, price))
        conn.commit()

def get_all_cafes():
    with sqlite3.connect(_db_path()) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, latitude, longitude, restrictions, operating_hours, price FROM cafes")
        rows = cursor.fetchall()
    return [
        {
            "name": row[0],
            "latitude": row[1],
            "longitude": row[2],
            "restrictions": row[3],
            "operating_hours": row[4],
            "price": row[5],
        }
        for row in rows
    ]

def _haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2.0)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon/2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def get_cafes_by_location(latitude, longitude, radius=5.0):
    cafes = get_all_cafes()
    nearby = []
    for cafe in cafes:
        dist = _haversine(latitude, longitude, cafe["latitude"], cafe["longitude"])
        if dist <= radius:
            item = dict(cafe)
            item["distance_km"] = round(dist, 2)
            nearby.append(item)
    return nearby
