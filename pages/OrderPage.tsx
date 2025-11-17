
import React, { useState, useEffect } from 'react';
import type { OrderFormData, User, Voucher, ProductData } from '../types';
import { 
    ShoppingCartIcon, 
    LinkIcon, 
    HashtagIcon, 
    TagIcon, 
    UserCircleIcon, 
    PhoneIcon, 
    MapPinIcon, 
    ChatBubbleLeftEllipsisIcon,
    XCircleIcon,
    MailIcon,
    SparklesIcon,
} from '../components/Icons';
import { Loader } from '../components/Loader';
import { fetchProductInfo } from '../services/geminiService';
import ProductInfoSkeleton from '../components/ProductInfoSkeleton';


interface OrderPageProps {
    onOrderSubmit: (formData: OrderFormData) => void;
    user: User | null;
    vouchers: Voucher[];
    orderCount: number;
    orderLimit: number;
    isSubmitting: boolean;
}

const OrderPage: React.FC<OrderPageProps> = ({ onOrderSubmit, user, vouchers, orderCount, orderLimit, isSubmitting }) => {
    const [formData, setFormData] = useState<OrderFormData>({
        productLink: '',
        quantity: 1,
        voucher: 'none',
        customerName: user?.username || '',
        address: '',
        contact: '',
        notes: '',
        email: user?.email || '',
    });

    const [productData, setProductData] = useState<ProductData | null>(null);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    
    const isOrderLimitReached = orderCount >= orderLimit;
    const isUserBanned = user?.status === 'banned';

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            customerName: user?.username || prev.customerName,
            email: user?.email || prev.email
        }));
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'productLink') {
            setProductData(null);
            setFetchError(null);
        }
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(1, parseInt(value)) : value
        }));
    };

    const handleFetchProductInfo = async () => {
        const url = formData.productLink.trim();
        const shopeeRegex = /https?:\/\/(www\.)?shopee\.vn\/.+/;

        if (!url || !shopeeRegex.test(url) || productData) {
            return;
        }

        setIsFetchingProduct(true);
        setFetchError(null);
        setProductData(null);

        try {
            const data = await fetchProductInfo(url);
            setProductData(data);
        } catch (error) {
            console.error(error);
            setFetchError('Không thể lấy thông tin sản phẩm. Vui lòng kiểm tra lại link hoặc điền thủ công.');
        } finally {
            setIsFetchingProduct(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isOrderLimitReached || isUserBanned || isSubmitting) return;
        onOrderSubmit(formData);
    };

    const renderBlocker = () => {
        if (isOrderLimitReached) {
            return (
                <div className="p-8 text-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-xl">
                    <XCircleIcon className="w-12 h-12 mx-auto text-yellow-500" />
                    <h2 className="mt-4 text-2xl font-bold">Dịch vụ Tạm ngưng nhận đơn</h2>
                    <p className="mt-2 text-yellow-700 dark:text-yellow-300">
                        Hiện tại chúng tôi đã nhận đủ số lượng đơn hàng cho phép. 
                        <br />
                        Vui lòng quay lại sau. Xin cảm ơn!
                    </p>
                </div>
            );
        }
        if (isUserBanned) {
            return (
                 <div className="p-8 text-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700 rounded-lg shadow-xl">
                    <XCircleIcon className="w-12 h-12 mx-auto text-red-500" />
                    <h2 className="mt-4 text-2xl font-bold">Tài khoản bị khóa</h2>
                    <p className="mt-2 text-red-700 dark:text-red-300">
                        Tài khoản của bạn đã bị khóa và không thể tạo đơn hàng mới.
                        <br/>
                        Lý do: {user?.banReason || 'Không có lý do cụ thể'}
                    </p>
                </div>
            )
        }
        return null;
    }

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
            <header className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
                    <ShoppingCartIcon className="w-8 h-8 text-indigo-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                    Tạo Đơn Hàng Mới
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                    Vui lòng điền đầy đủ thông tin để chúng tôi xử lý đơn hàng nhanh nhất.
                </p>
            </header>

            {isOrderLimitReached || isUserBanned ? renderBlocker() : (
                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-slate-800/50 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg">
                    {/* Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-4">
                            <label htmlFor="productLink" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <LinkIcon className="w-5 h-5 text-slate-400"/>
                                <span>Link sản phẩm Shopee</span>
                            </label>
                            <input type="url" name="productLink" id="productLink" required value={formData.productLink} onChange={handleChange} onBlur={handleFetchProductInfo} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://shopee.vn/..." />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <HashtagIcon className="w-5 h-5 text-slate-400"/>
                                <span>Số lượng</span>
                            </label>
                            <input type="number" name="quantity" id="quantity" required value={formData.quantity} onChange={handleChange} min="1" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                    
                    {/* AI Product Preview Section */}
                    {isFetchingProduct && <ProductInfoSkeleton />}
                    {fetchError && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{fetchError}</p>}
                    {productData && !isFetchingProduct && (
                        <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 animate-fade-in-fast">
                             <div className="flex items-start gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-indigo-500" />
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Thông tin sản phẩm (AI)</h4>
                            </div>
                            <div className="flex items-center space-x-4">
                                <img src={productData.imageUrl} alt="Product" className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">{productData.productName}</p>
                                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{productData.price.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="voucher" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <TagIcon className="w-5 h-5 text-slate-400"/>
                            <span>Voucher</span>
                        </label>
                        <select name="voucher" id="voucher" value={formData.voucher} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="none">Không áp dụng</option>
                            {vouchers.map(v => (
                                <option key={v.id} value={v.code}>
                                    {v.description} ({v.code}) - Phí: {v.price ? `${v.price.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <hr className="border-slate-200 dark:border-slate-700" />

                    {/* Customer Info */}
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">Thông tin nhận hàng</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="customerName" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <UserCircleIcon className="w-5 h-5 text-slate-400"/>
                                <span>Tên người nhận</span>
                            </label>
                            <input type="text" name="customerName" id="customerName" required value={formData.customerName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Nguyễn Văn A" />
                        </div>
                        <div>
                            <label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <PhoneIcon className="w-5 h-5 text-slate-400"/>
                                <span>SĐT / Link liên hệ (Zalo, FB)</span>
                            </label>
                            <input type="text" name="contact" id="contact" required value={formData.contact} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="09xxxxxxxx" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <MailIcon className="w-5 h-5 text-slate-400"/>
                            <span>Email (để nhận thông báo)</span>
                        </label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="you@example.com" />
                    </div>

                    <div>
                        <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <MapPinIcon className="w-5 h-5 text-slate-400"/>
                            <span>Địa chỉ nhận hàng</span>
                        </label>
                        <textarea name="address" id="address" required value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"></textarea>
                    </div>

                    <div>
                        <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-slate-400"/>
                            <span>Ghi chú</span>
                        </label>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Thêm bất kỳ yêu cầu đặc biệt nào cho đơn hàng của bạn.</p>
                        <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-2 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ví dụ: màu sắc, kích cỡ, thời gian giao hàng..."></textarea>
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isSubmitting ? <Loader /> : 'Tạo Đơn Hàng'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default OrderPage;
