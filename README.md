<h1 align="center">Graduation Project: 서울 반려견을 위한 미세먼지 정보 제공 플랫폼</h1>

<p align="center">
  <img src="https://img.shields.io/badge/졸업프로젝트-2025-red" />
  <img src="https://img.shields.io/badge/원유재_교수님-CNU-blueviolet" /> <br/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/sqlite-003B57?style=for-the-badge&logo=sqlite&logoColor=white">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white">
</p>

<p align="center">
  충대학교 2025 졸업프로젝트 <br/>
  반려견 보호자를 위한 미세먼지 정보 제공 서비스
</p>

---

## 🧑‍🦰팀원
- **송수민(팀장)**: Front-end, 수의대생 인식 조사 
- **장주형**: Front-end, 데이터셋 관리
- **정유진**: Back-end, README 작성

---

## 📌 프로젝트 소개

**“반려견 보호자를 위한 미세먼지 정보 제공 서비스”** 는  
반려견 가구 비율이 28.6%에 도달한 데다 ‘펫펨족’ 문화가 확산되면서 보호자들이 반려견의 건강 관리에 높은 관심을 보이고 있다는 사회적 흐름을 반영한 웹 서비스입니다.  
반려견은 사람보다 공기 소비량이 많고 지면에 가까운 호흡기로 미세먼지에 더 민감하기 때문에,  
실시간 공기질 정보를 기반으로 최적의 야외·실내 활동 장소를 추천하고  
관리 가이드를 제공하여 보호자가 안심하고 반려견과 함께 안전한 활동을 할 수 있도록 지원합니다.

* **직관적 지도 시각화**: PM10·PM2.5 농도를 WHO 글로벌 대기질 가이드라인의 다섯 단계 색상 등급(매우좋음·좋음·보통·나쁨·매우나쁨)으로 표시  
* **위치 기반 활동 추천**: 공기질 상태에 따라 실외 산책 장소 또는 실내 애견카페를 자동 안내  
* **건강 가이드**: 미세먼지 노출 전·후 반려견 건강 관리법을 카드 뉴스 형식으로 쉽고 간결하게 제공  

---

## 🔥 주요 기능

### 1. 실시간 미세먼지 지도 시각화
* 전국 PM10/PM2.5 농도를 WHO 기준 5개 색상 등급(매우좋음·좋음·보통·나쁨·매우나쁨)으로 직관적으로 표시  
* 지도 위 행정구 레이어 클릭 시 해당 구의 실시간 수치 및 등급 확인 가능  

### 2. 위치 기반 실외 산책 장소 추천
* 현재 위치를 기준으로 반경 내 안전한 산책 장소(공원·놀이터 등)를 자동 추천  
* 장소명·주소·거리·태그(야외·실외·공원 등)·평점 정보를 제공  

### 3. 실내 애견카페 정보 조회
* 반려견 동반 가능 카페 정보를 위치 기반으로 안내  
* 운영시간·전화번호·견종 제한 사항·사용자 리뷰 등의 기본 정보 포함  

### 4. 반려견 건강 행동 가이드 제공
* 대기 상태에 따라 ‘산책 자제’ 또는 ‘실내 대체 활동’을 제안  
* 반려견 건강 관리법을 카드 뉴스 형식으로 시각화하여 쉽게 이해 가능  

### 5. 사용자 리뷰 및 알림 설정
* 애견카페별 리뷰 등록·조회 기능 제공 (내 리뷰 관리)  
* PM10/PM2.5 임계값 도달 시 카카오 알림 설정 및 발송  

---

## 📸 화면 예시

#### 1. 실시간 미세먼지 지도 시각화

![미세먼지 지도](docs/screenshots/pm-map.jpg)
> * 좌측: 현재 위치(예: 강남구) 실시간 농도 및 “산책 시 주의가 필요합니다.” 메시지
> * 우측: Leaflet 기반 서울시 행정구역별 PM10 수치 레이어

#### 2. 실외 산책 장소 추천 화면

