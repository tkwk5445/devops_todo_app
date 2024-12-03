# 1단계: Node.js 기반 이미지 사용
FROM node:18 AS build

# 2단계: 작업 디렉토리 설정
WORKDIR /app

# 3단계: package.json과 package-lock.json을 복사하여 의존성 설치
COPY package*.json ./
RUN npm install

# 4단계: 애플리케이션 소스 코드를 컨테이너에 복사
COPY . .

# 5단계: React 애플리케이션 빌드
RUN npm run build

# 6단계: Nginx 사용하여 빌드된 애플리케이션 서빙
FROM nginx:stable-alpine

# 커스터마이징된 Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 정적 파일을 Nginx 웹 서버 디렉토리에 복사
COPY --from=build /app/build /usr/share/nginx/html

# 7단계: 포트 80을 열어서 외부에서 접근할 수 있도록 설정
EXPOSE 80

# 8단계: Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
