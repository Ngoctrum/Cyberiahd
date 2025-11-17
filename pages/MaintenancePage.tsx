
import React from 'react';
import { WrenchScrewdriverIcon } from '../components/Icons';

const MaintenancePage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-gray-950 text-center p-4">
            <div className="max-w-md">
                <WrenchScrewdriverIcon className="w-24 h-24 mx-auto text-indigo-400 dark:text-indigo-500" />
                <h1 className="mt-8 text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                    Website đang bảo trì
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Chúng tôi đang thực hiện một số nâng cấp để mang lại trải nghiệm tốt hơn. 
                    Dịch vụ sẽ sớm trở lại. Xin cảm ơn!
                </p>
                <p className="mt-12 text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Ani Shop
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
