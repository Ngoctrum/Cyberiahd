

import React, { useState } from 'react';
import type { SupportTicket, User } from '../types';
import { QuestionMarkCircleIcon, HashtagIcon, ChatAlt2Icon, LinkIcon, CheckCircleIcon, PaperAirplaneIcon } from '../components/Icons';
import { Loader } from '../components/Loader';


interface SupportPageProps {
    onCreateTicket: (ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => boolean;
    user: User | null;
    isSubmitting: boolean;
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onCreateTicket, user, isSubmitting, addToast }) => {
    const [orderId, setOrderId] = useState('');
    const [issue, setIssue] = useState('');
    const [contactLink, setContactLink] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!orderId || !issue || !contactLink) {
            addToast('Vui lòng điền đầy đủ thông tin.', 'error');
            return;
        }
        const success = onCreateTicket({ orderId, issue, contactLink });
        if (success) {
            // The loading state will be handled for 1 sec, then this will be true
            setTimeout(() => setSubmitted(true), 1100);
        }
    };

    if (submitted) {
        return (
            <div className="w-full max-w-2xl mx-auto text-center animate-fade-in p-8 bg-white dark:bg-slate-800/50 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                    Yêu cầu đã được ghi nhận!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    Bộ phận CSKH sẽ liên hệ với bạn trong vòng 24h.
                    <br />
                    Vui lòng chú ý điện thoại hoặc tin nhắn.
                </p>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
             <header className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
                    <QuestionMarkCircleIcon className="w-8 h-8 text-indigo-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                    Gửi Phiếu Hỗ trợ
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    Mô tả vấn đề bạn đang gặp phải, chúng tôi sẽ hỗ trợ bạn sớm nhất có thể.
                </p>
            </header>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-slate-800/50 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg">
                 <div>
                    <label htmlFor="orderId" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <HashtagIcon className="w-5 h-5 text-slate-400"/>
                        <span>Mã đơn hàng</span>
                    </label>
                    <input 
                        type="text" 
                        name="orderId" 
                        id="orderId" 
                        required 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="VD: ANI123XYZ" 
                    />
                </div>
                
                 <div>
                    <label htmlFor="issue" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <ChatAlt2Icon className="w-5 h-5 text-slate-400"/>
                        <span>Vấn đề gặp phải</span>
                    </label>
                    <textarea 
                        name="issue" 
                        id="issue" 
                        required 
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        rows={5} 
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="contactLink" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <LinkIcon className="w-5 h-5 text-slate-400"/>
                        <span>Link Facebook hoặc Zalo để liên hệ</span>
                    </label>
                    <input 
                        type="text" 
                        name="contactLink" 
                        id="contactLink" 
                        required 
                        value={contactLink}
                        onChange={(e) => setContactLink(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="https://www.facebook.com/yourprofile" 
                    />
                </div>

                <div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader /> : <><PaperAirplaneIcon className="w-5 h-5" /> Gửi Yêu cầu</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default SupportPage;
