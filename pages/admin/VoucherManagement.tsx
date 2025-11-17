
import React, { useState } from 'react';
import type { Voucher, Settings } from '../../types';
import { TagIcon, PlusCircleIcon, TrashIcon, CogIcon, CurrencyDollarIcon } from '../../components/Icons';

interface VoucherManagementProps {
    vouchers: Voucher[];
    onCreateVoucher: (voucherData: Omit<Voucher, 'id'>) => void;
    onDeleteVoucher: (voucherId: string) => void;
    orderLimit: number;
    currentOrderCount: number;
    onUpdateSettings: (newSettings: Partial<Settings>) => void;
    onResetOrders: () => void;
}

const VoucherManagement: React.FC<VoucherManagementProps> = (props) => {
    const { vouchers, onCreateVoucher, onDeleteVoucher, orderLimit, currentOrderCount, onUpdateSettings, onResetOrders } = props;
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');
    const [limitInput, setLimitInput] = useState(orderLimit);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim() || !description.trim()) {
            setError('Mã và mô tả không được để trống.');
            return;
        }
        onCreateVoucher({ code, description, price: Number(price) });
        setCode('');
        setDescription('');
        setPrice(0);
        setError('');
    };
    
    const handleLimitChange = () => {
        onUpdateSettings({ orderLimit: Number(limitInput) });
        alert('Cập nhật giới hạn đơn hàng thành công!');
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý Voucher & Dịch vụ</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">Thêm, xóa voucher và cài đặt giới hạn cho dịch vụ.</p>
            </header>
            
            <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200"><CogIcon className="w-6 h-6 text-slate-400"/> Giới hạn Dịch vụ</h3>
                 <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
                     <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Trạng thái hiện tại:</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{currentOrderCount} / {orderLimit} <span className="text-base font-normal">đơn hàng</span></p>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(currentOrderCount / orderLimit) * 100}%` }}></div>
                        </div>
                    </div>
                     <div className="flex flex-col sm:flex-row items-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="orderLimit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số lượng đơn tối đa</label>
                            <input 
                                type="number" 
                                id="orderLimit"
                                value={limitInput}
                                onChange={e => setLimitInput(Number(e.target.value))}
                                className="w-full sm:w-40 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                         <button onClick={handleLimitChange} className="w-full sm:w-auto bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">Cập nhật</button>
                         <button onClick={onResetOrders} className="w-full sm:w-auto bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Reset Số lượng</button>
                     </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Voucher Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200"><PlusCircleIcon className="w-6 h-6 text-indigo-500" /> Thêm Voucher Mới</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Voucher</label>
                                <input 
                                    type="text" 
                                    id="code"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="VC80/0"
                                />
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mô tả</label>
                                <input 
                                    type="text" 
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="Voucher 80/0"
                                />
                            </div>
                             <div>
                                <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phí dịch vụ (VNĐ)</label>
                                <div className="relative">
                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CurrencyDollarIcon className="w-5 h-5 text-slate-400"/>
                                    </div>
                                    <input 
                                        type="number" 
                                        id="price"
                                        value={price}
                                        onChange={e => setPrice(Number(e.target.value))}
                                        className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="30000"
                                    />
                                </div>
                                 <p className="text-xs text-slate-500 mt-1">Nhập 0 nếu là voucher miễn phí.</p>
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                Thêm Voucher
                            </button>
                        </form>
                    </div>
                </div>

                {/* Voucher List */}
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-slate-800/80 shadow-lg border border-slate-200 dark:border-slate-700/50 rounded-xl">
                        <h3 className="text-lg font-bold p-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><TagIcon className="w-6 h-6 text-slate-400"/> Danh sách Voucher</h3>
                         <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {vouchers.length > 0 ? vouchers.map(voucher => (
                                <div key={voucher.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div>
                                        <p className="font-mono font-bold text-slate-800 dark:text-white">{voucher.code}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{voucher.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            {voucher.price ? `${voucher.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                        </p>
                                        <button onClick={() => onDeleteVoucher(voucher.id)} className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="p-6 text-center text-slate-500">Chưa có voucher nào.</p>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoucherManagement;
