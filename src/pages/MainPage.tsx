import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo } from '../api/auth';
import Navbar from '../components/Navbar';
import './MainPage.css';

const MAIN_CATEGORIES = [
    { label: '♻️ 재활용', category: '재활용', color: '#E8F0D8', textColor: '#3a5a18' },
    { label: '🗑️ 종량제', category: '종량제', color: '#F1EFE8', textColor: '#4a4840' },
    { label: '🍚 음식물쓰레기', category: '음식물쓰레기', color: '#FEF3E2', textColor: '#7a4a10' },
    { label: '📦 대형폐기물', category: '대형폐기물', color: '#E8F4FB', textColor: '#1a5a7a' },
    { label: '⚗️ 특수수거', category: '특수수거', color: '#F5EDF8', textColor: '#5a2a7a' },
];

const SUB_CATEGORIES = [
    { label: '📄 종이류', binType: '종이 분리배출' },
    { label: '🧴 플라스틱', binType: '플라스틱 분리배출' },
    { label: '🫙 유리병', binType: '유리병 분리배출' },
    { label: '🥫 캔류', binType: '캔류 분리배출' },
    { label: '🛍️ 비닐류', binType: '비닐류 분리배출' },
    { label: '🧊 스티로폼', binType: '스티로폼 분리배출' },
];

function MainPage() {
    const [nickname, setNickname] = useState('');
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getMyInfo().then((data) => setNickname(data.nickname)).catch(() => { });
        }
    }, []);

    const handleSearch = () => {
        if (!keyword.trim()) return;
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };

    return (
        <div className="main-wrapper">
            <Navbar />

            {/* 히어로 섹션 */}
            <section className="hero-section">
                {nickname && <p className="hero-greeting">안녕하세요, {nickname}님 😄</p>}
                <h1 className="hero-title">어디에 버려야할지 헷갈린다면? </h1>
                <p className="hero-sub">442개 품목 분리수거 정보를 한 번에</p>
                <div className="hero-search-bar">
                    <input
                        className="hero-search-input"
                        type="text"
                        placeholder="예) 페트병, 건전지, 형광등..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="hero-search-btn" onClick={handleSearch}>검색</button>
                </div>
            </section>

            {/* 대분류 카테고리 5개 */}
            <section className="category-section">
                <h2 className="section-title">카테고리로 찾기</h2>
                <div className="main-category-grid">
                    {MAIN_CATEGORIES.map((cat) => (
                        <button
                            key={cat.category}
                            className="main-category-card"
                            style={{ backgroundColor: cat.color, color: cat.textColor }}
                            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.category)}`)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* 세부 바로가기 */}
                <div className="sub-category-grid">
                    {SUB_CATEGORIES.map((cat) => (
                        <button
                            key={cat.binType}
                            className="sub-category-card"
                            onClick={() => navigate(`/search?binType=${encodeURIComponent(cat.binType)}`)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* 퀴즈 배너 */}
            <section className="quiz-banner-section">
                <div className="quiz-banner-inner">
                    <div className="quiz-banner-text">
                        <p className="quiz-banner-sub">오늘의 분리수거 퀴즈 🧩</p>
                        <p className="quiz-banner-title">내 분리수거 실력은 몇 점?</p>
                    </div>
                    <button className="quiz-banner-btn" onClick={() => navigate('/quiz')}>
                        퀴즈 도전하기
                    </button>
                </div>
            </section>
        </div>
    );
}

export default MainPage;