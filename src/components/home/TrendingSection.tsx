'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/navigation';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import { Product } from '@/types/api';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

interface TrendingProductCardProps {
  product: Product;
  index: number;
  isRTL: boolean;
  locale: string;
}

function TrendingProductCard({ product, index, isRTL, locale }: TrendingProductCardProps) {
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');
  const router = useRouter();

  // 3D Tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 0, 150], ['8deg', '0deg', '-8deg']);
  const rotateY = useTransform(x, [-150, 0, 150], ['-8deg', '0deg', '8deg']);

  // Glow position follows mouse
  const glowX = useTransform(x, [-150, 0, 150], ['20%', '50%', '80%']);
  const glowY = useTransform(y, [-150, 0, 150], ['20%', '50%', '80%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Cart & Wishlist stores
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id);

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

  const formattedPrice = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
      role="listitem"
    >
      <Link href={`/product/${product._id}`} className="block h-full flex flex-col" aria-label={product.title}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl overflow-hidden bg-white/5 dark:bg-black/30 border border-white/10 dark:border-white/5 flex-1 flex flex-col"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Dynamic Glow Shadow */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${glowX} ${glowY}, rgba(139, 92, 246, 0.25) 0%, transparent 70%)`,
              transform: 'translateZ(-20px)',
            }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Border Glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: `inset 0 0 0 1px rgba(139, 92, 246, 0.1)`,
            }}
          />

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-white/5">
            <SafeImage
              src={product.imageCover}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
            />

            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlist}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'absolute top-3 z-10 p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 hover:bg-white/20 hover:border-white/30 transition-all duration-300',
                isRTL ? 'left-3' : 'right-3',
                'md:opacity-0 md:group-hover:opacity-100',
                isWishlisted && 'text-primary border-primary opacity-100'
              )}
              aria-label={tCommon('wishlist')}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Heart
                className={cn('size-5 transition-transform', isWishlisted && 'fill-current')}
                aria-hidden="true"
              />
            </motion.button>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3 flex-1 flex flex-col" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
            {/* Category */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
            >
              {product.category?.name || t('category')}
            </motion.span>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors"
            >
              {product.title}
            </motion.h3>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <Star className="size-4 text-yellow-400 fill-current" aria-hidden="true" />
              <span>{product.ratingsAverage?.toFixed(1) || '4.5'}</span>
              <span className="text-white/40">({product.ratingsQuantity || '0'})</span>
            </motion.div>

            {/* Price & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
            >
              <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                <span className="text-xl font-bold text-primary">{formattedPrice}</span>
              </div>

              {/* Add to Cart Button - slides up */}
              <motion.button
                onClick={handleAddToCart}
                initial={{ y: '100%', opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium',
                  'transition-transform duration-300 ease-out',
                  'group-hover:translate-y-0'
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(40px)',
                }}
                aria-label={tCommon('addToCart')}
              >
                <ShoppingCart className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tCommon('addToCart')}</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

interface TrendingSectionProps {
  products: Product[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const t = useTranslations('landing');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Take first 8 products
  const displayProducts = products.slice(0, 8);

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-20" aria-labelledby="trending-title">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn('mb-12 md:mb-16', isRTL ? 'text-right' : 'text-left')}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium tracking-wide"
        >
          <Star className="size-4" aria-hidden="true" />
          {t('trendingBadge')}
        </motion.span>
        <motion.h2
          id="trending-title"
          initial={{ opacity: 0, y: 20, clipPath: 'inset(100% 0 0 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
        >
          {t('trendingTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-white/60 text-lg max-w-2xl"
        >
          {t('trendingDesc')}
        </motion.p>
      </motion.div>

      {/* Product Grid */}
      <div
        className={cn('grid gap-6', 'grid-cols-2 md:grid-cols-4', isRTL ? '[direction:rtl]' : '')}
        role="list"
        aria-label={t('trendingProducts')}
      >
        {displayProducts.map((product, index) => (
          <TrendingProductCard
            key={product.id}
            product={product}
            index={index}
            isRTL={isRTL}
            locale={locale}
          />
        ))}

        {/* Placeholder cards if less than 8 products */}
        {displayProducts.length < 8 && Array.from({ length: 8 - displayProducts.length }).map((_, i) => {
          const placeholderProduct = {
            id: `placeholder-${i}`,
            title: t('placeholderTitle'),
            slug: '',
            price: 0,
            imageCover: '',
            ratingsAverage: 0,
            ratingsQuantity: 0,
            category: { name: t('placeholderCategory') },
          } as Product;

          return (
            <TrendingProductCard
              key={`placeholder-${i}`}
              product={placeholderProduct}
              index={displayProducts.length + i}
              isRTL={isRTL}
              locale={locale}
            />
          );
        })}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          {t('viewAllProducts')}
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}