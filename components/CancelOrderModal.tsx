
import React, { useState } from 'react';
import type { Order } from '../types';
import { CloseIcon, ExclamationTriangleIcon } from './Icons';

interface CancelOrderModalProps {
    order: Order;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ order, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            alert('Vui lòng cung cấp lý do hủy đơn hàng.');
            return;
        }
        onConfirm(reason);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                        Xác nhận Hủy Đơn hàng
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn đang hủy đơn hàng <strong className="font-mono text-gray-800 dark:text-gray-200">{order.id}</strong>. Vui lòng cung cấp lý do.
                    </p>
                    <div>
                        <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lý do hủy</label>
                        <textarea
                            id="cancelReason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            placeholder="Ví dụ: Khách hàng yêu cầu hủy, sản phẩm hết hàng..."
                        />
                    </div>
                </div>

                <div className="p-4 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Bỏ qua
                    </button>
                    <button onClick={handleConfirm} className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                        Xác nhận Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
