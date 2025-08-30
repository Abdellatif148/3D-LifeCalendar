import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success('Successfully signed in!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in');
            throw error;
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            });
            if (error) throw error;
            toast.success('Account created successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create account');
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success('Successfully signed out!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign out');
            throw error;
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        try {
            const { error } = await supabase.functions.invoke('delete-user');
            if (error) throw error;
            toast.success('Account deleted successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete account');
            throw error;
        }
    }, []);

    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error getting session:', error);
                toast.error('Failed to load session');
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            
            // Create profile on sign up
            if (event === 'SIGNED_UP' && session?.user) {
                try {
                    const { error } = await supabase
                        .from('profiles')
                        .insert({ id: session.user.id });
                    if (error && error.code !== '23505') { // Ignore duplicate key error
                        console.error('Error creating profile:', error);
                    }
                } catch (error) {
                    console.error('Error creating profile:', error);
                }
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        deleteAccount,
    };

    return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
