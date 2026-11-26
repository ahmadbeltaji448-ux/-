import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FACILITY_IMAGE, PRODUCTS } from '../data/products';
import { WholesaleQuoteRequest } from '../types/order';
import { ResilientImage } from './ResilientImage';

interface FacilityWholesaleSectionProps {
  onQuoteSubmitted: (quote: WholesaleQuoteRequest) => void;
}

export function FacilityWholesaleSection({ onQuoteSubmitted }: FacilityWholesaleSectionProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('الرياض');
  const [productInterest, setProductInterest] = useState(PRODUCTS[0].name);
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<WholesaleQuoteRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (companyName.trim().length < 2 || contactName.trim().length < 2) {
      setErrorMsg('يرجى إدخال اسم المنشأة واسم المسؤول.');
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(phone.trim())) {
      setErrorMsg('يرجى إدخال رقم هاتف أو جوال صحيح.');
      return;
    }

    const quote: WholesaleQuoteRequest = {
      referenceId: `QTE-${Math.floor(4000 + Math.random() * 5000)}`,
      createdAt: new Intl.DateTimeFormat('ar-PS-u-nu-latn', {
        calendar: 'gregory',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date()),
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      city,
      productInterest,
      estimatedQuantity: estimatedQuantity.trim() || 'كمية تجارية دورية',
      notes: notes.trim(),
    };

    onQuoteSubmitted(quote);
    setSubmittedQuote(quote);
    setCompanyName('');
    setContactName('');
    setPhone('');
    setEstimatedQuantity('');
    setNotes('');
  };

  return (
    <section id="facility" className="border-t border-[#E2E6DC] bg-[#F1F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {/* Part 1: Manufacturing Facility & 3-Step Production Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] lg:min-h-[380px] rounded-xl overflow-hidden border border-[#E2E6DC] bg-white">
              <ResilientImage
                src={FACILITY_IMAGE}
                alt="خطوط الإنتاج والتعبئة الآلية في مصنع زادنا للتصنيع الزراعي"
                fallbackTitle="منشأة زادنا للتصنيع الزراعي"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-medium text-[#535E54] mb-2">
              الجودة التصنيعية · من المزرعة إلى خط التعبئة
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] mb-4 text-balance">
              معايير تصنيع دقيقة تضمن نقاء كل عبوة
            </h2>
            <p className="text-sm sm:text-base text-[#535E54] leading-relaxed mb-8">
              تعتمد خطوطنا في شركة زادنا على المعالجة الآلية المغلقة للحفاظ على القيمة الغذائية والنكهة الأصيلة للمحاصيل الزراعية دون تدخل بشري مباشر.
            </p>

            <div className="space-y-5 border-t border-[#D4DACB] pt-6">
              <div>
                <h3 className="font-display text-base font-semibold text-[#141C15]">
                  01. الفرز الليزري والغسيل الآلي
                </h3>
                <p className="text-sm text-[#535E54] mt-1">
                  استلام المحاصيل الطازجة وفحصها مخبرياً قبل دخولها وحدات الغسيل والتنقية عالية الدقة.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-[#141C15]">
                  02. العصر البارد والتعقيم الحراري المضبوط
                </h3>
                <p className="text-sm text-[#535E54] mt-1">
                  ضبط درجات الحرارة بدقة لحفظ الفيتامينات والزيوت العطرية الطبيعية في كل دفعة إنتاج.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-[#141C15]">
                  03. التعبئة المحكمة والتوريد المجدول
                </h3>
                <p className="text-sm text-[#535E54] mt-1">
                  تعبئة فورية في عبوات زجاجية ومعدنية آمنة مع طباعة رقم التشغيلة لضمان التتبع الكامل.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Dedicated B2B / Wholesale Contract & Custom Order Form */}
        <div
          id="wholesale"
          className="bg-white rounded-xl border border-[#E2E6DC] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-[#2B4C2F] mb-2">
                قسم المبيعات التجارية · للمطاعم والفنادق والأسواق
              </p>
              <h2 className="font-display text-2xl font-bold text-[#141C15] mb-3 text-balance">
                طلب تسعيرة توريد أو كميات جملة مخصصة
              </h2>
              <p className="text-sm text-[#535E54] leading-relaxed mb-6">
                إذا كانت منشأتكم تحتاج إلى عقود توريد شهرية، عبوات مطاعم خاصة (3–25 كجم)، أو شحنات طبليات كاملة، أرسلوا مواصفات الطلب ليقوم فريق المبيعات بتثبيت السعر وجدول التوصيل.
              </p>
            </div>

            <dl className="border-t border-[#E2E6DC] pt-5 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#535E54]">الحد الأدنى لطلبات العقود</dt>
                <dd className="font-semibold text-[#141C15] tabular-nums">20 كرتون أو شوال</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#535E54]">الرد وتأكيد التسعيرة</dt>
                <dd className="font-semibold text-[#141C15] tabular-nums">خلال 4 ساعات عمل</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#535E54]">تسهيلات السداد</dt>
                <dd className="font-semibold text-[#141C15]">تحويل بنكي أو آجل معتمد</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            {submittedQuote ? (
              <div className="h-full flex flex-col justify-center p-6 rounded-xl bg-[#F9FAF8] border border-[#D4DACB]">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2B4C2F] shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-base text-[#141C15]">
                      تم استلام طلب التسعيرة المرجعي ({submittedQuote.referenceId})
                    </h3>
                    <p className="text-xs text-[#535E54]">
                      بتاريخ {submittedQuote.createdAt} · {submittedQuote.companyName}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#535E54] leading-relaxed mb-5">
                  سيتواصل مسؤول مبيعات الجملة على الرقم{' '}
                  <span className="font-semibold text-[#141C15] tabular-nums" dir="ltr">
                    {submittedQuote.phone}
                  </span>{' '}
                  لتأكيد عرض السعر الخاص بصنف «{submittedQuote.productInterest}».
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedQuote(null)}
                  className="self-start px-4 py-2 rounded-lg border border-[#D4DACB] bg-white text-xs font-medium text-[#141C15] hover:bg-[#F1F3EE] transition-colors cursor-pointer"
                >
                  إرسال طلب تسعيرة آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      اسم الشركة / المطعم / المتجر *
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="مثال: شركة أطياف للتموين"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-contact"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      اسم مسؤول المشتريات *
                    </label>
                    <input
                      id="quote-contact"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="الاسم الكامل"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      رقم التواصل *
                    </label>
                    <input
                      id="quote-phone"
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
                    <label
                      htmlFor="quote-city"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      المدينة / منطقة التوصيل
                    </label>
                    <input
                      id="quote-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quote-product"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      الصنف المطلوب
                    </label>
                    <select
                      id="quote-product"
                      value={productInterest}
                      onChange={(e) => setProductInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="تشكيلة منتجات متعددة">تشكيلة منتجات متعددة</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="quote-qty"
                      className="block text-xs font-medium text-[#141C15] mb-1.5"
                    >
                      الكمية التقديرية المطلوبة
                    </label>
                    <input
                      id="quote-qty"
                      type="text"
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      placeholder="مثال: 50 كرتون شهرياً"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-notes"
                    className="block text-xs font-medium text-[#141C15] mb-1.5"
                  >
                    مواصفات العبوة أو جدول التوريد المفضل
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب أي تفاصيل إضافية حول التعبئة أو مواعيد الاستلام..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#D4DACB] bg-[#F9FAF8] text-sm focus:outline-none focus:border-[#2B4C2F]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors cursor-pointer"
                >
                  إرسال طلب التسعيرة والتوريد
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
