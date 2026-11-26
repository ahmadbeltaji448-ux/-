import { ArrowLeft } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { ResilientImage } from './ResilientImage';

export function HeroSection() {
  return (
    <section id="top" className="border-b border-[#E2E6DC] bg-[#F9FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Balanced 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2">
            <p className="text-xs font-medium text-[#535E54] mb-4">
              توريد مباشر من المصنع · معتمد وفق معايير ISO 22000 و HACCP
            </p>
            <h1
              className="font-display font-bold text-[#141C15] leading-[1.2] text-balance mb-5"
              style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}
            >
              محاصيل زراعية مصنّعة، تُطلب مباشرة من خطوط الإنتاج
            </h1>
            <p className="text-base sm:text-lg text-[#535E54] leading-relaxed max-w-xl mb-8">
              توفر شركة زادنا للتصنيع الزراعي للعملاء والمنشآت الغذائية طلبيات مباشرة من الزيوت المعصورة على البارد، المعجونات، التمور، والمخللات الفاخرة بعبوات تجزئة وجملة.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors whitespace-nowrap shrink-0"
              >
                <span>ابدأ طلبك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <a
                href="#wholesale"
                className="inline-flex items-center px-5 py-3 rounded-lg border border-[#D4DACB] bg-white text-[#141C15] text-sm font-medium hover:bg-[#F1F3EE] transition-colors whitespace-nowrap shrink-0"
              >
                طلبات الجملة والمطاعم
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-xl overflow-hidden border border-[#E2E6DC] bg-[#F1F3EE]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="منتجات شركة زادنا للتصنيع الزراعي من زيت الزيتون والمخللات ومعجون الطماطم"
                fallbackTitle="شركة زادنا للتصنيع الزراعي"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Strip */}
        <div className="mt-10 lg:mt-12 pt-8 border-t border-[#E2E6DC] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] tabular-nums">
              100%
            </p>
            <p className="mt-1 text-sm text-[#535E54]">مكونات طبيعية خالية من المواد الحافظة</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] tabular-nums">
              24–48 ساعة
            </p>
            <p className="mt-1 text-sm text-[#535E54]">مدة التجهيز والشحن المبرد من المصنع</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] tabular-nums">
              12 شهر+
            </p>
            <p className="mt-1 text-sm text-[#535E54]">ضمان جودة التعبئة وتاريخ الصلاحية</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] tabular-nums">
              تجزئة وجملة
            </p>
            <p className="mt-1 text-sm text-[#535E54]">خيارات تسعير مرنة للأفراد والمتاجر</p>
          </div>
        </div>
      </div>
    </section>
  );
}
