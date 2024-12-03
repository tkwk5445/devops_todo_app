import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList';
import AuthPage from './pages/AuthPage';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // JWT 토큰 삭제
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);

                    // 토큰 만료 시간을 계산하여 타이머 설정
                    const timeToLogout = (decodedToken.exp - currentTime) * 1000; // 밀리초 단위로 변환
                    setTimeout(() => {
                        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                        handleLogout();
                    }, timeToLogout);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('토큰 디코딩 오류:', error);
                handleLogout();
            }
        }
        setIsLoading(false); // 로딩 상태 업데이트
    }, []);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    const API_URL = process.env.REACT_APP_API_URL || 'https://todo-app-todo-backend-58f00-100724284-01a5be37c903.kr.lb.naverncp.com'; // 기본값 설정


    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage onLogin={handleLogin} />} />
                <Route
                    path="/todos"
                    element={
                        isAuthenticated ? <TodoList onLogout={handleLogout} /> : <Navigate to="/" replace />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;