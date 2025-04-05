FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 복사 및 파이썬 패키지 설치
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 애플리케이션 소스 코드 복사
COPY . .

# 환경 변수 설정 (예: FLASK_APP, FLASK_ENV)
ENV FLASK_APP=app
ENV FLASK_ENV=development

# Flask 애플리케이션 실행 (0.0.0.0:5000)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
