'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';

export default function WishlistPage() {
  const t = useTranslations('common');
  const tCart = useTranslations('cart');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const { wishlistData, removeItem: removeWishlistItem, isInWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeWishlistItem(productId);
  };

  const handleMoveToCart = async (product: any) => {
    await addToCart(product);
    // Also remove from wishlist
    await removeWishlistItem(product._id);
  };

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto px-4">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const wishlistProducts = wishlistData?.products || [];
  const isEmpty = wishlistProducts.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-8 pb-16 px-4">
      <InteractiveGrid className="pointer-events-none fixed inset-0 -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
            {t('wishlist')}
          </h1>
          <p className="mt-2 text-foreground-muted">
            {wishlistProducts.length === 1
              ? `${wishlistProducts.length} ${tProduct('item')}`
              : `${wishlistProducts.length} ${t('items')}`}
          </p>
        </div>

        {/* Empty State */}
        {isEmpty && (
          <div className="glass rounded-3xl border border-border p-12 md:p-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Heart className="size-10 text-foreground-muted" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('wishlist')}</h2>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto">
              {tCart.emptyDesc || 'Your wishlist is empty. Start adding products you love!'}
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = '/shop'}
              className="gap-2"
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {t('continueShopping') || 'Continue Shopping'}
            </Button>
          </div>
        )}

        {/* Wishlist Grid */}
        {!isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                variant="wishlist"
                onAddToCart={() => handleMoveToCart(product)}
                onAddToWishlist={() => handleRemoveFromWishlist(product._id)}
                isInWishlist={true}
                showWishlistActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}