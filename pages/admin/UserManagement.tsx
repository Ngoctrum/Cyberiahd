
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { User } from '../../types';
import { SearchIcon, DotsVerticalIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '../../components/Icons';

interface UserManagementProps {
    currentUser: User;
    users: User[];
    onBanUser: (user: User) => void;
    onUnbanUser: (userId: string) => void;
    onUpdateUserRole: (userId: string, newRole: 'user' | 'admin') => void;
}

const getStatusPill = (status: User['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
    switch (status) {
        case 'active': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300`;
        case 'banned': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300`;
        default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
};

const ActionMenu: React.FC<{ user: User, onAction: (action: string, user: User) => void, isCurrentUser: boolean }> = ({ user, onAction, isCurrentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isCurrentUser) {
        return <span className="text-xs text-slate-400 italic">N/A</span>;
    }

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
                    {user.status === 'active' ? (
                        <button onClick={() => { onAction('ban', user); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">Cấm</button>
                    ) : (
                        <button onClick={() => { onAction('unban', user); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700">Bỏ cấm</button>
                    )}
                    {user.role === 'user' ? (
                         <button onClick={() => { onAction('promote', user); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"><ArrowUpCircleIcon className="w-5 h-5"/> Nâng lên Admin</button>
                    ) : (
                         <button onClick={() => { onAction('demote', user); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"><ArrowDownCircleIcon className="w-5 h-5"/> Hạ xuống User</button>
                    )}
                </div>
            )}
        </div>
    );
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, onBanUser, onUnbanUser, onUpdateUserRole }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleAction = (action: string, user: User) => {
        switch(action) {
            case 'ban':
                onBanUser(user);
                break;
            case 'unban':
                onUnbanUser(user.id);
                break;
            case 'promote':
                if (window.confirm(`Bạn có chắc muốn nâng cấp ${user.username} thành Admin?`)) {
                    onUpdateUserRole(user.id, 'admin');
                }
                break;
            case 'demote':
                 if (window.confirm(`Bạn có chắc muốn hạ cấp ${user.username} xuống thành User?`)) {
                    onUpdateUserRole(user.id, 'user');
                }
                break;
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Người dùng</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Xem, cấm hoặc bỏ cấm tài khoản người dùng.</p>
            </header>

            <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative w-full md:w-2/5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400"/></div>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm username, email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                </div>
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 font-semibold">
                             <tr>
                                <th scope="col" className="px-6 py-4">ID Người dùng</th>
                                <th scope="col" className="px-6 py-4">Username</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Vai trò</th>
                                <th scope="col" className="px-6 py-4">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                             {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">{user.id}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 uppercase text-xs font-bold">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={getStatusPill(user.status)}>{user.status}</span>
                                        {user.status === 'banned' && <p className="text-xs mt-1 text-slate-500">Lý do: {user.banReason}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <ActionMenu user={user} onAction={handleAction} isCurrentUser={currentUser.id === user.id} />
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>Không tìm thấy người dùng nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;