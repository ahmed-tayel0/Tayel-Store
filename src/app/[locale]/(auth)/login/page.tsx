'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { signinAction } from '@/actions/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { MagicCard } from '@/components/ui/magicui/MagicCard';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect URL from query params, default to '/home'
  const redirect = searchParams.get('redirect') || '/home';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('redirect', searchParams.get('redirect') || '/home');

      const result = await signinAction(formData);

      if (result.success && result.token && result.user) {
        // Save token to localStorage for client-side axios interceptor
        localStorage.setItem('auth_token', result.token);
        // Save token to cookie for middleware (7 days expiry)
        Cookies.set('auth_token', result.token, { expires: 7 });
        // Save user object to localStorage for Profile page
        localStorage.setItem('user', JSON.stringify(result.user));

        // Dispatch auth-change event to notify Navbar and other components
        window.dispatchEvent(new Event('auth-change'));

        // Navigate to redirect URL (default: /home)
        const redirectTo = searchParams.get('redirect') || '/home';
        router.push(redirectTo);
        toast.success(t('signInSuccess') || 'Logged in successfully');
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
                <span className="block text-foreground">{t('welcomeHeadline1')}</span>
                <span className="block gradient-text">{t('welcomeHeadline2')}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-foreground-muted/80 leading-relaxed max-w-lg mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {t('welcomeSubtitle')}
              </motion.p>

              {/* Feature Highlights */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {[
                  { icon: '🚀', title: t('feature1Title'), desc: t('feature1Desc') },
                  { icon: '🔒', title: t('feature2Title'), desc: t('feature2Desc') },
                  { icon: '🔄', title: t('feature3Title'), desc: t('feature3Desc') },
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

          {/* Right Column - Glass Login Card */}
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
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('signIn')}</h1>
                <p className="mt-3 text-foreground-muted text-base leading-relaxed">{t('welcomeBack')}</p>
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

                {/* Password Field with Remember Me & Forgot Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground/90">{t('password')}</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary/80 hover:text-primary hover:underline transition-colors"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-foreground-muted/60 pointer-events-none" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-11 pr-12 bg-black/20 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300"
                      {...register('password')}
                      disabled={isSubmitting}
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted/60 hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-sm text-error flex items-center gap-1" role="alert">
                      <AlertCircle className="size-3" aria-hidden="true" />
                      {errors.password.message}
                    </p>
                  )}

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <Label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/70" htmlFor="rememberMe">
                      <Checkbox
                        id="rememberMe"
                        {...register('rememberMe')}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-white/20 focus-visible:ring-primary/50"
                      />
                      <span>{t('rememberMe')}</span>
                    </Label>
                  </div>
                </div>

                {/* Root Error */}
                {errors.root && (
                  <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-sm text-error" role="alert">
                    <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
                    <p>{errors.root.message}</p>
                  </div>
                )}

                {/* Submit Button - ShimmerButton */}
                <Button
                  type="submit"
                  className="w-full py-3.5 text-lg font-medium gap-2 relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      {t('signingIn')}
                    </>
                  ) : (
                    <>
                      {t('signInButton')}
                      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </motion.form>

              {/* Social Login Divider */}
              <motion.div
                className="relative my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-foreground-muted/60 uppercase tracking-widest">{t('orContinueWith')}</span>
                </div>
              </motion.div>

              {/* Social Login Buttons */}
              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {/* Google Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-foreground font-medium gap-2 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('google')}
                </Button>

                {/* Facebook Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-foreground font-medium gap-2 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <svg className="size-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span>{t('facebook')}</span>
                </Button>
              </motion.div>

              {/* Register Link Footer */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <p className="text-foreground-muted/70">
                  {t('dontHaveAccount')}{' '}
                  <Link
                    href="/register"
                    className="text-primary font-medium hover:text-primary/80 underline underline-offset-2 transition-colors"
                  >
                    {t('signUp')}
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