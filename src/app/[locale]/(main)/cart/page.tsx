'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Truck,
  Shield,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { SafeImage } from '@/components/shared/SafeImage';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { AlertDialog } from '@/components/ui/alert-dialog';

export default function CartPage() {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const { cartData, fetchCart, updateQuantity, removeItem, clear, getItemCount, getTotalPrice, isLoading } = useCartStore();

  const [removeItemId, setRemoveItemId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Particle state for empty state animation (client-side only to avoid hydration error)
  const [particles, setParticles] = useState<Array<{ top: string; left: string; opacity: number; duration: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 6 }).map(() => ({
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = cartData?.products || [];
  const itemCount = getItemCount();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 500 ? 0 : 30; // Free shipping over 500 EGP
  const tax = subtotal * 0.14; // 14% tax
  const total = subtotal + shipping + tax;

  // Wrapper to pass locale to the shared formatPrice utility
  const formatPriceWithLocale = (price: number) => formatPrice(price, locale);

  const handleQuantityChange = async (productId: string, newCount: number) => {
    if (newCount < 1) return;
    try {
      await updateQuantity(productId, newCount);
      toast.success(t('quantityUpdated'));
    } catch (error) {
      toast.error(t('errorUpdating'));
    }
  };

  const handleRemoveItem = (productId: string) => {
    setRemoveItemId(productId);
  };

  const confirmRemoveItem = async () => {
    if (!removeItemId) return;
    try {
      await removeItem(removeItemId);
      toast.success(t('itemRemoved'));
    } catch (error) {
      toast.error(t('errorRemoving'));
    }
    setRemoveItemId(null);
  };

  const handleClearCart = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCart = async () => {
    try {
      await clear();
      toast.success(t('cartCleared'));
    } catch (error) {
      toast.error(t('errorClearing'));
    }
    setShowClearConfirm(false);
  };

  const handleCheckout = () => {
    if (itemCount === 0) return;
    // Check if user is logged in by checking localStorage (localStorage-only auth)
    const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }
    router.push('/checkout');
  };

  // Alert Dialogs
  const removeDialog = removeItemId ? (
    <AlertDialog
      open={true}
      onOpenChange={() => setRemoveItemId(null)}
      title={t('confirmRemove')}
      description=""
      confirmText={t('remove')}
      cancelText={tCommon('cancel')}
      onConfirm={confirmRemoveItem}
      variant="destructive"
    />
  ) : null;

  const clearDialog = (
    <AlertDialog
      open={showClearConfirm}
      onOpenChange={setShowClearConfirm}
      title={t('confirmClear')}
      description=""
      confirmText={t('clearCart')}
      cancelText={tCommon('cancel')}
      onConfirm={confirmClearCart}
      variant="destructive"
    />
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/10 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-24 h-24 bg-white/10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-1/2 bg-white/10 rounded" />
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-24 bg-white/10 rounded" />
                      <div className="h-4 w-16 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-white/5 border border-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (itemCount === 0) {
    return (
      <div className="relative min-h-screen">
        {/* Interactive Background */}
        <InteractiveGrid />

        <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center py-20 lg:py-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShoppingCart className="size-12 md:size-16 text-foreground-muted/50" aria-hidden="true" />
              </div>
              {/* Floating particles - rendered client-side only */}
              {particles.length > 0 && (
                <div className="absolute inset-0 -inset-4 pointer-events-none overflow-hidden rounded-2xl">
                  {particles.map((particle, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-primary/30"
                      style={{
                        top: particle.top,
                        left: particle.left,
                        opacity: particle.opacity,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                      transition={{ duration: particle.duration, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              {t('emptyTitle')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-foreground-muted max-w-md mx-auto mb-8"
            >
              {t('emptyDesc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push('/shop')}
                className="gap-2 min-w-[200px]"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                {t('continueShopping')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/shop')}
                className="gap-2 min-w-[200px]"
              >
                {tCommon('newArrivals')}
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-foreground-muted/70"
            >
              <div className="flex items-center gap-2">
                <Truck className="size-5" aria-hidden="true" />
                <span>{tCommon('fastDeliveryDesc')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-5" aria-hidden="true" />
                <span>{tCommon('securePaymentDesc')}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="size-5" aria-hidden="true" />
                <span>{tCommon('easyReturnsDesc')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="relative min-h-screen">
      {/* Interactive Background */}
      <InteractiveGrid />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-foreground-muted mt-1">
                {itemCount} {itemCount === 1 ? t('item') : t('items')} {t('inCart', { count: itemCount })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              className="text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-2"
              disabled={isLoading}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t('clearCart')}
            </Button>
          </div>
        </motion.div>

        {/* Main Grid: Cart Items + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - 2/3 width */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -100 : 100, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group"
                >
                  <CartItem
                    item={item}
                    index={index}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    formatPrice={formatPriceWithLocale}
                    locale={locale}
                    isRTL={isRTL}
                    t={t}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary - 1/3 width (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              itemCount={itemCount}
              onCheckout={handleCheckout}
              formatPrice={formatPriceWithLocale}
              t={t}
              tCommon={tCommon}
              isLoading={isLoading}
              isRTL={isRTL}
            />
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/shop')}
            className="gap-2"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t('continueShopping')}
          </Button>
        </motion.div>
      </div>
      {removeDialog}
      {clearDialog}
    </div>
  );
}

interface CartItemProps {
  item: {
    product: {
      _id: string;
      title: string;
      imageCover: string;
      price: number;
      priceAfterDiscount?: number;
      quantity: number;
    };
    count: number;
    price: number;
  };
  index: number;
  onQuantityChange: (productId: string, count: number) => Promise<void>;
  onRemove: (productId: string) => void | Promise<void>;
  formatPrice: (price: number) => string;
  locale: string;
  isRTL: boolean;
  t: ReturnType<typeof useTranslations>;
}

function CartItem({
  item,
  index,
  onQuantityChange,
  onRemove,
  formatPrice,
  locale,
  isRTL,
  t,
}: CartItemProps) {
  const product = item.product;
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const originalPrice = hasDiscount ? product.price : null;
  const maxQuantity = product.quantity || 10;

  return (
    <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all duration-300">
      {/* Product Image */}
      <Link
        href={`/product/${product._id}`}
        className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/5"
        aria-label={product.title}
      >
        <SafeImage
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className={cn('absolute top-2 z-10 px-1.5 py-0.5 rounded text-xs font-bold bg-red-500 text-white', isRTL ? 'right-2' : 'left-2')}>
            -{Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)}%
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/product/${product._id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {product.title}
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            <span className="text-lg font-bold text-primary">{formatPrice(displayPrice)}</span>
            {originalPrice && (
              <span className="text-sm text-foreground-muted line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                product.quantity > 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              )}
            >
              {product.quantity > 0 ? t('inStock') : t('outOfStock')}
            </span>
            {product.quantity > 0 && product.quantity < 10 && (
              <span className="text-xs text-foreground-muted">
                ({product.quantity} {t('left', { count: product.quantity })})
              </span>
            )}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3 border-t border-white/10">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(product._id, item.count - 1)}
              disabled={item.count <= 1}
              className="h-10 w-10 rounded-lg bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-50"
              aria-label={t('decreaseQuantity', { count: item.count })}
            >
              <Minus className="size-4" aria-hidden="true" />
            </Button>
            <span className="w-10 text-center text-lg font-medium text-foreground select-none">
              {item.count}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(product._id, item.count + 1)}
              disabled={item.count >= maxQuantity}
              className="h-10 w-10 rounded-lg bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-50"
              aria-label={t('increaseQuantity', { count: item.count })}
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(product._id)}
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10 gap-1 px-3 py-2"
            aria-label={t('remove')}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('remove')}</span>
          </Button>
        </div>
      </div>

      {/* Line Total - Mobile only */}
      <div className="hidden sm:block w-28 flex-shrink-0 flex items-center justify-end">
        <span className="text-lg font-bold text-foreground">
          {formatPrice(displayPrice * item.count)}
        </span>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
  formatPrice: (price: number) => string;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
  isLoading: boolean;
  isRTL: boolean;
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
  onCheckout,
  formatPrice,
  t,
  tCommon,
  isLoading,
  isRTL,
}: OrderSummaryProps) {
  const isFreeShipping = shipping === 0;

  return (
    <div className="sticky top-24">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">{t('orderSummary')}</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">{t('subtotal')} ({itemCount} {itemCount === 1 ? t('item') : t('items')})</span>
            <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted flex items-center gap-2">
              <Truck className="size-4" aria-hidden="true" />
              {t('shipping')}
            </span>
            <span className={cn('font-medium', isFreeShipping && 'text-green-400')}>
              {isFreeShipping ? t('shippingFree') : formatPrice(shipping)}
            </span>
          </div>

          {isFreeShipping && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="size-3" aria-hidden="true" />
              {t('shippingInfo')}
            </p>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted flex items-center gap-2">
              <Shield className="size-4" aria-hidden="true" />
              {t('tax')} (14%)
            </span>
            <span className="text-foreground font-medium">{formatPrice(tax)}</span>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>{t('grandTotal')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="border-t border-white/10 pt-4 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <Shield className="size-5 text-primary/50" aria-hidden="true" />
            <span>{tCommon('securePaymentDesc')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <RotateCcw className="size-5 text-primary/50" aria-hidden="true" />
            <span>{tCommon('easyReturnsDesc')}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={isLoading || itemCount === 0}
          className="w-full py-4 text-lg font-semibold gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span>
              {t('processing')}
            </>
          ) : (
            <>
              {t('checkout')}
              <ArrowRight className={cn('size-5', isRTL && 'rotate-180')} aria-hidden="true" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-foreground-muted/60 mt-4">
          {t('secureCheckout')}
        </p>
      </div>
    </div>
  );
}