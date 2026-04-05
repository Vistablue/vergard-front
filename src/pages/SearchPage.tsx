import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchItems, saveSearchHistory, getSearchHistory, searchByCategory, searchByBinType, getAllItems, searchByWasteClass } from '../api/items';
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
    '음식물쓰레기': '🍎',
    '대형폐기물': '🛋️',
    '특수수거': '💻',
};

const WASTE_CLASS_OPTIONS = [
    { label: '전체 🌏', value: '전체' },
    { label: '플라스틱류🪣', value: '플라스틱류' },
    { label: '종이류📚', value: '종이류' },
    { label: '종이팩🐮', value: '종이팩' },
    { label: '일반종량제🗑️', value: '일반종량제' },
    { label: '비닐류🛍️', value: '비닐류' },
    { label: '스티로폼⬜', value: '스티로폼' },
    { label: '캔류🥫', value: '캔류' },
    { label: '유리병🍷', value: '유리병' },
    { label: '불연성종량제❌', value: '불연성종량제' },
    { label: '폐건전지·배터리류🔋', value: '폐건전지·배터리류' },
    { label: '형광등🌟', value: '형광등' },
    { label: '의류·섬유👗', value: '의류·섬유' },
    { label: '음식물쓰레기🍎', value: '음식물쓰레기' },
    { label: '중소형 폐가전🖱️', value: '중소형 폐가전' },
    { label: '대형 폐가전📺', value: '대형 폐가전' },
    { label: '가구류🛏️', value: '가구류' },
    { label: '대형폐기물 배출🛁', value: '대형폐기물 배출' },
    { label: '생활계유해폐기물🛢️', value: '생활계유해폐기물' },
    { label: '폐의약품💊', value: '폐의약품' },
    { label: '고철류🍳', value: '고철류' },
];

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [results, setResults] = useState<Item[]>([]);
    const [searched, setSearched] = useState(false);
    const [history, setHistory] = useState<History[]>([]);
    const [pageTitle, setPageTitle] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedWasteClass, setSelectedWasteClass] = useState('전체');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const k = searchParams.get('keyword');
        const cat = searchParams.get('category');
        const binT = searchParams.get('binType');
        const wc = searchParams.get('wasteClass');

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
        } else if (wc) {
            setPageTitle(`${wc}`);
            setSelectedWasteClass(wc);
            searchByWasteClass(wc).then((data) => {
                setResults(data);
                setSearched(true);
            });
        } else {
            setPageTitle('전체 품목');
            getAllItems().then((data) => {
                setResults(data);
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
        await loadHistory();
        setSearchParams({ keyword });
    };

    const handleWasteClassFilter = (wc: string) => {
        setSelectedWasteClass(wc);
        if (wc === '전체') {
            setSearchParams({});
        } else {
            setSearchParams({ wasteClass: wc });
        }
    };

    // 정렬 적용
    const displayResults = sortAsc
        ? [...results].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
        : results;

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

                    {history.length > 0 && (
                        <div className="history-wrap">
                            <span className="history-label">최근 검색기록</span>
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

                {/* 필터 + 정렬 */}
                <div className="filter-wrap">
                    <div className="waste-class-filter">
                        {WASTE_CLASS_OPTIONS.map((wc) => (
                            <button
                                key={wc.value}
                                className={`filter-btn ${selectedWasteClass === wc.value ? 'active' : ''}`}
                                onClick={() => handleWasteClassFilter(wc.value)}
                            >
                                {wc.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 결과 헤더 */}
                <div className="result-header">
                    <h2 className="result-title">{pageTitle}</h2>
                    <span className="result-count">{displayResults.length}개</span>
                </div>

                {displayResults.length === 0 && searched ? (
                    <div className="no-result">
                        <p>검색 결과가 없습니다 😢</p>
                        <p>다른 키워드로 검색해보세요</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {displayResults.map((item) => {
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