![산책 장소 추천](docs/screenshots/walk-places.png)
> * 왼쪽: 카카오맵 마커로 표시된 산책 장소
> * 오른쪽: 장소 카드(이름, 거리, 태그, 평점) 리스트

#### 3. 반려견 건강 가이드

![건강 가이드](docs/screenshots/health-guide.png)
> * 카드 뉴스 형태로 제공되는 전문가 관리법(미세먼지 상황별 대처법)

#### 4. 미세먼지 통계 시각화

![통계 시각화](docs/screenshots/statistics.png)
> * 연도별/월별/일별 탭 전환, 구별 평균값 표, Bar·Line 차트 렌더링

---


## 🛠️ 기술 스택

* **Backend**

  * Python 3.11, Flask 2.x
  * SQLite 3.x (데이터 저장)
  * Folium (지도 시각화), Requests (외부 API 호출)
  * Pytest (자동화 유닛/통합 테스트), Postman (API 컬렉션)

* **Frontend**

  * React 18, Vite 4
  * Tailwind CSS (스타일링)
  * Kakao Map SDK (지도/위치 검색)
  * Chart.js (통계 그래프)
  * Cypress (E2E 자동화 테스트)

* **Infrastructure**

  * Docker & Docker Compose
  * GitHub Actions (CI/CD 파이프라인 예시)

---

## 📖 API 문서

### 기본 안내

* **호스트(로컬)**: `http://localhost:5000`
* **Swagger UI**: `http://localhost:5000/docs/`
* **OpenAPI 스펙**: `http://localhost:5000/apispec_1.json`
* 모든 엔드포인트는 `/api/`로 시작합니다.

---

### 1. 미세먼지 데이터

#### 1-1. 서울 구별 미세먼지 조회

**GET** `/api/dust/seoul/{pollutant}`

| Path Parameter | 설명               | 예시     |
| -------------- | ---------------- | ------ |
| pollutant      | `PM10` 또는 `PM25` | `PM10` |

#### Response

```json
{
  "pollutant": "PM10",
  "data": [
    { "region": "종로구", "value": 45 },
    { "region": "중구",   "value": 52 },
    …
  ]
}
```

---

#### 1-2. 전국 도·광역시 평균 미세먼지 조회

**GET** `/api/dust/province/{pollutant}`

| Path Parameter | 설명               | 예시     |
| -------------- | ---------------- | ------ |
| pollutant      | `PM10` 또는 `PM25` | `PM25` |

#### Response

```json
{
  "pollutant": "PM25",
  "data": [
    { "province": "서울특별시", "value": 30 },
    { "province": "부산광역시", "value": 28 },
    …
  ]
}
```

---

#### 1-3. 전국 실시간 측정소 미세먼지 조회

**GET** `/api/dust/nationwide/realtime`

#### Response

```json
{
  "count": 500,
  "items": [
    {
      "stationName": "종로구",
      "pm10": "45",
      "pm25": "22",
      "dataTime": "2025-06-13 14:00"
    },
    …
  ]
}
```

---

### 2. 전문가 조언 제공

**GET** `/api/advice/{pollutant}/{value}`

| Path Parameter | 설명               | 예시     |
| -------------- | ---------------- | ------ |
| pollutant      | `PM10` 또는 `PM25` | `PM10` |
| value          | 농도 임계값(㎍/m³)     | `90`   |

#### Response

```json
{ "advice": "미세먼지 농도가 높습니다. 외출을 자제하세요." }
```

---

### 3. 산책 장소 추천

**GET** `/api/walking_places?lat={lat}&lon={lon}&radius={km}`

| Query Parameter | 설명          | 예시         |
| --------------- | ----------- | ---------- |
| lat             | 위도 (사용자 위치) | `37.5665`  |
| lon             | 경도 (사용자 위치) | `126.9780` |
| radius          | 반경(km)      | `3`        |

#### Response

```json
[
  {
    "name": "용허리근린공원",
    "latitude": 37.5678,
    "longitude": 126.9756
  },
  …
]
```

---

### 4. 애견카페 정보 조회

**GET** `/api/pet_cafe_info?lat={lat}&lon={lon}&radius={km}`

