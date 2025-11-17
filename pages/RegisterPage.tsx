
import React, { useState } from 'react';
import { ShoppingCartIcon, UserIcon, MailIcon, LockClosedIcon } from '../components/Icons';
import type { User } from '../types';

interface RegisterPageProps {
    onRegister: (newUser: Omit<User, 'role'>) => { success: boolean, message: string };
    onNavigateLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if(password.length < 6){
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const result = onRegister({ username, email, password });
        if(result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                onNavigateLogin();
            }, 2000); // Navigate to login after 2 seconds
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in p-4">
            <div className="relative w-full max-w-md">
                 <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur opacity-25"></div>
                <div className="relative p-8 space-y-6 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">Ani Shop</span>
                        </div>
                        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                            Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                            Tham gia cùng chúng tôi ngay hôm nay!
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-slate-400" /></div>
                                <input id="username-reg" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800" placeholder="yourname" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Địa chỉ Email</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="h-5 w-5 text-slate-400" /></div>
                                <input id="email-reg" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-slate-400" /></div>
                                <input id="password-reg" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800" placeholder="••••••••" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Xác nhận mật khẩu</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-slate-400" /></div>
                                <input id="confirm-password-reg" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800" placeholder="••••••••" />
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-600 dark:text-green-400 text-center">{success}</p>}

                        <div>
                            <button type="submit" disabled={!!success} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 dark:disabled:bg-indigo-800">
                                Đăng ký
                            </button>
                        </div>
                    </form>
                    <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                        Đã có tài khoản?{' '}
                        <button onClick={onNavigateLogin} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
