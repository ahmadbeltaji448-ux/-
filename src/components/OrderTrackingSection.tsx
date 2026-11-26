import { FormEvent, useEffect, useState } from 'react';
import { Search, PackageCheck, Truck, ClipboardCheck, Box } from 'lucide-react';
import { CustomerOrder, OrderStatus } from '../types/order';

interface OrderTrackingSectionProps {
  orders: CustomerOrder[];
  activeOrderNumber: string;
  onSelectOrderNumber: (orderNumber: string) => void;
}

const ORDER_STEPS = [
  { status: OrderStatus.RECEIVED, label: 'تم استلام الطلب', icon: ClipboardCheck },
  { status: OrderStatus.PROCESSING, label: 'قيد التجهيز والتعبئة', icon: Box },
  { status: OrderStatus.SHIPPED, label: 'خرج للتوصيل', icon: Truck },
  { status: OrderStatus.DELIVERED, label: 'تم التسليم', icon: PackageCheck },
];

export function OrderTrackingSection({
  orders,
  activeOrderNumber,
  onSelectOrderNumber,
}: OrderTrackingSectionProps) {
  const [query, setQuery] = useState(activeOrderNumber || 'ZDN-1042');
  const [searchedOnce, setSearchedOnce] = useState(false);

  useEffect(() => {
    if (activeOrderNumber) {
      setQuery(activeOrderNumber);
    }
  }, [activeOrderNumber]);

  const normalizedQuery = query.trim().toUpperCase();
  const matchedOrder = orders.find(
    (o) => o.orderNumber.toUpperCase() === normalizedQuery || o.phone.includes(query.trim())
  );

  const activeStepIndex = matchedOrder
    ? ORDER_STEPS.findIndex((s) => s.status === matchedOrder.status)
    : -1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchedOnce(true);
    if (matchedOrder) {
      onSelectOrderNumber(matchedOrder.orderNumber);
    }
  };

  return (
    <section id="tracking" className="border-t border-[#E2E6DC] bg-[#F9FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-medium text-[#535E54] mb-2">
            الشفافية والمتابعة · حالة الشحنات
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] mb-3 text-balance">
            تتبع حالة طلبيتك من المصنع حتى التسليم
          </h2>
          <p className="text-sm text-[#535E54] leading-relaxed">
            أدخل رقم الطلبية (مثل <span className="font-semibold tabular-nums">ZDN-1042</span>) أو رقم الجوال المسجل لمتابعة مراحل التجهيز والشحن.
          </p>
        </div>

        {/* Lookup Bar & Recent Orders Quick Switcher */}
        <div className="bg-white rounded-xl border border-[#E2E6DC] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E2E6DC]">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="أدخل رقم الطلب (مثال: ZDN-1042)"
                  aria-label="رقم الطلبية"
                  className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F] tabular-nums"
                />
                <Search className="w-4 h-4 text-[#535E54] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#2B4C2F] text-white text-sm font-medium hover:bg-[#213B24] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                عرض الحالة
              </button>
            </form>

            {orders.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#535E54]">الطلبيات المسجلة:</span>
                {orders.slice(0, 4).map((o) => (
                  <button
                    key={o.orderNumber}
                    type="button"
                    onClick={() => {
                      setQuery(o.orderNumber);
                      onSelectOrderNumber(o.orderNumber);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border tabular-nums transition-colors cursor-pointer ${
                      matchedOrder?.orderNumber === o.orderNumber
                        ? 'bg-[#2B4C2F] text-white border-[#2B4C2F]'
                        : 'bg-[#F9FAF8] text-[#141C15] border-[#E2E6DC] hover:border-[#2B4C2F]/50'
                    }`}
                  >
                    {o.orderNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {matchedOrder ? (
            <div className="pt-6 space-y-8">
              {/* Order Summary Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#535E54] mb-1">
                    <span className="tabular-nums font-semibold text-[#141C15]">
                      {matchedOrder.orderNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{matchedOrder.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{matchedOrder.paymentMethod}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#141C15]">
                    {matchedOrder.customerName} — {matchedOrder.city}
                  </h3>
                  <p className="text-xs text-[#535E54] mt-0.5">{matchedOrder.address}</p>
                </div>

                <div className="text-start sm:text-end">
                  <span className="text-xs text-[#535E54] block">الحالة الحالية</span>
                  <span className="text-sm font-bold text-[#2B4C2F]">{matchedOrder.status}</span>
                  <span className="block text-xs text-[#535E54] mt-0.5">
                    الوصول المتوقع: {matchedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* 4-Stage Progress Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {ORDER_STEPS.map((stepObj, idx) => {
                  const Icon = stepObj.icon;
                  const completed = idx <= activeStepIndex;
                  const current = idx === activeStepIndex;
                  return (
                    <div
                      key={stepObj.status}
                      className={`p-4 rounded-lg border transition-colors ${
                        current
                          ? 'bg-[#F1F3EE] border-[#2B4C2F]'
                          : completed
                            ? 'bg-white border-[#D4DACB]'
                            : 'bg-[#F9FAF8] border-[#E2E6DC] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            completed ? 'text-[#2B4C2F]' : 'text-[#535E54]'
                          }`}
                        />
                        <span className="text-xs font-semibold text-[#141C15]">
                          {stepObj.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#535E54]">
                        {current ? 'المرحلة الحالية' : completed ? 'مكتمل' : 'بانتظار التنفيذ'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Itemized Receipt Table */}
              <div className="border-t border-[#E2E6DC] pt-5">
                <h4 className="text-xs font-semibold text-[#535E54] mb-3">تفاصيل الأصناف المطلوبة</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead>
                      <tr className="border-b border-[#E2E6DC] text-xs text-[#535E54]">
                        <th className="pb-2 font-medium text-start">المنتج</th>
                        <th className="pb-2 font-medium text-start">العبوة</th>
                        <th className="pb-2 font-medium text-start">الكمية</th>
                        <th className="pb-2 font-medium text-end">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E6DC]">
                      {matchedOrder.items.map((item) => (
                        <tr key={item.key}>
                          <td className="py-2.5 font-medium text-[#141C15]">{item.productName}</td>
                          <td className="py-2.5 text-xs text-[#535E54]">{item.variantLabel}</td>
                          <td className="py-2.5 tabular-nums text-[#141C15]">{item.quantity}</td>
                          <td className="py-2.5 tabular-nums font-semibold text-end text-[#141C15]">
                            {item.unitPrice * item.quantity} شيكل
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#D4DACB]">
                        <td colSpan={3} className="pt-3 font-bold text-[#141C15]">
                          الإجمالي النهائي شامل التوصيل
                        </td>
                        <td className="pt-3 font-bold text-end text-[#2B4C2F] tabular-nums">
                          {matchedOrder.total} شيكل
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-[#141C15]">
                {searchedOnce
                  ? 'لم يتم العثور على طلبية مطابقة لهذا الرقم.'
                  : 'أدخل رقم الطلبية لعرض التفاصيل.'}
              </p>
              <p className="text-xs text-[#535E54] mt-1">
                يمكنك تجربة الرقم النموذجي{' '}
                <button
                  type="button"
                  onClick={() => setQuery('ZDN-1042')}
                  className="text-[#2B4C2F] underline font-semibold tabular-nums cursor-pointer"
                >
                  ZDN-1042
                </button>{' '}
                أو إرسال طلب جديد من السلة.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
