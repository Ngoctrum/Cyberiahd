

export interface ProductData {
  productName: string;
  price: number;
  imageUrl: string;
}

export interface User {
    id: string;
    role: 'user' | 'admin';
    username: string;
    email: string;
    password?: string;
    status: 'active' | 'banned';
    banReason?: string;
    banReasonDetails?: string;
}

export interface Voucher {
    id: string;
    code: string;
    description: string;
    price?: number;
}

export interface OrderFormData {
    productLink: string;
    quantity: number;
    voucher: string;

    customerName: string;
    address: string;
    contact: string;
    notes: string;
    email: string;
}

export interface OrderShippingInfo {
    customerName: string;
    address: string;
    contact: string;
    notes: string;
    email: string;
}


export interface Order extends OrderFormData {
    id: string;
    userId: string;
    serviceFee: number;
    status: 'Chờ duyệt' | 'Đã đặt' | 'Chờ người bán chuẩn bị' | 'Đã giao cho ĐVVC' | 'Giao thành công' | 'Đã hủy' | 'Yêu cầu hủy';
    paymentStatus: 'Chưa thanh toán' | 'Chờ duyệt thanh toán' | 'Đã thanh toán';
    createdAt: Date;
    mvd: string;
    cancellationReason?: string;
}

export interface SupportTicketMessage {
    author: 'user' | 'admin';
    content: string;
    timestamp: Date;
}

export interface SupportTicket {
    id: string;
    userId: string;
    orderId: string;
    issue: string;
    contactLink?: string;
    status: 'Đang xử lý' | 'Đã trả lời' | 'Đã đóng';
    createdAt: Date;
    messages: SupportTicketMessage[];
}

export interface OrderEditRequest {
    id: string;
    orderId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    rejectionReason?: string;
    // For admin-generated links
    token?: string;
    expiresAt?: Date;
    // For user-initiated requests or after link submission
    oldData?: OrderShippingInfo;
    newData?: OrderShippingInfo;
}

export interface Settings {
    isMaintenanceMode: boolean;
    orderLimit: number;
    shopInfo: {
        zalo: string;
        email: string;
    };
    smtp: {
        host: string;
        port: string;
        user: string;
        pass: string;
    };
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    announcement: {
        enabled: boolean;
        message: string;
        type: 'info' | 'warning';
    };
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export type Theme = 'light' | 'dark';