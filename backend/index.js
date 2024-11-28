// index.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL 설정
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 미들웨어: JWT 인증
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ message: '토큰이 없습니다.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: '토큰 인증 실패.' });
        req.user = user;
        next();
    });
};

// 회원가입
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send({ message: '회원가입 성공!' });
    } catch (error) {
        res.status(500).send({ message: '회원가입 실패', error });
    }
});

// 로그인
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user) return res.status(404).send({ message: '사용자를 찾을 수 없습니다.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send({ message: '비밀번호가 틀립니다.' });

        // JWT 토큰 발급 (유효기간: 1시간)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('발급된 토큰:', token); // 디버깅: 토큰 확인
        res.status(200).send({ token }); // 토큰 반환
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        res.status(500).send({ message: '로그인 실패', error });
    }
});

// 토큰 갱신
app.post('/api/refresh-token', authenticateToken, (req, res) => {
    const userId = req.user.id;

    try {
        // 새로운 토큰 발급 (유효기간: 1시간)
        const newToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).send({ token: newToken });
    } catch (error) {
        res.status(500).send({ message: '토큰 갱신 실패', error });
    }
});

// 할 일 목록 조회
app.get('/api/todos', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        res.status(200).send(rows);
    } catch (error) {
        res.status(500).send({ message: '할 일 조회 실패', error });
    }
});

// 할 일 추가
app.post('/api/todos', authenticateToken, async (req, res) => {
    const { task } = req.body;
    const userId = req.user.id;

    try {
        await pool.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, task]);
        res.status(201).send({ message: '할 일이 추가되었습니다.' });
    } catch (error) {
        res.status(500).send({ message: '할 일 추가 실패', error });
    }
});

// 할 일 삭제
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM todos WHERE id = ?', [id]);
        res.status(200).send({ message: '할 일이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).send({ message: '할 일 삭제 실패', error });
    }
});

// 로그아웃 (프론트에서 토큰 삭제)
app.post('/api/logout', (req, res) => {
    // 백엔드에서 별도의 처리가 필요 없는 경우
    res.status(200).send({ message: '로그아웃 성공!' });
});

// 서버 실행
app.listen(4000, () => {
    console.log('서버가 4000번 포트에서 실행 중입니다.');
});
