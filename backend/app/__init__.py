"""
Flask 애플리케이션 초기화 및 Blueprint 등록 모듈
- CORS 설정을 추가하여 프론트엔드 도메인에서 API 호출을 허용
- app/config.py: 애플리케이션 설정 불러오기
- app/routes.py: 기본 공통 라우트 정의
- app/error_handlers.py: 에러 핸들러 등록
- data 패키지 내 모듈: 각 기능별 API 엔드포인트(BluePrint) 등록
"""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flasgger import Swagger

from .config import Config
from .routes import main
from .error_handlers import register_error_handlers

# data 패키지 내 Blueprint 임포트
from ..data.seoul_visualize import seoul_viz_bp
from ..data.dust_visualize import dust_viz_bp
from ..data.expert_advice import expert_advice_bp
from ..data.walking_places import walking_places_bp
from ..data.pet_cafe_info import pet_cafe_info_bp
from ..data.cafe_reviews import cafe_reviews_bp
from ..data.kakao_notify import kakao_notify_bp
from ..data.subscription_api import subscription_bp
from ..data.dust_history_api import history_bp
from ..data.seoul_history_api import seoul_history_bp
from ..data.nationwide_dust_api import bp as nationwide_bp
from ..data.user_profile import bp as user_profile_bp
from ..data.pet_profiles import bp as pet_profiles_bp
from ..data.reviews import bp as reviews_bp
from ..data.notification_settings import bp as notifications_bp
from ..data.location_service import location_bp
from ..data.air_service import air_bp
from ..data.guides_service import guides_bp
from ..data.home_service import home_bp
from ..data.products_service import products_bp
from ..data.air_summary_service import air_summary_bp

# 확장 초기화
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    """
    Flask 애플리케이션 초기화 및 Blueprint 등록 함수
    """
    app = Flask(__name__, instance_relative_config=True)

    # Config 불러오기 (.env 값 포함)
    app.config.from_object(Config)

    # DB, LoginManager 초기화
    db.init_app(app)
    login_manager.init_app(app)

    # CORS: 모든 /api/* 요청 허용
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Swagger 설정
    swagger_config = {
        'headers': [],
        'specs': [
            {
                'endpoint': 'apispec_1',
                'route': '/apispec_1.json',
                'rule_filter': lambda rule: True,
                'model_filter': lambda tag: True,
            }
        ],
        'static_url_path': '/flasgger_static',
        'swagger_ui': True,
        'specs_route': '/docs/'
    }
    Swagger(app, config=swagger_config)

    # ----- 대기질 및 시각화 관련 -----
    app.register_blueprint(seoul_viz_bp)
    app.register_blueprint(dust_viz_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(seoul_history_bp)
    app.register_blueprint(nationwide_bp)

    # ----- 사용자 편의 기능 -----
    app.register_blueprint(expert_advice_bp)
    app.register_blueprint(walking_places_bp)
    app.register_blueprint(pet_cafe_info_bp)
    app.register_blueprint(cafe_reviews_bp)

    # ----- 알림/구독 -----
    app.register_blueprint(kakao_notify_bp)
    app.register_blueprint(subscription_bp)
    app.register_blueprint(notifications_bp)

    # ----- 사용자/반려견 관리 -----
    app.register_blueprint(user_profile_bp)
    app.register_blueprint(pet_profiles_bp)
    app.register_blueprint(reviews_bp)

    # ----- 공통/메인 페이지 -----
    app.register_blueprint(main)

    # ----- 피드백 반영 기능 -----
    app.register_blueprint(location_bp)
    app.register_blueprint(air_bp)
    app.register_blueprint(guides_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(air_summary_bp)

    # 에러 핸들러 등록
    register_error_handlers(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

from ..data.scheduler import start_scheduler
with app.app_context():
    start_scheduler(app)

