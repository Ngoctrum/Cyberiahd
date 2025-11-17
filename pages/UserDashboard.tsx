

import React, { useMemo, useState } from 'react';
import type { User, Order, SupportTicket } from '../types';
import { ClipboardListIcon, ChatAlt2Icon, ChevronDownIcon, XCircleIcon } from '../components/Icons';
import OrderStatusTracker from '../components/OrderStatusTracker';
import SupportTicketDetailsModal from '../components/SupportTicketDetailsModal';

interface UserDashboardProps {
    user: User;
    orders: Order[];
    supportTickets: SupportTicket[];
    onReplyToTicket: (ticketId: string, content: string, author: 'user' | 'admin') => void;
    onRequestCancellation: (orderId: string) => void;
}

type ActiveTab = 'orders' | 'support';

const getStatusPill = (status: Order['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
    const statusMap = {
        'Chờ duyệt': "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300",
        'Đã đặt': "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300",
        'Chờ người bán chuẩn bị': "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
        'Đã giao cho ĐVVC': "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
        'Giao thành công': "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
        'Đã hủy': "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
        'Yêu cầu hủy': "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
    };
    return `${baseClasses} ${statusMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`;
};

const getSupportStatusPill = (status: SupportTicket['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
     switch (status) {
        case 'Đang xử lý': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`;
        case 'Đã trả lời': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300`;
        case 'Đã đóng': return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        default: return ``;
    }
}

const OrderDetails: React.FC<{ order: Order, onRequestCancellation: (orderId: string) => void }> = ({ order, onRequestCancellation }) => {
    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
            <OrderStatusTracker status={order.status} />
            {order.status === 'Đã hủy' && order.cancellationReason && (
                 <div className="mt-4 p-3 text-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 rounded-lg">
                    <p className="font-semibold text-sm">Lý do hủy đơn:</p>
                    <p className="text-sm">{order.cancellationReason}</p>
                </div>
            )}
             {order.status === 'Chờ duyệt' && (
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn gửi yêu cầu hủy đơn hàng này không?')) {
                                onRequestCancellation(order.id);
                            }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                        <XCircleIcon className="w-5 h-5"/>
                        Yêu cầu Hủy đơn
                    </button>
                </div>
            )}
        </div>
    );
};


const UserDashboard: React.FC<UserDashboardProps> = ({ user, orders, supportTickets, onReplyToTicket, onRequestCancellation }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const userOrders = useMemo(() => {
        return orders
            .filter(order => order.userId === user.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [orders, user.id]);

    const userTickets = useMemo(() => {
        return supportTickets
            .filter(ticket => ticket.userId === user.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [supportTickets, user.id]);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in space-y-8">
            {selectedTicket && (
                <SupportTicketDetailsModal
                    user={user}
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onReply={onReplyToTicket}
                />
            )}
            <header>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                    Bảng điều khiển
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    Quản lý đơn hàng và các yêu cầu hỗ trợ của bạn.
                </p>
            </header>

            <div>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                         <button
                            onClick={() => setActiveTab('orders')}
                            className={`${ activeTab === 'orders' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600' } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <ClipboardListIcon className="w-5 h-5 mr-2" />
                            <span>Đơn hàng của tôi</span>
                        </button>
                         <button
                            onClick={() => setActiveTab('support')}
                            className={`${ activeTab === 'support' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600' } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            <ChatAlt2Icon className="w-5 h-5 mr-2" />
                            <span>Hỗ trợ của tôi</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'orders' && (
                         <div className="bg-white dark:bg-slate-800/80 shadow-xl border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 font-semibold">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Mã Đơn hàng</th>
                                            <th scope="col" className="px-6 py-4">Ngày Đặt</th>
                                            <th scope="col" className="px-6 py-4">Sản phẩm</th>
                                            <th scope="col" className="px-6 py-4">Trạng thái</th>
                                            <th scope="col" className="px-6 py-4">Phí Dịch vụ</th>
                                            <th scope="col" className="px-6 py-4"><span className="sr-only">Chi tiết</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                        {userOrders.map((order) => (
                                            <React.Fragment key={order.id}>
                                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{order.id}</td>
                                                    <td className="px-6 py-4">{order.createdAt.toLocaleDateString('vi-VN')}</td>
                                                    <td className="px-6 py-4">
                                                        <a href={order.productLink} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                                            Xem sản phẩm
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={getStatusPill(order.status)}>{order.status}</span>
                                                    </td>
                                                     <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                        {order.serviceFee.toLocaleString('vi-VN')}đ
                                                    </td>
                                                     <td className="px-6 py-4 text-right">
                                                        <button onClick={() => toggleOrderDetails(order.id)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedOrderId === order.id && (
                                                    <tr>
                                                        <td colSpan={6}>
                                                            <OrderDetails order={order} onRequestCancellation={onRequestCancellation} />
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                                {userOrders.length === 0 && (
                                    <div className="text-center p-8 text-slate-500">
                                        <p className="font-semibold">Bạn chưa có đơn hàng nào.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                     {activeTab === 'support' && (
                        <div className="bg-white dark:bg-slate-800/80 shadow-xl border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
                             <div className="overflow-x-auto">
                                 <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                     <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 font-semibold">
                                         <tr>
                                             <th scope="col" className="px-6 py-4">ID Phiếu</th>
                                             <th scope="col" className="px-6 py-4">Ngày tạo</th>
                                             <th scope="col" className="px-6 py-4">Vấn đề</th>
                                             <th scope="col" className="px-6 py-4">Trạng thái</th>
                                             <th scope="col" className="px-6 py-4"></th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                         {userTickets.map((ticket) => (
                                             <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                 <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{ticket.id}</td>
                                                 <td className="px-6 py-4">{ticket.createdAt.toLocaleDateString('vi-VN')}</td>
                                                 <td className="px-6 py-4 max-w-sm truncate">{ticket.issue}</td>
                                                 <td className="px-6 py-4"><span className={getSupportStatusPill(ticket.status)}>{ticket.status}</span></td>
                                                 <td className="px-6 py-4 text-right">
                                                    <button onClick={() => setSelectedTicket(ticket)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                                        Xem & Trả lời
                                                    </button>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                                 {userTickets.length === 0 && (
                                     <div className="text-center p-8 text-slate-500">
                                         <p className="font-semibold">Bạn chưa có phiếu hỗ trợ nào.</p>
                                     </div>
                                 )}
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;