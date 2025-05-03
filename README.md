

📘 DogPollution Backend API 문서
기본 안내
호스트(로컬): http://localhost:5000

Swagger UI(Flasgger): http://localhost:5000/docs/

OpenAPI 스펙: http://localhost:5000/apispec_1.json

모든 엔드포인트는 /api/로 시작합니다.

CORS가 *로 허용되어 있어, 프론트엔드(5173)에서 바로 호출 가능합니다.

1. 미세먼지 데이터
1-1. 서울 구별 미세먼지
swift
복사
GET /api/dust/seoul/{pollutant}
Path Parameter	설명	예시
pollutant	PM10 또는 PM25	PM10

Response
jsonc
복사
{
  "pollutant": "PM10",
  "data": [
    { "region": "종로구", "value": 45 },
    { "region": "중구",   "value": 52 },
    … 
  ]
}
1-2. 전국 도/광역시 평균 미세먼지
swift
복사
GET /api/dust/province/{item_code}
Path Parameter	설명	예시
item_code	PM10 또는 PM25	PM25

Response
json
복사
{
  "item_code": "PM25",
  "data": [
    { "region": "서울특별시", "value":  48 },
    { "region": "부산광역시", "value":  55 },
    …
  ]
}
2. 전문가 조언
swift
복사
GET /api/advice/{pollutant}/{value}
Path Parameter	설명	예시
pollutant	PM10 또는 PM25	PM10
value	농도(정수)	85

Response
json
복사
{
  "pollutant": "PM10",
  "value": 85,
  "advice": "미세먼지 농도가 높습니다. 외출을 자제하세요."
}
3. 위치 기반 검색
3-1. 산책 장소
bash
복사
GET /api/walking_places?lat={lat}&lon={lon}&radius={radius}
Query Parameter	설명	필수/선택	예시
lat	위도	필수	37.5665
lon	경도	필수	126.9780
radius	반경(km), 기본 5	선택	3

Response
json
복사
{
  "latitude": 37.5665,
  "longitude": 126.9780,
  "radius": 3,
  "places": [
    { "name": "서울숲", "latitude": 37.544, "longitude": 127.037, "description": "넓은 공원..." },
    …
  ]
}
3-2. 애견카페 정보
bash
복사
GET /api/pet_cafe_info?lat={lat}&lon={lon}&radius={radius}
Query Parameter	설명	필수/선택	예시
lat	위도	필수	37.5665
lon	경도	필수	126.9780
radius	반경(km), 기본 5	선택	5

Response
json
복사
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
    },
    …
  ]
}
4. 애견카페 리뷰 & 별점
bash
복사
GET  /api/cafe_reviews/{cafe_name}
POST /api/cafe_reviews/{cafe_name}
Method	Path Parameter	설명
GET	cafe_name	조회할 카페 이름
POST	cafe_name	리뷰·별점 추가

POST Request Body
json
복사
{
  "rating": 4, 
  "review": "정말 좋아요!"
}
GET Response
json
복사
{
  "cafe_name": "CafeX",
  "count": 2,
  "reviews": [
    { "rating": 5, "review": "최고!", "created_at": "2025-05-05T12:34:56" },
    { "rating": 3, "review": "보통이에요", "created_at": "2025-05-04T09:10:11" }
  ]
}
5. 구독(알림) 관리
bash
복사
POST   /api/customers
GET    /api/customers
GET    /api/customers/{customer_id}
PUT    /api/customers/{customer_id}
DELETE /api/customers/{customer_id}
POST /api/customers Request Body
json
복사
{
  "name": "홍길동",
  "kakao_token": "사용자_토큰",
  "pollutant": "PM10",
  "threshold": 80
}
GET /api/customers Response
json
복사
{ "subscribers": [ { "id": 1, "name": "...", "pollutant": "PM10", "threshold": 80 }, … ] }
GET /api/customers/1 Response
json
복사
{ "id": 1, "name": "홍길동", "pollutant": "PM10", "threshold": 80, "active": true }
PUT /api/customers/1 Request Body
json
복사
{ "threshold": 90, "active": false }
DELETE /api/customers/1
json
복사
{ "message": "구독 해지 완료" }
6. 카카오톡 알림 발송
bash
복사
POST /api/notify/kakao
Request Body
json
복사
{
  "pollutant": "PM10",
  "value": 85
}
Response
json
복사
{ "message": "알림 전송 성공", "result": { … 카카오 API 응답 … } }
