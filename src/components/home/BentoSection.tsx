'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Truck, Timer, Sparkles, ArrowRight, Users, Store, Headphones } from 'lucide-react';
import { MagicCard } from '@/components/ui/magicui/MagicCard';
import { SafeImage } from '@/components/shared/SafeImage';
import { Product } from '@/types/api';
import { cn } from '@/lib/utils';

interface BentoSectionProps {
  products: Product[];
  id?: string;
}

export function BentoSection({ products, id }: BentoSectionProps) {
  const t = useTranslations('landing');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set countdown to end of current day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = endOfDay.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  // Product indices: 0=hero, 1=bento-card1, 2=bento-card3, 3=extra
  const card1Product = products[1] || products[0];
  const card3Product = products[2] || products[1];
  const card5Product = products[3] || products[2];

  return (
    <section id={id} className="relative w-full py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-20" aria-labelledby="bento-title">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn('grid gap-6', 'grid-cols-1 md:grid-cols-4', isRTL ? '[direction:rtl]' : '')}
        role="list"
        aria-label={t('bentoSection')}
      >
        {/* CARD 1: Span 2 cols, Tall - Cinematic Product Card */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 md:col-span-2 row-span-2 min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden group"
          role="listitem"
        >
          <SafeImage
            src={card1Product?.imageCover}
            alt={card1Product?.title || ''}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: isRTL
                ? 'linear-gradient(to left, #000 20%, rgba(0,0,0,0.6) 60%, transparent)'
                : 'linear-gradient(to right, #000 20%, rgba(0,0,0,0.6) 60%, transparent)',
            }}
          />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
            <div className={cn('max-w-xl', isRTL ? 'text-right' : 'text-left')}>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium mb-4"
              >
                <Sparkles className="size-3 text-primary" aria-hidden="true" />
                {t('bentoCard1Badge')}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4"
              >
                {t('bentoCard1Title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 text-lg md:text-xl max-w-md leading-relaxed"
              >
                {t('bentoCard1Desc')}
              </motion.p>
            </div>
          </div>
        </motion.article>

        {/* CARD 2: Span 1 col - Free Shipping MagicCard */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 rounded-2xl overflow-hidden group"
          role="listitem"
        >
          <MagicCard
            className="h-full min-h-[240px] flex flex-col items-center justify-center p-6 text-center"
            glowColor="primary"
            intensity={0.4}
          >
            <motion.div
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-6"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 30px rgba(139, 92, 246, 0.4)',
                  '0 0 50px rgba(139, 92, 246, 0.6)',
                  '0 0 30px rgba(139, 92, 246, 0.4)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Glowing Orb Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 via-primary/20 to-transparent blur-xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-2xl animate-pulse" />
              <Truck className="relative size-10 md:size-12 text-white drop-shadow-lg" aria-hidden="true" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-bold text-white mb-2"
            >
              {t('bentoCard2Title')}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm md:text-base"
            >
              {t('bentoCard2Desc')}
            </motion.p>
          </MagicCard>
        </motion.article>

        {/* CARD 3: Span 1 col - Product Image Card */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 rounded-2xl overflow-hidden group"
          role="listitem"
        >
          <SafeImage
            src={card3Product?.imageCover}
            alt={card3Product?.title || ''}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(isRTL ? 'text-right' : 'text-left')}
            >
              <span className="text-xs font-medium text-primary/90 uppercase tracking-wider">
                {card3Product?.category?.name || t('bentoCard3Category')}
              </span>
              <h3 className="mt-1 text-lg md:text-xl font-bold text-white line-clamp-1">
                {card3Product?.title || t('bentoCard3Title')}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  {card3Product ? new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(card3Product.price) : '—'}
                </span>
                <motion.span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                  {t('bentoCard3Action')}
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.article>

        {/* CARD 4: Span 1 col - Flash Sale Countdown */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 min-h-[240px] rounded-2xl overflow-hidden group"
          role="listitem"
          style={{
            background: 'linear-gradient(145deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
          <div
            className="absolute -top-10 -right-10 w-full max-w-[160px] h-auto aspect-square rounded-full bg-primary/20 blur-3xl"
            style={{ filter: 'blur(80px)' }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-full max-w-[128px] h-auto aspect-square rounded-full bg-accent/20 blur-3xl"
            style={{ filter: 'blur(80px)' }}
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
              className="mb-6"
            >
              <Timer className="size-12 text-primary/90 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]" aria-hidden="true" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2"
            >
              {t('bentoCard4Title')}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-sm mb-6 max-w-xs"
            >
              {t('bentoCard4Desc')}
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 md:gap-4"
              role="timer"
              aria-live="polite"
              aria-label={t('bentoCard4CountdownLabel')}
            >
              <div className="flex items-center justify-center gap-1 md:gap-2">
                <CountdownUnit value={formatTime(timeLeft.hours)} label={t('hours')} />
                <span className="text-primary text-2xl md:text-3xl font-bold animate-pulse" aria-hidden="true">:</span>
                <CountdownUnit value={formatTime(timeLeft.minutes)} label={t('minutes')} />
                <span className="text-primary text-2xl md:text-3xl font-bold animate-pulse" aria-hidden="true">:</span>
                <CountdownUnit value={formatTime(timeLeft.seconds)} label={t('seconds')} />
              </div>
            </motion.div>
          </div>
        </motion.article>

        {/* CARD 4B: Elegant Feature Card - Fill empty grid cell (row 2, col 4) */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 rounded-2xl overflow-hidden group"
          role="listitem"
        >
          <MagicCard
            className="h-full w-full flex flex-col items-center justify-center p-6 md:p-8 text-center"
            glowColor="primary"
            intensity={0.3}
          >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-xl" />
                <Sparkles className="relative size-10 md:size-12 text-white drop-shadow-lg" aria-hidden="true" />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl font-bold text-white leading-tight"
              >
                {t('bentoCard4bTitle') || 'Experience the Future'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 text-base md:text-lg max-w-xs leading-relaxed"
              >
                {t('bentoCard4bDesc') || 'of Shopping'}
              </motion.p>
            </motion.div>
          </MagicCard>
        </motion.article>

        {/* CARD 5: Span 3 cols - Wide Editorial Card */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 md:col-span-3 rounded-3xl overflow-hidden group"
          role="listitem"
        >
          {/* Lifestyle/Abstract Background */}
          <div className="absolute inset-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 75vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background: isRTL
                  ? 'linear-gradient(to left, #000 30%, rgba(0,0,0,0.7) 70%, transparent)'
                  : 'linear-gradient(to right, #000 30%, rgba(0,0,0,0.7) 70%, transparent)',
              }}
            />
          </div>

          <div className="relative z-10 h-full flex items-center p-8 md:p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn('max-w-2xl md:max-w-3xl', isRTL ? 'mr-auto' : 'ml-auto')}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium tracking-wide mb-6"
              >
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                {t('bentoCard5Badge')}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white mb-6"
              >
                {t('bentoCard5Title')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl"
              >
                {t('bentoCard5Desc')}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                {t('bentoCard5Action')}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </motion.button>
            </motion.div>
          </div>
        </motion.article>

        {/* CARD 6: Store Stats - Fill empty cell (row 3, col 4) */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative col-span-1 rounded-2xl overflow-hidden group"
          role="listitem"
        >
          <MagicCard
            className="h-full min-h-[240px] flex flex-col items-center justify-center p-6 text-center"
            glowColor="accent"
            intensity={0.3}
          >
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl font-bold text-white mb-6"
            >
              {t('bentoCard6Title') || 'Store Stats'}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 w-full"
            >
              {/* Stat 1: Customers */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-primary" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))' }}>
                  <Users className="size-6" aria-hidden="true" />
                </div>
                <div className={cn('text-left flex-1', isRTL ? 'text-right' : 'text-left')}>
                  <p className="text-xl font-bold text-white">10k+</p>
                  <p className="text-white/60 text-sm">{t('bentoCard6Stat1') || 'Customers'}</p>
                </div>
              </div>

              {/* Stat 2: Brands */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-400" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))' }}>
                  <Store className="size-6" aria-hidden="true" />
                </div>
                <div className={cn('text-left flex-1', isRTL ? 'text-right' : 'text-left')}>
                  <p className="text-xl font-bold text-white">500+</p>
                  <p className="text-white/60 text-sm">{t('bentoCard6Stat2') || 'Brands'}</p>
                </div>
              </div>

              {/* Stat 3: Support */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-amber-400" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))' }}>
                  <Headphones className="size-6" aria-hidden="true" />
                </div>
                <div className={cn('text-left flex-1', isRTL ? 'text-right' : 'text-left')}>
                  <p className="text-xl font-bold text-white">24/7</p>
                  <p className="text-white/60 text-sm">{t('bentoCard6Stat3') || 'Support'}</p>
                </div>
              </div>
            </motion.div>
          </MagicCard>
        </motion.article>
      </motion.div>
    </section>
  );
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  const t = useTranslations('landing');
  return (
    <div className="flex flex-col items-center min-w-[50px] md:min-w-[60px]">
      <div className="relative">
        <div className="w-full max-w-[68px] aspect-square md:max-w-[80px] rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center">
          <span className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-xs md:text-sm text-white/50 uppercase tracking-wider">{label}</span>
    </div>
  );
}