# Backend README

> 서울 반려견을 위한 미세먼지 정보 제공 플랫폼 – **Backend** 

---

## 📂 프로젝트 구조(백엔드 관련)

```
backend/
├─ app/
│  ├─ __init__.py        # Flask 앱 초기화, Swagger, CORS, Blueprint 등록
│  ├─ config.py          # 환경변수/DB 설정
│  ├─ routes.py          # 메인(안내) 페이지
│  └─ error_handlers.py  # 예외 처리 표준화
├─ data/
│  ├─ air_service.py
│  ├─ air_summary_service.py
│  ├─ cafe_reviews.py
│  ├─ expert_advice.py
│  ├─ guides_service.py
│  ├─ home_service.py
│  ├─ kakao_notify.py
│  ├─ location_service.py
│  ├─ nationwide_dust_api.py
│  ├─ pet_cafe_info.py
│  ├─ pet_cafe_db.py
│  ├─ pet_profiles.py
│  ├─ products_service.py (demo)
│  ├─ reviews.py
│  ├─ scheduler.py
│  ├─ seoul_history_api.py
│  ├─ seoul_visualize.py
│  ├─ dust_visualize.py
│  └─ dust_history_api.py
├─ requirements.txt
└─ Dockerfile
```

---

## ✅ 요구사항

* Python 3.11+
* pip / venv (권장: 가상환경)
* (선택) Docker & Docker Compose

---

## ⚙️ 환경변수(.env)

현재 프로젝트는 이미 동작 중인 `.env`를 사용합니다. *새 키 추가 없이* 아래 값이 존재하면 됩니다.

```
DEBUG=True
SECRET_KEY=...
FRONTEND_URL=...
KAKAO_ACCESS_TOKEN=...=
SEOUL_API_KEY=...
AIRKOREA_SERVICE_KEY=...
CUSTOMER_DB_PATH=...
REVIEWS_DB_PATH=...=
```

> 참고: 에어코리아 키는 **디코딩(일반 문자열) 키**를 권장합니다.

`.env`는 절대 커밋하지 마세요. 필요 시 `.env.example`로 키 이름만 공유하세요.

---

## 🚀 빠른 시작 (Windows PowerShell 예시)

```powershell
# 0) 가상환경(선택)
python -m venv .venv
. .venv\Scripts\Activate.ps1

# 1) 의존성 설치
pip install -r requirements.txt

# 2) 환경변수 파일 확인
# backend/.env (리포 루트 기준 경로는 팀 규칙에 맞게)

# 3) 개발 서버 실행
set FLASK_APP=backend/app
flask run --host=0.0.0.0 --port=5000

# Swagger UI: http://localhost:5000/docs/
```

### Docker로 실행

```bash
# 이미지 빌드
docker build -t dogpollution-backend ./backend

# 컨테이너 실행 (포트 5000 노출)
docker run --env-file ./backend/.env -p 5000:5000 dogpollution-backend
```

---

## 🔌 주요 기능 요약 (전국/모바일 브라우저 대응)

* **전국 확장**: 좌표 → 카카오 역지오코딩으로 전국 시/도·시군구 인식, 에어코리아 실시간 데이터 사용
* **모바일 브라우저 최적화**: 타임아웃 단축, 경량 응답(JSON 필드 축소), 캐시 헤더 적용
* **문서화**: Swagger(`/docs/`)로 전체 스펙 확인 가능

---

## 📖 API 요약

> 전체 스펙과 파라미터 상세는 Swagger(`/docs/`) 참고.

### 1) 대기질 조회

* **서울 구별**: `GET /api/dust/seoul/<PM10|PM25>`
* **전국 평균**: `GET /api/dust/province/<PM10|PM25>`
* **전국 요약(시/도별)**: `GET /api/air/summary?sidoName=서울&pollutant=PM10`
* **내 주변 측정소**: `GET /api/air/nearby?lat=<float>&lon=<float>`

### 2) 위치/가이드/요약

