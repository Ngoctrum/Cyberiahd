
import React, { useState, useEffect } from 'react';
import type { Order, OrderEditRequest, OrderShippingInfo, Toast } from '../types';
import { ShoppingCartIcon, UserCircleIcon, PhoneIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon, MailIcon, ClockIcon, XCircleIcon } from '../components/Icons';
import { Loader } from '../components/Loader';

interface EditOrderPageProps {
    params: { token: string };
    orderEditRequests: OrderEditRequest[];
    orders: Order[];
    onSubmit: (token: string, oldData: OrderShippingInfo, newData: OrderShippingInfo) => void;
    addToast: (message: string, type: Toast['type']) => void;
    onNavigateHome: () => void;
}

const EditOrderPage: React.FC<EditOrderPageProps> = ({ params, orderEditRequests, orders, onSubmit, addToast, onNavigateHome }) => {
    const [request, setRequest] = useState<OrderEditRequest | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState<OrderShippingInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const { token } = params;
        const foundRequest = orderEditRequests.find(r => r.token === token);

        if (!foundRequest) {
            setError('Link không hợp lệ hoặc đã được sử dụng.');
            setIsLoading(false);
            return;
        }

        if (foundRequest.expiresAt && new Date() > new Date(foundRequest.expiresAt)) {
            setError('Link chỉnh sửa đã hết hạn. Vui lòng yêu cầu link mới.');
            setIsLoading(false);
            return;
        }

        const foundOrder = orders.find(o => o.id === foundRequest.orderId);
        if (!foundOrder) {
            setError('Không tìm thấy đơn hàng tương ứng.');
            setIsLoading(false);
            return;
        }
        
        setRequest(foundRequest);
        setOrder(foundOrder);
        setFormData({
            customerName: foundOrder.customerName,
            address: foundOrder.address,
            contact: foundOrder.contact,
            notes: foundOrder.notes,
            email: foundOrder.email,
        });
        setIsLoading(false);
    }, [params, orderEditRequests, orders]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev!, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!request || !order || !formData || isSubmitting) return;
        
        setIsSubmitting(true);
        
        const oldData: OrderShippingInfo = {
            customerName: order.customerName,
            address: order.address,
            contact: order.contact,
            notes: order.notes,
            email: order.email,
        };

        // Simulate API call
        setTimeout(() => {
            onSubmit(request.token!, oldData, formData);
            // No need to set isSubmitting to false as the page will navigate away
        }, 1000);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-8"><Loader /></div>;
        }

        if (error || !order || !formData) {
            return (
                <div className="p-8 text-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 rounded-lg shadow-xl">
                    <XCircleIcon className="w-12 h-12 mx-auto text-red-500" />
                    <h2 className="mt-4 text-2xl font-bold">Đã xảy ra lỗi</h2>
                    <p className="mt-2 text-red-700 dark:text-red-300">{error || 'Không thể tải dữ liệu.'}</p>
                    <button onClick={onNavigateHome} className="mt-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Về Trang chủ</button>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-slate-800/50 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="text-center">
                    <p className="font-mono text-slate-500 dark:text-slate-400">Mã đơn hàng: {order.id}</p>
                    <div className="inline-flex items-center gap-2 mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                        <ClockIcon className="w-4 h-4" />
                        Link sẽ hết hạn lúc {new Date(request!.expiresAt!).toLocaleTimeString('vi-VN')}
                    </div>
                </div>
                <hr className="border-slate-200 dark:border-slate-700" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><UserCircleIcon className="w-5 h-5 text-slate-400"/> Tên người nhận</label>
                        <input type="text" name="customerName" required value={formData.customerName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><PhoneIcon className="w-5 h-5 text-slate-400"/> SĐT / Link liên hệ</label>
                        <input type="text" name="contact" required value={formData.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><MailIcon className="w-5 h-5 text-slate-400"/> Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><MapPinIcon className="w-5 h-5 text-slate-400"/> Địa chỉ nhận hàng</label>
                    <textarea name="address" required value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"><ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-slate-400"/> Ghi chú</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                        {isSubmitting ? <Loader /> : 'Gửi Yêu cầu Cập nhật'}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-gray-950">
            <div className="w-full max-w-2xl mx-auto animate-fade-in">
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
                        <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        Chỉnh sửa Thông tin Đơn hàng
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        Vui lòng kiểm tra và cập nhật thông tin chính xác.
                    </p>
                </header>
                {renderContent()}
            </div>
             <footer className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                <p>&copy; {new Date().getFullYear()} Ani Shop. All Rights Reserved.</p>
             </footer>
        </div>
    );
};

export default EditOrderPage;
