'use client';

import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { SafeImage } from '@/components/shared/SafeImage';
import { useProductDetails } from '@/hooks/useProductDetails';
import { useProductReviews } from '@/hooks/useProductReviews';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/api';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductCard } from '@/components/ui/ProductCard';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('product');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: productData, isLoading: productLoading, error: productError } = useProductDetails(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(id);
  const { data: relatedProductsData, isLoading: relatedLoading } = useProducts({
    category: productData?.data?.category?._id ? [productData.data.category._id] : undefined,
    limit: 4,
    sortBy: '-createdAt',
  });

  // Cart & Wishlist stores
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const product = productData?.data;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = product ? isInWishlist(product._id) : false;

  // Fix: Properly type allImages as string[]
  const allImages: string[] = product?.images?.length
    ? product.images.filter((img): img is string => Boolean(img))
    : (product?.imageCover ? [product.imageCover] : []);

  if (productLoading) {
    return <ProductDetailsSkeleton t={t} />;
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl text-center">
        <h1 className="text-2xl font-bold mb-4">{t('notFound')}</h1>
        <p className="text-foreground-muted mb-6">{t('notFoundDesc')}</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
          <ChevronLeft className="size-4" />
          {t('backToShop')}
        </Link>
      </div>
    );
  }

  // Fix: Proper boolean type for hasDiscount
  const hasDiscount = Boolean(product.priceAfterDiscount && product.priceAfterDiscount < product.price);
  const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const originalPrice = hasDiscount ? product.price : null;
  // Fix: Proper number type for discountPercent
  const discountPercent: number = hasDiscount ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100) : 0;

  // Use shared formatPrice utility with 0 decimal places for product display
  const formattedPrice = formatPrice(displayPrice, locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedOriginalPrice = originalPrice
    ? formatPrice(originalPrice, locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : null;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.quantity || 10)));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product._id}`)}`);
      return;
    }
    try {
      await addToCart(product);
    } catch (error) {
      // Error handled in store (shows toast, redirects on 401)
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${product._id}`)}`);
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

  const relatedProducts = relatedProductsData?.data.filter((p) => p._id !== product._id) || [];

  return (
    <div className="relative min-h-screen">
      {/* Interactive Background */}
      <InteractiveGrid />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-foreground-muted" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            {t('shop')}
          </Link>
          <ChevronRight className={cn('size-4 flex-shrink-0', isRTL && 'rotate-180')} aria-hidden="true" />
          {product.category && (
            <Link
              href={`/shop?category=${product.category._id}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          )}
          {product.category && (
            <>
              <ChevronRight className={cn('size-4 flex-shrink-0', isRTL && 'rotate-180')} aria-hidden="true" />
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]" aria-current="page">
            {product.title}
          </span>
        </nav>

        {/* Main Grid - Natural RTL flow: Image first, then Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery - First in DOM = Left in LTR, Right in RTL (natural grid flow) */}
          <div className="relative">
            <ProductImageGallery
              images={allImages}
              selectedIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
              hasDiscount={hasDiscount}
              discountPercent={discountPercent}
              isRTL={isRTL}
              productTitle={product.title}
            />
          </div>

          {/* Product Details - Second in DOM = Right in LTR, Left in RTL */}
          <div className="flex flex-col">
            <ProductDetailsContent
              product={product}
              hasDiscount={hasDiscount}
              discountPercent={discountPercent}
              formattedPrice={formattedPrice}
              formattedOriginalPrice={formattedOriginalPrice}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
              isRTL={isRTL}
              reviewsCount={reviewsData?.results || product.ratingsQuantity || 0}
              t={t}
            />
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="mt-16 lg:mt-24" id="reviews">
          <ProductReviews
            reviews={reviewsData?.data || []}
            isLoading={reviewsLoading}
            productId={id}
            isRTL={isRTL}
          />
        </div>

        {/* Related Products Section */}
        {(relatedProducts.length > 0 || relatedLoading) && (
          <div className="mt-20 lg:mt-24">
            <h2 className="text-2xl font-bold mb-8">{t('relatedProducts')}</h2>
            {relatedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} priority />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductImageGallery({
  images,
  selectedIndex,
  onSelectImage,
  hasDiscount,
  discountPercent,
  isRTL,
  productTitle,
}: {
  images: string[];
  selectedIndex: number;
  onSelectImage: (index: number) => void;
  hasDiscount: boolean;
  discountPercent: number;
  isRTL: boolean;
  productTitle: string;
}) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <SafeImage
              src={images[selectedIndex] || images[0]}
              alt={`${productTitle} - Image ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Sale Badge */}
        {hasDiscount && (
          <div className={cn(
            'absolute top-4 z-10 px-3 py-1.5 rounded-full text-sm font-bold bg-red-500 text-white',
            isRTL ? 'right-4' : 'left-4'
          )}>
            -{discountPercent}%
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onSelectImage((selectedIndex - 1 + images.length) % images.length)}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10',
                'text-foreground hover:bg-white/10 transition-colors',
                isRTL ? 'right-4' : 'left-4'
              )}
              aria-label="Previous image"
            >
              {isRTL ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </button>
            <button
              onClick={() => onSelectImage((selectedIndex + 1) % images.length)}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10',
                'text-foreground hover:bg-white/10 transition-colors',
                isRTL ? 'left-4' : 'right-4'
              )}
              aria-label="Next image"
            >
              {isRTL ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className={cn(
            'flex gap-3 overflow-x-auto pb-2 scrollbar-hide',
            'scroll-snap-x scroll-snap-mandatory'
          )}
          role="list"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => onSelectImage(index)}
              className={cn(
                'relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                'scroll-snap-start snap-center',
                index === selectedIndex
                  ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'border-transparent hover:border-white/20'
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : 'false'}
            >
              <SafeImage
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetailsContent({
  product,
  hasDiscount,
  discountPercent,
  formattedPrice,
  formattedOriginalPrice,
  quantity,
  onQuantityChange,
  onAddToCart,
  onWishlist,
  isRTL,
  reviewsCount,
  t,
}: {
  product: Product;
  hasDiscount: boolean;
  discountPercent: number;
  formattedPrice: string;
  formattedOriginalPrice: string | null;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
  onWishlist: () => void;
  isRTL: boolean;
  reviewsCount: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Category & Brand */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-muted">
        {product.category && <span>{product.category.name}</span>}
        {product.category && product.brand && <span>•</span>}
        {product.brand && <span>{product.brand.name}</span>}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
        {product.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <div className="flex items-center gap-0.5" aria-label={`${product.ratingsAverage} out of 5 stars`}>
            <Star className="size-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="text-lg font-medium text-foreground">
              {product.ratingsAverage?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-sm text-foreground-muted">
            ({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
          </span>
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl md:text-4xl font-bold text-primary">
          {formattedPrice}
        </span>
        {hasDiscount && formattedOriginalPrice && (
          <span className="text-xl text-foreground-muted line-through">
            {formattedOriginalPrice}
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-1 rounded-full text-sm font-semibold bg-red-500/10 text-red-500">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Description */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold mb-3">{t('description')}</h3>
        <p className="text-foreground-muted line-clamp-4 whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold mb-4">{t('quantity')}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => onQuantityChange(-1)}
              disabled={quantity <= 1}
              className={cn(
                'p-3 text-foreground hover:bg-white/5 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="size-5" />
            </button>
            <span className="w-12 text-center text-lg font-medium text-foreground select-none">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              disabled={quantity >= (product.quantity || 10)}
              className={cn(
                'p-3 text-foreground hover:bg-white/5 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Increase quantity"
            >
              <Plus className="size-5" />
            </button>
          </div>
          <span className="text-sm text-foreground-muted">
            ({t('inStock', { count: product.quantity || 0 })})
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="border-t border-white/10 pt-6 space-y-3">
        <button
          onClick={onAddToCart}
          className={cn(
            'relative overflow-hidden flex items-center justify-center gap-2',
            'w-full py-4 px-6 rounded-xl font-semibold text-lg',
            'bg-primary text-primary-foreground',
            'hover:bg-primary-hover transition-colors',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
          )}
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          <span>{t('addToCart')}</span>
        </button>
        <button
          onClick={onWishlist}
          className={cn(
            'flex items-center justify-center gap-2',
            'w-full py-4 px-6 rounded-xl font-semibold text-lg',
            'bg-white/5 border border-white/10 text-foreground',
            'hover:bg-white/10 hover:border-primary/50 transition-colors'
          )}
        >
          <Heart className="size-5" aria-hidden="true" />
          <span>{t('addToWishlist')}</span>
        </button>
      </div>

      {/* Meta Info */}
      <div className="border-t border-white/10 pt-6 space-y-2 text-sm text-foreground-muted">
        <div className="flex gap-2">
          <span className="font-medium">{t('sku')}:</span>
          <span>{product._id.slice(-8).toUpperCase()}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">{t('category')}:</span>
          <span>{product.category?.name}</span>
        </div>
        {product.brand && (
          <div className="flex gap-2">
            <span className="font-medium">{t('brand')}:</span>
            <span>{product.brand.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductDetailsSkeletonProps {
  t: ReturnType<typeof useTranslations>;
}

function ProductDetailsSkeleton({ t }: ProductDetailsSkeletonProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="aspect-square rounded-2xl bg-white/5" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl bg-white/10" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="flex flex-col space-y-6 animate-pulse">
          <div className="h-4 w-1/3 bg-white/10 rounded" />
          <div className="h-10 w-3/4 bg-white/10 rounded" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 bg-white/10 rounded" />
            <div className="h-5 w-20 bg-white/10 rounded" />
          </div>
          <div className="flex items-baseline gap-3">
            <div className="h-10 w-32 bg-white/10 rounded" />
            <div className="h-7 w-24 bg-white/10 rounded" />
          </div>
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="h-5 w-1/4 bg-white/10 rounded" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="h-5 w-1/4 bg-white/10 rounded mb-4" />
            <div className="flex items-center gap-4">
              <div className="h-12 w-32 bg-white/10 rounded" />
              <div className="h-5 w-20 bg-white/10 rounded" />
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="h-12 w-full bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}