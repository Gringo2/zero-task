import { useState, useCallback, useEffect } from 'react';
import { getAuthMetadata, saveAuthMetadata, type AuthMetadata } from '../services/db';

/**
 * Utility: Hash passcode with salt using SHA-256
 */
const hashPasscode = async (passcode: string, salt: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Utility: Generate random salt
 */
const generateSalt = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

/**
 * Hook: useAuth
 * 
 * Manages the local-first authentication lifecycle.
 */
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSetupRequired, setIsSetupRequired] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial check
    useEffect(() => {
        const checkAuth = async () => {
            const metadata = await getAuthMetadata();
            setIsSetupRequired(!metadata || !metadata.isSetup);
            setIsLoading(false);

            // For developers: If in dev mode and no passcode, auto-auth could be an option, 
            // but for ZERO-TASK we follow strict doctrine.
        };
        checkAuth();
    }, []);

    const setupPasscode = useCallback(async (passcode: string) => {
        const salt = generateSalt();
        const hash = await hashPasscode(passcode, salt);

        const metadata: AuthMetadata = {
            passcodeHash: hash,
            salt: salt,
            isSetup: true
        };

        await saveAuthMetadata(metadata);
        setIsSetupRequired(false);
        setIsAuthenticated(true);
    }, []);

    const login = useCallback(async (passcode: string): Promise<boolean> => {
        const metadata = await getAuthMetadata();
        if (!metadata) return false;

        const attemptHash = await hashPasscode(passcode, metadata.salt);
        if (attemptHash === metadata.passcodeHash) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
    }, []);

    return {
        isAuthenticated,
        isSetupRequired,
        isLoading,
        setupPasscode,
        login,
        logout
    };
};
