import React from 'react';
import type { Order } from '../../types';

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
    const sortedOrders = orders.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Lịch sử Đơn hàng</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Xem lại tất cả các đơn hàng đã được tạo.</p>
            </header>

            <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 font-semibold">
                            <tr>
                                <th scope="col" className="px-6 py-4">Mã Đön</th>
                                <th scope="col" className="px-6 py-4">Ngày tạo</th>
                                <th scope="col" className="px-6 py-4">Khách hàng</th>
                                <th scope="col" className="px-6 py-4">Trạng thái</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {sortedOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{order.id}</td>
                                    <td className="px-6 py-4">{order.createdAt.toLocaleString('vi-VN')}</td>
                                    <td className="px-6 py-4">{order.customerName}</td>
                                    <td className="px-6 py-4">{order.status}</td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                     {orders.length === 0 && <p className="p-6 text-center">Không có đơn hàng nào trong lịch sử.</p>}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;