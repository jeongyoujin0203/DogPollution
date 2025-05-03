import json
import pytest
from ..backend.data.customer_db import add_customer, get_customer, get_subscribed_customers, update_subscription, delete_customer
from ..backend.data.cafe_reviews import add_review, get_reviews


def test_customer_db_crud(app):
    # 고객 추가 및 조회
    cust_id = add_customer("Alice", "token1", "PM10", 50)
    cust = get_customer(cust_id)
    assert cust["name"] == "Alice"

    # 구독 설정 업데이트
    update_subscription(cust_id, pollutant="PM25", threshold=80, active=False)
    cust2 = get_customer(cust_id)
    assert cust2["pollutant"] == "PM25"
    assert cust2["threshold"] == 80
    assert cust2["active"] is False

    # 활성 구독자 리스트
    subs = get_subscribed_customers()
    assert all(c["id"] != cust_id for c in subs)

    # 구독 해지 테스트
    bob_id = add_customer("Bob", "token2", "PM10", 30)
    delete_customer(bob_id)
    subs2 = get_subscribed_customers()
    assert all(c["id"] != bob_id for c in subs2)


def test_cafe_reviews_db(app):
    # 리뷰 추가 및 조회
    add_review("CafeA", 5, "Great!")
    add_review("CafeA", 3, "Okay")
    revs = get_reviews("CafeA")
    assert len(revs) == 2
    assert set(r["rating"] for r in revs) <= {3, 5}


def test_subscription_api(client):
    # 고객 등록
    rv = client.post(
        "/api/customers",
        json={
            "name": "TestUser",
            "kakao_token": "tk",
            "pollutant": "PM10",
            "threshold": 60
        }
    )
    assert rv.status_code == 201
    data = rv.get_json()
    cid = data["customer_id"]

    # 고객 정보 조회
    rv2 = client.get(f"/api/customers/{cid}")
    assert rv2.status_code == 200

    # 구독 설정 수정
    rv3 = client.put(f"/api/customers/{cid}", json={"threshold": 70})
    assert rv3.status_code == 200

    # 구독자 리스트
    rv4 = client.get("/api/customers")
    subs = rv4.get_json()["subscribers"]
    assert any(c["id"] == cid for c in subs)

    # 구독 해지
    client.delete(f"/api/customers/{cid}")
    rv5 = client.get("/api/customers")
    subs2 = rv5.get_json()["subscribers"]
    assert all(c["id"] != cid for c in subs2)


def test_cafe_reviews_api(client):
    # 리뷰 POST
    post = client.post("/api/cafe_reviews/CafeX", json={"rating": 4, "review": "Nice place!"})
    assert post.status_code == 201

    # 리뷰 GET
    get = client.get("/api/cafe_reviews/CafeX")
    assert get.status_code == 200
    data = get.get_json()
    assert data["count"] == 1


@pytest.mark.parametrize("endpoint", [
    "/api/walking_places?lat=37.5&lon=127.0",
    "/api/pet_cafe_info?lat=37.5&lon=127.0&radius=10"
])
def test_location_apis(client, endpoint):
    rv = client.get(endpoint)
    assert rv.status_code == 200
    js = rv.get_json()
    assert isinstance(js, dict)
    assert any(key in js for key in ["places", "pet_cafes"])


def test_cors_allowed(client):
    rv = client.options("/api/customers")
    assert rv.status_code in (200, 204)
    assert rv.headers.get("Access-Control-Allow-Origin") == "*"