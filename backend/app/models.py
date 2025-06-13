from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin
from . import db

db = SQLAlchemy()

class DogCafe(db.Model):
    __tablename__ = 'dog_cafes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    phone = db.Column(db.String)

class User(db.Model, UserMixin):
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)

    pets                = db.relationship('Pet', backref='owner', lazy=True)
    reviews             = db.relationship('Review', backref='author', lazy=True)
    notification_setting= db.relationship('NotificationSetting', backref='user', uselist=False)

class Pet(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name        = db.Column(db.String(50), nullable=False)
    breed       = db.Column(db.String(50), nullable=False)
    age         = db.Column(db.Integer)
    gender      = db.Column(db.String(10))
    health_info = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    place_id   = db.Column(db.Integer, nullable=False)
    rating     = db.Column(db.Integer, nullable=False)
    review     = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class NotificationSetting(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    pollutant  = db.Column(db.String(10), nullable=False)  # 'PM10' or 'PM25'
    threshold  = db.Column(db.Integer, nullable=False)
    kakao_id   = db.Column(db.String(100), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)