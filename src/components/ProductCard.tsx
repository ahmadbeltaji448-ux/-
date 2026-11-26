import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { OrderMode, Product, ProductVariant } from '../types/order';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  orderMode: OrderMode;
  onAddToCart: (product: Product, variant: ProductVariant, qty: number) => void;
  onOpenDetail: (product: Product, selectedVariantId: string) => void;
}

export function ProductCard({ product, orderMode, onAddToCart, onOpenDetail }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  const isWholesale = orderMode === OrderMode.WHOLESALE;
  const price = isWholesale ? selectedVariant.wholesalePrice : selectedVariant.retailPrice;
  const minQty = isWholesale ? selectedVariant.minWholesaleQty : 1;

  const handleQuickAdd = () => {
    onAddToCart(product, selectedVariant, minQty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group bg-white rounded-xl border border-[#E2E6DC] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      {/* 4:3 Studio Product Photography */}
      <button
        type="button"
        onClick={() => onOpenDetail(product, selectedVariant.id)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F3EE] cursor-pointer text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4C2F]"
        aria-label={`عرض تفاصيل ${product.name}`}
      >
        <ResilientImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${product.imagePosition ?? 'object-center'}`}
        />
      </button>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Clean Unboxed Metadata (Zero-Pill Rule) */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#535E54] mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{product.sku}</span>
          </div>
          {product.featuredTag && (
            <span className="text-[#2B4C2F] font-medium whitespace-nowrap shrink-0">
              {product.featuredTag}
            </span>
          )}
        </div>

        <h3 className="font-display text-base font-semibold text-[#141C15] mb-1.5 leading-snug">
          <button
            type="button"
            onClick={() => onOpenDetail(product, selectedVariant.id)}
            className="text-start hover:text-[#2B4C2F] transition-colors cursor-pointer"
          >
            {product.name}
          </button>
        </h3>

        <p className="text-sm text-[#535E54] leading-relaxed mb-4 line-clamp-2">
          {product.shortDesc}
        </p>

        {/* Interactive Pack Size Variant Selector */}
        <div className="mb-4 mt-auto">
          <p className="text-xs text-[#535E54] mb-2">
            {isWholesale ? 'تعبئة الجملة:' : 'حجم العبوة:'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((variant) => {
              const active = variant.id === selectedVariant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#2B4C2F] text-white border-[#2B4C2F] font-medium'
                      : 'bg-[#F9FAF8] text-[#141C15] border-[#E2E6DC] hover:border-[#2B4C2F]/50'
                  }`}
                >
                  {isWholesale ? variant.wholesaleUnitLabel : variant.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Baseline Price + Action */}
        <div className="pt-4 border-t border-[#E2E6DC] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#141C15] tabular-nums">{price}</span>
              <span className="text-xs font-medium text-[#535E54]">شيكل</span>
            </div>
            {isWholesale && (
              <p className="text-[11px] text-[#535E54] tabular-nums">
                الحد الأدنى: {minQty} وحدات
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4C2F] ${
              justAdded
                ? 'bg-[#1E3A22] text-white'
                : 'bg-[#2B4C2F] text-white hover:bg-[#213B24]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{isWholesale ? `إضافة (${minQty})` : 'إضافة للطلبية'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
