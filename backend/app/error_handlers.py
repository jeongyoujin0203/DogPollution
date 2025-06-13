"""
에러 핸들러 모듈
- 에러 발생 시 JSON 형태로 통일된 응답 반환
"""
from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        response = jsonify({
            "error": "Not Found",
            "message": "요청하신 페이지를 찾을 수 없습니다."
        })
        response.status_code = 404
        return response

    @app.errorhandler(500)
    def internal_error(error):
        response = jsonify({
            "error": "Internal Server Error",
            "message": "서버 내부에서 문제가 발생했습니다."
        })
        response.status_code = 500
        return response