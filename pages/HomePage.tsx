
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TagIcon, RocketLaunchIcon, ShieldCheckIcon, UserCircleIcon, MapPinIcon, PhoneIcon, LinkIcon, HashtagIcon, ChatBubbleLeftEllipsisIcon, FacebookIcon, SparklesIcon, PencilAltIcon } from '../components/Icons';
import OrderStatusTracker from '../components/OrderStatusTracker';
import type { Order, Settings, Voucher, OrderShippingInfo } from '../types';
import EditOrderModal from '../components/EditOrderModal';

type Page = 'home' | 'order' | 'admin' | 'login' | 'register' | 'my-orders' | 'support';

interface HomePageProps {
    onNavigate: (page: Page) => void;
    orders: Order[];
    lastOrderId?: string | null;
    settings: Settings;
    vouchers: Voucher[];
    onUserConfirmPayment: (orderId: string) => void;
    onRequestOrderEdit: (orderId: string, oldData: OrderShippingInfo, newData: OrderShippingInfo) => void;
}

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode}> = ({icon, title, children}) => (
    <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 h-full transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mb-5">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">{title}</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{children}</p>
    </div>
);

const HowItWorksStep: React.FC<{number: string, title: string, children: React.ReactNode}> = ({number, title, children}) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-600 text-white font-bold text-xl rounded-full shadow-lg shadow-indigo-500/30">
            {number}
        </div>
        <div>
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1">{title}</h4>
            <p className="text-zinc-600 dark:text-zinc-400">{children}</p>
        </div>
    </div>
);

