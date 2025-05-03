# backend/__init__.py
"""
백엔드 패키지 초기화 모듈
- Flask 애플리케이션 인스턴스를 생성하여 exposed하는 역할
- 상위 디렉토리에서 `flask run --app backend` 로 실행할 수 있도록 설정
"""
from app import create_app

# Flask 애플리케이션 인스턴스
app = create_app()
