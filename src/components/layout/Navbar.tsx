'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileMenu } from './MobileMenu';
import { LogoutDialog } from '@/components/shared/LogoutDialog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Globe,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const t = useTranslations('common');
  const tLanding = useTranslations('landing');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isRTL = locale === 'ar';

  // Cart & Wishlist stores
  const { cartData, fetchCart, getItemCount: getCartItemCount } = useCartStore();
  const { wishlistData, fetchWishlist, getItemCount: getWishlistItemCount } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch cart/wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Hide navbar on landing page (root path after locale)
  const isLandingPage = pathname === '/' || pathname === '';

  if (isLandingPage) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <Link
              href="/home"
              className="flex items-center gap-2 text-foreground font-bold text-xl tracking-tight z-50"
              aria-label={tLanding('brand')}
            >
              <span className="gradient-text">{tLanding('brand')}</span>
            </Link>

            {/* Mobile Compact Search (between Logo and Hamburger) - Expanded */}
            <div className="md:hidden flex-1 flex items-center justify-center px-4">
              <form onSubmit={handleSearch} className="relative w-full flex-1 mx-4">
                <Search
                  className={cn('absolute top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none', isRTL ? 'right-3' : 'left-3')}
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-full bg-white/5 border border-white/10 pl-9 pr-10 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 transition-all duration-300"
                  aria-label={t('search')}
                />
              </form>
            </div>

            {/* Center: Search (Desktop) */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:px-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-xl">
                <Search
                  className={cn('absolute top-1/2 -translate-y-1/2 size-5 text-foreground-muted pointer-events-none', isRTL ? 'right-4' : 'left-4')}
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-white/5 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  aria-label={t('search')}
                />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Actions (hidden on mobile) */}
              <div className="hidden md:flex md:items-center md:gap-3">
                {/* Language Switcher */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' })}
                  aria-label={t('language')}
                  className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Globe className="size-5" aria-hidden="true" />
                  <span className="sr-only">{t('language')}</span>
                </Button>

                {/* Cart Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/cart')}
                  aria-label={t('cart')}
                  className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <ShoppingCart className="size-5" aria-hidden="true" />
                  {mounted && cartItemCount > 0 && (
                    <span className={cn('absolute -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-background', isRTL ? '-left-1' : '-right-1')}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Button>

                {/* Wishlist Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/wishlist')}
                  aria-label={t('wishlist')}
                  className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Heart className="size-5" aria-hidden="true" />
                  {mounted && wishlistItemCount > 0 && (
                    <span className={cn('absolute -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white', isRTL ? '-left-1' : '-right-1')}>
                      {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                    </span>
                  )}
                </Button>

                {/* User Profile / Login */}
                {isAuthenticated ? (
                  <div className="relative">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t('profile')}
                        aria-expanded={userMenuOpen}
                        aria-haspopup="true"
                        className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <User className="size-5" aria-hidden="true" />
                      </Button>
                      <ChevronDown className={cn('size-4 text-foreground-muted', isRTL && 'rotate-180')} aria-hidden="true" />
                    </div>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className={cn('absolute mt-2 w-48 glass rounded-xl border border-border py-2 shadow-lg animate-fade-in-up', isRTL ? 'left-0' : 'right-0')}>
                        <div className="px-4 py-2 border-b border-border">
                          <p className="font-medium text-sm">
                            {user?.name ? user.name.split(' ')[0] : t('profile')}
                          </p>
                          <p className="text-xs text-foreground-muted">{t('account')}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="size-4" aria-hidden="true" />
                          {t('profile')}
                        </Link>
                        <hr className="my-2 border-border" />
                        <LogoutDialog triggerAriaLabel={t('logout')}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            aria-label={t('logout')}
                          >
                            <LogOut className="size-4" aria-hidden="true" />
                            {t('logout')}
                          </Button>
                        </LogoutDialog>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/login')}
                    aria-label={t('profile')}
                    className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <User className="size-5" aria-hidden="true" />
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label={t('menu')}
              >
                <Menu className="size-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}