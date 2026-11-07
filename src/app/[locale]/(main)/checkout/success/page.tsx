'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ChevronLeft, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { useOrdersStore, Order } from '@/store/useOrdersStore';
import { cn } from '@/lib/utils';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const { orders, fetchOrders, getOrderById } = useOrdersStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        // First try to find in existing orders
        await fetchOrders();
        const existingOrder = getOrderById(orderId);
        if (existingOrder) {
          setOrder(existingOrder);
        } else {
          // Order might not be in store yet, create a minimal order object
          // In a real app, you'd fetch from API here
          setOrder(null);
        }
      }
      setIsLoading(false);
    };
    loadOrder();
  }, [orderId, fetchOrders, getOrderById]);

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto px-4">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="h-64 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Interactive Background */}
      <InteractiveGrid />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="text-center mb-8"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="size-12 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            {t('orderSuccess')}
          </h1>
          <p className="text-foreground-muted text-lg">
            {t('orderSuccessDesc')}
          </p>
        </motion.div>

        {/* Order Details Card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Package className="size-5 text-primary" />
                  {t('orderNumber')}: <span className="font-mono">{order._id.slice(-8).toUpperCase()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-foreground-muted">{t('placedOn')}</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-foreground-muted">{t('total')}</p>
                    <p className="font-medium text-xl text-primary">
                      {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
                        style: 'currency',
                        currency: 'EGP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(order.total || 0)}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-foreground-muted">{t('paymentMethod')}</p>
                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-foreground-muted">{t('orderStatus')}</p>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                      order.orderStatus === 'delivered' && 'bg-green-500/20 text-green-400 border border-green-500/30',
                      order.orderStatus === 'shipped' && 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                      order.orderStatus === 'processing' && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                      order.orderStatus === 'pending' && 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
                      order.orderStatus === 'cancelled' && 'bg-red-500/20 text-red-400 border border-red-500/30',
                    )}>
                      <span className="relative h-2 w-2 rounded-full bg-current" />
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Package className="size-4" />
                    {t('shippingAddress')}
                  </h3>
                  <div className="text-foreground-muted space-y-1">
                    <p>{order.shippingAddress?.fullName}</p>
                    <p>{order.shippingAddress?.phone}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="gap-2 w-full sm:w-auto"
            onClick={() => router.push(`/profile?tab=orders`)}
          >
            <Package className="size-4" />
            {t('orderNumber')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto"
            onClick={() => router.push('/shop')}
          >
            <Home className="size-4" />
            {t('continueShopping')}
          </Button>
        </motion.div>

        {/* Order Not Found Fallback */}
        {!order && orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Card className="glass">
              <CardContent className="py-8">
                <p className="text-foreground-muted mb-4">
                  Order #{orderId.slice(-8).toUpperCase()} was placed successfully.
                </p>
                <p className="text-foreground-muted mb-6">
                  Order details will appear here shortly. You can also check your order history.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => router.push(`/profile?tab=orders`)}
                  >
                    <Package className="size-4" />
                    {t('orderNumber')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => router.push('/shop')}
                  >
                    <Home className="size-4" />
                    {t('continueShopping')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Order ID Fallback */}
        {!order && !orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Card className="glass">
              <CardContent className="py-8">
                <CheckCircle className="size-16 mx-auto text-green-400 mb-4" />
                <h2 className="text-xl font-bold mb-2">{t('orderSuccess')}</h2>
                <p className="text-foreground-muted mb-6">{t('orderSuccessDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => router.push('/profile?tab=orders')}
                  >
                    <Package className="size-4" />
                    {t('orderNumber')}
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => router.push('/shop')}
                  >
                    <Home className="size-4" />
                    {t('continueShopping')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}