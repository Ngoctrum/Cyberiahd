
import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import { CloseIcon, LinkIcon } from './Icons';

interface CreateEditLinkModalProps {
    order: Order | null;
    onClose: () => void;
    onCreateLink: (orderId: string) => string;
}

const CreateEditLinkModal: React.FC<CreateEditLinkModalProps> = ({ order, onClose, onCreateLink }) => {
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (order) {
            const link = onCreateLink(order.id);
            setGeneratedLink(link);
            setCopied(false);
        }
    }, [order, onCreateLink]);

    const handleCopy = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!order) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                     <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tạo Link Chỉnh sửa Đơn hàng</h2>
                        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <CloseIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Gửi link này cho khách hàng <strong className="text-slate-800 dark:text-slate-200">{order.customerName}</strong> để họ có thể tự chỉnh sửa thông tin đơn hàng.
                        <br/>
                        <span className="text-sm text-red-500">Link sẽ hết hạn sau 1 giờ.</span>
                    </p>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={generatedLink}
                            placeholder="Đang tạo link..."
                            className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md font-mono text-sm"
                        />
                         <button 
                            onClick={handleCopy}
                            className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            {copied ? 'Đã sao chép!' : 'Sao chép'}
                        </button>
                    </div>
                </div>

                <div className="p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEditLinkModal;
