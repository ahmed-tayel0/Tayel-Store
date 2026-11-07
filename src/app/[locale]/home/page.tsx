'use client';

import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { HeroSection } from '@/components/home/HeroSection';
import { BentoSection } from '@/components/home/BentoSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { BrandPromise } from '@/components/home/BrandPromise';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');

  const { data: productsResponse, isLoading, isError, refetch } = useProducts();

  const products = productsResponse?.data || [];

  const handleRetry = () => {
    refetch();
  };

  // Loading Skeletons matching the final layout
  const LoadingSkeletons = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-16 md:space-y-24"
    >
      {/* Hero Skeleton */}
      <SkeletonCard variant="hero" className="h-[80vh] min-h-[600px] max-h-[900px] rounded-3xl" />

      {/* Bento Skeletons */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        <SkeletonCard variant="hero" className="md:col-span-2 row-span-2 min-h-[400px] md:min-h-[500px] rounded-3xl" />
        <SkeletonCard variant="hero" className="min-h-[240px] rounded-2xl" />
        <SkeletonCard variant="hero" className="min-h-[240px] rounded-2xl" />
        <SkeletonCard variant="hero" className="min-h-[240px] rounded-2xl bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30" />
        <SkeletonCard variant="hero" className="md:col-span-3 min-h-[300px] rounded-3xl" />
      </div>

      {/* Trending Skeletons */}
      <div className="space-y-8">
        <div className="space-y-4">
          <SkeletonCard variant="hero" className="h-8 w-48 rounded-full" />
          <SkeletonCard variant="hero" className="h-6 w-96 rounded-full max-w-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} variant="product" />
          ))}
        </div>
      </div>

      {/* Brand Promise Skeleton */}
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <SkeletonCard variant="hero" className="h-10 w-64 rounded-full" />
          <SkeletonCard variant="hero" className="h-6 w-96 rounded-full max-w-full" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} variant="hero" className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <SkeletonCard variant="hero" className="aspect-[4/5] md:aspect-[3/4] lg:aspect-[1/1] rounded-3xl" />
      </div>
    </motion.div>
  );

  // Error State
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[70vh] flex items-center justify-center bg-background px-4"
      >
        <div className="text-center glass p-8 md:p-12 rounded-3xl max-w-md mx-auto border border-white/10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white mb-3"
          >
            {tCommon('error')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/60 mb-6"
          >
            {t('errorDescription')}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tCommon('retry')}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Loading State
  if (isLoading) {
    return <LoadingSkeletons />;
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[70vh] flex items-center justify-center bg-background px-4"
      >
        <div className="text-center glass p-8 md:p-12 rounded-3xl max-w-md mx-auto border border-white/10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-white mb-3"
          >
            {t('noProductsTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/60"
          >
            {t('noProductsDesc')}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Success State - Render all sections
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section - First product */}
      {products[0] && <HeroSection product={products[0]} />}

      {/* Bento Section - Next 5 products (indices 1-5) */}
      {products.length > 1 && <BentoSection id="next-section" products={products.slice(1, 6)} />}

      {/* Trending Section - Next 8 products (indices 6-13) */}
      {products.length > 6 && <TrendingSection products={products.slice(6, 14)} />}

      {/* Brand Promise Section */}
      <BrandPromise />
    </motion.div>
  );
}