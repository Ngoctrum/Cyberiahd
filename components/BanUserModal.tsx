
import React, { useState } from 'react';
import type { User } from '../types';
import { CloseIcon, UserCircleIcon } from './Icons';

interface BanUserModalProps {
    user: User;
    onClose: () => void;
    onConfirmBan: (reason: string, details?: string) => void;
}

const PREDEFINED_REASONS = [
    'Không thanh toán phí dịch vụ',
    'Nghi ngờ spam/lừa đảo',
    'Vi phạm điều khoản dịch vụ',
    'Hành vi không phù hợp',
];

const BanUserModal: React.FC<BanUserModalProps> = ({ user, onClose, onConfirmBan }) => {
    const [reason, setReason] = useState(PREDEFINED_REASONS[0]);
    const [details, setDetails] = useState('');

    const handleConfirm = () => {
        const finalReason = reason === 'Khác' ? details : reason;
        if (!finalReason.trim()) {
            alert('Vui lòng cung cấp lý do cấm người dùng.');
            return;
        }
        onConfirmBan(finalReason, reason === 'Khác' ? details : undefined);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Xác nhận Cấm Người dùng</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <CloseIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Bạn có chắc chắn muốn cấm người dùng <strong className="text-slate-800 dark:text-slate-200">{user.username}</strong> ({user.email})?
                    </p>
                    <div>
                        <label htmlFor="banReason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lý do cấm</label>
                        <select
                            id="banReason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {PREDEFINED_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            <option value="Khác">Khác (ghi rõ bên dưới)</option>
                        </select>
                    </div>
                    {reason === 'Khác' && (
                        <div>
                            <label htmlFor="banDetails" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chi tiết lý do</label>
                            <textarea
                                id="banDetails"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Cung cấp chi tiết lý do..."
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                        Hủy
                    </button>
                    <button onClick={handleConfirm} className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                        Xác nhận Cấm
                    </button>
                </div>
            </div>
             <style>{`
                .animate-fade-in-fast { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default BanUserModal;
