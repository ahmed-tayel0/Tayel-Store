'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutDialog } from '@/components/shared/LogoutDialog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuth } from '@/hooks/useAuth';
import {
  X,
  Menu,
  Home,
  ShoppingCart,
  Heart,
  User,
  Globe,
  Package,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('common');
  const tLanding = useTranslations('landing');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Cart & Wishlist stores
  const { getItemCount: getCartItemCount } = useCartStore();
  const { getItemCount: getWishlistItemCount } = useWishlistStore();

  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  const isRTL = locale === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigateAndClose = (href: string) => {
    router.push(href);
    onClose();
  };

  // Don't render if still loading auth state
  if (isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed top-0 h-full w-[80%] max-w-sm bg-[#09090b]/95 backdrop-blur-2xl border-white/10 z-[100] flex flex-col
              ${isRTL ? 'left-0 border-r' : 'right-0 border-l'}
            `}
            role="dialog"
            aria-modal="true"
            aria-label={t('menu')}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Link
                href="/home"
                onClick={onClose}
                className="flex items-center gap-2 text-foreground font-bold text-xl tracking-tight"
                aria-label={tLanding('brand')}
              >
                <span className="gradient-text">{tLanding('brand')}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label={t('close')}
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <X className="size-6" aria-hidden="true" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-foreground border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  onClick={() => navigateAndClose('/home')}
                >
                  <Home className="size-5" aria-hidden="true" />
                  <span className="font-medium">{t('home')}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-foreground border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  onClick={() => navigateAndClose('/shop')}
                >
                  <Package className="size-5" aria-hidden="true" />
                  <span className="font-medium">{t('products')}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-foreground border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  onClick={() => navigateAndClose('/cart')}
                >
                  <ShoppingCart className="size-5" aria-hidden="true" />
                  <span className="font-medium">{t('cart')}</span>
                  {cartItemCount > 0 && (
                    <span className={cn('flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-background', isRTL ? 'mr-auto' : 'ml-auto')}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-foreground border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  onClick={() => navigateAndClose('/wishlist')}
                >
                  <Heart className="size-5" aria-hidden="true" />
                  <span className="font-medium">{t('wishlist')}</span>
                  {mounted && wishlistItemCount > 0 && (
                    <span className={cn('flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white', isRTL ? 'mr-auto' : 'ml-auto')}>
                      {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                    </span>
                  )}
                </Button>
                {isAuthenticated ? (
                  <>
                    <hr className="border-white/10 my-2" />
                    <LogoutDialog triggerAriaLabel={t('logout')}>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-red-400 border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
                        aria-label={t('logout')}
                      >
                        <LogOut className="size-5" aria-hidden="true" />
                        <span className="font-medium">{t('logout')}</span>
                      </Button>
                    </LogoutDialog>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-foreground border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    onClick={() => navigateAndClose('/login')}
                  >
                    <User className="size-5" aria-hidden="true" />
                    <span className="font-medium">{t('account')}</span>
                  </Button>
                )}
              </nav>

              {/* Footer Actions */}
              <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-white/10">
                {/* Language Switcher */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 px-4 py-3 rounded-xl"
                  onClick={() => {
                    router.replace(pathname, { locale: locale === 'en' ? 'ar' : 'en' });
                    onClose();
                  }}
                >
                  <Globe className="size-5" aria-hidden="true" />
                  <span className="font-medium">{locale === 'en' ? 'العربية' : 'English'}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}