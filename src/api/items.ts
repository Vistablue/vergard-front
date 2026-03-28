// /api/items/search, /api/items/{id} 호출(검색/상세조회 API 호출하는 함수)
import axios from 'axios';

const BASE_URL = 'http://134.185.117.253:8080/api/items';

export const searchItems = async (keyword: string) => {
    const response = await axios.get(`${BASE_URL}/search?keyword=${keyword}`);
    return response.data;
};

export const getItemDetail = async (id: number) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};
export const saveSearchHistory = async (keyword: string) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:8080/api/history?keyword=${keyword}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getSearchHistory = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/api/history', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const migrateSearchHistory = async (keywords: string[]) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/history/migrate', keywords, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
export const searchByCategory = async (category: string) => {
    const response = await axios.get(`${BASE_URL}/category?category=${encodeURIComponent(category)}`);
    return response.data;
};

export const searchByBinType = async (binType: string) => {
    const response = await axios.get(`${BASE_URL}/binType?binType=${encodeURIComponent(binType)}`);
    return response.data;
};

export const getAllItems = async () => {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
};

