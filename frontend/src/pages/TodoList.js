import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TodoList = ({ onLogout }) => {
    // 하드코딩된 API URL
  // const API_URL = 'http://todo-app-todo-backend-58f00-100724284-01a5be37c903.kr.lb.naverncp.com'; // 필요에 따라 이 값을 변경하세요
    const API_URL = process.env.REACT_APP_API_URL
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/todos`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTodos(response.data);
        } catch (error) {
            console.error('할 일 조회 실패:', error);
        }
    };

    const addTodo = async () => {
        try {
            await axios.post(
                `${API_URL}/api/todos`,
                { task: newTask },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setNewTask('');
            fetchTodos();
        } catch (error) {
            console.error('할 일 추가 실패:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchTodos();
        } catch (error) {
            console.error('할 일 삭제 실패:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/'); // 로그인 페이지로 이동
    };

    return (
        <div className="container">
            <h2>할 일 목록</h2>
            <button onClick={handleLogoutClick} style={{ float: 'right', backgroundColor: '#f44336' }}>
                로그아웃
            </button>
            <input
                type="text"
                placeholder="할 일 추가"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTodo}>추가</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.task}
                        <button onClick={() => deleteTodo(todo.id)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
