
import React from 'react';

const ProductInfoSkeleton: React.FC = () => (
    <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-md flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
        </div>
    </div>
);

export default ProductInfoSkeleton;
