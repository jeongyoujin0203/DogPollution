"""
애플리케이션 설정 모듈 (환경 변수 기반)
- .env 파일을 통해 비밀 키 및 설정 로드
"""
import os
from dotenv import load_dotenv

# .env 파일 로드 (프로젝트 루트에 위치)
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
env_path = os.path.join(base_dir, '.env')
load_dotenv(dotenv_path=env_path)

class Config:
    # 기본 설정
    DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-this-secret')

    # Kakao 설정
    KAKAO_ACCESS_TOKEN = os.getenv('KAKAO_ACCESS_TOKEN')
    FRONTEND_URL = os.getenv('FRONTEND_URL')

    # 서울시 미세먼지 API 키
    SEOUL_API_KEY = os.getenv('SEOUL_API_KEY')
    
    # AirKorea 전국 측정소 실시간 미세먼지 API 키
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI", "sqlite:///app.db")

    # 고객 DB 경로
    CUSTOMER_DB_PATH = os.getenv(
        'CUSTOMER_DB_PATH',
        os.path.join(base_dir, 'data', 'customers.db')
    )

    # 기타 DB 경로
    REVIEWS_DB_PATH = os.getenv(
        'REVIEWS_DB_PATH',
        os.path.join(base_dir, 'data', 'cafes_reviews.db')
    )