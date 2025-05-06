# frontend/Dockerfile

FROM node:18

# 앱 디렉토리 생성
WORKDIR /app

# package.json만 먼저 복사해서 의존성 설치
COPY package.json package-lock.json* ./

RUN npm install && \
    npm install react-router-dom && \
    npm install -D @types/react-router-dom
# 전체 복사
COPY . .


# Vite 개발서버 실행
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]