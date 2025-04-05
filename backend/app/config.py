"""
애플리케이션 설정 모듈
- DEBUG: 디버그 모드 활성화 여부
- SECRET_KEY: 세션 및 보안 관련 키 (실제 배포 시 변경 필요)
"""
class Config:
    DEBUG = True
    SECRET_KEY = 'your_secret_key_here'
