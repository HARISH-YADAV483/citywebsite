import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isResidentClaim, setIsResidentClaim] = useState(false);
    
    // Quiz state
    const [showQuiz, setShowQuiz] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null); // 'pass', 'fail', null
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:3003/api/quiz/questions');
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
            setShowQuiz(true);
        } else {
            submitRegistration(false);
        }
    };

    const submitRegistration = async (verifiedResident) => {
        try {
            const response = await fetch('http://localhost:3003/api/auth/register', {
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
            const response = await fetch('http://localhost:3003/api/auth/login', {
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
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? t('auth.login') : t('auth.register')}</h2>
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
                        <p className="auth-switch">{t('auth.noAccount')} <span onClick={() => setIsLogin(false)}>{t('auth.registerHere')}</span></p>
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
                        <button type="submit" className="auth-btn">{t('auth.continueBtn')}</button>
                        <p className="auth-switch">{t('auth.hasAccount')} <span onClick={() => setIsLogin(true)}>{t('auth.loginHere')}</span></p>
                    </form>
                )}

                {/* QUIZ SECTION */}
                {!isLogin && showQuiz && quizResult === null && (
                    <div className="quiz-section">
                        <h3>{t('auth.quizTitle')}</h3>
                        <p>{t('auth.quizDesc')}</p>
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="quiz-question">
                                <p><strong>{qIndex + 1}. {q.question}</strong></p>
                                {q.options.map((opt, oIndex) => (
                                    <label key={oIndex} className="quiz-option">
                                        <input 
                                            type="radio" 
                                            name={`question-${qIndex}`} 
                                            value={opt}
                                            checked={answers[qIndex] === opt}
                                            onChange={() => setAnswers({...answers, [qIndex]: opt})}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ))}
                        <button className="auth-btn" onClick={handleQuizSubmit}>{t('auth.submitAnswers')}</button>
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
    );
};

export default AuthPage;
