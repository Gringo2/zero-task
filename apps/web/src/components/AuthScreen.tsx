import { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';
import './AuthScreen.css';

interface AuthScreenProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onSignup: (email: string, password: string, name: string) => Promise<{ error?: unknown }>;
}

/**
 * Component: AuthScreen
 * 
 * The gateway to ZERO-TASK. Handles multi-user authentication.
 */
export const AuthScreen = ({ onLogin, onSignup }: AuthScreenProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setIsProcessing(true);

        try {
            if (isLogin) {
                const success = await onLogin(email, password);
                if (!success) {
                    setError(true);
                }
            } else {
                const { error: signUpError } = await onSignup(email, password, name);
                if (signUpError) {
                    setError(true);
                } else {
                    // Auto switch to login or handle session
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error('Auth submission error:', err);
            setError(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="auth-outer">
            <motion.div
                className={`auth-card ${error ? 'error' : ''}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <header className="auth-header">
                    <img src={logo} alt="Zero Task" className="auth-logo" />
                    <h1>{isLogin ? 'Sovereign Access' : 'Establish Identity'}</h1>
                    <p>{isLogin ? 'Enter your credentials' : 'Create your ZERO-TASK identity'}</p>
                </header>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-field">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="auth-input"
                                required
                                disabled={isProcessing}
                            />
                        </div>
                    )}
                    <div className="input-field">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="auth-input"
                            required
                            autoFocus
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="auth-input"
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    {error && (
                        <motion.p
                            className="auth-error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {isLogin ? 'Access Denied. Invalid credentials.' : 'Registration failed. Please try again.'}
                        </motion.p>
                    )}

                    <button type="submit" className="auth-btn" disabled={isProcessing}>
                        {isProcessing ? 'Verifying...' : (isLogin ? 'Unlock' : 'Secure Engine')}
                    </button>

                    <button
                        type="button"
                        className="auth-toggle"
                        onClick={() => setIsLogin(!isLogin)}
                        disabled={isProcessing}
                    >
                        {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p>Protected by System Zero Sovereignty</p>
                    <span>Multi-user environment with centralized audit logs.</span>
                </footer>
            </motion.div>
        </div>
    );
};
