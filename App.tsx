

import React, { useState, useEffect } from 'react';
import type { User, Order, OrderFormData, Voucher, Settings, SupportTicket, Toast, OrderEditRequest, Theme, OrderShippingInfo } from './types';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ShoppingCartIcon } from './components/Icons';
import MaintenancePage from './pages/MaintenancePage';
import UserDashboard from './pages/UserDashboard';
import SupportPage from './pages/SupportPage';
import ToastContainer from './components/ToastContainer';
import AnnouncementModal from './components/AnnouncementModal';
import EditOrderPage from './pages/EditOrderPage';

type Page = 'home' | 'order' | 'admin' | 'login' | 'register' | 'my-orders' | 'support' | 'edit-order';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentRouteParams, setCurrentRouteParams] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 'user-001', username: 'admin', email: 'admin@anishop.site', password: '1', role: 'admin', status: 'active' },
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [orderEditRequests, setOrderEditRequests] = useState<OrderEditRequest[]>([]);
  
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [vouchers, setVouchers] = useState<Voucher[]>([
      { id: '1', code: 'VC80/0', description: 'Voucher 80/0', price: 30000 },
      { id: '2', code: 'giam10k', description: 'Giảm 10,000đ', price: 0 },
      { id: '3', code: 'freeship', description: 'Miễn phí vận chuyển', price: 0 },
  ]);
  const [settings, setSettings] = useState<Settings>({
      isMaintenanceMode: false, orderLimit: 50,
      shopInfo: { zalo: '0348747253', email: 'support@anishop.site' },
      smtp: { host: '', port: '', user: '', pass: '' },
      bankInfo: { bankName: 'MB Bank', accountNumber: '0348747253', accountName: 'NGUYEN VAN A' },
      announcement: { enabled: true, message: 'Chào mừng đến với Ani Shop! Chúng tôi hiện đang trong giai đoạn thử nghiệm.', type: 'info' }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isSubmittingSupportTicket, setIsSubmittingSupportTicket] = useState(false);

  // --- Core App Logic ---

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('aniShopState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        const reviveDates = (items: any[], key: string) => items.map(item => ({...item, [key]: new Date(item[key])}));

        if (parsed.users) setUsers(parsed.users);
        if (parsed.orders) setOrders(reviveDates(parsed.orders, 'createdAt'));
        if (parsed.supportTickets) setSupportTickets(reviveDates(parsed.supportTickets, 'createdAt'));
        if (parsed.orderEditRequests) {
            const revivedRequests = parsed.orderEditRequests.map((req: any) => ({
                ...req,
                createdAt: new Date(req.createdAt),
                expiresAt: req.expiresAt ? new Date(req.expiresAt) : undefined,
            }));
            setOrderEditRequests(revivedRequests);
        }
        if (parsed.vouchers) setVouchers(parsed.vouchers);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.user) setUser(parsed.user);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
     // Theme initialization
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', prefersDark);
    }

    // Announcement Modal Logic
    const hasSeenAnnouncement = sessionStorage.getItem('seenAnnouncement');
    if (!hasSeenAnnouncement && settings.announcement.enabled) {
        setAnnouncementModalOpen(true);
    }

    // Basic routing from URL
    const path = window.location.pathname;
    if (path.startsWith('/edit-order/')) {
        const token = path.split('/')[2];
        setCurrentPage('edit-order');
        setCurrentRouteParams({ token });
    }

  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = { users, orders, supportTickets, orderEditRequests, vouchers, settings, user };
      localStorage.setItem('aniShopState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [users, orders, supportTickets, orderEditRequests, vouchers, settings, user]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
  };

  const handleToggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const handleLogin = (credentials: { usernameOrEmail: string; password: string }) => {
    setLoginError(null);
    const foundUser = users.find(u => (u.username === credentials.usernameOrEmail || u.email === credentials.usernameOrEmail) && u.password === credentials.password);
    if (foundUser) {
      if (foundUser.status === 'banned') {
        const reason = `Tài khoản của bạn đã bị khóa. Lý do: ${foundUser.banReason || 'Không có lý do cụ thể'}.`;
        setLoginError(reason);
        addToast(reason, 'error');
        return;
      }
      setUser(foundUser);
      handleNavigate('home');
      addToast(`Chào mừng trở lại, ${foundUser.username}!`, 'success');
    } else {
      const errorMsg = 'Tên đăng nhập, email hoặc mật khẩu không chính xác.';
      setLoginError(errorMsg);
      addToast(errorMsg, 'error');
    }
  };

  const handleRegister = (newUser: Omit<User, 'role' | 'id' | 'status'>) => {
    if (users.some(u => u.username === newUser.username)) return { success: false, message: 'Tên đăng nhập đã tồn tại.' };
    if (users.some(u => u.email === newUser.email)) return { success: false, message: 'Email đã được sử dụng.' };
    const userToRegister: User = { ...newUser, id: `user-${Date.now()}`, role: 'user', status: 'active' };
    setUsers(p => [...p, userToRegister]);
    addToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
  };
  
  const handleLogout = () => { setUser(null); handleNavigate('home'); addToast('Bạn đã đăng xuất.', 'info'); };

  const handleNavigate = (page: Page) => {
    setLastOrderId(null); setLoginError(null);
    if ((page === 'order' || page === 'my-orders' || page === 'support') && !user) { setCurrentPage('login'); return; }
    if (page === 'admin' && user?.role !== 'admin') return;
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
  };
  
  const handleOrderSubmit = (formData: OrderFormData) => {
      if(orders.length >= settings.orderLimit) { addToast('Hệ thống đã đạt giới hạn đơn hàng.', 'error'); return; }
      if (user?.status === 'banned') { addToast('Tài khoản của bạn đã bị khóa.', 'error'); return; }
      
      setIsSubmittingOrder(true);
      setTimeout(() => {
        const appliedVoucher = vouchers.find(v => v.code === formData.voucher);
        const serviceFee = appliedVoucher?.price || 0;
        const newOrder: Order = {
            id: `ANI${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            ...formData, userId: user!.id, serviceFee, status: 'Chờ duyệt', paymentStatus: 'Chưa thanh toán',
            createdAt: new Date(), mvd: '',
        };
        setOrders(p => [...p, newOrder]);
        setLastOrderId(newOrder.id);
        handleNavigate('home');
        addToast('Tạo đơn hàng thành công!', 'success');
        setIsSubmittingOrder(false);
      }, 1000);
  };
  
  const handleUpdateOrderDetails = (updatedOrder: Order) => {
      const originalOrder = orders.find(o => o.id === updatedOrder.id);
      setOrders(p => p.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      if (originalOrder && originalOrder.status !== updatedOrder.status && updatedOrder.email) {
          addToast(`Trạng thái đơn hàng ${updatedOrder.id} đã cập nhật thành "${updatedOrder.status}".`, 'info');
      } else {
          addToast(`Đã cập nhật chi tiết đơn hàng ${updatedOrder.id}.`, 'success');
      }
  };

  const handleUserConfirmPayment = (orderId: string) => {
    setOrders(p => p.map(o => o.id === orderId ? { ...o, paymentStatus: 'Chờ duyệt thanh toán' } : o));
    addToast('Đã gửi yêu cầu xác nhận thanh toán.', 'info');
    setLastOrderId(orderId);
  };
  
  const handleCreateVoucher = (voucherData: Omit<Voucher, 'id'>) => {
      setVouchers(p => [...p, { id: `V${Date.now()}`, ...voucherData }]);
      addToast('Tạo voucher thành công!', 'success');
  };
  
  const handleDeleteVoucher = (voucherId: string) => {
      setVouchers(p => p.filter(v => v.id !== voucherId));
      addToast('Đã xóa voucher.', 'info');
  };

  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Cài đặt đã được cập nhật.', 'success');
  };

  const handleResetOrders = () => {
    if(window.confirm('Bạn có chắc chắn muốn xóa tất cả đơn hàng và reset lại số lượng không?')) { setOrders([]); addToast('Đã reset toàn bộ đơn hàng.', 'info'); }
  };

  const handleBanUser = (userId: string, reason: string, details?: string) => {
    setUsers(p => p.map(u => u.id === userId ? { ...u, status: 'banned', banReason: reason, banReasonDetails: details } : u));
    addToast('Đã cấm người dùng.', 'success');
  };
    
  const handleUnbanUser = (userId: string) => {
      setUsers(p => p.map(u => u.id === userId ? { ...u, status: 'active', banReason: undefined, banReasonDetails: undefined } : u));
      addToast('Đã bỏ cấm người dùng.', 'success');
  };

  const handleUpdateUserRole = (userId: string, newRole: 'user' | 'admin') => {
    if (user?.id === userId) { addToast("Bạn không thể thay đổi vai trò của chính mình.", 'error'); return; }
    setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u));
    addToast('Đã cập nhật vai trò người dùng.', 'success');
  };

  const handleCreateSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => {
    setIsSubmittingSupportTicket(true);
    setTimeout(() => {
        const newTicket: SupportTicket = { id: `TICKET-${Date.now()}`, ...ticketData, status: 'Đang xử lý', createdAt: new Date() };
        setSupportTickets(p => [...p, newTicket]);
        setIsSubmittingSupportTicket(false);
    }, 1000);
    return true;
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(p => p.map(t => t.id === ticketId ? { ...t, status } : t));
    addToast('Cập nhật trạng thái phiếu hỗ trợ.', 'success');
  };

  // --- Comprehensive Order Edit Request Logic ---

  // Flow 1: User-initiated request from HomePage
  const handleRequestOrderEditFromUser = (orderId: string, oldData: OrderShippingInfo, newData: OrderShippingInfo) => {
    if (orderEditRequests.some(req => req.orderId === orderId && req.status === 'pending')) {
        addToast('Đơn hàng này đã có một yêu cầu chỉnh sửa đang chờ duyệt.', 'error');
        return;
    }
    const newRequest: OrderEditRequest = {
        id: `REQ-${Date.now()}`, orderId, status: 'pending', oldData, newData, createdAt: new Date(),
    };
    setOrderEditRequests(p => [newRequest, ...p]);
    addToast('Đã gửi yêu cầu chỉnh sửa, vui lòng chờ admin duyệt.', 'info');
  };
  
  // Flow 2: Admin generates a link for the user
  const handleCreateEditRequestLink = (orderId: string): string => {
    const token = `EDIT-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    const newRequest: OrderEditRequest = {
        id: `REQLINK-${Date.now()}`, orderId, status: 'pending', token, expiresAt, createdAt: new Date(),
    };
    setOrderEditRequests(p => [...p, newRequest]);
    return `${window.location.origin}/edit-order/${token}`;
  };

  // Flow 2 continued: User submits changes from the link
  const handleSubmitEditFromLink = (token: string, oldData: OrderShippingInfo, newData: OrderShippingInfo) => {
    setOrderEditRequests(p => p.map(req => 
        req.token === token ? { ...req, oldData, newData, token: undefined } : req
    ));
    handleNavigate('home');
    addToast('Đã gửi yêu cầu chỉnh sửa, vui lòng chờ admin duyệt.', 'success');
  };


  const handleApproveEditRequest = (requestId: string) => {
      const request = orderEditRequests.find(r => r.id === requestId);
      if (!request || !request.newData) return;
      
      setOrders(p => p.map(o => o.id === request.orderId ? { ...o, ...request.newData } : o));
      setOrderEditRequests(p => p.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
      addToast('Đã duyệt yêu cầu và cập nhật đơn hàng.', 'success');
  };
  
  const handleRejectEditRequest = (requestId: string) => {
      setOrderEditRequests(p => p.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
      addToast('Đã từ chối yêu cầu chỉnh sửa.', 'info');
  };


  const renderPage = () => {
    if(settings.isMaintenanceMode && user?.role !== 'admin') return <MaintenancePage />;
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={handleNavigate} orders={orders} lastOrderId={lastOrderId} settings={settings} vouchers={vouchers} onUserConfirmPayment={handleUserConfirmPayment} onRequestOrderEdit={handleRequestOrderEditFromUser} />;
      case 'order': return <OrderPage onOrderSubmit={handleOrderSubmit} user={user} vouchers={vouchers} orderCount={orders.length} orderLimit={settings.orderLimit} isSubmitting={isSubmittingOrder} />;
      case 'support': return <SupportPage onCreateTicket={handleCreateSupportTicket} user={user} isSubmitting={isSubmittingSupportTicket} addToast={addToast} />;
      case 'my-orders': return user ? <UserDashboard user={user} orders={orders} /> : <LoginPage onLogin={handleLogin} onNavigateRegister={() => handleNavigate('register')} error={loginError} />;
      case 'edit-order': return <EditOrderPage params={currentRouteParams} orderEditRequests={orderEditRequests} orders={orders} onSubmit={handleSubmitEditFromLink} addToast={addToast} onNavigateHome={() => handleNavigate('home')} />;
      case 'admin': return user?.role === 'admin' ? <AdminDashboard user={user} users={users} onLogout={handleLogout} onNavigate={handleNavigate} orders={orders} onUpdateOrderDetails={handleUpdateOrderDetails} vouchers={vouchers} onCreateVoucher={handleCreateVoucher} onDeleteVoucher={handleDeleteVoucher} settings={settings} onUpdateSettings={handleUpdateSettings} onResetOrders={handleResetOrders} onBanUser={handleBanUser} onUnbanUser={handleUnbanUser} onUpdateUserRole={handleUpdateUserRole} supportTickets={supportTickets} onUpdateTicketStatus={handleUpdateTicketStatus} orderEditRequests={orderEditRequests} onCreateEditRequestLink={handleCreateEditRequestLink} onApproveEditRequest={handleApproveEditRequest} onRejectEditRequest={handleRejectEditRequest} /> : <HomePage onNavigate={handleNavigate} orders={orders} vouchers={vouchers} settings={settings} onUserConfirmPayment={handleUserConfirmPayment} onRequestOrderEdit={handleRequestOrderEditFromUser} />;
      case 'login': return <LoginPage onLogin={handleLogin} onNavigateRegister={() => handleNavigate('register')} error={loginError} />;
      case 'register': return <RegisterPage onRegister={handleRegister} onNavigateLogin={() => handleNavigate('login')} />;
      default: return <HomePage onNavigate={handleNavigate} orders={orders} vouchers={vouchers} settings={settings} onUserConfirmPayment={handleUserConfirmPayment} onRequestOrderEdit={handleRequestOrderEditFromUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(p => p.filter(t => t.id !== id))} />
      {isAnnouncementModalOpen && <AnnouncementModal settings={settings} onClose={() => { setAnnouncementModalOpen(false); sessionStorage.setItem('seenAnnouncement', 'true'); }} />}
      
      {currentPage !== 'admin' && currentPage !== 'edit-order' && <Navbar user={user} onNavigate={handleNavigate} onLogout={handleLogout} currentPage={currentPage} theme={theme} toggleTheme={handleToggleTheme} />}
      
      <main className={`flex-grow ${currentPage !== 'admin' && !settings.isMaintenanceMode ? 'container mx-auto p-4 sm:p-6 md:p-8' : ''}`}>
        {renderPage()}
      </main>

      {currentPage !== 'admin' && currentPage !== 'edit-order' && !settings.isMaintenanceMode && (
         <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                <div className="space-y-8 xl:col-span-1">
                  <div className="flex items-center gap-2">
                    <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                    <span className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Ani Shop</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Dịch vụ đặt hàng hộ Shopee uy tín, nhanh chóng và tiết kiệm.</p>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider uppercase">Liên kết</h3>
                      <ul className="mt-4 space-y-2">
                          <li><button onClick={() => handleNavigate('home')} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors">Trang chủ</button></li>
                          <li><button onClick={() => handleNavigate('order')} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors">Đặt hàng</button></li>
                          <li><button onClick={() => handleNavigate('support')} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors">Hỗ trợ</button></li>
                          {user && <li><button onClick={() => handleNavigate('my-orders')} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 transition-colors">Đơn hàng của tôi</button></li>}
                      </ul>
                    </div>
                    <div className="mt-12 md:mt-0">
                      <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 tracking-wider uppercase">Liên hệ</h3>
                      <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                          <li>Zalo: {settings.shopInfo.zalo}</li>
                          <li>Email: {settings.shopInfo.email}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">&copy; {new Date().getFullYear()} Ani Shop. All Rights Reserved.</p>
            </div>
          </footer>
      )}
    </div>
  );
};

export default App;
