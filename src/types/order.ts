export enum ProductCategory {
  ALL = 'الكل',
  PICKLES = 'المخللات والزيتون',
  OILS = 'الزيوت المعصورة',
  PRESERVES = 'الصلصات والمعلبات',
  DATES_TAHINI = 'التمور والطحينة',
  GRAINS = 'الحبوب والمجففات',
}

export enum OrderMode {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
}

export enum PaymentMethod {
  COD = 'الدفع عند الاستلام',
  BANK_TRANSFER = 'تحويل بنكي للمؤسسات',
}

export enum OrderStatus {
  RECEIVED = 'تم استلام الطلب',
  PROCESSING = 'قيد التجهيز والتعبئة',
  SHIPPED = 'خرج للتوصيل',
  DELIVERED = 'تم التسليم',
}

export interface ProductVariant {
  id: string;
  label: string;
  weightText: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleUnitLabel: string;
  minWholesaleQty: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Exclude<ProductCategory, ProductCategory.ALL>;
  shortDesc: string;
  origin: string;
  batchInfo: string;
  shelfLife: string;
  image: string;
  imagePosition?: string;
  featuredTag?: string;
  variants: ProductVariant[];
}

export interface CartItem {
  key: string;
  productId: string;
  productName: string;
  sku: string;
  image: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  mode: OrderMode;
}

export interface CustomerOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  mode: OrderMode;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
}

export interface WholesaleQuoteRequest {
  referenceId: string;
  createdAt: string;
  companyName: string;
  contactName: string;
  phone: string;
  city: string;
  productInterest: string;
  estimatedQuantity: string;
  notes: string;
}
