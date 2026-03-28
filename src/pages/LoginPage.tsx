import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { migrateSearchHistory } from '../api/items';
import './LoginPage.css';
import logo from '../assets/logo.png';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const token = await login(email, password);
            localStorage.setItem('token', token);
            const localHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            if (localHistory.length > 0) {
                await migrateSearchHistory(localHistory).catch(() => { });
                localStorage.removeItem('searchHistory');
            }
            navigate('/');
        } catch (e) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <img
                    src={logo}
                    alt="Vergard"
                    className="auth-logo-img"
                    onClick={() => navigate('/')}
                />
                <h2 className="auth-title">로그인</h2>
                <p className="auth-sub">올바른 분리수거, 베르가드와 함께해요 🌿</p>

                <div className="auth-form">
                    <div className="auth-field">
                        <label className="auth-label">이메일</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">비밀번호</label>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-btn" onClick={handleLogin}>
                        로그인
                    </button>
                </div>

                <p className="auth-switch">
                    계정이 없으신가요?{' '}
                    <span className="auth-link" onClick={() => navigate('/signup')}>
                        회원가입
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;