'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrdersStore, Order } from '@/store/useOrdersStore';
import {
  Package,
  ChevronDown,
  Clock,
  Loader2,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
  Filter,
  ChevronLeft,
  ChevronRight,
  Wallet,
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
  processing: Loader2,
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

export default function OrdersPage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const tOrders = useTranslations('orders');
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { orders, fetchOrders } = useOrdersStore();

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

    fetchOrders();
  }, [router, fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    if (activeStatusFilter === 'all') return true;
    return order.orderStatus === activeStatusFilter;
  });

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const StatusIcon = STATUS_ICONS[status] || Clock;
    const statusKey = `statuses.${status}` as const;
    return (
      <Badge className={`${STATUS_COLORS[status] || STATUS_COLORS.pending} gap-1`}>
        <StatusIcon className="size-3" />
        {tOrders(statusKey) || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusKey = `paymentStatuses.${status}` as const;
    return (
      <Badge className={`${PAYMENT_STATUS_COLORS[status] || PAYMENT_STATUS_COLORS.pending} gap-1`}>
        {tOrders(statusKey) || status}
      </Badge>
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                  {tOrders('title')}
                </h1>
                <p className="mt-1 text-foreground-muted">
                  {tOrders('subtitle', { count: orders.length })}
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push('/shop')}>
                <ArrowLeft className={cn('size-4', isRTL ? 'rotate-180 ml-2' : 'mr-2')} />
                {tCommon('continueShopping')}
              </Button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8"
          >
            <StatCard
              title={tOrders('stats.totalOrders')}
              value={orders.length}
              icon={Package}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title={tOrders('stats.totalSpent')}
              value={`${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} EGP`}
              icon={Wallet}
              color="from-green-500 to-green-600"
            />
            <StatCard
              title={tOrders('stats.pending')}
              value={orders.filter(o => o.orderStatus === 'pending').length}
              icon={Clock}
              color="from-yellow-500 to-yellow-600"
            />
            <StatCard
              title={tOrders('stats.shipped')}
              value={orders.filter(o => o.orderStatus === 'shipped').length}
              icon={Truck}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title={tOrders('stats.delivered')}
              value={orders.filter(o => o.orderStatus === 'delivered').length}
              icon={CheckCircle}
              color="from-emerald-500 to-emerald-600"
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-4 mb-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <Filter className="size-5 text-foreground-muted" />
              <Tabs
                value={activeStatusFilter}
                onValueChange={setActiveStatusFilter}
                className="flex-1"
              >
                <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
                  {[
                    { value: 'all', label: tOrders('filters.all') },
                    { value: 'pending', label: tOrders('filters.pending') },
                    { value: 'processing', label: tOrders('filters.processing') },
                    { value: 'shipped', label: tOrders('filters.shipped') },
                    { value: 'delivered', label: tOrders('filters.delivered') },
                    { value: 'cancelled', label: tOrders('filters.cancelled') },
                  ].map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className={cn(
                        'text-sm px-4 py-2 rounded-xl transition-all duration-200',
                        activeStatusFilter === filter.value
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
                      )}
                    >
                      {filter.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {paginatedOrders.length === 0 ? (
              <Card className="glass">
                <CardContent className="text-center py-16">
                  <Package className="size-16 mx-auto text-foreground-muted/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {activeStatusFilter !== 'all'
                      ? tOrders('emptyFiltered', { filter: tOrders(`filters.${activeStatusFilter}`) })
                      : tOrders('emptyTitle')}
                  </h3>
                  <p className="text-foreground-muted mb-6">
                    {activeStatusFilter !== 'all'
                      ? tOrders('emptyFilteredDesc')
                      : tOrders('emptyDesc')}
                  </p>
                  <Button onClick={() => router.push('/shop')}>
                    <ArrowLeft className={cn('size-4', isRTL ? 'rotate-180 ml-2' : 'mr-2')} />
                    {tCommon('continueShopping')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      locale={locale}
                      onClick={() => router.push(`/orders/${order._id}`)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.nav
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-12 flex items-center justify-center gap-2"
                    aria-label={tCommon('pagination')}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label={tCommon('previous')}
                    >
                      <ChevronLeft className={cn('size-4', isRTL && 'rotate-180')} />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, arr) => (
                        <span key={page} className="flex items-center gap-1">
                          {index > 0 && arr[index - 1] !== page - 1 && (
                            <span className="px-2 text-foreground-muted">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </span>
                      ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label={tCommon('next')}
                    >
                      <ChevronRight className={cn('size-4', isRTL && 'rotate-180')} />
                    </Button>
                  </motion.nav>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="size-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrderCardProps {
  order: Order;
  locale: string;
  onClick: () => void;
}

function OrderCard({ order, locale, onClick }: OrderCardProps) {
  const tOrders = useTranslations('orders');
  const isRTL = locale === 'ar';

  const getStatusBadge = (status: string) => {
    const StatusIcon = STATUS_ICONS[status] || Clock;
    const statusKey = `statuses.${status}` as const;
    return (
      <Badge className={`${STATUS_COLORS[status] || STATUS_COLORS.pending} gap-1`}>
        <StatusIcon className="size-3" />
        {tOrders(statusKey) || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusKey = `paymentStatuses.${status}` as const;
    return (
      <Badge className={`${PAYMENT_STATUS_COLORS[status] || PAYMENT_STATUS_COLORS.pending} gap-1`}>
        {tOrders(statusKey) || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      className="glass p-4 cursor-pointer hover:border-primary/50 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Package className="size-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {tOrders('orderNumber')}{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-foreground-muted">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className={cn('sm:text-left', isRTL ? 'text-left' : 'text-right')}>
            <p className="font-semibold">
              {order.total?.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} EGP
            </p>
            <p className="text-sm text-foreground-muted">
              {order.items?.length || 0} {tOrders('items')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {getStatusBadge(order.orderStatus)}
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
            <ChevronDown className={cn('size-4 text-foreground-muted transition-transform duration-200', isRTL && 'rotate-180')} />
          </div>
        </div>
      </div>
    </Card>
  );
}