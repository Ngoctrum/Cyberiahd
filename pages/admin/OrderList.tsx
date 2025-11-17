


import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Order } from '../../types';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, DotsVerticalIcon, PencilAltIcon } from '../../components/Icons';

interface OrderListProps {
    orders: Order[];
    onViewDetails: (order: Order) => void;
    onCreateEditLink: (order: Order) => void;
}

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS: Order['status'][] = ['Chờ duyệt', 'Đã đặt', 'Chờ người bán chuẩn bị', 'Đã giao cho ĐVVC', 'Giao thành công', 'Đã hủy'];

const getStatusPill = (status: Order['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
    switch (status) {
        case 'Chờ duyệt': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`;
        case 'Đã đặt': return `${baseClasses} bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300`;
        case 'Chờ người bán chuẩn bị': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300`;
        case 'Đã giao cho ĐVVC': return `${baseClasses} bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300`;
        case 'Giao thành công': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300`;
        case 'Đã hủy': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300`;
        default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
};

const getPaymentStatusPill = (status: Order['paymentStatus']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide mt-1";
     switch (status) {
        case 'Chưa thanh toán': return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        case 'Chờ duyệt thanh toán': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`;
        case 'Đã thanh toán': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300`;
        default: return ``;
    }
}

const ActionMenu: React.FC<{ order: Order, onViewDetails: () => void, onCreateEditLink: () => void }> = ({ order, onViewDetails, onCreateEditLink }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
                    <button onClick={() => { onViewDetails(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700">Xem chi tiết</button>
                    <button
                        onClick={() => { onCreateEditLink(); setIsOpen(false); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                        <PencilAltIcon className="w-4 h-4" />
                        <span>Tạo link sửa</span>
                    </button>
                </div>
            )}
        </div>
    );
};


const OrderList: React.FC<OrderListProps> = ({ orders, onViewDetails, onCreateEditLink }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const sortedOrders = useMemo(() => {
        return orders.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return sortedOrders.filter(order => {
            const matchesSearch = 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [sortedOrders, searchTerm, statusFilter]);
    
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);
    
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Danh sách Đơn hàng</h1>
                <p className="text-md text-zinc-500 dark:text-zinc-400 mt-1">Quản lý và theo dõi tất cả đơn hàng của khách.</p>
            </header>
            
            <div className="bg-white dark:bg-zinc-800/80 shadow-lg border border-zinc-200 dark:border-zinc-700/50 rounded-xl">
                <div className="p-4 flex flex-col md:flex-row gap-4 justify-between border-b border-zinc-200 dark:border-zinc-700">
                    <div className="relative w-full md:w-2/5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-zinc-400"/></div>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm mã đơn, tên khách..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                         className="w-full md:w-auto bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                        <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-700/50 dark:text-zinc-300 font-semibold">
                             <tr>
                                <th scope="col" className="px-6 py-4">Mã Đơn / Ngày tạo</th>
                                <th scope="col" className="px-6 py-4">Khách hàng</th>
                                <th scope="col" className="px-6 py-4">Chi tiết đơn hàng</th>
                                <th scope="col" className="px-6 py-4">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700/50">
                             {paginatedOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200">
                                    <td scope="row" className="px-6 py-4 align-top">
                                        <p className="font-mono font-bold text-zinc-800 dark:text-white">{order.id}</p>
                                        <p className="text-xs">{order.createdAt.toLocaleDateString('vi-VN')} {order.createdAt.toLocaleTimeString('vi-VN')}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">{order.customerName}</p>
                                        <p className="text-xs">{order.contact}</p>
                                        <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">{order.address}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top max-w-sm">
                                        <a href={order.productLink} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate block">Xem sản phẩm</a>
                                        <p className="text-xs">Số lượng: <span className="font-semibold">{order.quantity}</span></p>
                                        <p className="text-xs">Voucher: <span className="font-semibold">{order.voucher}</span></p>
                                        {order.notes && <p className="text-xs mt-1 italic text-zinc-500 dark:text-zinc-400">Ghi chú: {order.notes}</p>}
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col items-start gap-1">
                                            <div className={getStatusPill(order.status)}>{order.status}</div>
                                            <div className={getPaymentStatusPill(order.paymentStatus)}>{order.paymentStatus}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top text-center">
                                        <ActionMenu 
                                            order={order} 
                                            onViewDetails={() => onViewDetails(order)} 
                                            onCreateEditLink={() => onCreateEditLink(order)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {paginatedOrders.length === 0 && (
                        <div className="text-center p-8 text-zinc-500">
                            <p>Không có đơn hàng nào phù hợp.</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="p-4 flex justify-between items-center text-sm border-t border-zinc-200 dark:border-zinc-700">
                        <span className="text-zinc-600 dark:text-zinc-400">Tổng cộng: {filteredOrders.length} đơn hàng</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-zinc-300 dark:border-zinc-600 rounded-md disabled:opacity-50 flex items-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Trước
                            </button>
                             <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-zinc-300 dark:border-zinc-600 rounded-md disabled:opacity-50 flex items-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Sau
                                 <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