| Query Parameter | 설명          | 예시         |
| --------------- | ----------- | ---------- |
| lat             | 위도 (사용자 위치) | `37.5665`  |
| lon             | 경도 (사용자 위치) | `126.9780` |
| radius          | 반경(km)      | `5`        |

#### Response

```json
[
  {
    "name": "해피도그카페",
    "restrictions": "소형견만 입장 가능",
    "opening_hours": "10:00–20:00",
    "price": "₩10,000",
    "rating": 4.5
  },
  …
]
```

---

### 5. 사용자 인증 & 프로필 관리

#### 5-1. 내 프로필 조회

**GET** `/api/users/me`

#### Response

```json
{ "id": 1, "username": "hong", "email": "hong@example.com" }
```

---

#### 5-2. 내 프로필 수정

**PUT** `/api/users/me`

```json
{ "username": "hong2", "email": "hong2@example.com" }
```

#### Response

```json
{ "message": "Profile updated" }
```

---

#### 5-3. 비밀번호 변경

**PUT** `/api/users/me/password`

```json
{ "old_password": "old123", "new_password": "new456" }
```

#### Response

```json
{ "message": "Password changed successfully" }
```

---

#### 5-4. 계정 탈퇴

**DELETE** `/api/users/me`

#### Response

```json
{ "message": "Account deleted" }
```

---

### 6. 반려견 프로필 관리

#### 6-1. 반려견 목록 조회

**GET** `/api/users/me/pets`

#### Response

```json
[
  { "id": 1, "name": "콩이", "breed": "푸들", "age": 3, "gender": "여", "health_info": "" },
  …
]
```

---

#### 6-2. 반려견 추가

**POST** `/api/users/me/pets`

```json
{ "name": "콩이", "breed": "푸들", "age": 3, "gender": "여", "health_info": "" }
```

#### Response

```json
{ "message": "Pet added", "pet_id": 1 }
```

---

#### 6-3. 반려견 수정

**PUT** `/api/users/me/pets/{pet_id}`

| Path Parameter | 설명     | 예시  |
| -------------- | ------ | --- |
| pet\_id        | 반려견 ID | `1` |

```json
{ "age": 4 }
```

#### Response

```json
{ "message": "Pet updated" }
```

---

#### 6-4. 반려견 삭제

**DELETE** `/api/users/me/pets/{pet_id}`

#### Response

```json
{ "message": "Pet deleted" }
```

---

### 7. 리뷰 관리

#### 7-1. 내 리뷰 조회

**GET** `/api/users/me/reviews`

#### Response

```json
[
  { "id": 1, "place_id": 10, "rating": 5, "review": "좋아요!", "created_at": "2025-06-13T14:00:00" },
  …
]
```

---

#### 7-2. 리뷰 작성

**POST** `/api/places/{place_id}/reviews`

| Path Parameter | 설명    | 예시   |
| -------------- | ----- | ---- |
| place\_id      | 장소 ID | `10` |

```json
{ "rating": 5, "review": "깨끗하고 좋아요!" }
```

#### Response

```json
{ "message": "Review created", "review_id": 1 }
```

---

#### 7-3. 내 리뷰 수정

**PUT** `/api/reviews/{review_id}`

| Path Parameter | 설명    | 예시  |
| -------------- | ----- | --- |
| review\_id     | 리뷰 ID | `1` |

```json
{ "rating": 4 }
```

#### Response

```json
{ "message": "Review updated" }
```

---

#### 7-4. 내 리뷰 삭제

**DELETE** `/api/reviews/{review_id}`

#### Response

```json
{ "message": "Review deleted" }
```

---

### 8. 알림 설정

#### 8-1. 알림 설정 조회

**GET** `/api/users/me/notifications`

#### Response

```json
{ "pollutant": "PM10", "threshold": 80, "kakao_id": "abcdefg-12345" }
```

---

#### 8-2. 알림 설정 등록/수정

**PUT** `/api/users/me/notifications`

```json
{ "pollutant": "PM25", "threshold": 50, "kakao_id": "abcdefg-12345" }
```

#### Response

```json
{ "message": "Notification settings updated" }
```
