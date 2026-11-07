'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { Truck, Shield, RotateCcw, ArrowDown } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/magicui/ShimmerButton';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/api';

interface HeroSectionProps {
  product?: Product | null;
  products?: Product[];
}

export function HeroSection({ product, products }: HeroSectionProps) {
  // Props accepted for compatibility but not used in new design
  void product; void products;
  const t = useTranslations('landing');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden pt-28 pb-16"
      aria-labelledby="hero-title"
    >
      {/* Interactive Grid Background */}
      <InteractiveGrid />

      {/* Subtle Radial Glow Behind Text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-full max-h-[800px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Content Container - Center Aligned */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full px-4 md:px-6">
        {/* Badge - Glassmorphism Pill */}
        <motion.span
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-sm font-medium tracking-wide backdrop-blur-xl"
        >
          <motion.span
            className="size-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          {t('futureEcommerce') || '✨ The Future of E-Commerce'}
        </motion.span>

        {/* Headline - Huge, Bold, Tracking Tight */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mt-6 leading-[1.1] tracking-tight"
        >
          {t('elevateLifestyle') || 'Elevate Your Lifestyle.'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl leading-relaxed"
        >
          {t('heroSubtitle') || 'Discover the finest curated collection of premium products, engineered for those who demand excellence.'}
        </motion.p>

        {/* Buttons - Shop Now + Explore Collections Stacked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-10 flex flex-col items-center gap-4 w-full"
        >
          {/* Primary: ShimmerButton wrapped in Link for locale-aware routing */}
          <Link href="/shop">
            <ShimmerButton
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
            >
              <span className="flex items-center gap-2">
                {tCommon('shopNow') || 'Shop Now'}
              </span>
            </ShimmerButton>
          </Link>

          {/* Secondary: Explore Collections - Tiny elegant text link with arrow */}
          <button
            onClick={() => document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth' })}
            onKeyDown={(e) => e.key === 'Enter' && document.getElementById('next-section')?.scrollIntoView({ behavior: 'smooth' })}
            tabIndex={0}
            role="button"
            className="flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mt-4 group"
          >
            <span className="tracking-widest uppercase text-xs">{tCommon('browseCollection') || 'Explore Collections'}</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </motion.div>
          </button>
        </motion.div>

        {/* Bento Features Grid - 3 Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 w-full max-w-4xl"
          role="list"
        >
          {/* Card 1: Fast Delivery */}
          <motion.article
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            role="listitem"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary/20 to-violet-500/20">
              <Truck className="size-7 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('fastDelivery') || 'Fast Delivery'}</h3>
            <p className="text-sm text-muted-foreground">{t('fastDeliveryDesc') || 'Free shipping on orders over 500 EGP'}</p>
          </motion.article>

          {/* Card 2: Secure Payment */}
          <motion.article
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            role="listitem"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Shield className="size-7 text-cyan-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('securePayment') || 'Secure Payment'}</h3>
            <p className="text-sm text-muted-foreground">{t('securePaymentDesc') || '100% secure payment gateway'}</p>
          </motion.article>

          {/* Card 3: Easy Returns */}
          <motion.article
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            role="listitem"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <RotateCcw className="size-7 text-emerald-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('easyReturns') || 'Easy Returns'}</h3>
            <p className="text-sm text-muted-foreground">{t('easyReturnsDesc') || '30-day hassle-free returns'}</p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}