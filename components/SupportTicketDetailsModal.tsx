

import React, { useState, useRef, useEffect } from 'react';
import type { SupportTicket, User } from '../types';
import { CloseIcon, PaperAirplaneIcon, UserCircleIcon, ExternalLinkIcon } from './Icons';
import { Loader } from './Loader';

interface SupportTicketDetailsModalProps {
    user: User;
    ticket: SupportTicket;
    onClose: () => void;
    onReply: (ticketId: string, content: string, author: 'user' | 'admin') => void;
}

const SupportTicketDetailsModal: React.FC<SupportTicketDetailsModalProps> = ({ user, ticket, onClose, onReply }) => {
    const [replyContent, setReplyContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket.messages]);

    const handleReply = () => {
        if (!replyContent.trim() || isSending) return;
        setIsSending(true);
        setTimeout(() => {
            onReply(ticket.id, replyContent, user.role);
            setReplyContent('');
            setIsSending(false);
        }, 500);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-start p-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Hỗ trợ cho Đơn hàng</h2>
                        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{ticket.orderId || 'Không có'}</p>
                        {ticket.contactLink && (
                            <a href={ticket.contactLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                                <ExternalLinkIcon className="w-3 h-3" />
                                <span>Link liên hệ</span>
                            </a>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <CloseIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {ticket.messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.author === user.role ? 'justify-end' : ''}`}>
                            {message.author !== user.role && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    <UserCircleIcon className="w-6 h-6 text-slate-500" />
                                </div>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${message.author === user.role ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className={`text-xs mt-1 opacity-70 ${message.author === user.role ? 'text-right' : 'text-left'}`}>
                                    {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                                </p>
                            </div>
                             {message.author === user.role && (
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                 <div className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                    <div className="relative">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            placeholder="Nhập tin nhắn..."
                            className="w-full pl-4 pr-12 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleReply();
                                }
                            }}
                        />
                        <button 
                            onClick={handleReply}
                            disabled={isSending || !replyContent.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
                        >
                            {isSending ? <Loader /> : <PaperAirplaneIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketDetailsModal;