import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderDrawer } from './components/OrderDrawer';
import { FacilityWholesaleSection } from './components/FacilityWholesaleSection';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { Footer } from './components/Footer';
import { PRODUCTS, SAMPLE_ORDERS } from './data/products';
import {
  CartItem,
  CustomerOrder,
  OrderMode,
  Product,
  ProductCategory,
  ProductVariant,
  WholesaleQuoteRequest,
} from './types/order';

const CART_STORAGE_KEY = 'zadna_cart_v1';
const ORDERS_STORAGE_KEY = 'zadna_orders_v1';

const CATEGORY_TABS: ProductCategory[] = [
  ProductCategory.ALL,
  ProductCategory.PICKLES,
  ProductCategory.OILS,
  ProductCategory.PRESERVES,
  ProductCategory.DATES_TAHINI,
  ProductCategory.GRAINS,
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.ALL);
  const [orderMode, setOrderMode] = useState<OrderMode>(OrderMode.RETAIL);
  const [searchQuery, setSearchQuery] = useState('');

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CustomerOrder[];
        return parsed.length > 0 ? parsed : SAMPLE_ORDERS;
      }
      return SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<{
    product: Product;
    variantId?: string;
  } | null>(null);
  const [activeTrackOrderNumber, setActiveTrackOrderNumber] = useState(
    orders[0]?.orderNumber ?? 'ZDN-1042'
  );
  const [, setWholesaleQuotes] = useState<WholesaleQuoteRequest[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === ProductCategory.ALL || product.category === selectedCategory;
      const matchesSearch =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.shortDesc.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalCartUnits = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (
    product: Product,
    variant: ProductVariant,
    qty: number,
    explicitMode?: OrderMode
  ) => {
    const modeToUse = explicitMode ?? orderMode;
    const isWholesale = modeToUse === OrderMode.WHOLESALE;
    const unitPrice = isWholesale ? variant.wholesalePrice : variant.retailPrice;
    const variantLabel = isWholesale ? variant.wholesaleUnitLabel : variant.label;
    const key = `${product.id}__${variant.id}__${modeToUse}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          image: product.image,
          variantId: variant.id,
          variantLabel,
          unitPrice,
          quantity: qty,
          mode: modeToUse,
        },
      ];
    });
  };

  const handleUpdateQty = (key: string, nextQty: number) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: nextQty } : item))
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleOrderCreated = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackOrderNumber(newOrder.orderNumber);
  };

  const handleJumpToTrack = (orderNumber: string) => {
    setActiveTrackOrderNumber(orderNumber);
    const el = document.getElementById('tracking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF8] text-[#141C15]">
      <Navbar cartCount={totalCartUnits} onOpenCart={() => setIsDrawerOpen(true)} />

      <main className="flex-1">
        <HeroSection />

        {/* Section 2: Product Catalog & Direct Ordering Workspace */}
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-medium text-[#535E54] mb-2">
                الكتالوج المباشر · أسعار المصنع المحدثة
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141C15] text-balance">
                منتجات زادنا الغذائية والزراعية
              </h2>
            </div>

            {/* Retail vs Wholesale Tier Selector (inside Catalog Toolbar) */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-[#535E54]">فئة الطلب:</span>
              <div className="inline-flex p-1 bg-[#F1F3EE] rounded-lg border border-[#E2E6DC]">
                <button
                  type="button"
                  onClick={() => setOrderMode(OrderMode.RETAIL)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    orderMode === OrderMode.RETAIL
                      ? 'bg-white text-[#141C15] shadow-xs'
                      : 'text-[#535E54] hover:text-[#141C15]'
                  }`}
                >
                  طلب أفراد (تجزئة)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderMode(OrderMode.WHOLESALE)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    orderMode === OrderMode.WHOLESALE
                      ? 'bg-white text-[#141C15] shadow-xs'
                      : 'text-[#535E54] hover:text-[#141C15]'
                  }`}
                >
                  طلب جملة (كراتين)
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Category Tabs + Live Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E2E6DC]">
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
              role="tablist"
              aria-label="تصنيفات المنتجات"
            >
              {CATEGORY_TABS.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#2B4C2F] text-white'
                        : 'bg-[#F1F3EE] text-[#535E54] hover:text-[#141C15] hover:bg-[#E7EBE2]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المنتج أو رقم الصنف..."
                aria-label="ابحث في منتجات زادنا"
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-[#D4DACB] bg-white text-sm focus:outline-none focus:border-[#2B4C2F]"
              />
              <Search className="w-4 h-4 text-[#535E54] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  orderMode={orderMode}
                  onAddToCart={(p, v, q) => handleAddToCart(p, v, q)}
                  onOpenDetail={(p, variantId) => setDetailTarget({ product: p, variantId })}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-xl border border-[#E2E6DC]">
              <p className="font-display text-lg font-semibold text-[#141C15] mb-2">
                لا توجد منتجات مطابقة لبحثك
              </p>
              <p className="text-sm text-[#535E54] mb-5">
                جرب البحث بكلمة أخرى أو إعادة عرض جميع تصنيفات شركة زادنا.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(ProductCategory.ALL);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-[#2B4C2F] text-white text-xs font-medium hover:bg-[#213B24] transition-colors cursor-pointer"
              >
                عرض جميع المنتجات
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Manufacturing Facility & Wholesale Quote Form */}
        <FacilityWholesaleSection
          onQuoteSubmitted={(quote) => setWholesaleQuotes((prev) => [quote, ...prev])}
        />

        {/* Section 4: Order Tracking & History */}
        <OrderTrackingSection
          orders={orders}
          activeOrderNumber={activeTrackOrderNumber}
          onSelectOrderNumber={setActiveTrackOrderNumber}
        />
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailTarget?.product ?? null}
        initialVariantId={detailTarget?.variantId}
        orderMode={orderMode}
        onClose={() => setDetailTarget(null)}
        onAddToCart={(p, v, q, mode) => handleAddToCart(p, v, q, mode)}
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <OrderDrawer
        isOpen={isDrawerOpen}
        items={cartItems}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onOrderCreated={handleOrderCreated}
        onJumpToTrack={handleJumpToTrack}
      />
    </div>
  );
}
