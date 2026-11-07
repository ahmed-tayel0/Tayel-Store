'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Truck, Shield, RotateCcw, Heart, Globe, MessageCircle, Share2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full bg-background/50 backdrop-blur-xl border-t border-white/10 dark:border-white/5"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      {/* Decorative Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-auto aspect-[3/1] max-h-[200px] bg-primary/10 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Footer Grid */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {/* Column 1: Brand */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2" aria-label={tCommon('storeHome') || 'Go to homepage'}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <Heart className="size-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">{t('brandName')}</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {t('brandDescription')}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label={t('social.twitter') || 'Twitter'}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label={t('social.instagram') || 'Instagram'}
            >
              <Share2 className="size-5" aria-hidden="true" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label={t('social.facebook') || 'Facebook'}
            >
              <Globe className="size-5" aria-hidden="true" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              aria-label={t('social.youtube') || 'YouTube'}
            >
              <Mail className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Column 2: Shop */}
        <nav className="space-y-4" aria-labelledby="shop-heading">
          <h3 id="shop-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {t('shop.title')}
          </h3>
          <ul className="space-y-3" role="list">
            <li>
              <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.allProducts')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?category=new-arrivals" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.newArrivals')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?category=bestsellers" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.bestSellers')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?sort=price-asc" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.sale')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.categories')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/brands" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('shop.brands')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 3: Account */}
        <nav className="space-y-4" aria-labelledby="account-heading">
          <h3 id="account-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {t('account.title')}
          </h3>
          <ul className="space-y-3" role="list">
            <li>
              <Link href="/account" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.myAccount')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.orders')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.wishlist')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/addresses" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.addresses')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.settings')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.login')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('account.register')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 4: Support */}
        <div className="space-y-4" aria-labelledby="support-heading">
          <h3 id="support-heading" className="text-sm font-semibold text-foreground uppercase tracking-wider">
            {t('support.title')}
          </h3>
          <ul className="space-y-3" role="list">
            <li>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.helpCenter')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.contactUs')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.faq')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.shippingInfo')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.returns')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.terms')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                {t('support.privacy')}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>

          {/* Newsletter Signup */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-sm text-muted-foreground">{t('support.newsletterText')}</p>
            <form className="flex gap-2" aria-label={t('support.newsletterLabel')}>
              <input
                type="email"
                placeholder={t('support.emailPlaceholder')}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                aria-label={t('support.emailPlaceholder')}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {t('support.subscribe')}
              </button>
            </form>
            <p className="text-xs text-muted-foreground/70">{t('support.privacyNote')}</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-6 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground/80 text-center md:text-left">
            {t('bottom.copyright', { year: currentYear })}
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end" aria-label={t('bottom.paymentMethods')}>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10" aria-hidden="true">
              <svg className="w-6 h-5 text-muted-foreground" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                <rect width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4h16M8 8h16M8 12h16M8 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10" aria-hidden="true">
              <svg className="w-6 h-5 text-muted-foreground" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                <rect width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="16" cy="10" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10" aria-hidden="true">
              <span className="text-xs font-bold text-muted-foreground tracking-wider">VISA</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10" aria-hidden="true">
              <span className="text-xs font-bold text-muted-foreground tracking-wider">MC</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10" aria-hidden="true">
              <svg className="w-6 h-5 text-muted-foreground" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                <rect width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 10L14 16L24 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/70" aria-label={t('bottom.trustBadges')}>
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5" aria-hidden="true" />
              {t('bottom.freeShipping')}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5" aria-hidden="true" />
              {t('bottom.securePayment')}
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              {t('bottom.easyReturns')}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="size-3.5" aria-hidden="true" />
              {t('bottom.support247')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}