import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemDetail } from '../api/items';
import Navbar from '../components/Navbar';
import './ItemDetailPage.css';

interface Item {
    id: number;
    name: string;
    category: string;
    binType: string;
    wasteClass: string;
    description: string;
    precautions: string;
    localNotice: string;
    recyclable: boolean;
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
    '대형폐기물': '📦',
    '특수수거': '⚗️',
};

function ItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        if (id) {
            getItemDetail(Number(id)).then(setItem);
        }
    }, [id]);

    if (!item) return (
        <div className="detail-wrapper">
            <Navbar />
            <div className="detail-loading">로딩중...</div>
        </div>
    );

    const color = CATEGORY_COLORS[item.category] || { bg: '#F1EFE8', text: '#4a4840' };
    const icon = CATEGORY_ICONS[item.category] || '📦';

    return (
        <div className="detail-wrapper">
            <Navbar />
            <div className="detail-content">

                {/* 뒤로가기 */}
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← 뒤로가기
                </button>

                {/* 헤더 카드 */}
                <div className="detail-header-card" style={{ backgroundColor: color.bg }}>
                    <div className="detail-icon">{icon}</div>
                    <div className="detail-header-info">
                        <span className="detail-category-tag" style={{ color: color.text }}>
                            {item.category}
                        </span>
                        <h1 className="detail-name">{item.name}</h1>
                        <span className="detail-recyclable">
                            {item.recyclable ? '✅ 재활용 가능' : '❌ 재활용 불가'}
                        </span>
                    </div>
                </div>

                {/* 배출 정보 카드 */}
                <div className="detail-card">
                    <h2 className="detail-card-title">🗂 배출 정보</h2>
                    <div className="detail-info-row">
                        <span className="detail-info-label">배출 방법</span>
                        <span className="detail-info-value">{item.binType}</span>
                    </div>
                    <div className="detail-info-row">
                        <span className="detail-info-label">폐기물 분류</span>
                        <span className="detail-info-value">{item.wasteClass}</span>
                    </div>
                </div>

                {/* 설명 카드 */}
                <div className="detail-card">
                    <h2 className="detail-card-title">📋 설명</h2>
                    <p className="detail-card-text">{item.description}</p>
                </div>

                {/* 주의사항 카드 */}
                <div className="detail-card">
                    <h2 className="detail-card-title">⚠️ 주의사항</h2>
                    <p className="detail-card-text">{item.precautions}</p>
                </div>

                {/* 지역 안내 카드 */}
                <div className="detail-card detail-notice-card">
                    <h2 className="detail-card-title">📍 지역 안내</h2>
                    <p className="detail-card-text">{item.localNotice}</p>
                </div>

            </div>
        </div>
    );
}

export default ItemDetailPage;