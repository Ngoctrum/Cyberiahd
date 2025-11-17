


import React, { useMemo } from 'react';
import type { OrderEditRequest, OrderShippingInfo } from '../../types';
import { CheckIcon, XCircleIcon, ClockIcon } from '../../components/Icons';

interface EditRequestListProps {
    requests: OrderEditRequest[];
    onApprove: (requestId: string) => void;
    onReject: (request: OrderEditRequest) => void;
}

const DataField: React.FC<{ label: string, value: string, changed?: boolean }> = ({ label, value, changed }) => (
    <div>
        <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
        <dd className={`mt-1 text-sm text-zinc-800 dark:text-zinc-200 ${changed ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}`}>{value || 'N/A'}</dd>
    </div>
);

const RequestCard: React.FC<{ request: OrderEditRequest, onApprove: () => void, onReject: () => void }> = ({ request, onApprove, onReject }) => {
    
    const changedFields = useMemo(() => {
        const changes = new Set<keyof OrderShippingInfo>();
        if (request.oldData && request.newData) {
            for (const key in request.newData) {
                const typedKey = key as keyof OrderShippingInfo;
                if (request.oldData[typedKey] !== request.newData[typedKey]) {
                    changes.add(typedKey);
                }
            }
        }
        return changes;
    }, [request.oldData, request.newData]);

    // Render a "diff" view only if oldData and newData are present (user has submitted changes)
    const renderDiffView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <div className="space-y-3">
                <h4 className="font-semibold text-sm text-zinc-600 dark:text-zinc-300">Thông tin Cũ</h4>
                <dl className="space-y-2">
                    <DataField label="Tên" value={request.oldData!.customerName} />
                    <DataField label="Liên hệ" value={request.oldData!.contact} />
                    <DataField label="Email" value={request.oldData!.email} />
                    <DataField label="Địa chỉ" value={request.oldData!.address} />
                    <DataField label="Ghi chú" value={request.oldData!.notes} />
                </dl>
            </div>
            <div className="space-y-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-sm text-indigo-700 dark:text-indigo-300">Thông tin Mới</h4>
                 <dl className="space-y-2">
                    <DataField label="Tên" value={request.newData!.customerName} changed={changedFields.has('customerName')} />
                    <DataField label="Liên hệ" value={request.newData!.contact} changed={changedFields.has('contact')} />
                    <DataField label="Email" value={request.newData!.email} changed={changedFields.has('email')} />
                    <DataField label="Địa chỉ" value={request.newData!.address} changed={changedFields.has('address')} />
                    <DataField label="Ghi chú" value={request.newData!.notes} changed={changedFields.has('notes')} />
                </dl>
            </div>
        </div>
    );
    
    // Render a simpler view for link-based requests before the user has submitted data
    const renderLinkPendingView = () => (
         <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>Đang chờ người dùng điền thông tin từ link đã tạo.</p>
            <p className="text-xs">Link hết hạn lúc: {request.expiresAt?.toLocaleString('vi-VN')}</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-800/80 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700/50 space-y-3 transition-all hover:shadow-lg hover:border-indigo-500/50">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-mono font-bold text-zinc-800 dark:text-white text-sm">Đơn hàng: {request.orderId}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Yêu cầu lúc: {new Date(request.createdAt).toLocaleString('vi-VN')}</p>
                </div>
            </div>
            
            {request.oldData && request.newData ? renderDiffView() : renderLinkPendingView()}

            {request.status === 'pending' && request.newData && (
                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <button onClick={onReject} className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 rounded-md">Từ chối</button>
                    <button onClick={onApprove} className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900 rounded-md">Duyệt</button>
                </div>
            )}
        </div>
    );
};

const EditRequestList: React.FC<EditRequestListProps> = ({ requests, onApprove, onReject }) => {
    
    const pendingRequests = useMemo(() => {
        return [...requests]
            .filter(r => r.status === 'pending')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [requests]);

    const processedRequests = useMemo(() => {
         return [...requests]
            .filter(r => r.status !== 'pending')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 20); // Show last 20 processed requests
    }, [requests]);


    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Duyệt Yêu cầu Chỉnh sửa</h1>
                <p className="text-md text-zinc-500 dark:text-zinc-400 mt-1">Quản lý các yêu cầu thay đổi thông tin đơn hàng từ khách hàng.</p>
            </header>

            <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Chờ duyệt ({pendingRequests.length})</h2>
                    </div>
                    <div className="space-y-4">
                        {pendingRequests.length > 0 ? pendingRequests.map(req => (
                            <RequestCard key={req.id} request={req} onApprove={() => onApprove(req.id)} onReject={() => onReject(req)} />
                        )) : <div className="p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center text-sm text-zinc-500">Không có yêu cầu nào đang chờ duyệt.</div>}
                    </div>
                </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                         <CheckIcon className="w-6 h-6 text-zinc-500" />
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Đã xử lý gần đây</h2>
                    </div>
                     <div className="space-y-4 opacity-80">
                         {processedRequests.length > 0 ? processedRequests
                            .filter(req => req.status !== 'pending')
                            .map(req => (
                                <div key={req.id} className={`p-4 rounded-lg border ${req.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">ĐH: {req.orderId}</p>
                                            <p className="text-xs text-zinc-500">Ngày: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                        <span className={`text-xs font-bold uppercase ${req.status === 'approved' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {req.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                                        </span>
                                    </div>
                                    {req.status === 'rejected' && req.rejectionReason && (
                                        <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                                            <p className="text-xs text-red-700 dark:text-red-300"><strong>Lý do:</strong> {req.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>
                        )) : <div className="p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-center text-sm text-zinc-500">Chưa có yêu cầu nào được xử lý.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRequestList;