'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { ShoppingCart, Heart, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { TiltCard } from '@/components/ui/aceternity/TiltCard';
import { cn } from '@/lib/utils';
import { Product } from '@/types/api';
import { useState } from 'react';
import { SafeImage } from '@/components/shared/SafeImage';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
  variant?: 'default' | 'wishlist';
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
  showWishlistActions?: boolean;
}

export function ProductCard({
  product,
  className,
  priority = false,
  variant = 'default',
  onAddToCart,
  onAddToWishlist,
  isInWishlist: isInWishlistProp,
  showWishlistActions = false
}: ProductCardProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  // Cart & Wishlist stores
  const { addItem: addToCart, getItemCount: getCartItemCount } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlistProp ?? isInWishlist(product._id);

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

    if (onAddToCart) {
      onAddToCart();
      return;
    }

    try {
      await addToCart(product);
      // Toast is shown in the store action
    } catch (error) {
      // Error is handled in the store action
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (onAddToWishlist) {
      onAddToWishlist();
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      // Error is handled in the store action
    }
  };

  const handleMoveToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (onAddToCart) {
      onAddToCart();
    } else {
      try {
        await addToCart(product);
      } catch (error) {
        // Error is handled in the store action
      }
    }
  };

  const handleRemoveFromWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (onAddToWishlist) {
      onAddToWishlist();
    } else {
      try {
        await removeFromWishlist(product._id);
      } catch (error) {
        // Error is handled in the store action
      }
    }
  };

  return (
    <TiltCard
      tiltStrength={6}
      glowColor="primary"
      className={cn(
        'group flex flex-col h-full overflow-hidden cursor-pointer',
        'transition-all duration-500',
        className
      )}
    >
      <Link href={`/product/${product._id}`} className="block h-full flex flex-col" aria-label={product.title}>
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
          <SafeImage
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlist}
            aria-label={t('wishlist')}
            className={cn(
              'absolute top-3',
              isRTL ? 'left-3' : 'right-3',
              'h-9 w-9 rounded-full bg-background/80 backdrop-blur-md border border-white/10',
              'text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300',
              'hover:bg-primary/20 hover:border-primary/50',
              isWishlisted && 'text-primary border-primary opacity-100',
              'flex items-center justify-center'
            )}
          >
            <Heart
              className={cn('size-5 transition-transform', isWishlisted && 'fill-current')}
              aria-hidden="true"
            />
          </button>

          {/* Sale Badge - Top Left */}
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

          {/* Add to Cart Button - Circular, floats over image on hover (default variant) */}
          {variant === 'default' && (
            <button
              onClick={handleAddToCart}
              aria-label={t('addToCart')}
              className={cn(
                'absolute bottom-4',
                isRTL ? 'left-4' : 'right-4',
                'w-12 h-12 rounded-full bg-primary text-white',
                'flex items-center justify-center',
                'shadow-lg shadow-primary/40',
                'opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0',
                'transition-all duration-300 ease-out',
                'hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/50 hover:scale-105'
              )}
            >
              <ShoppingCart className="size-5" aria-hidden="true" />
            </button>
          )}

          {/* Wishlist Actions - Bottom overlay (wishlist variant) */}
          {variant === 'wishlist' && showWishlistActions && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {/* Move to Cart Button */}
                <Button
                  onClick={handleMoveToCart}
                  className="flex-1 gap-2 bg-primary hover:bg-primary-hover"
                  size="sm"
                  aria-label={t('moveToCart') || 'Move to Cart'}
                >
                  <ShoppingBag className="size-4" aria-hidden="true" />
                  <span>{t('moveToCart') || 'Move to Cart'}</span>
                </Button>
                {/* Remove from Wishlist Button */}
                <Button
                  onClick={handleRemoveFromWishlist}
                  variant="outline"
                  className="h-10 w-10 rounded-lg border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-500"
                  size="icon"
                  aria-label={t('removeFromWishlist') || 'Remove from Wishlist'}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2">
            <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
              {product.category?.name || product.brand?.name || t('product')}
            </p>
          </div>

          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-lg font-bold text-foreground">
              {formattedPrice}
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}