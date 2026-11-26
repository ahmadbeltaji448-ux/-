import { useEffect, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { OrderMode, Product, ProductVariant } from '../types/order';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  initialVariantId?: string;
  orderMode: OrderMode;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, qty: number, mode: OrderMode) => void;
}

export function ProductDetailModal({
  product,
  initialVariantId,
  orderMode,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [localMode, setLocalMode] = useState<OrderMode>(orderMode);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    if (product) {
      const startVariant =
        product.variants.find((v) => v.id === initialVariantId) ?? product.variants[0];
      setSelectedVariantId(startVariant.id);
      setLocalMode(orderMode);
      setQty(orderMode === OrderMode.WHOLESALE ? startVariant.minWholesaleQty : 1);
    }
  }, [product, initialVariantId, orderMode]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const isWholesale = localMode === OrderMode.WHOLESALE;
  const unitPrice = isWholesale ? variant.wholesalePrice : variant.retailPrice;
  const minQty = isWholesale ? variant.minWholesaleQty : 1;

  const handleVariantChange = (nextVariant: ProductVariant) => {
    setSelectedVariantId(nextVariant.id);
    if (isWholesale && qty < nextVariant.minWholesaleQty) {
      setQty(nextVariant.minWholesaleQty);
    }
  };

  const handleModeSwitch = (nextMode: OrderMode) => {
    setLocalMode(nextMode);
    if (nextMode === OrderMode.WHOLESALE) {
      setQty((prev) => Math.max(prev, variant.minWholesaleQty));
    } else {
      setQty(1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141C15]/50 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div
        className="bg-white w-full max-w-4xl rounded-xl border border-[#E2E6DC] overflow-hidden max-h-[90vh] flex flex-col lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left/Right Media Panel */}
        <div className="lg:col-span-6 bg-[#F1F3EE] relative min-h-[240px] lg:min-h-full">
          <ResilientImage
            src={product.image}
            alt={product.name}
            fallbackTitle={product.name}
            className={`w-full h-full object-cover ${product.imagePosition ?? 'object-center'}`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="lg:hidden absolute top-3 left-3 w-10 h-10 rounded-lg bg-white/95 text-[#141C15] flex items-center justify-center border border-[#E2E6DC] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous Purchase Module */}
        <div className="lg:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="text-xs text-[#535E54] flex items-center gap-1.5">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{product.sku}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق نافذة المنتج"
                className="hidden lg:flex w-9 h-9 rounded-lg border border-[#E2E6DC] text-[#535E54] hover:text-[#141C15] hover:bg-[#F1F3EE] items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 id="pdp-title" className="font-display text-2xl font-bold text-[#141C15] mb-3">
              {product.name}
            </h2>
            <p className="text-sm text-[#535E54] leading-relaxed mb-5">{product.shortDesc}</p>

            {/* Specifications Table */}
            <dl className="border-y border-[#E2E6DC] py-3.5 mb-5 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-[#535E54]">المصدر وخط الإنتاج</dt>
                <dd className="text-[#141C15] font-medium text-end">{product.origin}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#535E54]">معلومات التشغيلة</dt>
                <dd className="text-[#141C15] font-medium text-end">{product.batchInfo}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#535E54]">الصلاحية والتخزين</dt>
                <dd className="text-[#141C15] font-medium text-end">{product.shelfLife}</dd>
              </div>
            </dl>

            {/* Order Tier Toggle */}
            <div className="mb-4">
              <p className="text-xs font-medium text-[#535E54] mb-2">نوع التسعير:</p>
              <div className="inline-flex p-1 bg-[#F1F3EE] rounded-lg border border-[#E2E6DC]">
                <button
                  type="button"
                  onClick={() => handleModeSwitch(OrderMode.RETAIL)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    !isWholesale
                      ? 'bg-white text-[#141C15] shadow-xs'
                      : 'text-[#535E54] hover:text-[#141C15]'
                  }`}
                >
                  طلب أفراد (تجزئة)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch(OrderMode.WHOLESALE)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    isWholesale
                      ? 'bg-white text-[#141C15] shadow-xs'
                      : 'text-[#535E54] hover:text-[#141C15]'
                  }`}
                >
                  طلب جملة (كراتين)
                </button>
              </div>
            </div>

            {/* Variant Selection */}
            <div className="mb-6">
              <p className="text-xs font-medium text-[#535E54] mb-2">اختر العبوة:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((item) => {
                  const active = item.id === variant.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleVariantChange(item)}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#2B4C2F] text-white border-[#2B4C2F] font-medium'
                          : 'bg-[#F9FAF8] text-[#141C15] border-[#E2E6DC] hover:border-[#2B4C2F]/50'
                      }`}
                    >
                      {isWholesale ? item.wholesaleUnitLabel : item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price + Quantity + Confirm */}
          <div className="pt-4 border-t border-[#E2E6DC]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs text-[#535E54] block">الإجمالي للكمية المختارة</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display text-2xl font-bold text-[#141C15] tabular-nums">
                    {unitPrice * qty}
                  </span>
                  <span className="text-sm text-[#535E54]">شيكل</span>
                </div>
              </div>

              <div className="flex items-center border border-[#D4DACB] rounded-lg bg-[#F9FAF8]">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(minQty, prev - 1))}
                  aria-label="إنقاص الكمية"
                  className="w-10 h-10 flex items-center justify-center text-[#141C15] hover:bg-[#F1F3EE] rounded-r-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  aria-label="زيادة الكمية"
                  className="w-10 h-10 flex items-center justify-center text-[#141C15] hover:bg-[#F1F3EE] rounded-l-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product, variant, qty, localMode);
                onClose();
              }}
              className="w-full py-3 px-6 rounded-lg bg-[#2B4C2F] text-white text-sm font-semibold hover:bg-[#213B24] transition-colors cursor-pointer"
            >
              إضافة إلى سلة الطلبية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
