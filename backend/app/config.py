"""
애플리케이션 설정 모듈 (환경 변수 기반)
- .env 파일을 통해 비밀 키 및 설정 로드
"""
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # DB 경로 절대화 (항상 backend/app.db 에 생성되도록)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(basedir, 'app.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 외부 API Key
    AIRKOREA_SERVICE_KEY = os.getenv("AIRKOREA_SERVICE_KEY")
    SEOUL_API_KEY = os.getenv("SEOUL_API_KEY")
    KAKAO_ADMIN_KEY = os.getenv("KAKAO_ADMIN_KEY")

    # 프론트엔드 URL
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
