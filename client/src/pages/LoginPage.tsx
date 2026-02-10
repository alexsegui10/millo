import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { setAuthToken, setUser } from '../lib/auth';
import type { LoginResponse } from '../types';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const response = await api.post<LoginResponse>('/auth/login', { email, password });

        setLoading(false);

        if (response.ok && response.data) {
            setAuthToken(response.data.token);
            setUser(response.data.user);
            navigate('/');
        } else {
            setError(response.error?.message || 'Entrar failed');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4">
            {/* Decorative background */}
            <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-40 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-[80px]"></div>
            </div>

            {/* Central Card */}
            <div className="w-full max-w-[480px] bg-white dark:bg-[#1a2332] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary/80 to-primary"></div>

                <div className="p-8 md:p-10 flex flex-col gap-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                            <span className="material-symbols-outlined text-3xl">hub</span>
                        </div>
                        <h1 className="font-display text-3xl font-black tracking-tight text-[#0d121b] dark:text-white">
                            OFM Agency Hub
                        </h1>
                        <p className="text-[#4c669a] dark:text-gray-400 text-base font-normal leading-relaxed">
                            Sign in to manage your models and assets
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                            <span className="material-symbols-outlined text-sm">error</span>
                            <p className="text-xs font-medium">{error}</p>
                        </div>
                    )}

                    {/* Entrar Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#0d121b] dark:text-gray-200" htmlFor="email">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131b29] pl-10 pr-4 py-3 text-[#0d121b] dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary focus:ring-1 transition-all duration-200 ease-in-out sm:text-sm"
                                    id="email"
                                    name="email"
                                    placeholder="name@agency.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#0d121b] dark:text-gray-200" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>
                                <input
                                    className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131b29] pl-10 pr-10 py-3 text-[#0d121b] dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary focus:ring-1 transition-all duration-200 ease-in-out sm:text-sm"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    className="custom-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-600 dark:bg-[#131b29] dark:checked:bg-primary transition-colors cursor-pointer"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors select-none">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            className="mt-2 w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Need help accessing your account? <a className="text-primary hover:underline" href="#">Contact Admin</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