* **위치 확인(권한/정확도 대응)**: `GET /api/location/resolve?lat=<f>&lon=<f>&accuracy=<f>`
* **대기질 매핑(색/아이콘)**: `POST /api/air/visual-map` (body: `{pm10, pm25}`)
* **산책 가능 여부**: `GET /api/guides/walkability?pm10=&pm25=&sensitivity=`
* **홈 요약**: `GET /api/home/summary`

### 3) 장소/카페/리뷰

* **산책 장소**: `GET /api/walking_places?lat=&lon=&radius=`
* **애견카페 정보**: `GET /api/pet_cafe_info?lat=&lon=&radius=`
* **카페 리뷰**: `GET|POST /api/cafe_reviews/<cafe_name>` (POST는 로그인 필요)

### 4) 사용자/반려견/알림

* **User Profile**: `/api/user_profile/...`
* **Pet Profiles**: `/api/pet_profiles/...`
* **내 리뷰**: `/api/reviews/...`
* **알림 설정**: `/api/notifications/...`

### 5) 더미 상품(데모)

* **목록**: `GET /api/products`
* **상세**: `GET /api/products/<id>`


---

## API Documentation

---

## 📖 개요

* 모든 API는 `/api/` prefix를 가집니다.
* 응답은 기본적으로 `application/json` 형식입니다.
* 오류 발생 시 `{ "code": <int>, "message": "<string>" }` 형식으로 응답합니다.
* Swagger UI: `http://localhost:5000/docs/`

---

## 1) 대기질 조회

### 1-1. 서울 구별 대기질

* **GET** `/api/dust/seoul/<pollutant>`
* **Path Parameters**

  * `pollutant`: `PM10` 또는 `PM25`
* **Response**

```json
{
  "pollutant": "PM10",
  "items": [
    { "MSRSTENAME": "종로구", "PM10": 31 },
    { "MSRSTENAME": "중구",   "PM10": 29 }
  ]
}
```

### 1-2. 전국 평균 대기질

* **GET** `/api/dust/province/<item_code>`
* **Path Parameters**

  * `item_code`: `PM10` 또는 `PM25`
* **Response**

```json
{
  "pollutant": "PM25",
  "items": [
    { "city": "서울", "value": 15 },
    { "city": "부산", "value": 18 }
  ]
}
```

### 1-3. 전국 요약 (시/도별)

* **GET** `/api/air/summary`
* **Query Parameters**

  * `sidoName` *(필수)*: 조회할 시/도 이름 (예: `서울`, `부산`)
  * `pollutant`: `PM10` 또는 `PM25` (기본: `PM10`)
* **Response**

```json
{
  "level": "sido",
  "sidoName": "서울",
  "items": [
    { "stationName": "종로구", "dataTime": "2025-09-15 14:00", "PM10": 31, "PM25": 15 },
    { "stationName": "중구",   "dataTime": "2025-09-15 14:00", "PM10": 29, "PM25": 14 }
  ]
}
```

### 1-4. 내 주변 측정소

* **GET** `/api/air/nearby`
* **Query Parameters**

  * `lat`: 위도 (필수)
  * `lon`: 경도 (필수)
* **Response**

```json
{
  "items": [
    { "stationName": "종로구", "addr": "서울시 종로구", "tm": {"x": 200123, "y": 451234} },
    { "stationName": "중구",   "addr": "서울시 중구",   "tm": {"x": 200223, "y": 451334} }
  ]
}
```

---

## 2) 위치 및 시각화 기능

### 2-1. 위치 확인

* **GET** `/api/location/resolve`
* **Query Parameters**

  * `lat`: 위도 (선택)
  * `lon`: 경도 (선택)
  * `accuracy`: 정확도(m 단위, 선택)
* **Response**

```json
{
  "status": "ok",
  "source": "gps",
  "sido": {"name": "서울특별시"},
  "sigungu": {"name": "종로구"},
  "hint": null
}
```

### 2-2. 대기질 매핑

* **POST** `/api/air/visual-map`
* **Request Body**

