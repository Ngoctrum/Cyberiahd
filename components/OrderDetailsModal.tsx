
import React, { useState, useEffect } from 'react';
import type { Order, Voucher } from '../types';
import { CloseIcon, UserCircleIcon, PhoneIcon, MapPinIcon, LinkIcon, HashtagIcon, TagIcon, ChatBubbleLeftEllipsisIcon, MailIcon } from './Icons';

interface OrderDetailsModalProps {
    order: Order;
    vouchers: Voucher[];
    onClose: () => void;
    onSave: (updatedOrder: Order) => void;
}

const ALL_STATUSES: Order['status'][] = ['Chờ duyệt', 'Đã đặt', 'Chờ người bán chuẩn bị', 'Đã giao cho ĐVVC', 'Giao thành công', 'Đã hủy'];
const ALL_PAYMENT_STATUSES: Order['paymentStatus'][] = ['Chưa thanh toán', 'Chờ duyệt thanh toán', 'Đã thanh toán'];

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, vouchers, onClose, onSave }) => {
    const [editedOrder, setEditedOrder] = useState<Order>(order);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setEditedOrder(order);
    }, [order]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (editedOrder.status === 'Đã giao cho ĐVVC' && !editedOrder.mvd?.trim()) {
            setError('Vui lòng nhập Mã vận đơn trước khi chuyển trạng thái "Đã giao cho ĐVVC".');
            return;
        }
        setError('');
        onSave(editedOrder);
        onClose();
    };
    
    const appliedVoucher = vouchers.find(v => v.code === order.voucher);

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Chi tiết Đơn hàng</h2>
                        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <CloseIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Editable Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Thông tin Khách hàng</h3>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><UserCircleIcon className="w-5 h-5"/> Tên người nhận</label>
                                <input type="text" name="customerName" value={editedOrder.customerName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md"/>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><MailIcon className="w-5 h-5"/> Email</label>
                                <input type="email" name="email" value={editedOrder.email} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md"/>
                            </div>
                             <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><PhoneIcon className="w-5 h-5"/> Liên hệ</label>
                                <input type="text" name="contact" value={editedOrder.contact} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md"/>
                            </div>
                             <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><MapPinIcon className="w-5 h-5"/> Địa chỉ</label>
                                <textarea name="address" value={editedOrder.address} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md"></textarea>
                            </div>
                        </div>

                        {/* Right Column: Order Status & Details */}
                        <div className="space-y-6">
                             <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Xử lý Đơn hàng</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái Đơn hàng</label>
                                    <select name="status" value={editedOrder.status} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                        {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {appliedVoucher?.price && appliedVoucher.price > 0 && (
                                     <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái Thanh toán</label>
                                        <select name="paymentStatus" value={editedOrder.paymentStatus} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                            {ALL_PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                             </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Vận Đơn (MVD)</label>
                                <input type="text" name="mvd" value={editedOrder.mvd} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Nhập MVD khi giao cho ĐVVC"/>
                            </div>
                             {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                             <hr className="border-slate-200 dark:border-slate-700" />
                             <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                 <p className="flex items-center gap-2"><LinkIcon className="w-5 h-5"/> <a href={order.productLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Xem sản phẩm</a></p>
                                 <p className="flex items-center gap-2"><HashtagIcon className="w-5 h-5"/> Số lượng: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.quantity}</span></p>
                                 <p className="flex items-center gap-2"><TagIcon className="w-5 h-5"/> Voucher: <span className="font-semibold text-slate-800 dark:text-slate-200">{order.voucher} ({appliedVoucher?.price ? `${appliedVoucher.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'})</span></p>
                                 {order.notes && <p className="flex items-start gap-2"><ChatBubbleLeftEllipsisIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/> Ghi chú: <span className="italic text-slate-800 dark:text-slate-200">{order.notes}</span></p>}
                             </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Lưu thay đổi
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

export default OrderDetailsModal;