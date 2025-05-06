## DogPollution Backend API 문서

### 기본 안내

* **호스트(로컬)**: `http://localhost:5000`
* **Swagger UI**: `/docs/`
* **OpenAPI 스펙**: `/apispec_1.json`
* 모든 엔드포인트는 `/api/`로 시작합니다.

## 1. 미세먼지 데이터

### 1-1. 서울 구별 미세먼지

**GET** `/api/dust/seoul/{pollutant}`

* **Path Parameter**

  * `pollutant`: `PM10` 또는 `PM25`

#### Response 예시

```json
{
  "pollutant": "PM10",
  "data": [
    { "region": "종로구", "value": 45 },
    { "region": "중구",   "value": 52 }
  ]
}
```

### 1-2. 전국 도/광역시 평균 미세먼지

**GET** `/api/dust/province/{item_code}`

* **Path Parameter**

  * `item_code`: `PM10` 또는 `PM25`

#### Response 예시

```json
{
  "item_code": "PM25",
  "data": [
    { "region": "서울특별시", "value": 48 },
    { "region": "부산광역시", "value": 55 }
  ]
}
```

## 2. 전문가 조언

**GET** `/api/advice/{pollutant}/{value}`

* **Path Parameter**

  * `pollutant`: `PM10` 또는 `PM25`
  * `value`: 정수 미세먼지 농도

#### Response 예시

```json
{
  "pollutant": "PM10",
  "value": 85,
  "advice": "미세먼지 농도가 높습니다. 외출을 자제하세요."
}
```

## 3. 위치 기반 검색

### 3-1. 산책 장소

**GET** `/api/walking_places?lat={lat}&lon={lon}&radius={radius}`

* **Query Parameter**

  * `lat`: 위도 (필수)
  * `lon`: 경도 (필수)
  * `radius`: 반경 km, 기본값 5 (선택)

#### Response 예시

```json
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "radius": 3,
  "places": [
    {
      "name": "서울숲",
      "latitude": 37.544,
      "longitude": 127.037,
      "description": "넓은 공원과 산책로"
    }
  ]
}
```

### 3-2. 애견카페 정보

**GET** `/api/pet_cafe_info?lat={lat}&lon={lon}&radius={radius}`

* **Query Parameter**

  * `lat`: 위도 (필수)
  * `lon`: 경도 (필수)
  * `radius`: 반경 km, 기본값 5 (선택)

#### Response 예시

```json
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "radius_km": 5,
  "count": 2,
  "pet_cafes": [
    {
      "name": "도그카페 해피독",
      "latitude": 37.565,
      "longitude": 126.976,
      "restrictions": "소형견만 입장 가능",
      "operating_hours": "10:00 ~ 22:00",
      "price": "커피 5,000원",
      "distance_km": 0.27
    }
  ]
}
```

## 4. 애견카페 리뷰 & 별점

**GET** `/api/cafe_reviews/{cafe_name}`
**POST** `/api/cafe_reviews/{cafe_name}`

* **Path Parameter**

  * `cafe_name`: 카페 이름
* **POST Request Body 예시**

  ```json
  {
    "rating": 4,
    "review": "정말 좋아요!"
  }
  ```
* **GET Response 예시**

  ```json
  {
    "cafe_name": "CafeX",
    "count": 2,
    "reviews": [
      { "rating": 5, "review": "최고!",     "created_at": "2025-05-05T12:34:56" },
      { "rating": 3, "review": "보통이에요", "created_at": "2025-05-04T09:10:11" }
    ]
  }
  ```

## 5. 구독(알림) 관리

**POST** `/api/customers`
**GET** `/api/customers`
**GET** `/api/customers/{customer_id}`
**PUT** `/api/customers/{customer_id}`
**DELETE** `/api/customers/{customer_id}`

* **POST `/api/customers` Request Body 예시**

  ```json
  {
    "name": "홍길동",
    "kakao_token": "사용자_토큰",
    "pollutant": "PM10",
    "threshold": 80
  }
  ```
* **GET `/api/customers` Response 예시**

  ```json
  {
    "subscribers": [
      { "id": 1, "name": "홍길동", "pollutant": "PM10", "threshold": 80 }
    ]
  }
  ```
* **GET `/api/customers/{id}` Response 예시**

  ```json
  {
    "id": 1,
    "name": "홍길동",
    "pollutant": "PM10",
    "threshold": 80,
    "active": true
  }
  ```
* **PUT `/api/customers/{id}` Request Body 예시**

  ```json
  {
    "threshold": 90,
    "active": false
  }
  ```
* **DELETE `/api/customers/{id}` Response 예시**

  ```json
  { "message": "구독 해지 완료" }
  ```

## 6. 카카오톡 알림 발송

**POST** `/api/notify/kakao`

* **Request Body 예시**

  ```json
  {
    "pollutant": "PM10",
    "value": 85
  }
  ```
* **Response 예시**

  ```json
  {
    "message": "알림 전송 성공",
    "result": { /* 카카오 API 응답 */ }
  }
  ```

## 7. 미세먼지 통계 API
### 7-1. 서울시 구별 월별 통계
**GET** `/api/dust/history/monthly?year={YYYY}&pollutant={PM10|PM25}`

* **Query Parameter**
  * `year (필수)`: 조회할 연도, 예: 2025

  * `pollutant (필수)`: PM10 또는 PM25

#### Response 예시

```json
{
  "year": "2025",
  "pollutant": "PM10",
  "data": [
    {
      "region": "종로구",
      "monthly": [45.2, 50.1, 55.3, …, 40.0]
    },
    {
      "region": "중구",
      "monthly": [47.0, 49.2, 53.8, …, 42.5]
    }
    // …
  ]
}
```

### 7-2. 서울시 구별 연별 통계
**GET** `/api/dust/seoul/history/yearly?start_year={YYYY}&end_year={YYYY}&pollutant={PM10|PM25}`

* **Query Parameter**
  * `start_year (필수)`: 시작 연도, 예: 2023

  * `end_year (필수)`: 종료 연도, 예: 2025
 
  * `pollutant (필수)`: PM10 또는 PM25

#### Response 예시

```json
{
  "start_year": "2023",
  "end_year": "2025",
  "pollutant": "PM25",
  "years": ["2023", "2024", "2025"],
  "data": [
    {
      "region": "종로구",
      "yearly": [48.5, 47.2, 46.1]
    },
    {
      "region": "중구",
      "yearly": [49.0, 48.0, 47.5]
    }
    // …
  ]
}
```
