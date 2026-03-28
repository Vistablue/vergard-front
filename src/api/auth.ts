// /api/auth/signup, /api/login 호출(로그인/회원가입 API 호출하는 함수)
import axios from 'axios';

const BASE_URL = 'http://134.185.117.253:8080/api/auth';

export const signup = async (email: string, password: string, nickname: string) => {
    const response = await axios.post(`${BASE_URL}/signup`, {
        email,
        password,
        nickname
    });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password
    });
    return response.data;
};

export const getMyInfo = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};