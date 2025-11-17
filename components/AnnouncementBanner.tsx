
import React from 'react';
import type { Settings, User } from '../types';
import { InformationCircleIcon, ExclamationTriangleIcon, CloseIcon } from './Icons';

interface AnnouncementBannerProps {
    settings: Settings;
    onUpdateSettings: (newSettings: Partial<Settings>) => void;
    user: User | null;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ settings, onUpdateSettings, user }) => {
    const { announcement } = settings;
    if (!announcement || !announcement.enabled) return null;

    const isWarning = announcement.type === 'warning';
    const bgColor = isWarning ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-blue-50 dark:bg-blue-900/30';
    const textColor = isWarning ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-800 dark:text-blue-200';
    const iconColor = isWarning ? 'text-yellow-500' : 'text-blue-500';
    const Icon = isWarning ? ExclamationTriangleIcon : InformationCircleIcon;

    const handleClose = () => {
        onUpdateSettings({ 
            announcement: { ...announcement, enabled: false } 
        });
    };

    return (
        <div className={`relative ${bgColor} ${textColor} transition-colors duration-300`}>
            <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-3">
                    <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
                    <p className="text-sm font-medium text-center flex-1">{announcement.message}</p>
                    {user?.role === 'admin' && (
                        <button 
                            onClick={handleClose} 
                            className="p-1.5 rounded-full hover:bg-black/10"
                            aria-label="Đóng thông báo"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
