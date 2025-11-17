
import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { SupportTicket } from '../../types';
import { ExternalLinkIcon, DotsVerticalIcon } from '../../components/Icons';

interface SupportTicketListProps {
    tickets: SupportTicket[];
    onUpdateStatus: (ticketId: string, status: SupportTicket['status']) => void;
}

const getStatusPill = (status: SupportTicket['status']) => {
    const baseClasses = "text-xs font-semibold px-2.5 py-1 rounded-full inline-block tracking-wide";
    if (status === 'Đang xử lý') {
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`;
    }
    return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300`;
};

const ActionMenu: React.FC<{ ticket: SupportTicket, onUpdateStatus: () => void }> = ({ ticket, onUpdateStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const actionText = ticket.status === 'Đang xử lý' ? 'Đánh dấu Đã xử lý' : 'Mở lại phiếu';
    const actionClass = ticket.status === 'Đang xử lý'
        ? 'text-green-600 dark:text-green-400'
        : 'text-yellow-600 dark:text-yellow-400';

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-10">
                    <button onClick={() => { onUpdateStatus(); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${actionClass} hover:bg-slate-100 dark:hover:bg-slate-700`}>{actionText}</button>
                </div>
            )}
        </div>
    );
};


const SupportTicketList: React.FC<SupportTicketListProps> = ({ tickets, onUpdateStatus }) => {

    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            if (a.status === 'Đang xử lý' && b.status === 'Đã xử lý') return -1;
            if (a.status === 'Đã xử lý' && b.status === 'Đang xử lý') return 1;
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
                                <th scope="col" className="px-6 py-4">Vấn đề & Liên hệ</th>
                                <th scope="col" className="px-6 py-4">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {sortedTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                                    <td className="px-6 py-4 align-top">
                                        <p className="font-mono font-bold text-slate-800 dark:text-white">{ticket.id}</p>
                                        <p className="text-xs">{ticket.createdAt.toLocaleString('vi-VN')}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top font-mono font-semibold text-slate-700 dark:text-slate-300">
                                        {ticket.orderId}
                                    </td>
                                    <td className="px-6 py-4 align-top max-w-sm">
                                        <p className="whitespace-pre-wrap">{ticket.issue}</p>
                                        <a 
                                            href={ticket.contactLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Link liên hệ <ExternalLinkIcon className="w-3 h-3" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <span className={getStatusPill(ticket.status)}>{ticket.status}</span>
                                    </td>
                                    <td className="px-6 py-4 align-top text-center">
                                         <ActionMenu 
                                            ticket={ticket} 
                                            onUpdateStatus={() => onUpdateStatus(ticket.id, ticket.status === 'Đang xử lý' ? 'Đã xử lý' : 'Đang xử lý')} 
                                         />
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
