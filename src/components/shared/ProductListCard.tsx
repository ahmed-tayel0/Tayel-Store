'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/api';
import { SafeImage } from '@/components/shared/SafeImage';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

interface ProductListCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductListCard({ product, priority = false }: ProductListCardProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  // Cart & Wishlist stores
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id);

  const formattedPrice = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  // Check if user is authenticated (localStorage-only)
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(product);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className={cn(
        'group flex flex-col md:flex-row items-stretch w-full gap-4 p-4',
        'md:rtl:flex-row-reverse',
        'bg-white/5 border border-white/10 rounded-2xl',
        'hover:border-primary/50 hover:bg-white/10 transition-all duration-300',
        'overflow-hidden'
      )}
      aria-label={product.title}
    >
      {/* Product Image - Full width on mobile, fixed on desktop */}
      <div className={cn(
        'relative w-full aspect-[4/3] md:w-48 md:h-48 md:aspect-auto md:shrink-0 overflow-hidden rounded-xl',
        'bg-white/5'
      )}>
        <SafeImage
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Sale Badge - Top Left of Image */}
        {product.price > 0 && (
          <div className={cn(
            'absolute top-3',
            isRTL ? 'right-3' : 'left-3',
            'px-2 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground',
            'opacity-100 transition-opacity duration-300'
          )}>
            {t('sale')}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 w-full">
        {/* Top: Category, Title, Description, Rating */}
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            {product.category?.name || product.brand?.name || t('product')}
          </p>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-foreground-muted line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5" aria-label={`${product.ratingsAverage} out of 5 stars`}>
              <Star className="size-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                {product.ratingsAverage?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-xs text-foreground-muted">
              ({product.ratingsQuantity || 0} {t('reviews')})
            </span>
          </div>
        </div>

        {/* Bottom: Price + Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-white/10 mt-auto">
          {/* Price */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-foreground">
              {formattedPrice}
            </span>
          </div>

          {/* Actions: Add to Cart + Wishlist */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full',
                'bg-primary text-primary-foreground font-medium',
                'shadow-lg shadow-primary/30',
                'hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/50',
                'transition-all duration-300 ease-out',
                'whitespace-nowrap',
                'md:flex-1 md:justify-center'
              )}
              aria-label={t('addToCart')}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('addToCart')}</span>
            </button>

            <button
              onClick={handleWishlist}
              className={cn(
                'p-2.5 rounded-full',
                'bg-white/5 border border-white/10',
                'text-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10',
                'transition-all duration-300',
                isWishlisted && 'text-primary border-primary bg-primary/10'
              )}
              aria-label={t('wishlist')}
            >
              <Heart
                className={cn('size-5 transition-transform', isWishlisted && 'fill-current')}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}