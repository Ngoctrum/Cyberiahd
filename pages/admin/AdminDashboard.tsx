
import React, { useState, useMemo } from 'react';
import type { Order, Voucher, User, Settings, SupportTicket, OrderEditRequest, Toast } from '../../types';
import { ClipboardListIcon, DocumentTextIcon, TagIcon, CogIcon, MenuIcon, HomeIcon, ShoppingCartIcon, LogoutIcon, ExternalLinkIcon, UserGroupIcon, ChatAlt2Icon, PencilAltIcon } from '../../components/Icons';

import AdminHome from './AdminHome';
import OrderList from './OrderList';
import VoucherManagement from './VoucherManagement';
import OrderHistory from './OrderHistory';
import AdminSettings from './AdminSettings';
import UserManagement from './UserManagement';
import SupportTicketList from './SupportTicketList';
import EditRequestList from './EditRequestList';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import BanUserModal from '../../components/BanUserModal';
import CreateEditLinkModal from '../../components/CreateEditLinkModal';
import CancelOrderModal from '../../components/CancelOrderModal';
import RejectReasonModal from '../../components/RejectReasonModal';
import SupportTicketDetailsModal from '../../components/SupportTicketDetailsModal';


type AdminView = 'home' | 'orders' | 'history' | 'vouchers' | 'users' | 'settings' | 'support' | 'edit-requests';
type Page = 'home' | 'order' | 'admin' | 'login' | 'register' | 'my-orders' | 'support' | 'edit-order';

interface AdminDashboardProps {
    user: User;
    users: User[];
    onLogout: () => void;
    onNavigate: (page: Page) => void;
    orders: Order[];
    onUpdateOrderDetails: (updatedOrder: Order, cancellationReason?: string) => void;
    vouchers: Voucher[];
    onCreateVoucher: (voucherData: Omit<Voucher, 'id'>) => void;
    onDeleteVoucher: (voucherId: string) => void;
    settings: Settings;
    onUpdateSettings: (newSettings: Partial<Settings>) => void;
    onResetOrders: () => void;
    onBanUser: (userId: string, reason: string, details?: string) => void;
    onUnbanUser: (userId: string) => void;
    onUpdateUserRole: (userId: string, newRole: 'user' | 'admin') => void;
    supportTickets: SupportTicket[];
    onUpdateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
    onSupportTicketReply: (ticketId: string, content: string, author: 'user' | 'admin') => void;
    orderEditRequests: OrderEditRequest[];
    onCreateEditRequestLink: (orderId: string) => string;
    onApproveEditRequest: (requestId: string) => void;
    onRejectEditRequest: (requestId: string, reason: string) => void;
    addToast: (message: string, type: Toast['type']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<AdminView>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [requestToReject, setRequestToReject] = useState<OrderEditRequest | null>(null);
    const [userToBan, setUserToBan] = useState<User | null>(null);
    const [orderToCreateLinkFor, setOrderToCreateLinkFor] = useState<Order | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    
    const pendingSupportTickets = useMemo(() => props.supportTickets.filter(t => t.status === 'Đang xử lý' || t.status === 'Đã trả lời').length, [props.supportTickets]);
    const pendingEditRequests = useMemo(() => props.orderEditRequests.filter(r => r.status === 'pending').length, [props.orderEditRequests]);

    const menuItems = [
        { id: 'home', label: 'Tổng quan', icon: <HomeIcon className="w-5 h-5" /> },
        { id: 'orders', label: 'Danh sách Đơn hàng', icon: <ClipboardListIcon className="w-5 h-5" /> },
        { id: 'edit-requests', label: 'Yêu cầu Chỉnh sửa', icon: <PencilAltIcon className="w-5 h-5" />, badge: pendingEditRequests },
        { id: 'users', label: 'Quản lý Người dùng', icon: <UserGroupIcon className="w-5 h-5" /> },
        { id: 'support', label: 'Phiếu Hỗ trợ', icon: <ChatAlt2Icon className="w-5 h-5" />, badge: pendingSupportTickets },
        { id: 'history', label: 'Lịch sử Đơn hàng', icon: <DocumentTextIcon className="w-5 h-5" /> },
        { id: 'vouchers', label: 'Quản lý Voucher', icon: <TagIcon className="w-5 h-5" /> },
        { id: 'settings', label: 'Cài đặt', icon: <CogIcon className="w-5 h-5" /> },
    ];
    
    const handleConfirmBan = (reason: string, details?: string) => {
        if (userToBan) {
            props.onBanUser(userToBan.id, reason, details);
            props.addToast(`Đã cấm người dùng ${userToBan.username}.`, 'success');
            setUserToBan(null);
        }
    };

    const handleConfirmCancelOrder = (reason: string) => {
        if (orderToCancel) {
            props.onUpdateOrderDetails({ ...orderToCancel, status: 'Đã hủy' }, reason);
            setOrderToCancel(null);
        }
    };

    const handleConfirmRejectRequest = (reason: string) => {
        if (requestToReject) {
            props.onRejectEditRequest(requestToReject.id, reason);
            setRequestToReject(null);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'home':
                return <AdminHome user={props.user} orders={props.orders} vouchers={props.vouchers}/>;
            case 'orders':
                return <OrderList orders={props.orders} onViewDetails={setSelectedOrder} onCreateEditLink={setOrderToCreateLinkFor} />;
            case 'edit-requests':
                return <EditRequestList requests={props.orderEditRequests} onApprove={props.onApproveEditRequest} onReject={setRequestToReject} />;
            case 'users':
                return <UserManagement currentUser={props.user} users={props.users} onBanUser={setUserToBan} onUnbanUser={props.onUnbanUser} onUpdateUserRole={props.onUpdateUserRole}/>;
            case 'support':
                return <SupportTicketList tickets={props.supportTickets} onUpdateStatus={props.onUpdateTicketStatus} onViewDetails={setSelectedTicket} />;
            case 'vouchers':
                return <VoucherManagement vouchers={props.vouchers} onCreateVoucher={props.onCreateVoucher} onDeleteVoucher={props.onDeleteVoucher} orderLimit={props.settings.orderLimit} currentOrderCount={props.orders.length} onUpdateSettings={props.onUpdateSettings} onResetOrders={props.onResetOrders} />;
            case 'history':
                return <OrderHistory orders={props.orders} />;
            case 'settings':
                return <AdminSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} />;
            default:
                return <AdminHome user={props.user} orders={props.orders} vouchers={props.vouchers}/>;
        }
    };
    
