
import React from 'react';
import type { Settings } from '../types';
import { InformationCircleIcon, ExclamationTriangleIcon, CloseIcon } from './Icons';

interface AnnouncementModalProps {
    settings: Settings;
    onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ settings, onClose }) => {
    const { announcement } = settings;
    if (!announcement) return null;

    const isWarning = announcement.type === 'warning';
    const Icon = isWarning ? ExclamationTriangleIcon : InformationCircleIcon;
    const iconColor = isWarning ? 'text-yellow-500' : 'text-blue-500';

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <Icon className={`w-12 h-12 ${iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thông Báo</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        {announcement.message}
                    </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