const InfoItem: React.FC<{icon: React.ReactNode, label: string, children: React.ReactNode}> = ({icon, label, children}) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 mt-1">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{label}</p>
            <div className="text-md text-zinc-800 dark:text-zinc-200 font-medium break-words">
                {children}
            </div>
        </div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigate, orders, lastOrderId, settings, vouchers, onUserConfirmPayment, onRequestOrderEdit }) => {
    const [searchId, setSearchId] = useState('');
    const [searched, setSearched] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

    useEffect(() => {
        if (lastOrderId) {
            setSearchId(lastOrderId);
            setSearched(true);
        }
    }, [lastOrderId]);
    
    useEffect(() => {
        const handleScroll = () => {
            if (gridRef.current) {
                const offsetY = window.scrollY * 0.4;
                gridRef.current.style.transform = `translateY(${offsetY}px)`;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const foundOrder = useMemo(() => {
        if (!searchId.trim()) return null;
        return orders.find(order => order.id.toLowerCase() === searchId.trim().toLowerCase());
    }, [searchId, orders]);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
    };

    const handleOpenEditModal = (order: Order) => {
        setOrderToEdit(order);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (newData: OrderShippingInfo) => {
        if (orderToEdit) {
            const oldData: OrderShippingInfo = {
                customerName: orderToEdit.customerName,
                address: orderToEdit.address,
                contact: orderToEdit.contact,
                notes: orderToEdit.notes,
                email: orderToEdit.email,
            };
            onRequestOrderEdit(orderToEdit.id, oldData, newData);
        }
        setIsEditModalOpen(false);
        setOrderToEdit(null);
    };

    const getStatusPill = (status: Order['status']) => {
        const baseClasses = "text-xs font-semibold px-3 py-1.5 rounded-full inline-block";
        switch (status) {
            case 'Chờ duyệt': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300`;
            case 'Đã đặt': return `${baseClasses} bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300`;
            case 'Chờ người bán chuẩn bị': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300`;
            case 'Đã giao cho ĐVVC': return `${baseClasses} bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300`;
            case 'Giao thành công': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300`;
            case 'Đã hủy': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300`;
            default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        }
    };
    
    const maskAddress = (address: string) => {
        if (address.length <= 20) {
            return '***';
        }
        return '*** ' + address.slice(address.length - 20);
    };

    const maskContact = (contact: string) => {
        if (contact.length <= 4) {
            return '*'.repeat(contact.length);
        }
        return '*'.repeat(contact.length - 4) + contact.slice(-4);
    };

    const renderPaymentSection = (order: Order) => {
        const appliedVoucher = vouchers.find(v => v.code === order.voucher);
        const requiresPayment = appliedVoucher?.price && appliedVoucher.price > 0 && order.status === 'Đã giao cho ĐVVC';
        const hasMvd = order.mvd && order.mvd.trim() !== '';
    
        const MvdComponent = hasMvd ? (
            <div>
                <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">Mã vận đơn</h4>
                <p className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-center font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tracking-widest">{order.mvd}</p>
            </div>
        ) : null;
        
        let PaymentComponent = null;
    
        if (requiresPayment) {
            const qrUrl = `https://img.vietqr.io/image/${settings.bankInfo.bankName.replace(/\s/g, '')}-${settings.bankInfo.accountNumber}-compact.png?amount=${appliedVoucher.price}&addInfo=${encodeURIComponent(order.id)}&accountName=${encodeURIComponent(settings.bankInfo.accountName)}`;
    
            if (order.paymentStatus === 'Chưa thanh toán') {
                PaymentComponent = (
                    <div className="text-center">
                        <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">Yêu cầu thanh toán Phí Dịch Vụ</h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Quét mã QR dưới đây để thanh toán <span className="font-bold">{appliedVoucher.price.toLocaleString('vi-VN')}đ</span>.</p>
                        <img src={qrUrl} alt="QR Code Thanh toán" className="mx-auto rounded-lg shadow-lg w-56 h-56" />
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Nội dung chuyển khoản: <strong className="font-mono">{order.id}</strong></p>
                        <button 
                            onClick={() => onUserConfirmPayment(order.id)}
                            className="mt-6 w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300">
                            Tôi đã thanh toán
                        </button>
                    </div>
                );
            } else if (order.paymentStatus === 'Chờ duyệt thanh toán') {
                PaymentComponent = (
                    <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                        <p className="font-semibold">Đang chờ xác nhận thanh toán.</p>
                    </div>
                );
            } else if (order.paymentStatus === 'Đã thanh toán') {
                PaymentComponent = (
                     <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                        <p className="font-semibold">Đã thanh toán thành công!</p>
                    </div>
                );
            }
        }
    
        if (MvdComponent || PaymentComponent) {
            return (
                <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-6">
                    {MvdComponent}
                    {PaymentComponent}
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="animate-fade-in space-y-24 md:space-y-32">
             {orderToEdit && (
                <EditOrderModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    order={orderToEdit}
                    onSubmit={handleEditSubmit}
                />
            )}
            {/* Hero Section */}
            <section className="relative text-center pt-16 pb-20 overflow-hidden">
                <div ref={gridRef} className="absolute inset-0 bg-grid-slate-200/50 dark:dark\:bg-grid-slate-700/25 [mask-image:linear-gradient(to_bottom,white_0%,white_75%,transparent_100%)]"></div>
                 <div className="relative max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-indigo-600 dark:from-white dark:to-indigo-400 mb-4 pb-2">
                        Dịch Vụ Order Hộ Shopee
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
                        ĐẶT ĐƠN GIÁ RẺ TIẾT KIỆM - Tiết kiệm thời gian và chi phí cho bạn.
                    </p>
                    <button
                        onClick={() => onNavigate('order')}
                        className="rounded-lg bg-indigo-600 text-white font-semibold px-8 py-4 hover:bg-indigo-700 transition-all duration-300 text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:scale-105"
                    >
                        Bắt Đầu Đặt Hàng Ngay
                    </button>
                </div>
            </section>
            
            {/* Tracking & Result Section */}
            <section className="-mt-12">
                 <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl shadow-indigo-500/5 border border-zinc-200 dark:border-zinc-700">
                         <h2 className="text-xl font-bold text-center mb-4 text-zinc-800 dark:text-zinc-200">Tra cứu đơn hàng của bạn</h2>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Nhập mã đơn hàng..."
                                className="flex-grow px-4 py-3 text-base bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="bg-zinc-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors duration-300"
                            >
                                Tra cứu
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 min-h-[150px]">
                        {lastOrderId && !searched && (
                            <div className="mb-8 p-4 text-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 rounded-lg animate-fade-in">
                                <p className="font-semibold">Đặt hàng thành công!</p>
                                <p>Mã đơn hàng của bạn là <span className="font-bold">{lastOrderId}</span>. Dưới đây là thông tin chi tiết:</p>
                            </div>
                        )}
                       {searched && (
                            foundOrder ? (
                                <div className="bg-white dark:bg-zinc-800/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-6 sm:p-8 text-left animate-fade-in border border-zinc-200 dark:border-zinc-700 rounded-xl">
                                   <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Mã đơn hàng</h3>
                                            <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">{foundOrder.id}</p>
                                        </div>
                                        <div className={getStatusPill(foundOrder.status)}>
                                            {foundOrder.status}
                                        </div>
                                   </div>
                                   
                                   <OrderStatusTracker status={foundOrder.status} />

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
                                       <div className="space-y-5">
                                           <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">Thông tin giao hàng</h4>
                                           <InfoItem icon={<UserCircleIcon className="w-6 h-6"/>} label="Người nhận">
                                               {foundOrder.customerName}
                                           </InfoItem>
                                           <InfoItem icon={<MapPinIcon className="w-6 h-6"/>} label="Địa chỉ">
                                                {maskAddress(foundOrder.address)}
                                           </InfoItem>
                                            <InfoItem icon={<PhoneIcon className="w-6 h-6"/>} label="Liên hệ">
                                                {maskContact(foundOrder.contact)}
                                           </InfoItem>
                                       </div>
                                       
                                       <div className="space-y-5">
                                            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2">Chi tiết đơn hàng</h4>
                                            <InfoItem icon={<LinkIcon className="w-6 h-6"/>} label="Sản phẩm">
                                                <a href={foundOrder.productLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Xem sản phẩm trên Shopee</a>
                                            </InfoItem>
                                            <InfoItem icon={<HashtagIcon className="w-6 h-6"/>} label="Số lượng">
                                                {foundOrder.quantity}
                                            </InfoItem>
                                             <InfoItem icon={<TagIcon className="w-6 h-6"/>} label="Voucher">
                                                {foundOrder.voucher === 'none' ? 'Không áp dụng' : foundOrder.voucher}
                                            </InfoItem>
                                            {foundOrder.notes && (
                                                <InfoItem icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6"/>} label="Ghi chú">
                                                    {foundOrder.notes}
                                                </InfoItem>
                                            )}
                                       </div>
                                   </div>

                                   {renderPaymentSection(foundOrder)}

                                    {foundOrder.status === 'Chờ duyệt' && (
                                        <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-6 text-center">
                                            <button 
                                                onClick={() => handleOpenEditModal(foundOrder)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                                            >
                                                <PencilAltIcon className="w-5 h-5"/>
                                                Yêu cầu Chỉnh sửa Thông tin
                                            </button>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="text-center p-6 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg animate-fade-in">
                                    <p className="font-semibold">Không tìm thấy đơn hàng!</p>
                                    <p>Vui lòng kiểm tra lại mã đơn hàng của bạn.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
            
            {/* How it works Section */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Quy trình hoạt động</h2>
                     <p className="text-md text-zinc-600 dark:text-zinc-400 mt-2">Chỉ với 3 bước đơn giản để nhận hàng tận tay.</p>
                 </div>
                 <div className="max-w-3xl mx-auto space-y-10">
                    <HowItWorksStep number="1" title="Điền Form Đặt Hàng">
                        Cung cấp link sản phẩm và thông tin nhận hàng của bạn vào biểu mẫu tại trang Đặt Hàng.
                    </HowItWorksStep>
                     <HowItWorksStep number="2" title="Xác Nhận & Gửi Yêu Cầu">
                        Kiểm tra lại thông tin và nhấn nút gửi yêu cầu để hoàn tất.
                    </HowItWorksStep>
                     <HowItWorksStep number="3" title="Chúng Tôi Xử Lý & Giao Hàng">
                        Ani Shop sẽ tiến hành đặt hàng và cập nhật trạng thái. Bạn chỉ cần chờ nhận hàng.
                    </HowItWorksStep>
                 </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">Tại sao chọn Ani Shop?</h2>
                     <p className="text-md text-zinc-600 dark:text-zinc-400 mt-2">Dịch vụ chuyên nghiệp với những ưu điểm vượt trội.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <FeatureCard icon={<TagIcon className="w-6 h-6 text-indigo-500" />} title="Phí Dịch Vụ Cạnh Tranh">
                         Chúng tôi cung cấp mức phí dịch vụ hợp lý và minh bạch, không có chi phí ẩn.
                     </FeatureCard>
                     <FeatureCard icon={<RocketLaunchIcon className="w-6 h-6 text-indigo-500" />} title="Xử Lý Nhanh Chóng">
                         Đơn hàng của bạn sẽ được xử lý và đặt mua trong thời gian ngắn nhất sau khi xác nhận.
                     </FeatureCard>
                     <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6 text-indigo-500" />} title="An Toàn & Tin Cậy">
                        Quy trình làm việc chuyên nghiệp, đảm bảo thông tin và sản phẩm của bạn được an toàn.
                     </FeatureCard>
                 </div>
            </section>

            {/* Contact Section */}
            <section className="container mx-auto px-4">
                <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-700 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Liên hệ & Hỗ trợ</h2>
                        <p className="text-md text-zinc-600 dark:text-zinc-400 mt-2">Gặp sự cố hoặc có câu hỏi? Chúng tôi luôn sẵn sàng giúp đỡ.</p>
                        <div className="mt-6 space-y-4">
                            <a href={`https://zalo.me/${settings.shopInfo.zalo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <span className="font-bold">Zalo:</span>
                                <span>{settings.shopInfo.zalo}</span>
                            </a>
                            <a href="https://www.facebook.com/share/17L5Nk4gW4/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <FacebookIcon className="w-6 h-6 text-[#1877F2]" />
                                <span className="font-bold">Facebook:</span>
                                <span>Hỗ trợ Ani Shop</span>
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <button
                            onClick={() => onNavigate('support')}
                            className="rounded-lg bg-zinc-700 text-white font-semibold px-6 py-3 hover:bg-zinc-800 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-all duration-300 text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Gửi Phiếu Hỗ trợ
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
