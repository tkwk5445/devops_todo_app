// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, API_URL }) => {  // API_URL을 props로 전달받음
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, { username, password });
            console.log('로그인 응답:', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                alert('로그인 성공!');
                onLogin();
                navigate('/todos');
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