    const SidebarContent = () => (
         <div className="flex flex-col justify-between h-full">
            <div>
                 <div className="flex items-center gap-2 p-4 border-b border-gray-700 h-16">
                    <ShoppingCartIcon className="w-8 h-8 text-indigo-400" />
                    <span className="text-xl font-bold text-white">Ani Shop</span>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id as AdminView); setIsSidebarOpen(false); }}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${ activeView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white' }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge > 0 && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center ring-2 ring-gray-800">{item.badge}</span>
                            )}
                        </button>
                    ))}
                    <hr className="border-gray-700 my-2" />
                     <button
                        onClick={() => props.onNavigate('home')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                    >
                        <ExternalLinkIcon className="w-5 h-5" />
                        <span>Thoát ra trang chủ</span>
                    </button>
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
                        {props.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{props.user.username}</p>
                        <p className="text-xs text-gray-400">{props.user.email}</p>
                    </div>
                    <button onClick={props.onLogout} className="ml-auto p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                        <LogoutIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
                {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
                
                <aside className={`fixed lg:relative lg:translate-x-0 top-0 left-0 h-full z-40 w-64 bg-gray-800 dark:bg-gray-950 border-r border-gray-700 dark:border-gray-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </aside>

                <div className="flex-1 flex flex-col w-full min-w-0">
                    <header className="flex items-center justify-between h-16 px-4 sm:px-8 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm lg:bg-transparent lg:dark:bg-transparent">
                        <button className="lg:hidden text-gray-600 dark:text-gray-300" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <MenuIcon className="w-6 h-6"/>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 lg:hidden">
                            {menuItems.find(i => i.id === activeView)?.label}
                        </h1>
                        <div className="w-10 h-10"></div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={props.onUpdateOrderDetails} onCancelOrder={setOrderToCancel} vouchers={props.vouchers} />}
            {userToBan && <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} onConfirmBan={handleConfirmBan} />}
            {orderToCreateLinkFor && <CreateEditLinkModal order={orderToCreateLinkFor} onClose={() => setOrderToCreateLinkFor(null)} onCreateLink={props.onCreateEditRequestLink} />}
            {orderToCancel && <CancelOrderModal order={orderToCancel} onClose={() => setOrderToCancel(null)} onConfirm={handleConfirmCancelOrder} />}
            {requestToReject && <RejectReasonModal request={requestToReject} onClose={() => setRequestToReject(null)} onConfirm={handleConfirmRejectRequest} />}
            {selectedTicket && <SupportTicketDetailsModal user={props.user} ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onReply={props.onSupportTicketReply} />}
        </>
    );
};

export default AdminDashboard;
