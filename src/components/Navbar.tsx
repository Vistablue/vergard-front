import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        setMenuOpen(false);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setMenuOpen(false);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
            {/* 왼쪽: 로고 + 슬로건 */}
            <div className="navbar-left">
                <img
                    src={logo}
                    alt="Vergard"
                    className="navbar-logo"
                    onClick={() => handleNavigate('/')}
                />
                <span className="navbar-slogan">🌿올바른 분리수거, 베르가드🌱와 함께🌿</span>
            </div>

            {/* 가운데: 메뉴 */}
            <div className="navbar-center">
                <button className={`nav-menu-btn ${isActive('/search') ? 'active' : ''}`} onClick={() => handleNavigate('/search')}>
                    재활용 품목♻️
                </button>
                <button className={`nav-menu-btn ${isActive('/quiz') ? 'active' : ''}`} onClick={() => handleNavigate('/quiz')}>
                    퀴즈❓
                </button>
                <button className={`nav-menu-btn ${isActive('/ranking') ? 'active' : ''}`} onClick={() => handleNavigate('/ranking')}>
                    랭킹🏆
                </button>
            </div>

            {/* 오른쪽: 구분선 + 버튼 */}
            <div className="navbar-right">
                <div className="navbar-divider"></div>
                {token ? (
                    <button className="nav-btn-outline" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <>
                        <button className="nav-btn-outline" onClick={() => handleNavigate('/login')}>로그인</button>
                        <button className="nav-btn-fill" onClick={() => handleNavigate('/signup')}>회원가입</button>
                    </>
                )}
            </div>

            {/* 햄버거 버튼 (모바일 전용) */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* 모바일 드롭다운 메뉴 */}
            <div className="mobile-menu">
                <button className={`nav-menu-btn ${isActive('/search') ? 'active' : ''}`} onClick={() => handleNavigate('/search')}>
                    재활용 품목♻️
                </button>
                <button className={`nav-menu-btn ${isActive('/quiz') ? 'active' : ''}`} onClick={() => handleNavigate('/quiz')}>
                    퀴즈❓
                </button>
                <button className={`nav-menu-btn ${isActive('/ranking') ? 'active' : ''}`} onClick={() => handleNavigate('/ranking')}>
                    랭킹🏆
                </button>
                <div className="mobile-menu-divider"></div>
                {token ? (
                    <button className="nav-btn-outline" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <>
                        <button className="nav-btn-outline" onClick={() => handleNavigate('/login')}>로그인</button>
                        <button className="nav-btn-fill" onClick={() => handleNavigate('/signup')}>회원가입</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;