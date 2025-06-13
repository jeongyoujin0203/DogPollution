# 사용자 프로필 관리 (조회/수정/비밀번호 변경/탈퇴)

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from ..app.models import User, db

bp = Blueprint('user_profile', __name__, url_prefix='/api/users/me')

@bp.route('', methods=['GET'])
@login_required
def get_profile():
    """현재 로그인한 사용자의 프로필 정보를 조회"""
    user = current_user
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

@bp.route('', methods=['PUT'])
@login_required
def update_profile():
    """사용자 프로필(이름/이메일) 수정"""
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')

    if username:
        current_user.username = username
    if email:
        current_user.email = email

    db.session.commit()
    return jsonify({'message': 'Profile updated'}), 200

@bp.route('/password', methods=['PUT'])
@login_required
def change_password():
    """비밀번호 변경"""
    data = request.get_json() or {}
    old_pw = data.get('old_password')
    new_pw = data.get('new_password')

    if not old_pw or not new_pw:
        return jsonify({'error': 'Old and new passwords required'}), 400

    if not check_password_hash(current_user.password_hash, old_pw):
        return jsonify({'error': '기존 비밀번호가 일치하지 않습니다'}), 400

    current_user.password_hash = generate_password_hash(new_pw)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200

@bp.route('', methods=['DELETE'])
@login_required
def delete_account():
    """계정 탈퇴"""
    user = current_user
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Account deleted'}), 200