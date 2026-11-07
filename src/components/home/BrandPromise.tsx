'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Truck, Shield, RotateCcw, Sparkles, Star, UserCheck, Headphones } from 'lucide-react';
import { MagicCard } from '@/components/ui/magicui/MagicCard';
import { SafeImage } from '@/components/shared/SafeImage';
import { cn } from '@/lib/utils';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  borderColor: string;
  glowColor: 'primary' | 'accent';
}

export function BrandPromise() {
  const t = useTranslations('landing');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Scroll parallax for the image
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], ['0%', '15%']);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.05]);

  const features: FeatureItem[] = [
    {
      icon: <Star className="size-5" aria-hidden="true" />,
      title: t('brandPromiseFeature1Title'),
      description: t('brandPromiseFeature1Desc'),
      iconColor: 'text-primary',
      borderColor: 'border-primary/30',
      glowColor: 'primary',
    },
    {
      icon: <UserCheck className="size-5" aria-hidden="true" />,
      title: t('brandPromiseFeature2Title'),
      description: t('brandPromiseFeature2Desc'),
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/30',
      glowColor: 'accent',
    },
    {
      icon: <Headphones className="size-5" aria-hidden="true" />,
      title: t('brandPromiseFeature3Title'),
      description: t('brandPromiseFeature3Desc'),
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-400/30',
      glowColor: 'primary',
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-20 overflow-hidden" aria-labelledby="brand-promise-title">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Floating Glow Blobs */}
        <motion.div
          className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        {/* Center Radial Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-full max-h-[600px] rounded-full bg-gradient-to-r from-primary/5 via-transparent to-emerald-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 grid gap-12 md:gap-16 lg:gap-20 grid-cols-1 lg:grid-cols-2 items-center">
        {/* LEFT SIDE: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn('order-2 lg:order-1', isRTL ? 'text-right' : 'text-left')}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium tracking-wide mb-6"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {t('brandPromiseBadge')}
          </motion.span>

          {/* Headline */}
          <motion.h2
            id="brand-promise-title"
            initial={{ opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' }}
            transition={{ delay: 0.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white mb-6"
          >
            {t('brandPromiseTitle')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            {t('brandPromiseSubtitle')}
          </motion.p>

          {/* Feature Cards - Compact Glassmorphism Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <MagicCard
                  className={cn(
                    'flex items-center gap-3 p-3 md:p-4',
                    'bg-white/5 backdrop-blur-xl',
                    feature.borderColor,
                    'hover:border-opacity-100 hover:bg-white/10',
                    'transition-all duration-300 rounded-xl'
                  )}
                  glowColor={feature.glowColor}
                  intensity={0.2}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', feature.iconColor)}
                    style={{ background: `linear-gradient(135deg, ${feature.iconColor.replace('text-', '')}20, ${feature.iconColor.replace('text-', '')}05)` }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : 'text-left')}>
                    <h3 className="text-base font-semibold text-white mb-0.5">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-snug">{feature.description}</p>
                  </div>
                </MagicCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Parallax Image */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative rounded-3xl overflow-hidden h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
            {/* Parallax Image */}
            <motion.div
              style={{
                y,
                scale,
                transformOrigin: 'center center',
              }}
              className="absolute inset-0"
            >
              <SafeImage
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
                alt={t('brandPromiseImageAlt')}
                fill
                priority
                className="object-cover w-full h-full"
                sizes="(max-width: 1024px) 50vw, 50vw"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
            </motion.div>

            {/* Floating Accent Element */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 15, 0],
                rotate: [0, 2, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Sparkles className="size-10 md:size-12 text-white/90 drop-shadow-lg" aria-hidden="true" />
            </motion.div>

            {/* Corner Glow */}
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}