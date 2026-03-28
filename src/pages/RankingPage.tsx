import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRanking, getMyRank } from '../api/quiz';
import Navbar from '../components/Navbar';
import './RankingPage.css';

interface RankUser {
    id: number;
    nickname: string;
    bestScore: number;
    bestTime: number;
}

interface MyRank {
    rank: number;
    nickname: string;
    bestScore: number;
    bestTime: number;
}

function RankingPage() {
    const [ranking, setRanking] = useState<RankUser[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [myRank, setMyRank] = useState<MyRank | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRanking(0);
        if (token) {
            getMyRank().then(setMyRank).catch(() => { });
        }
    }, []);

    const fetchRanking = async (page: number) => {
        const data = await getRanking(page);
        setRanking(data.users);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setTotalUsers(data.totalUsers);
    };

    const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}초`;

    const getMedalEmoji = (index: number, page: number) => {
        const realIndex = page * 10 + index;
        if (realIndex === 0) return '🥇';
        if (realIndex === 1) return '🥈';
        if (realIndex === 2) return '🥉';
        return null;
    };

    return (
        <div className="ranking-wrapper">
            <Navbar />
            <div className="ranking-content">

                <div className="ranking-header">
                    <h1 className="ranking-title">🏆 랭킹</h1>
                    <p className="ranking-sub">총 {totalUsers}명 참여 중 · 퀴즈 점수 + 시간 기준</p>
                </div>

                {/* 내 순위 */}
                {myRank && myRank.bestScore > 0 && (
                    <div className="my-rank-card">
                        <span className="my-rank-label">내 순위</span>
                        <div className="my-rank-info">
                            <span className="my-rank-position">{myRank.rank}위</span>
                            <span className="my-rank-nickname">{myRank.nickname}</span>
                        </div>
                        <div className="my-rank-score">
                            <span className="ranking-score">{myRank.bestScore}점</span>
                            <span className="ranking-time">{formatTime(myRank.bestTime)}</span>
                        </div>
                    </div>
                )}

                {ranking.length === 0 ? (
                    <div className="ranking-empty">
                        <p>아직 랭킹 데이터가 없어요 😢</p>
                        <button className="ranking-quiz-btn" onClick={() => navigate('/quiz')}>
                            퀴즈 도전하기
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="ranking-list">
                            {ranking.map((user, index) => (
                                <div
                                    key={user.id}
                                    className={`ranking-item ${currentPage === 0 && index < 3 ? 'top-three' : ''} ${currentPage === 0 && index === 0 ? 'first' : ''}`}
                                >
                                    <div className="ranking-left">
                                        <span className="ranking-position">
                                            {getMedalEmoji(index, currentPage) || `${currentPage * 10 + index + 1}`}
                                        </span>
                                        <span className="ranking-nickname">{user.nickname}</span>
                                    </div>
                                    <div className="ranking-right">
                                        <span className="ranking-score">{user.bestScore}점</span>
                                        <span className="ranking-time">{formatTime(user.bestTime)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    onClick={() => fetchRanking(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    ←
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`page-btn ${currentPage === i ? 'active' : ''}`}
                                        onClick={() => fetchRanking(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="page-btn"
                                    onClick={() => fetchRanking(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="ranking-footer">
                    <button className="ranking-quiz-btn" onClick={() => navigate('/quiz')}>
                        퀴즈 도전하기
                    </button>
                    <button className="ranking-home-btn" onClick={() => navigate('/')}>
                        메인으로
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RankingPage;