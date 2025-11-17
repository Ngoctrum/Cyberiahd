
import React, { useState, useEffect } from 'react';
import type { Order, OrderShippingInfo } from '../types';
import { CloseIcon, UserCircleIcon, PhoneIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon, MailIcon } from './Icons';

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    onSubmit: (newData: OrderShippingInfo) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, order, onSubmit }) => {
    const [formData, setFormData] = useState<OrderShippingInfo>({
        customerName: '', address: '', contact: '', notes: '', email: ''
    });

    useEffect(() => {
        if (order) {
            setFormData({
                customerName: order.customerName,
                address: order.address,
                contact: order.contact,
                notes: order.notes,
                email: order.email,
            });
        }
    }, [order]);

    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Yêu cầu Chỉnh sửa Thông tin</h2>
                        <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <CloseIcon className="w-6 h-6 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Chỉnh sửa thông tin giao hàng của bạn và gửi yêu cầu để admin duyệt. Lưu ý: chỉ có thể yêu cầu sửa khi đơn hàng đang ở trạng thái "Chờ duyệt".</p>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><UserCircleIcon className="w-5 h-5"/> Tên người nhận</label>
                        <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><MailIcon className="w-5 h-5"/> Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><PhoneIcon className="w-5 h-5"/> Liên hệ</label>
                        <input type="text" name="contact" required value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"/>
                    </div>
                     <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><MapPinIcon className="w-5 h-5"/> Địa chỉ</label>
                        <textarea name="address" required value={formData.address} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"></textarea>
                    </div>
                     <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"><ChatBubbleLeftEllipsisIcon className="w-5 h-5"/> Ghi chú</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"></textarea>
                    </div>
                </form>

                <div className="p-4 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Gửi Yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditOrderModal;
