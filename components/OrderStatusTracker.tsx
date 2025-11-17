
import React from 'react';
import type { Order } from '../types';
import { ArchiveBoxIcon, ShoppingCartIcon, TruckIcon, HomeIcon, XCircleIcon, CheckIcon } from './Icons';

interface OrderStatusTrackerProps {
    status: Order['status'];
}

const STEPS = [
    { name: 'Chờ duyệt', icon: <ArchiveBoxIcon className="w-6 h-6" /> },
    { name: 'Đã đặt', icon: <ShoppingCartIcon className="w-6 h-6" /> },
    { name: 'Chờ người bán chuẩn bị', icon: <ArchiveBoxIcon className="w-6 h-6" /> },
    { name: 'Đã giao cho ĐVVC', icon: <TruckIcon className="w-6 h-6" /> },
    { name: 'Giao thành công', icon: <HomeIcon className="w-6 h-6" /> },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
    const currentStepIndex = STEPS.findIndex(step => step.name === status);

    if (status === 'Đã hủy') {
        return (
            <div className="flex items-center justify-center p-4 my-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <XCircleIcon className="w-8 h-8 text-red-500 mr-3" />
                <div>
                    <p className="font-bold text-red-800 dark:text-red-200">Đơn hàng đã bị hủy</p>
                    <p className="text-sm text-red-600 dark:text-red-300">Vui lòng liên hệ để biết thêm chi tiết.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full my-8">
            <div className="flex items-center">
                {STEPS.map((step, index) => {
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = currentStepIndex === index;

                    return (
                        <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isCompleted ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}>
                                    {isCompleted && !isCurrent ? <CheckIcon className="w-6 h-6" /> : step.icon}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold transition-colors duration-500 ${
                                    isCompleted ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {step.name}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="flex-auto border-t-2 transition-all duration-500 mx-2 -mt-8" style={{
                                    borderColor: isCompleted ? 'rgb(79 70 229)' : 'rgb(226 232 240)',
                                    // For dark mode border color
                                    ... (document.documentElement.classList.contains('dark') && { borderColor: isCompleted ? 'rgb(79 70 229)' : 'rgb(51 65 85)' })
                                }}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;
