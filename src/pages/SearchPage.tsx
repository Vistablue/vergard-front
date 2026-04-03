import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchItems, saveSearchHistory, getSearchHistory, searchByCategory, searchByBinType, getAllItems } from '../api/items';
import Navbar from '../components/Navbar';
import './SearchPage.css';

interface Item {
    id: number;
    name: string;
    category: string;
    binType: string;
    isRecyclable: boolean;
    description: string;
    precautions: string;
    imageUrl: string;
    categoryImageUrl: string;
    searchCount: number;
    localNotice: string;
    wasteClass: string;
}

interface History {
    id?: number;
    keyword: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    '재활용': { bg: '#E8F0D8', text: '#3a5a18' },
    '종량제': { bg: '#F1EFE8', text: '#4a4840' },
    '음식물쓰레기': { bg: '#FEF3E2', text: '#7a4a10' },
    '대형폐기물': { bg: '#E8F4FB', text: '#1a5a7a' },
    '특수수거': { bg: '#F5EDF8', text: '#5a2a7a' },
};

const CATEGORY_ICONS: Record<string, string> = {
    '재활용': '♻️',
    '종량제': '🗑️',
    '음식물쓰레기': '🍚',
    '대형폐기물': '🛋️',
    '특수수거': '⚗️',
};

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [results, setResults] = useState<Item[]>([]);
    const [searched, setSearched] = useState(false);
    const [history, setHistory] = useState<History[]>([]);
    const [pageTitle, setPageTitle] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // 검색기록 로드 — 항상 실행
    useEffect(() => {
        loadHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const k = searchParams.get('keyword');
        const cat = searchParams.get('category');
        const binT = searchParams.get('binType');

        if (k) {
            setKeyword(k);
            setPageTitle(`"${k}" 검색 결과`);
            searchItems(k).then((data) => {
                setResults(data);
                setSearched(true);
            });
        } else if (cat) {
            setPageTitle(`${CATEGORY_ICONS[cat] || ''} ${cat}`);
            searchByCategory(cat).then((data) => {
                setResults(data);
                setSearched(true);
            });
        } else if (binT) {
            setPageTitle(binT);
            searchByBinType(binT).then((data) => {
                setResults(data);
                setSearched(true);
            });
        } else {
            // 파라미터 없으면 전체 품목 — searched는 false 유지해서 검색기록 표시
            setPageTitle('전체 품목');
            getAllItems().then((data) => {
                setResults(data);
                // setSearched(true) 제거 — 전체 품목 화면에서도 검색기록 보여야 함
            });
        }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadHistory = async () => {
        if (token) {
            const data = await getSearchHistory().catch(() => []);
            setHistory(data);
        } else {
            const local = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            setHistory(local.map((k: string) => ({ keyword: k })));
        }
    };

    const handleSearch = async () => {
        if (!keyword.trim()) return;
        if (token) {
            await saveSearchHistory(keyword).catch(() => { });
        } else {
            const local = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const updated = [keyword, ...local.filter((k: string) => k !== keyword)].slice(0, 5);
            localStorage.setItem('searchHistory', JSON.stringify(updated));
        }
        // 검색 후 기록 갱신
        await loadHistory();
        setSearchParams({ keyword });
    };

    return (
        <div className="search-wrapper">
            <Navbar />
            <div className="search-content">
                {/* 검색바 */}
                <div className="search-bar-wrap">
                    <div className="search-bar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="품목명을 입력하세요"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="search-btn" onClick={handleSearch}>검색</button>
                    </div>

                    {/* 최근 검색기록 — searched 조건 제거, 기록 있으면 항상 표시 */}
                    {history.length > 0 && (
                        <div className="history-wrap">
                            <span className="history-label">최근 검색어</span>
                            {history.map((h, index) => (
                                <span
                                    key={h.id || index}
                                    className="history-tag"
                                    onClick={() => setSearchParams({ keyword: h.keyword })}
                                >
                                    {h.keyword}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 결과 영역 */}
                <div className="result-header">
                    <h2 className="result-title">{pageTitle}</h2>
                    <span className="result-count">{results.length}개</span>
                </div>

                {results.length === 0 && searched ? (
                    <div className="no-result">
                        <p>검색 결과가 없습니다 😢</p>
                        <p>다른 키워드로 검색해보세요</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {results.map((item) => {
                            const color = CATEGORY_COLORS[item.category] || { bg: '#F1EFE8', text: '#4a4840' };
                            const icon = CATEGORY_ICONS[item.category] || '📦';
                            return (
                                <div
                                    key={item.id}
                                    className="item-card"
                                    onClick={() => navigate(`/items/${item.id}`)}
                                >
                                    <div className="item-card-icon" style={{ backgroundColor: color.bg }}>
                                        <span>{icon}</span>
                                    </div>
                                    <div className="item-card-body">
                                        <p className="item-card-name">{item.name}</p>
                                        <span
                                            className="item-card-tag"
                                            style={{ backgroundColor: color.bg, color: color.text }}
                                        >
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;