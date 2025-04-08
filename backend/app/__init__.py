"""
Flask 애플리케이션 초기화 및 Blueprint 등록 모듈
- app/config.py: 애플리케이션 설정을 불러옴
- app/routes.py: 기본 공통 라우트 정의
- app/error_handlers.py: 에러 핸들러 등록
- data 폴더 내의 모듈들: 각 기능별 API 엔드포인트(BluePrint)를 등록
"""
from flask import Flask
from .config import Config
from .routes import main
from .error_handlers import register_error_handlers

# data 폴더 내 Blueprint 임포트
from ..data.seoul_visualize import seoul_viz_bp
from ..data.dust_visualize import dust_viz_bp
from ..data.expert_advice import expert_advice_bp
from ..data.walking_places import walking_places_bp
from ..data.pet_cafe_info import pet_cafe_info_bp
from ..data.cafe_reviews import cafe_reviews_bp

def create_app():
    """
    Flask 애플리케이션 초기화 및 구성 함수
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # 기본 라우트 등록
    app.register_blueprint(main)

    # 데이터 관련 Blueprint 등록
    app.register_blueprint(seoul_viz_bp)
    app.register_blueprint(dust_viz_bp)
    app.register_blueprint(expert_advice_bp)
    app.register_blueprint(walking_places_bp)
    app.register_blueprint(pet_cafe_info_bp)
    app.register_blueprint(cafe_reviews_bp)

    # 에러 핸들러 등록
    register_error_handlers(app)

    return app

if __name__ == '__main__':
    app = create_app()
    # 개발 환경: 호스트 0.0.0.0, 포트 5000, 디버그 모드 활성화
    app.run(host='0.0.0.0', port=5000, debug=True)
