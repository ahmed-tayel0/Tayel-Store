'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordAction } from '@/actions/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { MagicCard } from '@/components/ui/magicui/MagicCard';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const result = await forgotPasswordAction(formData);

      if (result.success) {
        toast.success(t('codeSent'));
        router.push('/verify-code');
      } else {
        setError('root', { message: result.error });
        toast.error(result.error || t('invalidCredentials'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('invalidCredentials');
      toast.error(errorMessage);
      setError('root', { message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-4 lg:px-6">
      {/* Cinematic Background - Interactive Grid */}
      <InteractiveGrid />

      {/* Animated Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-full max-w-[500px] h-auto aspect-square bg-violet-600/30 blur-[120px] rounded-full pointer-events-none z-0"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-full max-w-[400px] h-auto aspect-square bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none z-0"
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 15, -25, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-auto aspect-square bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 2-Column Layout Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Editorial Section (Hidden on Mobile) */}
          <motion.div
            className="hidden lg:block text-center lg:text-left px-4"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating Orbs behind text */}
            <div className="absolute -top-20 -right-10 w-full max-w-[300px] h-auto aspect-square bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full max-w-[200px] h-auto aspect-square bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative">
              {/* Brand Badge */}
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-foreground-muted mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="gradient-text">{t('premiumExperience')}</span>
              </motion.span>

              {/* Main Headline */}
              <motion.h1
                className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="block text-foreground">{t('forgotPasswordTitle')}</span>
                <span className="block gradient-text">{t('forgotPasswordSubtitle')}</span>
              </motion.h1>

              {/* Feature Highlights */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { icon: '🔐', title: t('feature1Title'), desc: t('feature1Desc') },
                  { icon: '📧', title: 'Secure Code Delivery', desc: '6-digit code sent directly to your inbox' },
                  { icon: '⚡', title: 'Instant Reset', desc: 'Quick password recovery in minutes' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex flex-row gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-3xl flex-shrink-0">{feature.icon}</span>
                    <div className="flex flex-col items-start text-start gap-1">
                      <p className="font-semibold text-foreground">{feature.title}</p>
                      <p className="text-sm text-foreground-muted">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Midnight Cyber Badge */}
              <motion.p
                className="mt-16 text-xs text-foreground-muted/40 tracking-widest uppercase flex items-center justify-center lg:justify-start gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <span className="w-16 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <span>Midnight Cyber Commerce</span>
                <span className="w-16 h-px bg-gradient-to-r from-primary/50 via-primary/50 to-transparent" />
              </motion.p>
            </div>
          </motion.div>

          {/* Right Column - Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative z-10"
          >
            <MagicCard glowColor="primary" intensity={0.8} className="rounded-3xl p-8 md:p-10 shadow-2xl border-white/10 w-full">
              {/* Logo */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 text-foreground font-bold text-3xl tracking-tight"
                  aria-label="Tayel Store"
                >
                  <span className="gradient-text">Tayel Store</span>
                </Link>
              </motion.div>

              {/* Title & Subtitle */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('forgotPasswordTitle')}</h1>
                <p className="mt-3 text-foreground-muted text-base leading-relaxed">{t('forgotPasswordSubtitle')}</p>
              </motion.div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/90">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-foreground-muted/60 pointer-events-none" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      className="pl-11 pr-4 bg-black/20 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300"
                      {...register('email')}
                      disabled={isSubmitting}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-error flex items-center gap-1" role="alert">
                      <AlertCircle className="size-3" aria-hidden="true" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Root Error */}
                {errors.root && (
                  <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-sm text-error" role="alert">
                    <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
                    <p>{errors.root.message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-3.5 text-lg font-medium gap-2 relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      {t('sendingCode')}
                    </>
                  ) : (
                    <>
                      {t('sendCode')}
                      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </motion.form>

              {/* Back to Login Link */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <p className="text-foreground-muted/70">
                  {t('rememberPassword')}{' '}
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:text-primary/80 underline underline-offset-2 transition-colors"
                  >
                    {t('backToLogin')}
                  </Link>
                </p>
              </motion.div>
            </MagicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}