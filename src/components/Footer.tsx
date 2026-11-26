export function Footer() {
  return (
    <footer className="border-t border-[#E2E6DC] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E2E6DC]">
          <div className="md:col-span-5">
            <p className="font-display text-lg font-bold text-[#141C15] mb-2">
              شركة زادنا للتصنيع الزراعي
            </p>
            <p className="text-sm text-[#535E54] leading-relaxed max-w-md">
              منشأة صناعية غذائية متخصصة في عصر الزيوت النباتية، تصنيع المعجونات والمخللات، وفرز وتعبئة التمور والحبوب بأعلى معايير الجودة والسلامة الغذائية.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-[#141C15] mb-3">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-[#535E54]">
              <li>
                <a href="#products" className="hover:text-[#141C15] transition-colors">
                  الكتالوج والطلب المباشر
                </a>
              </li>
              <li>
                <a href="#wholesale" className="hover:text-[#141C15] transition-colors">
                  عقود الجملة والمطاعم
                </a>
              </li>
              <li>
                <a href="#facility" className="hover:text-[#141C15] transition-colors">
                  خطوط الإنتاج والجودة
                </a>
              </li>
              <li>
                <a href="#tracking" className="hover:text-[#141C15] transition-colors">
                  تتبع الطلبيات
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-[#141C15] mb-3">خدمة العملاء والمصنع</h3>
            <ul className="space-y-2 text-sm text-[#535E54]">
              <li>المنطقة الصناعية الثانية — بوابة التصنيع الغذائي</li>
              <li className="tabular-nums" dir="ltr">
                +966 11 482 9000
              </li>
              <li>orders@zadna-agro.com</li>
              <li className="tabular-nums">ساعات تجهيز الطلبيات: السبت – الخميس (8 ص – 6 م)</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#535E54]">
          <p className="tabular-nums">© 2026 شركة زادنا للتصنيع الزراعي. جميع الحقوق محفوظة.</p>
          <p>توريد مباشر للأفراد والمنشآت التجارية</p>
        </div>
      </div>
    </footer>
  );
}
