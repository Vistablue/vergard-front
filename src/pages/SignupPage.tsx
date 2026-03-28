import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import './LoginPage.css';
import logo from '../assets/logo.png';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await signup(email, password, nickname);
            alert('회원가입 성공! 로그인해주세요.');
            navigate('/login');
        } catch (e) {
            setError('회원가입에 실패했습니다. 다시 시도해주세요.');
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
                <h2 className="auth-title">회원가입</h2>
                <p className="auth-sub">베르가드와 함께 환경을 지켜요 🌱</p>

                <div className="auth-form">
                    <div className="auth-field">
                        <label className="auth-label">이메일</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        />
                    </div>
                    <div className="auth-field">
                        <label className="auth-label">닉네임</label>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button className="auth-btn" onClick={handleSignup}>
                        회원가입
                    </button>
                </div>

                <p className="auth-switch">
                    이미 계정이 있으신가요?{' '}
                    <span className="auth-link" onClick={() => navigate('/login')}>
                        로그인
                    </span>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;