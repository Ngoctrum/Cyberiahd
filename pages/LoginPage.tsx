
import React, { useState } from 'react';
import { ShoppingCartIcon, UserIcon, LockClosedIcon } from '../components/Icons';

interface LoginPageProps {
    onLogin: (credentials: { usernameOrEmail: string; password: string }) => void;
    onNavigateRegister: () => void;
    error: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateRegister, error }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ usernameOrEmail, password });
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in p-4">
            <div className="relative w-full max-w-md">
                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25"></div>
                <div className="relative p-8 space-y-6 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">Ani Shop</span>
                        </div>
                        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                            Chào mừng trở lại
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                            Đăng nhập để tiếp tục sử dụng dịch vụ.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Tên đăng nhập hoặc Email
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800"
                                    placeholder="yourname or you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Mật khẩu
                            </label>
                            <div className="mt-1 relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                    <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                        Chưa có tài khoản?{' '}
                        <button onClick={onNavigateRegister} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Đăng ký ngay
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
