import os
import tempfile
import pytest
from ..backend.app import create_app

@pytest.fixture
def app(tmp_path, monkeypatch):
    """
    테스트용 Flask 앱을 생성하고, 환경 변수를 임시 DB 파일로 오버라이드합니다.
    """
    # 임시 데이터베이스 파일 경로
    cust_db = tmp_path / "customers.db"
    rev_db = tmp_path / "cafes_reviews.db"
    monkeypatch.setenv("CUSTOMER_DB_PATH", str(cust_db))
    monkeypatch.setenv("REVIEWS_DB_PATH", str(rev_db))
    monkeypatch.setenv("SEOUL_API_KEY", "dummy_key")
    monkeypatch.setenv("KAKAO_ACCESS_TOKEN", "dummy_token")
    monkeypatch.setenv("FRONTEND_URL", "http://test")

    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    yield app

@pytest.fixture
def client(app):
    """
    Flask 테스트 클라이언트를 반환합니다.
    """
    return app.test_client()