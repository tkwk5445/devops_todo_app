// Signup.js
import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ API_URL }) => {  // API_URL을 props로 전달받음
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await axios.post(`${API_URL}/api/signup`, { username, password });
            alert('회원가입 성공!');
        } catch (error) {
            alert('회원가입 실패: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
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
            <button onClick={handleSignup}>회원가입</button>
        </div>
    );
};

export default Signup;