```json
{ "pm10": 35, "pm25": 18 }
```

* **Response**

```json
{
  "label": "보통",
  "level": 1,
  "color": "#f1c40f",
  "icon": "walk-caution"
}
```

### 2-3. 산책 가능 여부

* **GET** `/api/guides/walkability`
* **Query Parameters**

  * `pm10`: PM10 값 (필수)
  * `pm25`: PM2.5 값 (필수)
  * `sensitivity`: `normal` 또는 `sensitive`
* **Response**

```json
{
  "decision": "CAUTION",
  "visual": { "label": "보통", "level": 1, "color": "#f1c40f", "icon": "walk-caution" },
  "tips": ["짧은 산책 권장", "수분 보충"]
}
```

### 2-4. 메인 요약

* **GET** `/api/home/summary`
* **Response**

```json
{
  "primary": { "label": "보통", "level": 1, "color": "#f1c40f", "icon": "walk-caution" },
  "headline": "현재 상태: 보통",
  "cta": { "text": "산책 가이드 보기", "href": "/guide" },
  "location": { "area": "종로구", "source": "default" }
}
```

---

## 3) 장소/카페/리뷰

### 3-1. 산책 장소 추천

* **GET** `/api/walking_places`
* **Query Parameters**

  * `lat`: 위도 (필수)
  * `lon`: 경도 (필수)
  * `radius`: 반경 km (선택, 기본=3)
* **Response**

```json
[
  { "name": "용허리근린공원", "latitude": 37.5678, "longitude": 126.9756 }
]
```

### 3-2. 애견카페 정보

* **GET** `/api/pet_cafe_info`
* **Query Parameters**

  * `lat`: 위도 (필수)
  * `lon`: 경도 (필수)
  * `radius`: 반경 km (선택, 기본=5)

### 3-3. 카페 리뷰

* **GET** `/api/cafe_reviews/<cafe_name>` (로그인 필요)
* **POST** `/api/cafe_reviews/<cafe_name>` (로그인 필요)
* **Response (GET)**

```json
{
  "cafe_name": "멍멍카페",
  "reviews": [
    { "rating": 5, "review": "좋아요!", "created_at": "2025-09-15T12:00:00" }
  ]
}
```

---

## 4) 사용자/반려견/알림

### 4-1. 사용자 프로필

* **엔드포인트**: `/api/user_profile/...`

### 4-2. 반려견 프로필

* **엔드포인트**: `/api/pet_profiles/...`

### 4-3. 리뷰 관리

* **엔드포인트**: `/api/reviews/...`

### 4-4. 알림 설정

* **엔드포인트**: `/api/notifications/...`

(세부 파라미터와 응답은 Swagger 참고)

---

## 5) 더미 상품(데모)

### 5-1. 상품 목록

* **GET** `/api/products`
* **Response**

```json
[
  { "id": 1, "name": "강아지 사료", "price": 25000, "image": "/static/images/dogfood.png" },
  { "id": 2, "name": "산책용 목줄", "price": 15000, "image": "/static/images/leash.png" }
]
```

### 5-2. 상품 상세

* **GET** `/api/products/<id>`
* **Response**

```json
{ "id": 1, "name": "강아지 사료", "price": 25000, "image": "/static/images/dogfood.png" }
```

---

## 🧰 트러블슈팅

* **Swagger 페이지가 안 열림**: `from flasgger import Swagger` import 확인, `app.config.from_object(Config)` → `Swagger(app, ...)` 순서 유지
* **에어코리아 403/실패**: `AIRKOREA_SERVICE_KEY`가 *디코딩 키*인지 확인
* **카카오 401**: `.env`의 `KAKAO_ACCESS_TOKEN`(또는 `KAKAO_ADMIN_KEY`) 값 확인, `Authorization: KakaoAK <키>` 형식
* **DB 파일 위치 혼동**: `config.py`에서 `SQLALCHEMY_DATABASE_URI` 절대경로 확인(기본: `backend/app.db`)

---


