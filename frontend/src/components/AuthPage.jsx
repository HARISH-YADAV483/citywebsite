import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isResidentClaim, setIsResidentClaim] = useState(false);
    
    // Quiz state
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null); // 'pass', 'fail', null
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
const api = import.meta.env.VITE_API_URL || 'http://localhost:3003';

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${api}/api/quiz/questions`);
            const data = await response.json();
            setQuestions(data);
        } catch (err) {
            console.error("Failed to fetch questions", err);
        }
    };

    const handleRegisterStep1 = (e) => {
        e.preventDefault();
        setError('');
        if (mobile.length !== 10) {
            setError(t('auth.mobileError'));
            return;
        }
        if (isResidentClaim) {
            fetchQuestions();
            setCurrentQuestionIndex(0);
            setShowQuiz(true);
        } else {
            submitRegistration(false);
        }
    };

    const submitRegistration = async (verifiedResident) => {
        try {
            const response = await fetch(`${api}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password, isResident: verifiedResident })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.error || t('auth.regFailed'));
            }
        } catch (err) {
            setError(t('auth.errorOccurred'));
        }
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${api}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.error || t('auth.loginFailed'));
            }
        } catch (err) {
            setError(t('auth.errorOccurred'));
        }
    };

    const handleQuizSubmit = () => {
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score++;
            }
        });
        
        if (score >= 5) {
            setQuizResult('pass');
        } else {
            setQuizResult('fail');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <Navbar variant="solid" />
            <div className="auth-split-container">
                <div className="auth-left-panel">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back
                    </button>
                    
                    <div className="auth-header-switch">
                        {isLogin ? (
                            <p>{t('auth.noAccount')} <span onClick={() => setIsLogin(false)}>{t('auth.registerHere')}</span></p>
                        ) : (
                            <p>{t('auth.hasAccount')} <span onClick={() => setIsLogin(true)}>{t('auth.loginHere')}</span></p>
                        )}
                    </div>

                    <div className={`auth-card ${!isLogin && showQuiz && quizResult === null ? 'auth-card--quiz' : ''}`}>
                        {isLogin && (
                            <div className="auth-welcome">
                                <h2>Welcome to <span className="brand-text">Mali Tibba</span></h2>
                                <p>Where the community meets daily updates, local insights, and honest conversations.</p>
                            </div>
                        )}
                        {!isLogin && !showQuiz && (
                            <div className="auth-welcome">
                                <h2>Join <span className="brand-text">Mali Tibba</span></h2>
                                <p>Create an account to connect with the local community and stay updated.</p>
                            </div>
                        )}
                        {error && <p className="auth-error">{error}</p>}
                        
                        {/* LOGIN FORM */}
                        {isLogin && (
                            <form onSubmit={submitLogin}>
                                <div className="form-group">
                                    <label>{t('auth.mobileLabel')}</label>
                                    <input 
                                        type="text" 
                                        value={mobile} 
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('auth.passwordLabel')}</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="auth-btn">{t('auth.loginBtn')}</button>
                            </form>
                        )}

                {/* REGISTER FORM */}
                {!isLogin && !showQuiz && (
                    <form onSubmit={handleRegisterStep1}>
                        <div className="form-group">
                            <label>{t('auth.mobileLabel')}</label>
                            <input 
                                type="text" 
                                value={mobile} 
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('auth.passwordLabel')}</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <input 
                                type="checkbox" 
                                id="residentCheck"
                                checked={isResidentClaim}
                                onChange={(e) => setIsResidentClaim(e.target.checked)}
                            />
                            <label htmlFor="residentCheck">{t('auth.residentCheck')}</label>
                        </div>
                        <p className="auth-note">{t('auth.rememberNote')}</p>
                        <button type="submit" className="auth-btn">{t('auth.continueBtn')}</button>
                    </form>
                )}

                {/* QUIZ SECTION */}
                {!isLogin && showQuiz && quizResult === null && questions.length > 0 && (
                    <div className="quiz-section">
                        <div className="quiz-header">
                            <h3>{t('auth.quizTitle')}</h3>
                            <span className="quiz-progress">{currentQuestionIndex + 1} / {questions.length}</span>
                        </div>
                        <p>{t('auth.quizDesc')}</p>
                        
                        <div className="quiz-question">
                            <p><strong>Q{currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}</strong></p>
                            <div className="quiz-options">
                                {questions[currentQuestionIndex].options.map((opt, oIndex) => (
                                    <label key={oIndex} className={`quiz-option ${answers[currentQuestionIndex] === opt ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name={`question-${currentQuestionIndex}`} 
                                            value={opt}
                                            checked={answers[currentQuestionIndex] === opt}
                                            onChange={() => setAnswers({...answers, [currentQuestionIndex]: opt})}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <div className="quiz-nav-actions">
                            <button 
                                className="auth-btn secondary quiz-nav-btn" 
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                {t('auth.prevBtn')}
                            </button>
                            
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button 
                                    className="auth-btn quiz-nav-btn" 
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                >
                                    {t('auth.nextBtn')}
                                </button>
                            ) : (
                                <button className="auth-btn quiz-nav-btn" onClick={handleQuizSubmit}>{t('auth.submitAnswers')}</button>
                            )}
                        </div>
                    </div>
                )}

                {/* QUIZ RESULTS */}
                {!isLogin && showQuiz && quizResult === 'pass' && (
                    <div className="quiz-result success">
                        <h3>{t('auth.congrats')}</h3>
                        <p>{t('auth.provedResidence')}</p>
                        <button className="auth-btn" onClick={() => submitRegistration(true)}>{t('auth.completeReg')}</button>
                    </div>
                )}

                {!isLogin && showQuiz && quizResult === 'fail' && (
                    <div className="quiz-result fail">
                        <h3>{t('auth.failTitle')}</h3>
                        <p>{t('auth.failDesc')}</p>
                        <div className="quiz-actions">
                            <button className="auth-btn" onClick={() => { setQuizResult(null); setAnswers({}); }}>{t('auth.reattempt')}</button>
                            <button className="auth-btn secondary" onClick={() => submitRegistration(false)}>{t('auth.continueNonRes')}</button>
                        </div>
                    </div>
                )}
            </div>
                </div>

                <div className="auth-right-panel">
                    <div className="promo-content">
                        <h2>Your community<br/>deserves to be<br/><span className="highlight">heard.</span></h2>
                        <div className="promo-cards">
                            <div className="promo-card">
                                <div className="promo-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </div>
                                <div className="promo-text">
                                    <h4>Connect & Engage</h4>
                                    <p>Share your blogs , ideas & grow together</p>
                                </div>
                            </div>
                            <div className="promo-card">
                                <div className="promo-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <div className="promo-text">
                                    <h4>Communities</h4>
                                    <p>Be part of the active Mali Tibba communities</p>
                                </div>
                            </div>
                            {/* <div className="promo-card">
                                <div className="promo-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <div className="promo-text">
                                    <h4>Real-time Chat</h4>
                                    <p>Message members & engage in conversations</p>
                                </div>
                            </div> */}
                        </div>
                        <div className="promo-stats">
                            <div className="stat-item">
                                <h4>1k+</h4>
                                <p>MEMBERS</p>
                            </div>
                            <div className="stat-item">
                                <h4>20+</h4>
                                <p>GROUPS</p>
                            </div>
                            <div className="stat-item">
                                <h4>24/7</h4>
                                <p>ACTIVE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
