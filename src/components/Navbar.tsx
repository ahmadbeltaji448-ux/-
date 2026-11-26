import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F9FAF8]/95 backdrop-blur-sm border-b border-[#E2E6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#141C15] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B4C2F]"
        >
          زادنا للتصنيع الزراعي
        </a>

        {/* Zone 2: 4 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#535E54]">
          <a
            href="#products"
            className="hover:text-[#141C15] hover:underline underline-offset-8 decoration-[#2B4C2F] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            المنتجات
          </a>
          <a
            href="#wholesale"
            className="hover:text-[#141C15] hover:underline underline-offset-8 decoration-[#2B4C2F] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            طلبات الجملة
          </a>
          <a
            href="#facility"
            className="hover:text-[#141C15] hover:underline underline-offset-8 decoration-[#2B4C2F] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            خطوط الإنتاج
          </a>
          <a
            href="#tracking"
            className="hover:text-[#141C15] hover:underline underline-offset-8 decoration-[#2B4C2F] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            تتبع الطلب
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#2B4C2F] text-white text-sm font-medium hover:bg-[#213B24] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4C2F]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>سلة الطلبية</span>
            <span className="tabular-nums bg-white/15 px-2 py-0.5 rounded text-xs font-semibold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
