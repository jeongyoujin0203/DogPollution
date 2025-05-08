# backend/data/subscription_api.py
"""
고객 구독(Subscription) 관련 API 모듈
- 회원 가입, 구독 설정 조회/수정, 구독 해지 기능 제공
"""
from flask import Blueprint, request, jsonify
from .customer_db import (
    add_customer, get_customer,
    update_subscription, delete_customer, get_subscribed_customers
)

subscription_bp = Blueprint('subscription_bp', __name__)

@subscription_bp.route('/api/customers', methods=['POST'])
def register_customer():
    """
    POST /api/customers
    요청 JSON:
      {
        "name": "홍길동",
        "kakao_token": "사용자별_토큰",
        "pollutant": "PM10",
        "threshold": 80
      }
    """
    data = request.get_json() or {}
    for key in ('name', 'kakao_token', 'pollutant', 'threshold'):
        if key not in data:
            return jsonify({"error": f"'{key}' 필수"}), 400
    cust_id = add_customer(
        data['name'], data['kakao_token'],
        data['pollutant'], int(data['threshold'])
    )
    return jsonify({"message": "등록 완료", "customer_id": cust_id}), 201

@subscription_bp.route('/api/customers/<int:customer_id>', methods=['GET'])
def fetch_customer(customer_id):
    """
    GET /api/customers/<id>
    """
    cust = get_customer(customer_id)
    if not cust:
        return jsonify({"error": "존재하지 않는 고객"}), 404
    return jsonify(cust)

@subscription_bp.route('/api/customers/<int:customer_id>', methods=['PUT'])
def modify_subscription(customer_id):
    """
    PUT /api/customers/<id>
    요청 JSON에 포함된 구독 설정만 수정
    예: { "threshold": 100, "active": false }
    """
    data = request.get_json() or {}
    update_subscription(
        customer_id,
        pollutant=data.get('pollutant'),
        threshold=data.get('threshold'),
        active=data.get('active')
    )
    return jsonify({"message": "구독 설정 업데이트 완료"})

@subscription_bp.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def unsubscribe_customer(customer_id):
    """
    DELETE /api/customers/<id>
    """
    delete_customer(customer_id)
    return jsonify({"message": "구독 해지 완료"})

@subscription_bp.route('/api/customers', methods=['GET'])
def list_subscribers():
    """
    GET /api/customers
    활성화된 모든 구독 고객 리스트 반환 (관리용)
    """
    subs = get_subscribed_customers()
    return jsonify({"subscribers": subs})
