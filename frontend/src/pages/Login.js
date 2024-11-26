import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 라우터 네비게이션 사용

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/login', { username, password });
            console.log('로그인 응답:', response.data); // 디버깅: 응답 데이터 확인
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // JWT 토큰 저장
                alert('로그인 성공!');
                onLogin(); // 인증 상태 업데이트
                navigate('/todos'); // To-Do 페이지로 이동
            } else {
                alert('토큰이 응답에 포함되지 않았습니다.');
            }
        } catch (error) {
            console.error('로그인 실패:', error.response || error.message);
            alert('로그인 실패: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default Login;
