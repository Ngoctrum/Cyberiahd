
import React, { useState, useEffect } from 'react';
import type { Settings } from '../../types';
import { CogIcon, WrenchScrewdriverIcon, MailIcon, ShoppingCartIcon, CurrencyDollarIcon, InformationCircleIcon } from '../../components/Icons';

interface AdminSettingsProps {
    settings: Settings;
    onUpdateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingCard: React.FC<{title: string, description: string, icon: React.ReactNode, children: React.ReactNode}> = ({ title, description, icon, children }) => (
    <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
             <div className="flex items-start gap-4">
                {icon}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
             </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40">
            {children}
        </div>
    </div>
);

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);
    
    const handleShopInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            shopInfo: {
                ...prev.shopInfo,
                [name]: value,
            }
        }));
    };

    const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            bankInfo: {
                ...prev.bankInfo,
                [name]: value,
            }
        }));
    };
    
    const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            smtp: {
                ...prev.smtp,
                [name]: value,
            }
        }));
    };
    
    const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            announcement: {
                ...prev.announcement,
                [name]: value,
            }
        }));
    };

    const handleSave = (key: keyof Settings, data: any) => {
        onUpdateSettings({ [key]: data });
        alert('Cài đặt đã được lưu!');
    };


    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cài đặt</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Quản lý các cài đặt và cấu hình cho toàn bộ website.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                     <SettingCard 
                        title="Bảo trì Website" 
                        description="Bật chế độ bảo trì để tạm ngưng dịch vụ và hiển thị thông báo."
                        icon={<WrenchScrewdriverIcon className="w-8 h-8 text-red-500 flex-shrink-0" />}
                    >
                         <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                {localSettings.isMaintenanceMode ? 'Website đang bảo trì' : 'Website đang hoạt động'}
                            </p>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={localSettings.isMaintenanceMode}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setLocalSettings(prev => ({ ...prev, isMaintenanceMode: isChecked }));
                                        onUpdateSettings({ isMaintenanceMode: isChecked });
                                    }}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-500 peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </SettingCard>

                    <SettingCard
                        title="Thông báo Toàn trang"
                        description="Hiển thị một banner thông báo ở đầu trang cho tất cả người dùng."
                        icon={<InformationCircleIcon className="w-8 h-8 text-cyan-500 flex-shrink-0" />}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-slate-700 dark:text-slate-300">
                                    {localSettings.announcement.enabled ? 'Đang hiển thị thông báo' : 'Thông báo đã tắt'}
                                </p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={localSettings.announcement.enabled}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setLocalSettings(prev => ({ ...prev, announcement: {...prev.announcement, enabled: isChecked} }));
                                        }}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-500 peer-checked:bg-cyan-600"></div>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nội dung thông báo</label>
                                <textarea name="message" value={localSettings.announcement.message} onChange={handleAnnouncementChange} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại thông báo</label>
                                <select name="type" value={localSettings.announcement.type} onChange={handleAnnouncementChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition">
                                    <option value="info">Tin tức (Xanh)</option>
                                    <option value="warning">Cảnh báo (Vàng)</option>
                                </select>
                            </div>
                            <button onClick={() => handleSave('announcement', localSettings.announcement)} className="w-full bg-cyan-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-cyan-700 transition-colors">Lưu Thông báo</button>
                        </div>
                    </SettingCard>
                    
                    <SettingCard
                        title="Thông tin Shop"
                        description="Cập nhật thông tin liên hệ sẽ được hiển thị trên trang web."
                        icon={<ShoppingCartIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />}
                    >
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="zalo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zalo</label>
                                <input type="text" name="zalo" id="zalo" value={localSettings.shopInfo.zalo} onChange={handleShopInfoChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input type="email" name="email" id="email" value={localSettings.shopInfo.email} onChange={handleShopInfoChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                            </div>
                            <button onClick={() => handleSave('shopInfo', localSettings.shopInfo)} className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Lưu Thông tin Shop</button>
                        </div>
                    </SettingCard>
                </div>

                <div className="space-y-6">
                    <SettingCard
                        title="Thông tin Thanh toán"
                        description="Cấu hình tài khoản ngân hàng để nhận thanh toán phí dịch vụ qua QR Code."
                        icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500 flex-shrink-0" />}
                    >
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ngân hàng</label>
                                <input type="text" name="bankName" value={localSettings.bankInfo.bankName} onChange={handleBankInfoChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="MB Bank" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số tài khoản</label>
                                <input type="text" name="accountNumber" value={localSettings.bankInfo.accountNumber} onChange={handleBankInfoChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="0123456789" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên chủ tài khoản</label>
                                <input type="text" name="accountName" value={localSettings.bankInfo.accountName} onChange={handleBankInfoChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="NGUYEN VAN A" />
                            </div>
                            <button onClick={() => handleSave('bankInfo', localSettings.bankInfo)} className="w-full bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors">Lưu Thông tin Ngân hàng</button>
                        </div>
                    </SettingCard>
                    
                    <SettingCard
                        title="Cấu hình Email (SMTP)"
                        description="Thiết lập để gửi email tự động. (Lưu ý: Chức năng gửi mail vẫn đang được mô phỏng)."
                        icon={<MailIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />}
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Host</label>
                                    <input type="text" name="host" value={localSettings.smtp.host} onChange={handleSmtpChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="smtp.example.com" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Port</label>
                                    <input type="text" name="port" value={localSettings.smtp.port} onChange={handleSmtpChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="587" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                                <input type="text" name="user" value={localSettings.smtp.user} onChange={handleSmtpChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="user@example.com" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input type="password" name="pass" value={localSettings.smtp.pass} onChange={handleSmtpChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="••••••••" />
                            </div>
                             <button onClick={() => handleSave('smtp', localSettings.smtp)} className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors">Lưu Cấu hình SMTP</button>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;