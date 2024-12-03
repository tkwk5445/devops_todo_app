// AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    // 환경 변수로 API URL 설정
    // const API_URL = process.env.REACT_APP_API_URL || 'https://be.wookja.site';  // 기본 URL 설정
    const API_URL = process.env.REACT_APP_API_URL

    return (
        <div className="container">
            <h1>To-Do App</h1>
            <div className="nav-buttons">
                <button onClick={() => setIsLogin(true)} style={{ backgroundColor: isLogin ? '#4CAF50' : '#ccc' }}>로그인</button>
                <button onClick={() => setIsLogin(false)} style={{ backgroundColor: !isLogin ? '#4CAF50' : '#ccc' }}>회원가입</button>
            </div>
            {isLogin ? <Login onLogin={onLogin} API_URL={API_URL} /> : <Signup API_URL={API_URL} />}
        </div>
    );
};

export default AuthPage;

