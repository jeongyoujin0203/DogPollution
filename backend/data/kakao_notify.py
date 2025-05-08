# backend/data/kakao_notify.py
"""
카카오톡 알림 모듈 및 Flask 엔드포인트
- 미세먼지 농도 임계치 초과 시 카카오톡 메시지를 전송
"""
import json
import requests
from flask import Blueprint, request, jsonify
from app.config import Config

# 카카오톡 메시지 전송 API URL
KAKAO_API_URL = "https://kapi.kakao.com/v2/api/talk/memo/default/send"

def send_kakao_alert(pollutant, value):
    """
    카카오톡으로 미세먼지 알림 전송
    인자:
      - pollutant: 'PM10' 또는 'PM25'
      - value: 미세먼지 농도 (정수)
    반환:
      - (success: bool, response_json: dict)
    """
    headers = {
        "Authorization": f"Bearer {Config.KAKAO_ACCESS_TOKEN}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    # 메시지 텍스트 및 링크 설정
    text = f"[미세먼지 알림] 현재 {pollutant} 농도는 {value}㎍/m³ 입니다."
    payload = {
        "template_object": json.dumps({
            "object_type": "text",
            "text": text,
            "link": {
                "web_url": Config.FRONTEND_URL,
                "mobile_web_url": Config.FRONTEND_URL
            }
        })
    }
    response = requests.post(KAKAO_API_URL, headers=headers, data=payload)
    if response.status_code != 200:
        return False, response.json()
    return True, response.json()

# Flask Blueprint 생성 및 엔드포인트 정의
kakao_notify_bp = Blueprint('kakao_notify_bp', __name__)

@kakao_notify_bp.route('/api/notify/kakao', methods=['POST'])
def kakao_notify():
    """
    POST: 미세먼지 알림 메시지를 카카오톡으로 전송하는 엔드포인트
    요청 JSON:
      {
        "pollutant": "PM10",
        "value": 85
      }
    """
    data = request.get_json() or {}
    pollutant = data.get('pollutant')
    value = data.get('value')

    # 입력 검증
    if pollutant not in ['PM10', 'PM25'] or not isinstance(value, int):
        return jsonify({"error": "잘못된 요청 형식입니다."}), 400

    # 카카오톡 알림 전송
    success, result = send_kakao_alert(pollutant, value)
    if not success:
        return jsonify({"error": "알림 전송 실패", "detail": result}), 500
    return jsonify({"message": "알림 전송 성공", "result": result})
