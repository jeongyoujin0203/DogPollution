"""
에러 핸들러 모듈
- 에러 발생 시 사용자에게 반환할 응답 정의
"""
def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return "<h3>404 - 페이지를 찾을 수 없습니다.</h3>", 404

    @app.errorhandler(500)
    def internal_error(error):
        return "<h3>500 - 내부 서버 오류</h3>", 500
