'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { TextGenerateEffect } from '@/components/ui/aceternity/TextGenerateEffect';
import { Marquee } from '@/components/ui/aceternity/Marquee';
import { GlowButton } from '@/components/ui/magicui/GlowButton';
import { Globe, LogIn, Menu, X, Users, User } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Badge floating animation
  const badgeTime = useMotionValue(0);
  const badgeFloatY = useTransform(badgeTime, [0, 6], [-10, 10]);
  const badgeSpring = useSpring(badgeFloatY, { stiffness: 20, damping: 15 });

  // Headline floating animation
  const headlineTime = useMotionValue(0);
  const headlineFloatY = useTransform(headlineTime, [0, 8], [-8, 8]);
  const headlineSpring = useSpring(headlineFloatY, { stiffness: 15, damping: 12 });

  // Pulsing dot for badge
  const pulseTime = useMotionValue(0);

  // Animation loops
  useEffect(() => {
    let frame: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      badgeTime.set(elapsed);
      headlineTime.set(elapsed * 0.85);
      pulseTime.set(elapsed);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [badgeTime, headlineTime, pulseTime]);

  // Pulse animation for badge dot
  const pulseScale = useTransform(pulseTime, [0, 2], [1, 1.3]);
  const pulseOpacity = useTransform(pulseTime, [0, 2], [0.4, 1]);
  const pulseSpring = useSpring(pulseScale, { stiffness: 100, damping: 15 });
  const pulseOpacitySpring = useSpring(pulseOpacity, { stiffness: 100, damping: 15 });

  return (
    <div className="relative z-0 h-screen w-full overflow-hidden" style={{ backgroundColor: '#09090b' }}>
      {/* Interactive Grid - Mouse reactive */}
      <InteractiveGrid />

      {/* Subtle Edge Lighting - Pure CSS, RTL-safe (dir="ltr" forces LTR coordinates) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        dir="ltr"
        style={{
          direction: 'ltr',
          background: `
            radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 0% 50%, rgba(217, 70, 239, 0.05) 0%, transparent 40%)
          `,
          mixBlendMode: 'screen',
          opacity: 0.7,
        }}
        aria-hidden="true"
      />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground font-bold text-xl tracking-tight z-50"
            aria-label={t('brand')}
          >
            <span className="gradient-text">{t('brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Premium Glass Language Switcher */}
              <button
                onClick={() => router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' })}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-foreground-muted hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all duration-300 backdrop-blur-xl cursor-pointer"
                aria-label={tCommon('language')}
              >
                <Globe className="size-4" aria-hidden="true" />
                <span className="font-medium">{locale === 'en' ? 'AR' : 'EN'}</span>
              </button>
              {/* Auth-aware: Show Profile if logged in, Login otherwise */}
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl font-medium"
                >
                  <User className="size-4" aria-hidden="true" />
                  <span>{tCommon('profile')}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl font-medium"
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  <span>{tCommon('login')}</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all duration-300 z-50 backdrop-blur-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden mt-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-white/10 px-6 py-4"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' })}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <Globe className="size-5" aria-hidden="true" />
                <span>{tCommon('language')}: {locale === 'en' ? 'العربية' : 'English'}</span>
              </button>
              {isLoggedIn ? (
                <Link href="/profile">
                  <GlowButton
                    variant="secondary"
                    size="lg"
                    className="w-full justify-center gap-2"
                  >
                    <User className="size-5" aria-hidden="true" />
                    <span>{tCommon('profile')}</span>
                  </GlowButton>
                </Link>
              ) : (
                <Link href="/login">
                  <GlowButton
                    variant="secondary"
                    size="lg"
                    className="w-full justify-center gap-2"
                  >
                    <LogIn className="size-5" aria-hidden="true" />
                    <span>{tCommon('login')}</span>
                  </GlowButton>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content - Centered Editorial Layout */}
      <main className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 pt-24">
        <div className="w-full max-w-5xl mx-auto relative z-10">

          {/* Floating Badge - Glass pill with pulsing dot */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              y: badgeSpring,
            }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-white/90 rounded-full px-5 py-2 text-sm font-medium tracking-wide backdrop-blur-xl">
              <motion.span
                className="size-2 rounded-full bg-primary"
                style={{
                  scale: pulseSpring,
                  opacity: pulseOpacitySpring,
                }}
                aria-hidden="true"
              />
              {t('futureEcommerce')}
            </span>
          </motion.div>

          {/* Headline - Single split headline with gradient on last word */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              y: headlineSpring,
            }}
            className="relative mb-6"
          >
            <div className="relative inline-block">
              {/* Clip-path reveal mask for gradient word */}
              <motion.div
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <TextGenerateEffect
                  words={t('headline_part1')}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
                  delay={0.5}
                  duration={1}
                  stagger={0.08}
                />
              </motion.div>

              {/* Gradient word "Tomorrow" / "المستقبل" */}
              <motion.span
                initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="gradient-text"
                style={{ fontFamily: 'inherit' }}
              >
                {t('headline_part2')}
              </motion.span>
            </div>
          </motion.div>

          {/* Subtitle - smaller, elegant, centered */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mt-6 leading-relaxed text-balance"
          >
            {t('subtitle')}
          </motion.p>

          {/* Buttons - centered with mt-10 spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-10"
          >
            <Link href="/home" className="inline-block">
              <GlowButton
                variant="primary"
                size="xl"
                magneticStrength={15}
                className="w-full sm:w-auto"
              >
                <span>{t('browseCollection')}</span>
              </GlowButton>
            </Link>

            {!isLoggedIn && (
              <Link href="/login" className="inline-block">
                <button className="w-full sm:w-auto px-10 py-5 text-xl font-semibold rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <span>{t('signIn')}</span>
                </button>
              </Link>
            )}
          </motion.div>

          {/* Trusted by - Separate section with mt-20 spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center justify-center gap-4 text-neutral-500 text-sm font-medium mt-20"
          >
            <span className="whitespace-nowrap">{t('trustedBy')}</span>
            <div className="flex -space-x-2" aria-label="Trusted by thousands">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.9 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className="size-10 rounded-full border-2 border-background bg-linear-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center ring-2 ring-black"
                >
                  <Users className="size-5 text-white/60" aria-hidden="true" />
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.3, type: 'spring', stiffness: 300, damping: 20 }}
                className="size-10 rounded-full border-2 border-background bg-white/5 flex items-center justify-center ring-2 ring-black"
              >
                <span className="text-white/50 text-xs font-bold">+7k</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Marquee at absolute bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 py-8">
        <div
          className="pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <Marquee speed={70} className="px-4">
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Apple</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Nike</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Sony</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Samsung</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Adidas</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Dior</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Gucci</span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-400 whitespace-nowrap select-none tracking-wide">Rolex</span>
          </Marquee>
        </div>
      </div>
    </div>
  );
}