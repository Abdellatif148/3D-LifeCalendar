import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const AuthView: React.FC = () => {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
        } catch (error) {
            // Error handling is done in the auth hook
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
            <div className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                        3D Time Optimizer
                    </h1>
                    <h2 className="text-xl font-semibold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                </div>
                
                <form className="space-y-6" onSubmit={handleAuth}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-white bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                            placeholder="Enter your password"
                            minLength={6}
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={loading || !email || !password} 
                        className="w-full text-lg"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </Button>
                </form>
                
                <div className="text-center">
                    <p className="text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    </p>
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="mt-2 font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                        disabled={loading}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
