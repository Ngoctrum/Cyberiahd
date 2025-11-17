
import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '../types';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, CloseIcon } from './Icons';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500" />,
  info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4700);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };
  
  const animationClass = isExiting ? 'animate-fade-out' : 'animate-slide-in-up';

  return (
    <div
      className={`relative flex items-start w-full max-w-sm p-4 my-2 overflow-hidden bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${animationClass}`}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="flex-shrink-0">{ICONS[toast.type]}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="ml-4 flex-shrink-0 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
       <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: scale(0.9); } }
        .animate-slide-in-up { animation: slideInUp 0.3s ease-out; }
        .animate-fade-out { animation: fadeOut 0.3s ease-in; }
      `}</style>
    </div>
  );
};

export default Toast;
