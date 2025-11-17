
import React, { useMemo } from 'react';
import type { User, Order } from '../types';

interface UserDashboardProps {
    user: User;
    orders: Order[];
}

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


const UserDashboard: React.FC<UserDashboardProps> = ({ user, orders }) => {

    const userOrders = useMemo(() => {
        return orders
            .filter(order => order.userId === user.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [orders, user.id]);

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-8">
            <header>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                    Đơn hàng của tôi
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    Xem lại toàn bộ lịch sử đặt hàng của bạn tại đây.
                </p>
            </header>

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {userOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {userOrders.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p className="font-semibold">Bạn chưa có đơn hàng nào.</p>
                            <p>Hãy bắt đầu đặt hàng ngay!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
