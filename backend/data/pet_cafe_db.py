import sqlite3
import os
import math

# 데이터베이스 파일 경로 설정
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DB_PATH = os.path.join(BASE_DIR, 'data', 'pet_cafes.db')

# 초기 애견카페 목록 예시 (시드 데이터)
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

def init_db():
    """
    데이터베이스 초기화 및 테이블 생성, 기본 데이터 시드
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # 테이블 생성
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cafes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            restrictions TEXT,
            operating_hours TEXT,
            price TEXT
        )
    ''')
    conn.commit()

    # 기본 데이터 시드 (테이블이 비어 있을 때만)
    cursor.execute('SELECT COUNT(*) FROM cafes')
    count = cursor.fetchone()[0]
    if count == 0:
        for cafe in DEFAULT_CAFES:
            add_cafe(
                cafe['name'], cafe['latitude'], cafe['longitude'],
                cafe['restrictions'], cafe['operating_hours'], cafe['price']
            )

    conn.close()


def add_cafe(name, latitude, longitude, restrictions, operating_hours, price):
    """
    애견카페 정보를 데이터베이스에 추가
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO cafes (name, latitude, longitude, restrictions, operating_hours, price)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (name, latitude, longitude, restrictions, operating_hours, price))
    conn.commit()
    conn.close()


def get_all_cafes():
    """
    저장된 모든 애견카페 정보를 리스트 형태로 반환
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT name, latitude, longitude, restrictions, operating_hours, price FROM cafes')
    rows = cursor.fetchall()
    conn.close()
    # 딕셔너리 리스트로 변환
    return [
        {
            'name': row[0],
            'latitude': row[1],
            'longitude': row[2],
            'restrictions': row[3],
            'operating_hours': row[4],
            'price': row[5]
        }
        for row in rows
    ]

def _haversine(lat1, lon1, lat2, lon2):
    """
    두 위경도 사이의 거리를 km 단위로 계산 (Haversine 공식)
    """
    R = 6371  # 지구 반경 (km)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def get_cafes_by_location(latitude, longitude, radius=5):
    """
    DB에 저장된 모든 카페 중, 주어진 위치(latitude, longitude)에서
    반경(radius km) 내 카페만 반환
    """
    cafes = get_all_cafes()   # 기존 함수 재사용
    nearby = []
    for cafe in cafes:
        dist = _haversine(latitude, longitude,
                          cafe['latitude'], cafe['longitude'])
        if dist <= radius:
            cafe_with_dist = cafe.copy()
            cafe_with_dist['distance_km'] = round(dist, 2)
            nearby.append(cafe_with_dist)
    return nearby

# 모듈 직접 실행 시 DB 초기화
if __name__ == '__main__':
    init_db()
    print("Database initialized and default cafes seeded.")
