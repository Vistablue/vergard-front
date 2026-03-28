import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuiz, saveScore } from '../api/quiz';
import Navbar from '../components/Navbar';
import './QuizPage.css';

interface Quiz {
    id: number;
    itemName: string;
    type: string;
    question: string;
    answer: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
}

function QuizPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [current, setCurrent] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [timeOver, setTimeOver] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [animate, setAnimate] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const totalTimeRef = useRef<number>(0);
    const questionStartRef = useRef<number>(Date.now());
    const scoreRef = useRef<number>(0);
    const navigate = useNavigate();

    const getTimeLimit = (index: number) => index < 5 ? 13 : 8;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다!');
            navigate('/login');
            return;
        }
        getQuiz().then((data) => {
            setQuizzes(data);
            setOptions(makeOptions(data[0]));
            questionStartRef.current = Date.now();
        });
    }, []);

    useEffect(() => {
        if (quizzes.length === 0 || finished) return;
        const limit = getTimeLimit(current);
        setTimeLeft(limit);
        questionStartRef.current = Date.now();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    const elapsed = Date.now() - questionStartRef.current;
                    totalTimeRef.current += elapsed;
                    setTimeOver(true);
                    setSelected('');
                    setAnimate(false);
                    setTimeout(() => setAnimate(true), 50);
                    setTimeout(() => handleNext(), 1500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current!);
    }, [current, quizzes]);

    const makeOptions = (quiz: Quiz) => {
        if (quiz.type === 'ox') return ['O', 'X'];
        const opts = [quiz.answer, quiz.wrong1, quiz.wrong2, quiz.wrong3];
        return opts.sort(() => Math.random() - 0.5);
    };

    const handleSelect = (option: string) => {
        if (selected !== null) return;
        clearInterval(timerRef.current!);
        const elapsed = Date.now() - questionStartRef.current;
        totalTimeRef.current += elapsed;
        setSelected(option);
        if (option === quizzes[current].answer) {
            setScore(prev => prev + 1);
            scoreRef.current += 1;
        }
        setAnimate(false);
        setTimeout(() => setAnimate(true), 50);
        setTimeout(() => handleNext(), 1500);
    };

    const handleNext = async () => {
        const next = current + 1;
        if (next >= quizzes.length) {
            const token = localStorage.getItem('token');
            if (token) {
                await saveScore(scoreRef.current, totalTimeRef.current).catch(() => { });
            }
            setFinished(true);
        } else {
            setCurrent(next);
            setOptions(makeOptions(quizzes[next]));
            setSelected(null);
            setTimeOver(false);
        }
    };

    if (quizzes.length === 0) return (
        <div className="quiz-wrapper">
            <Navbar />
            <div className="quiz-loading">퀴즈 불러오는 중... 🌿</div>
        </div>
    );

    if (finished) {
        const totalSec = (totalTimeRef.current / 1000).toFixed(1);
        const perfect = score === quizzes.length;
        return (
            <div className="quiz-wrapper">
                <Navbar />
                <div className="quiz-finish-content">
                    <div className="quiz-finish-card">
                        <div className="quiz-finish-emoji">
                            {perfect ? '🏆' : score >= 7 ? '🎉' : score >= 5 ? '😊' : '😅'}
                        </div>
                        <h1 className="quiz-finish-title">퀴즈 완료!</h1>
                        <div className="quiz-finish-score">
                            <span className="quiz-finish-score-num">{score}</span>
                            <span className="quiz-finish-score-total">/ {quizzes.length}</span>
                        </div>
                        <p className="quiz-finish-time">소요시간 {totalSec}초</p>
                        {perfect && <p className="quiz-finish-perfect">완벽해요! 🌟</p>}
                        <div className="quiz-finish-btns">
                            <button className="quiz-btn-primary" onClick={() => navigate('/ranking')}>
                                🏆 랭킹 보기
                            </button>
                            <button className="quiz-btn-secondary" onClick={() => window.location.reload()}>
                                다시하기
                            </button>
                            <button className="quiz-btn-secondary" onClick={() => navigate('/')}>
                                메인으로
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const quiz = quizzes[current];
    const timeLimit = getTimeLimit(current);
    const timerPercent = (timeLeft / timeLimit) * 100;
    const timerColor = timeLeft <= 3 ? '#e74c3c' : timeLeft <= 6 ? '#f39c12' : '#758C3B';

    return (
        <div className="quiz-wrapper">
            <Navbar />
            <div className="quiz-content">

                {/* 상단 진행 상태 */}
                <div className="quiz-progress-header">
                    <span className="quiz-progress-text">{current + 1} / {quizzes.length}</span>
                    <span className="quiz-timer-text" style={{ color: timerColor }}>{timeLeft}초</span>
                </div>

                {/* 타이머 바 */}
                <div className="quiz-timer-track">
                    <div
                        className="quiz-timer-bar"
                        style={{
                            width: `${timerPercent}%`,
                            backgroundColor: timerColor,
                            transition: timeLeft === getTimeLimit(current) ? 'none' : 'width 1s linear, background-color 0.3s'
                        }}
                    />
                </div>

                {/* 문제 카드 */}
                <div className="quiz-question-card">
                    <span className="quiz-question-label">Q{current + 1}</span>
                    <h2 className="quiz-question-text">{quiz.question}</h2>
                </div>

                {/* 보기 */}
                <div className={`quiz-options ${quiz.type === 'ox' ? 'ox-options' : ''}`}>
                    {options.map((opt) => {
                        let optClass = 'quiz-option';
                        if (selected !== null) {
                            if (opt === quiz.answer) optClass += ' correct';
                            else if (opt === selected) optClass += ' wrong';
                            else optClass += ' disabled';
                        }
                        return (
                            <button
                                key={opt}
                                className={optClass}
                                onClick={() => handleSelect(opt)}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* 정답/오답 표시 */}
                {selected !== null && (
                    <div className="quiz-result">
                        <p className={`quiz-result-text ${timeOver ? 'wrong-text' : selected === quiz.answer ? 'correct-text' : 'wrong-text'}`}>
                            {timeOver
                                ? `⏰ 시간 초과! 정답: ${quiz.answer}`
                                : selected === quiz.answer
                                    ? '나이스! ✨ 정답이에요!'
                                    : `앗! 😅 오답입니다. 정답: ${quiz.answer}`
                            }
                        </p>
                        <div className="quiz-next-track">
                            <div
                                className="quiz-next-bar"
                                style={{
                                    backgroundColor: selected === quiz.answer ? '#758C3B' : '#e74c3c',
                                    width: animate ? '100%' : '0%',
                                    transition: 'width 1.5s linear'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizPage;