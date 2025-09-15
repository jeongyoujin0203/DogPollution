"""
에러 핸들러 모듈
- 에러 발생 시 JSON 형태로 통일된 응답 반환
"""
from flask import jsonify

def register_error_handlers(app):
    def _error_response(code, message, hint=None):
        payload = {"code": code, "message": message}
        if hint:
            payload["hint"] = hint
        response = jsonify(payload)
        response.status_code = code
        return response

    @app.errorhandler(400)
    def bad_request(error):
        return _error_response(400, "잘못된 요청", str(error))

    @app.errorhandler(401)
    def unauthorized(error):
        return _error_response(401, "인증 필요", str(error))

    @app.errorhandler(403)
    def forbidden(error):
        return _error_response(403, "권한 없음", str(error))

    @app.errorhandler(404)
    def not_found(error):
        return _error_response(404, "경로를 찾을 수 없음", str(error))

    @app.errorhandler(500)
    def internal(error):
        return _error_response(500, "서버 내부 오류", str(error))
