import { FormEvent, useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  CartItem,
  CustomerOrder,
  OrderMode,
  OrderStatus,
  PaymentMethod,
} from '../types/order';
import { DELIVERY_FREE_THRESHOLD, STANDARD_DELIVERY_FEE } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface OrderDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (key: string, nextQty: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: CustomerOrder) => void;
  onJumpToTrack: (orderNumber: string) => void;
}

const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'أبها'];

export function OrderDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onJumpToTrack,
}: OrderDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length === 0 && step === 'checkout') {
      setStep('cart');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= DELIVERY_FREE_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const remainingForFreeDelivery = Math.max(0, DELIVERY_FREE_THRESHOLD - subtotal);

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = customerName.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (trimmedName.length < 2) {
      setFormError('يرجى إدخال الاسم الكامل أو اسم المنشأة.');
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(trimmedPhone)) {
      setFormError('يرجى إدخال رقم جوال صحيح للتواصل والتأكيد.');
      return;
    }
    if (trimmedAddress.length < 6) {
      setFormError('يرجى كتابة عنوان التوصيل التفصيلي.');
      return;
    }

    const randomCode = Math.floor(2000 + Math.random() * 7900);
    const hasWholesale = items.some((i) => i.mode === OrderMode.WHOLESALE);

    const newOrder: CustomerOrder = {
      orderNumber: `ZDN-${randomCode}`,
      createdAt: new Intl.DateTimeFormat('ar-PS-u-nu-latn', {
        calendar: 'gregory',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      customerName: trimmedName,
      phone: trimmedPhone,
      city,
      address: trimmedAddress,
      notes: notes.trim() || undefined,
      paymentMethod,
      mode: hasWholesale ? OrderMode.WHOLESALE : OrderMode.RETAIL,
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      status: OrderStatus.RECEIVED,
      estimatedDelivery: hasWholesale ? '24–48 ساعة (شحن مبرد)' : 'خلال 24 ساعة',
    };

    onOrderCreated(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
    setStep('confirmed');
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141C15]/45 backdrop-blur-[2px] flex justify-end"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-label="سلة الطلبية وإتمام الطلب"
    >
      <aside
        className="w-full max-w-lg bg-white h-full border-r border-[#E2E6DC] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E6DC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="العودة للسلة"
                className="w-8 h-8 rounded-lg border border-[#E2E6DC] flex items-center justify-center text-[#535E54] hover:text-[#141C15] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-lg font-bold text-[#141C15]">
              {step === 'cart' && 'سلة الطلبية'}
              {step === 'checkout' && 'بيانات التوصيل وتأكيد الطلب'}
              {step === 'confirmed' && 'تم تأكيد طلبك بنجاح'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="إغلاق السلة"
            className="w-9 h-9 rounded-lg border border-[#E2E6DC] text-[#535E54] hover:text-[#141C15] hover:bg-[#F1F3EE] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-4 space-y-6">
              <div className="p-5 rounded-xl bg-[#F1F3EE] border border-[#D4DACB]">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2B4C2F] shrink-0" />
                  <div>
                    <p className="font-display font-bold text-base text-[#141C15]">
                      طلب رقم {confirmedOrder.orderNumber} مؤكد
                    </p>
                    <p className="text-xs text-[#535E54]">{confirmedOrder.createdAt}</p>
                  </div>
                </div>
                <p className="text-sm text-[#535E54] leading-relaxed">
                  شكراً لتعاملكم مع شركة زادنا للتصنيع الزراعي. تم إرسال الطلب إلى قسم التجهيز والتعبئة وسيتواصل معكم المندوب قبل التسليم.
                </p>
              </div>

              <dl className="border-y border-[#E2E6DC] py-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#535E54]">العميل / المنشأة</dt>
                  <dd className="font-medium text-[#141C15]">{confirmedOrder.customerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#535E54]">المدينة والعنوان</dt>
                  <dd className="font-medium text-[#141C15] text-end">
                    {confirmedOrder.city} — {confirmedOrder.address}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#535E54]">طريقة الدفع</dt>
                  <dd className="font-medium text-[#141C15]">{confirmedOrder.paymentMethod}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#535E54]">الإجمالي النهائي</dt>
                  <dd className="font-bold text-[#2B4C2F] tabular-nums">
                    {confirmedOrder.total} شيكل
                  </dd>
                </div>
              </dl>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const num = confirmedOrder.orderNumber;
                    handleResetAndClose();
                    onJumpToTrack(num);
                  }}
                  className="w-full py-3 px-5 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors cursor-pointer"
                >
                  تتبع حالة الطلبية الآن
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-5 rounded-lg border border-[#D4DACB] text-[#141C15] text-sm font-medium hover:bg-[#F1F3EE] transition-colors cursor-pointer"
                >
                  مواصلة التصفح
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-semibold text-[#141C15] mb-2">
                سلة الطلبية فارغة حالياً
              </p>
              <p className="text-sm text-[#535E54] mb-6 max-w-xs mx-auto leading-relaxed">
                تصفح منتجات شركة زادنا واختر الأحجام المناسبة لإضافتها إلى طلبك المباشر.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-lg bg-[#2B4C2F] text-white text-sm font-medium hover:bg-[#213B24] transition-colors cursor-pointer"
              >
                استعراض المنتجات
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {/* Free Delivery Threshold Notice */}
              <div className="p-3.5 rounded-lg bg-[#F1F3EE] border border-[#E2E6DC] text-xs text-[#141C15]">
                {remainingForFreeDelivery > 0 ? (
                  <p>
                    أضف منتجات بقيمة{' '}
                    <span className="font-bold tabular-nums">{remainingForFreeDelivery} شيكل</span>{' '}
                    للحصول على شحن مجاني مباشر من المصنع.
                  </p>
                ) : (
                  <p className="font-medium text-[#2B4C2F]">
                    طلبك مؤهل للشحن المبرد المجاني من مصانع زادنا.
                  </p>
                )}
              </div>

              {/* Cart Items */}
              <ul className="divide-y divide-[#E2E6DC]">
                {items.map((item) => (
                  <li key={item.key} className="py-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1F3EE] border border-[#E2E6DC] shrink-0">
                      <ResilientImage
                        src={item.image}
                        alt={item.productName}
                        fallbackTitle={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#141C15] leading-snug">
                          {item.productName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          aria-label={`حذف ${item.productName}`}
                          className="text-[#535E54] hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#535E54] mt-0.5">
                        {item.variantLabel} · {item.mode === OrderMode.WHOLESALE ? 'جملة' : 'تجزئة'}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-[#D4DACB] rounded-md bg-[#F9FAF8]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                            aria-label="تقليل الكمية"
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#F1F3EE] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                            aria-label="زيادة الكمية"
                            className="w-8 h-8 flex items-center justify-center hover:bg-[#F1F3EE] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-[#141C15] tabular-nums">
                          {item.unitPrice * item.quantity} شيكل
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="order-name" className="block text-xs font-medium text-[#141C15] mb-1.5">
                  الاسم الكامل أو اسم المنشأة *
                </label>
                <input
                  id="order-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: أحمد المنصور / أسواق الواحة"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order-phone" className="block text-xs font-medium text-[#141C15] mb-1.5">
                    رقم الجوال *
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm text-end focus:outline-none focus:border-[#2B4C2F] tabular-nums"
                  />
                </div>

                <div>
                  <label htmlFor="order-city" className="block text-xs font-medium text-[#141C15] mb-1.5">
                    المدينة *
                  </label>
                  <select
                    id="order-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="order-address" className="block text-xs font-medium text-[#141C15] mb-1.5">
                  عنوان التوصيل التفصيلي *
                </label>
                <input
                  id="order-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الحي، الشارع، رقم المبنى أو المستودع"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#141C15] mb-2">طريقة الدفع *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[PaymentMethod.COD, PaymentMethod.BANK_TRANSFER].map((method) => {
                    const selected = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-3.5 py-2.5 rounded-lg border text-xs font-medium text-start transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#2B4C2F] text-white border-[#2B4C2F]'
                            : 'bg-[#F9FAF8] text-[#141C15] border-[#D4DACB] hover:border-[#2B4C2F]/50'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="order-notes" className="block text-xs font-medium text-[#141C15] mb-1.5">
                  ملاحظات إضافية للتوصيل (اختياري)
                </label>
                <textarea
                  id="order-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أوقات الاستلام المفضلة أو تعليمات التعبئة..."
                  className="w-full px-3.5 py-2 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                />
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-[#E2E6DC] bg-[#F9FAF8] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#535E54]">
                <span>المجموع الفرعي</span>
                <span className="tabular-nums">{subtotal} شيكل</span>
              </div>
              <div className="flex justify-between text-[#535E54]">
                <span>التوصيل المبرد</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? 'مجاني' : `${deliveryFee} شيكل`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#141C15] pt-2 border-t border-[#E2E6DC]">
                <span>الإجمالي المستحق</span>
                <span className="tabular-nums">{total} شيكل</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-6 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors cursor-pointer"
              >
                متابعة لإدخال بيانات التوصيل
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 px-6 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors cursor-pointer"
              >
                تأكيد وإرسال الطلبية ({total} شيكل)
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
