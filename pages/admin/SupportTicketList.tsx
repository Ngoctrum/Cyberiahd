

import React, { useMemo } from 'react';
import type { SupportTicket } from '../../types';

interface SupportTicketListProps {
    tickets: SupportTicket[];
    onUpdateStatus: (ticketId: string, status: SupportTicket['status']) => void;
    onViewDetails: (ticket: SupportTicket) => void;
}

const getStatusPill = (status: SupportTicket['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
    switch (status) {
        case 'Đang xử lý': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`;
        case 'Đã trả lời': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300`;
        case 'Đã đóng': return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        default: return ``;
    }
};

const SupportTicketList: React.FC<SupportTicketListProps> = ({ tickets, onUpdateStatus, onViewDetails }) => {

    const sortedTickets = useMemo(() => {
        const statusOrder = { 'Đang xử lý': 1, 'Đã trả lời': 2, 'Đã đóng': 3 };
        return [...tickets].sort((a, b) => {
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
    }, [tickets]);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Phiếu Hỗ trợ Khách hàng</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Xem và xử lý các yêu cầu hỗ trợ từ người dùng.</p>
            </header>

             <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300 font-semibold">
                            <tr>
                                <th scope="col" className="px-6 py-4">ID Phiếu / Ngày tạo</th>
                                <th scope="col" className="px-6 py-4">Mã Đơn hàng</th>
                                <th scope="col" className="px-6 py-4">Vấn đề</th>
                                <th scope="col" className="px-6 py-4">Trạng thái</th>
                                <th scope="col" className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {sortedTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer" onClick={() => onViewDetails(ticket)}>
                                    <td className="px-6 py-4 align-top">
                                        <p className="font-mono font-bold text-slate-800 dark:text-white">{ticket.id}</p>
                                        <p className="text-xs">{ticket.createdAt.toLocaleString('vi-VN')}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top font-mono font-semibold text-slate-700 dark:text-slate-300">
                                        {ticket.orderId}
                                    </td>
                                    <td className="px-6 py-4 align-top max-w-sm">
                                        <p className="whitespace-pre-wrap truncate">{ticket.issue}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <span className={getStatusPill(ticket.status)}>{ticket.status}</span>
                                    </td>
                                    <td className="px-6 py-4 align-top text-center">
                                         <button className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                            Xem & Trả lời
                                         </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {sortedTickets.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>Chưa có phiếu hỗ trợ nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportTicketList;