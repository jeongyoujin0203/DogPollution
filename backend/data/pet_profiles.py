# 사용자의 반려견 프로필 관리 (조회/추가/수정/삭제)

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..app.models import Pet, db

bp = Blueprint('pet_profiles', __name__, url_prefix='/api/users/me/pets')

@bp.route('', methods=['GET'])
@login_required
def list_pets():
    """현재 사용자가 등록한 반려견 목록 조회"""
    pets = Pet.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed,
            'age': pet.age,
            'gender': pet.gender,
            'health_info': pet.health_info
        }
        for pet in pets
    ]), 200

@bp.route('', methods=['POST'])
@login_required
def add_pet():
    """새 반려견 프로필 추가"""
    data = request.get_json() or {}
    name = data.get('name')
    breed = data.get('breed')
    age = data.get('age')
    gender = data.get('gender')
    health_info = data.get('health_info')

    if not name or not breed:
        return jsonify({'error': 'Name and breed are required'}), 400

    pet = Pet(
        user_id=current_user.id,
        name=name,
        breed=breed,
        age=age,
        gender=gender,
        health_info=health_info
    )
    db.session.add(pet)
    db.session.commit()
    return jsonify({'message': 'Pet added', 'pet_id': pet.id}), 201

@bp.route('/<int:pet_id>', methods=['PUT'])
@login_required
def update_pet(pet_id):
    """반려견 프로필 수정"""
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user.id).first()
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    data = request.get_json() or {}
    pet.name = data.get('name', pet.name)
    pet.breed = data.get('breed', pet.breed)
    pet.age = data.get('age', pet.age)
    pet.gender = data.get('gender', pet.gender)
    pet.health_info = data.get('health_info', pet.health_info)

    db.session.commit()
    return jsonify({'message': 'Pet updated'}), 200

@bp.route('/<int:pet_id>', methods=['DELETE'])
@login_required
def delete_pet(pet_id):
    """반려견 프로필 삭제"""
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user.id).first()
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Pet deleted'}), 200