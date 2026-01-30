import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function Auth({ onLogin, backendUrl }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const payload = isLogin ? { email, password } : { email, password, name };
            const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

            // Success
            onLogin(data);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Authentication failed';

            // UX Improvement: Auto-switch to login if user exists
            if (!isLogin && errorMsg.toLowerCase().includes('already exists')) {
                setError('User already exists! Switching to Login...');
                setTimeout(() => {
                    setIsLogin(true);
                    setError('');
                }, 1500);
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-200">
                        <User size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join us to optimize your career'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-bold text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:scale-[1.02]"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onLogin({ id: 'guest', name: 'Guest User' })}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm mt-3 transition-colors"
                    >
                        Continue as Guest (No Login)
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-600 font-bold ml-1 hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
