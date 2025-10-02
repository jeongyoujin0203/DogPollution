# 사용자별 카카오 알림 설정 및 발송 기능

from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from ..app.models import NotificationSetting, db
import requests
import json

bp = Blueprint('notifications', __name__, url_prefix='/api/users/me/notifications')

KAKAO_API_URL = 'https://kapi.kakao.com/v2/api/talk/memo/default/send'

@bp.route('', methods=['GET'])
@login_required
def get_notification_settings():
    """
    현재 로그인 사용자에 대한 알림 설정 조회
    """
    setting = NotificationSetting.query.filter_by(user_id=current_user.id).first()
    if not setting:
        return jsonify({
            'pollutant': None,
            'threshold': None,
            'kakao_id': None
        }), 200
    return jsonify({
        'pollutant': setting.pollutant,
        'threshold': setting.threshold,
        'kakao_id': setting.kakao_id
    }), 200

@bp.route('', methods=['PUT'])
@login_required
def update_notification_settings():
    """
    카카오 알림 설정 (오염물질, 임계값, 카카오 ID) 저장/수정
    JSON Body:
      {
        "pollutant": "PM10" or "PM25",
        "threshold": 80,
        "kakao_id": "사용자_카카오_UUID"
      }
    """
    data = request.get_json() or {}
    pollutant = data.get('pollutant')
    threshold = data.get('threshold')
    kakao_id = data.get('kakao_id')

    if pollutant not in ['PM10', 'PM25'] or not isinstance(threshold, int) or not kakao_id:
        return jsonify({'error': 'Invalid settings'}), 400

    setting = NotificationSetting.query.filter_by(user_id=current_user.id).first()
    if not setting:
        setting = NotificationSetting(
            user_id=current_user.id,
            pollutant=pollutant,
            threshold=threshold,
            kakao_id=kakao_id
        )
        db.session.add(setting)
    else:
        setting.pollutant = pollutant
        setting.threshold = threshold
        setting.kakao_id = kakao_id

    db.session.commit()
    return jsonify({'message': 'Notification settings updated'}), 200


def send_kakao_notification(user_id, message_text):
    """
    지정된 사용자에게 카카오톡 알림 전송
    """
    setting = NotificationSetting.query.filter_by(user_id=user_id).first()
    if not setting or not setting.kakao_id:
        return False

    admin_token = current_app.config.get('KAKAO_ADMIN_KEY')
    if not admin_token:
        current_app.logger.error('KAKAO_ADMIN_KEY not set')
        return False

    headers = {
        'Authorization': f'Bearer {admin_token}',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    template_obj = {
        'object_type': 'text',
        'text': message_text,
        'link': {'web_url': current_app.config.get('FRONTEND_URL')}
    }
    payload = {
        'template_object': json.dumps(template_obj)
    }

    response = requests.post(KAKAO_API_URL, headers=headers, data=payload)
    try:
        response.raise_for_status()
        return True
    except requests.HTTPError as e:
        current_app.logger.error(f'Kakao send failed: {e}')
        return False