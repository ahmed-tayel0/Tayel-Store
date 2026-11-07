'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

interface LogoutDialogProps {
  triggerLabel?: string;
  triggerAriaLabel?: string;
  children?: React.ReactNode;
}

export function LogoutDialog({
  triggerLabel,
  triggerAriaLabel,
  children,
}: LogoutDialogProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        // Clear auth token from localStorage (localStorage-only auth)
        localStorage.removeItem('auth_token');
        // Clear auth token from cookie (for middleware)
        Cookies.remove('auth_token');
        // Dispatch auth-change event to notify Navbar and other components
        window.dispatchEvent(new Event('auth-change'));
        toast.success(t('logoutSuccess') || 'Logged out successfully');
        router.push('/home');
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || t('logoutFailed') || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error(t('logoutFailed') || 'Logout failed');
    } finally {
      setIsLoggingOut(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="icon"
            aria-label={triggerAriaLabel || t('logout')}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <LogOut className="size-5" aria-hidden="true" />
            {triggerLabel && <span className="hidden sm:inline">{triggerLabel}</span>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass border-white/10 shadow-2xl z-[101]">
        <DialogHeader>
          <DialogTitle>{t('logoutConfirmTitle')}</DialogTitle>
          <DialogDescription>{t('logoutConfirmDesc')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : t('logout')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}