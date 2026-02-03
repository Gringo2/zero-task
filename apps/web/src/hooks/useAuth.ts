import { useCallback } from 'react';
import { authClient } from '../lib/auth-client';

/**
 * Hook: useAuth
 * 
 * Manages the authentication lifecycle using Better Auth.
 */
export const useAuth = () => {
    const session = authClient.useSession();
    const isAuthenticated = !!session.data;
    const isLoading = session.isPending;

    // Better Auth handles "setup" via sign-up or early admin creation.
    // For now, we'll expose a signup method.
    const signup = useCallback(async (email: string, password: string, name: string) => {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        return { data, error };
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            console.error('Login failed:', error.message);
            return false;
        }

        return !!data;
    }, []);

    const logout = useCallback(async () => {
        await authClient.signOut();
    }, []);

    return {
        isAuthenticated,
        user: session.data?.user,
        isLoading,
        signup,
        login,
        logout,
        // Keep compatibility with existing UI if needed, or update UI
        isSetupRequired: false, // We'll handle this differently with multi-user auth
    };
};
