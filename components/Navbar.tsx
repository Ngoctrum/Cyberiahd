

import React, { useState, useRef, useEffect } from 'react';
import type { User, Theme } from '../types';
import { ShoppingCartIcon, MenuIcon, CloseIcon, ChevronDownIcon, ClipboardListIcon, LogoutIcon, QuestionMarkCircleIcon, SunIcon, MoonIcon } from './Icons';

type Page = 'home' | 'order' | 'admin' | 'login' | 'register' | 'my-orders' | 'support' | 'edit-order';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentPage: Page;
  theme: Theme;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, currentPage, theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);
    
    const NavLink: React.FC<{page: Page, children: React.ReactNode, isSidebar?: boolean}> = ({ page, children, isSidebar = false }) => {
        const isActive = currentPage === page;
        const baseClasses = "font-medium transition-colors duration-300";
        const sidebarClasses = `w-full text-left block p-3 rounded-md text-base ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`;
        const navbarClasses = `py-2 px-3 rounded-md text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`;

        return (
            <button
              onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate(page);
              }}
              className={`${baseClasses} ${isSidebar ? sidebarClasses : navbarClasses}`}
            >
              {children}
            </button>
        );
    }

    const ThemeToggleButton = ({ isSidebar = false }) => (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${
                isSidebar
                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    );

    const SidebarContent = () => (
        <>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => { setIsMenuOpen(false); onNavigate('home'); }} className="flex-shrink-0 flex items-center gap-2">
                    <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Ani Shop</span>
                </button>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <CloseIcon className="w-6 h-6 text-slate-500" />
                </button>
            </div>
            <div className="flex flex-col flex-grow p-4">
                <nav className="space-y-2">
                    <NavLink page="home" isSidebar>Trang chủ</NavLink>
                    <NavLink page="order" isSidebar>Đặt Hàng</NavLink>
                    <NavLink page="support" isSidebar>Hỗ trợ</NavLink>
                    {user && <NavLink page="my-orders" isSidebar>Đơn hàng của tôi</NavLink>}
                    {user?.role === 'admin' && <NavLink page="admin" isSidebar>Quản lý</NavLink>}
                </nav>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                {user ? (
                    <div className="flex items-center justify-between">
                         <ThemeToggleButton isSidebar />
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white text-right">{user.username}</p>
                            <p className="text-sm text-slate-500 text-right">{user.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button onClick={() => { setIsMenuOpen(false); onNavigate('login'); }} className="w-full text-center rounded-md bg-indigo-600 text-white px-3 py-2 text-base font-medium hover:bg-indigo-700 transition-colors">
                            Đăng nhập
                        </button>
                        <button onClick={() => { setIsMenuOpen(false); onNavigate('register'); }} className="w-full text-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-base font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Đăng ký
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center gap-2">
                                <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                                <span className="text-xl font-bold text-slate-800 dark:text-slate-200">Ani Shop</span>
                            </button>
                        </div>
                        <div className="hidden md:block">
                            <nav className="ml-10 flex items-baseline space-x-4">
                                <NavLink page="home">Trang chủ</NavLink>
                                <NavLink page="order">Đặt Hàng</NavLink>
                                <NavLink page="support">Hỗ trợ</NavLink>
                                {user && <NavLink page="my-orders">Đơn hàng của tôi</NavLink>}
                                {user?.role === 'admin' && <NavLink page="admin">Quản lý</NavLink>}
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                             <ThemeToggleButton />
                            <div className="hidden md:block">
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.username}</span>
                                        <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-40 animate-fade-in-fast">
                                            <button onClick={() => { onNavigate('my-orders'); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <ClipboardListIcon className="w-5 h-5"/>
                                                <span>Đơn hàng của tôi</span>
                                            </button>
                                            <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <LogoutIcon className="w-5 h-5"/>
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onNavigate('login')} className="rounded-md text-slate-600 dark:text-slate-300 px-4 py-2 text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                                    Đăng nhập
                                    </button>
                                    <button onClick={() => onNavigate('register')} className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors duration-300">
                                    Đăng ký
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                <MenuIcon className="block h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

             {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isMenuOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Sidebar */}
                <aside className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <SidebarContent />
                </aside>
            </div>
        </>
    );
};

export default Navbar;