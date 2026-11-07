'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOrdersStore, Order } from '@/store/useOrdersStore';
import { SafeImage } from '@/components/shared/SafeImage';
import {
  Package,
  ChevronDown,
  Clock,
  Loader2,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Loader2 as LoaderIcon,
  AlertCircle,
  CircleCheck,
  CircleX,
  RotateCcw,
  Shield,
  User,
  Calendar,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  processing: LoaderIcon,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const PAYMENT_METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cash: CircleCheck,
  card: CreditCard,
  wallet: Wallet,
};

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'processing', label: 'Processing', icon: LoaderIcon },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CircleCheck },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const tProfile = useTranslations('profile');
  const tCheckout = useTranslations('checkout');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const { orders, getOrderById } = useOrdersStore();

  const orderId = params.id as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      router.push('/login');
      return;
    }

    const foundOrder = getOrderById(orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      router.push('/orders');
    }
  }, [router, orderId, getOrderById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const StatusIcon = STATUS_ICONS[status] || Clock;
    const statusKey = `statuses.${status}` as const;
    return (
      <Badge className={`${STATUS_COLORS[status] || STATUS_COLORS.pending} gap-1`}>
        <StatusIcon className="size-3" />
        {t(statusKey) || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusKey = `paymentStatuses.${status}` as const;
    return (
      <Badge className={`${PAYMENT_STATUS_COLORS[status] || PAYMENT_STATUS_COLORS.pending} gap-1`}>
        {t(statusKey) || status}
      </Badge>
    );
  };

  const getCurrentStepIndex = (status: string) => {
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const isStepActive = (stepKey: string, currentStatus: string) => {
    const currentIndex = getCurrentStepIndex(currentStatus);
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);
    return stepIndex <= currentIndex;
  };

  const isStepCompleted = (stepKey: string, currentStatus: string) => {
    const currentIndex = getCurrentStepIndex(currentStatus);
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);
    return stepIndex < currentIndex;
  };

  if (!mounted || !order) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background">
        <InteractiveGrid />
        <Loader2 className="relative z-10 size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveGrid />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button & Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className={cn('size-4', isRTL && 'rotate-180')} />
                {tCommon('back')}
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground-muted">
                  {t('orderNumber')}{order._id.slice(-8).toUpperCase()}
                </span>
                {getStatusBadge(order.orderStatus)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                {t('orderDetails')}
              </h1>
              <span className="text-foreground-muted text-sm">
                {t('placedOn')} {formatDate(order.createdAt)}
              </span>
            </div>
          </motion.div>

          {/* Order Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="size-5" />
                  {t('statusTimeline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical line */}
                  <div className={cn('absolute top-0 bottom-0 w-0.5 bg-white/10', isRTL ? 'right-6' : 'left-6')} />
                  {STATUS_STEPS.map((step, index) => {
                    const isActive = isStepActive(step.key, order.orderStatus);
                    const isCompleted = isStepCompleted(step.key, order.orderStatus);
                    const StepIcon = step.icon;

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        className={cn('relative pb-8 last:pb-0', isRTL ? 'pr-16' : 'pl-16')}
                      >
                        <div className="flex items-start gap-4">
                          {/* Step indicator */}
                          <div
                            className={cn(
                              'relative z-10 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/20'
                                : 'bg-white/5 border border-white/10 text-foreground-muted'
                            )}
                          >
                            {isCompleted ? (
                              <CircleCheck className="size-6" />
                            ) : (
                              <StepIcon className="size-5" />
                            )}
                          </div>

                          {/* Step content */}
                          <div className="flex-1 pt-1">
                            <p className={cn('font-medium', isActive ? 'text-foreground' : 'text-foreground-muted')}>
                              {t(`timeline.${step.key}`) || step.label}
                            </p>
                            <p className="text-sm text-foreground-muted mt-0.5">
                              {isCompleted
                                ? t('timeline.completed')
                                : isActive
                                ? t('timeline.current')
                                : t('timeline.pending')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="size-5" />
                    {t('items')}
                    <span className="ml-2 text-sm font-normal text-foreground-muted">
                      ({order.items?.length || 0} {t('itemsCount')})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                        className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all"
                      >
                        <Link
                          href={`/product/${item.product._id}`}
                          className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <SafeImage
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product._id}`}
                            className="font-medium hover:text-primary transition-colors block truncate"
                          >
                            {item.product.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-sm text-foreground-muted">
                            <span>
                              {t('quantity')}: {item.count}
                            </span>
                            <span>
                              {formatPrice(item.price, locale)}
                            </span>
                          </div>
                          {item.product.category && (
                            <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-white/5 text-foreground-muted">
                              {item.product.category.name}
                            </span>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold">
                            {formatPrice(item.total, locale)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="size-5" />
                    {t('orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <SummaryRow label={t('subtotal')} value={formatPrice(order.subtotal, locale)} />
                    <SummaryRow label={t('shipping')} value={formatPrice(order.shipping, locale)} />
                    <SummaryRow label={t('tax')} value={formatPrice(order.tax, locale)} />
                    <Separator className="my-3" />
                    <SummaryRow
                      label={t('total')}
                      value={formatPrice(order.total, locale)}
                      isTotal
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar: Shipping & Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Shipping Address */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    {t('shippingAddress')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                      <Phone className="size-3" />
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-foreground-muted flex items-center gap-1">
                      <Mail className="size-3" />
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="size-5" />
                    {t('paymentMethod')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center',
                        order.paymentMethod === 'cash'
                          ? 'bg-green-500/20 text-green-400'
                          : order.paymentMethod === 'card'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      )}
                    >
                      {order.paymentMethod === 'cash' && <CircleCheck className="size-6" />}
                      {order.paymentMethod === 'card' && <CreditCard className="size-6" />}
                      {order.paymentMethod === 'wallet' && <Wallet className="size-6" />}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{order.paymentMethod}</p>
                      <p className="text-sm text-foreground-muted capitalize">
                        {t(`paymentMethods.${order.paymentMethod}`)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    {t('orderInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <InfoRow
                      label={t('orderId')}
                      value={order._id}
                      icon={Package}
                    />
                    <InfoRow
                      label={t('orderDate')}
                      value={formatDate(order.createdAt)}
                      icon={Calendar}
                    />
                    <InfoRow
                      label={t('paymentStatus')}
                      value={getPaymentStatusBadge(order.paymentStatus)}
                      icon={CreditCard}
                    />
                    <InfoRow
                      label={t('orderStatus')}
                      value={getStatusBadge(order.orderStatus)}
                      icon={Truck}
                    />
                  </div>
                </CardContent>
                </Card>

              {/* Actions */}
              <Card className="glass">
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => router.push('/orders')}
                    >
                      <ArrowLeft className={cn('size-4', isRTL && 'rotate-180')} />
                      {t('backToOrders')}
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start gap-2"
                      onClick={() => router.push('/shop')}
                    >
                      <Package className="size-4" />
                      {t('continueShopping')}
                    </Button>
                    {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-foreground-muted hover:text-foreground"
                        disabled
                      >
                        <RotateCcw className="size-4" />
                        {t('trackOrder')}
                      </Button>
                    )}
                    {order.orderStatus === 'delivered' && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        disabled
                      >
                        <CircleCheck className="size-4" />
                        {t('reorder')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  isTotal,
}: {
  label: string;
  value: string | React.ReactNode;
  isTotal?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        isTotal && 'text-lg font-bold pt-2 border-t border-white/10'
      )}
    >
      <span className={cn('text-foreground-muted', isTotal && 'text-foreground')}>
        {label}
      </span>
      <span className={cn('', isTotal && 'text-primary')}>{value}</span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-foreground-muted">
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </div>
  );
}