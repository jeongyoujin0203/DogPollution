from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class DogCafe(db.Model):
    __tablename__ = 'dog_cafes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    phone = db.Column(db.String)
