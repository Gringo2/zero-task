import { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg';
import './AuthScreen.css';

interface AuthScreenProps {
    isSetup: boolean;
    onLogin: (passcode: string) => Promise<boolean>;
    onSetup: (passcode: string) => Promise<void>;
}

/**
 * Component: AuthScreen
 * 
 * The gateway to ZERO-TASK. Handles both initial setup and login.
 */
export const AuthScreen = ({ isSetup, onLogin, onSetup }: AuthScreenProps) => {
    const [passcode, setPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');
    const [error, setError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setIsProcessing(true);

        if (isSetup) {
            if (passcode.length < 4) {
                setError(true);
                setIsProcessing(false);
                return;
            }
            if (passcode !== confirmPasscode) {
                setError(true);
                setIsProcessing(false);
                return;
            }
            await onSetup(passcode);
        } else {
            const success = await onLogin(passcode);
            if (!success) {
                setError(true);
                setPasscode('');
            }
        }
        setIsProcessing(false);
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
                    <h1>{isSetup ? 'Establish Sovereignty' : 'Sovereign Access'}</h1>
                    <p>{isSetup ? 'Set your local master passcode' : 'Enter your local passcode'}</p>
                </header>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="passcode-field">
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder={isSetup ? "Create Passcode" : "••••"}
                            className="auth-input"
                            autoFocus
                            disabled={isProcessing}
                        />
                    </div>

                    {isSetup && (
                        <div className="passcode-field">
                            <input
                                type="password"
                                value={confirmPasscode}
                                onChange={(e) => setConfirmPasscode(e.target.value)}
                                placeholder="Confirm Passcode"
                                className="auth-input"
                                disabled={isProcessing}
                            />
                        </div>
                    )}

                    {error && (
                        <motion.p
                            className="auth-error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {isSetup ? 'Passcodes must match and be at least 4 digits.' : 'Access Denied. Passcode incorrect.'}
                        </motion.p>
                    )}

                    <button type="submit" className="auth-btn" disabled={isProcessing}>
                        {isProcessing ? 'Verifying...' : (isSetup ? 'Secure Engine' : 'Unlock')}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p>Protected by Local Sovereignty</p>
                    <span>No data ever leaves this device.</span>
                </footer>
            </motion.div>
        </div>
    );
};
