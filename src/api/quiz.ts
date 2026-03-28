import axios from 'axios';

const BASE_URL = 'https://api.vergard.me/api/quiz';

export const getQuiz = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const saveScore = async (score: number, totalTime: number) => {
    const token = localStorage.getItem('token');
    await axios.post(`https://api.vergard.me/api/ranking/score?score=${score}&totalTime=${totalTime}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getRanking = async (page: number = 0) => {
    const response = await axios.get(`https://api.vergard.me/api/ranking?page=${page}&size=10`);
    return response.data;
};

export const getMyRank = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await axios.get('https://api.vergard.me/api/ranking/my-rank', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};