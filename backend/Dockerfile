# 1단계: Node.js 기반 이미지 사용
FROM node:18

# 2단계: 작업 디렉토리 설정
WORKDIR /app

# 3단계: package.json과 package-lock.json 복사하여 의존성 설치
COPY package*.json ./
RUN npm install

# 4단계: 애플리케이션 소스 코드를 컨테이너에 복사
COPY . .

# 5단계: 포트 4000을 열어서 외부에서 접근할 수 있도록 설정
EXPOSE 4000

# 6단계: 애플리케이션 실행
CMD ["node", "index.js"]