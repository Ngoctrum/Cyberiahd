
import React, { useMemo } from 'react';
import type { Order, User, Voucher } from '../../types';
import { ClipboardListIcon, ClockIcon, CheckCircleIcon, ChartBarIcon, XCircleIcon, CurrencyDollarIcon } from '../../components/Icons';

interface AdminHomeProps {
    user: User;
    orders: Order[];
    vouchers: Voucher[];
}

const StatCard: React.FC<{title: string, value: number | string, icon: React.ReactNode, iconBgColor: string, iconColor: string}> = ({title, value, icon, iconBgColor, iconColor}) => (
    <div className="bg-white dark:bg-zinc-800/80 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700/50">
        <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4`} style={{backgroundColor: iconBgColor}}>
             <span style={{color: iconColor}}>{icon}</span>
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold mt-1 text-zinc-800 dark:text-zinc-100">{value}</p>
    </div>
);

const AdminHome: React.FC<AdminHomeProps> = ({ user, orders, vouchers }) => {
    
    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'Chờ duyệt').length;
        const completed = orders.filter(o => o.status === 'Giao thành công').length;
        const cancelled = orders.filter(o => o.status === 'Đã hủy').length;
        const totalRevenue = orders
            .filter(o => o.status === 'Giao thành công')
            .reduce((sum, order) => sum + (order.serviceFee || 0), 0);
            
        return { total, pending, completed, cancelled, totalRevenue };
    }, [orders]);

    const recentOrders = useMemo(() => {
        return orders.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
    }, [orders]);

    const statusCounts = useMemo(() => {
        const counts: { [key in Order['status']]: number } = {
            'Chờ duyệt': 0, 'Đã đặt': 0, 'Chờ người bán chuẩn bị': 0, 'Đã giao cho ĐVVC': 0, 'Giao thành công': 0, 'Đã hủy': 0, 'Yêu cầu hủy': 0,
        };
        orders.forEach(order => { if (order.status in counts) counts[order.status]++; });
        return counts;
    }, [orders]);
    
    const maxStatusCount = Math.max(...(Object.values(statusCounts) as number[]), 1);
    
    const statusColors: {[key in Order['status']]: string} = {
        'Chờ duyệt': '#f59e0b', 'Đã đặt': '#06b6d4', 'Chờ người bán chuẩn bị': '#3b82f6',
        'Đã giao cho ĐVVC': '#6366f1', 'Giao thành công': '#22c55e', 'Đã hủy': '#ef4444',
        'Yêu cầu hủy': '#f97316',
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Chào mừng trở lại, {user.username}!</h1>
                <p className="text-md text-zinc-500 dark:text-zinc-400 mt-1">Đây là tổng quan về hoạt động của cửa hàng.</p>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng số đơn" value={stats.total} icon={<ClipboardListIcon className="w-6 h-6"/>} iconBgColor="rgba(59, 130, 246, 0.1)" iconColor="#3b82f6" />
                <StatCard title="Chờ duyệt" value={stats.pending} icon={<ClockIcon className="w-6 h-6"/>} iconBgColor="rgba(245, 158, 11, 0.1)" iconColor="#f59e0b" />
                <StatCard title="Giao thành công" value={stats.completed} icon={<CheckCircleIcon className="w-6 h-6"/>} iconBgColor="rgba(34, 197, 94, 0.1)" iconColor="#22c55e" />
                <StatCard title="Tổng doanh thu" value={`${stats.totalRevenue.toLocaleString('vi-VN')}đ`} icon={<CurrencyDollarIcon className="w-6 h-6"/>} iconBgColor="rgba(139, 92, 246, 0.1)" iconColor="#8b5cf6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-800/80 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700/50">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                        <ChartBarIcon className="w-6 h-6 text-zinc-400"/>
                        Phân tích Trạng thái Đơn hàng
                    </h3>
                    <div className="flex justify-around items-end h-64 space-x-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                         {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status} className="flex flex-col items-center flex-1 h-full justify-end">
                                <div 
                                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80" 
                                    style={{ height: `${((count as number) / maxStatusCount) * 100}%`, backgroundColor: statusColors[status as Order['status']] }}
                                    title={`${status}: ${count} đơn`}
                                ></div>
                                <p className="text-xs text-center mt-2 text-zinc-500 dark:text-zinc-400 font-medium">{status}</p>
                            </div>
                         ))}
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-zinc-800/80 p-6 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700/50">
                     <h3 className="text-lg font-bold mb-4 text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700 pb-3">Hoạt động Gần đây</h3>
                     <div className="space-y-4 max-h-72 overflow-y-auto">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex items-start gap-3">
                                <div className={`mt-1 flex-shrink-0 w-3 h-3 rounded-full`} style={{backgroundColor: statusColors[order.status]}}></div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                        Đơn hàng <span className="font-mono">{order.id}</span>
                                    </p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {order.customerName} - {order.createdAt.toLocaleTimeString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && <p className="text-sm text-center text-zinc-500 py-4">Không có hoạt động nào gần đây.</p>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;