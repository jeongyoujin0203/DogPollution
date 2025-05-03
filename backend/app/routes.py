"""
공통 라우트(예: 기본 페이지)를 정의하는 모듈
"""
from flask import Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def index():
    """
    기본 페이지: API 엔드포인트 안내
    - 서울 미세먼지 지도: /api/dust/seoul/<pollutant>  (pollutant: PM10 또는 PM25)
    - 전국 평균 미세먼지 지도: /api/dust/province/<item_code>  (item_code: PM10 또는 PM25)
    """
    return """
    <h1>미세먼지 정보 제공 API</h1>
    <ul>
      <li><strong>서울 미세먼지 지도</strong>: /api/dust/seoul/&lt;PM10|PM25&gt;</li>
      <li><strong>전국 평균 미세먼지 지도</strong>: /api/dust/province/&lt;PM10|PM25&gt;</li>
    </ul>
    """
