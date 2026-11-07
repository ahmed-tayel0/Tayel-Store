'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useOrdersStore, ShippingAddress } from '@/store/useOrdersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Truck,
  CreditCard,
  Smartphone,
  CheckCircle,
  Shield,
  RotateCcw,
  Home,
  User,
  MapPin,
  Phone,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { cn, formatPrice } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCheckoutSchema, CheckoutFormData } from '@/lib/validations/checkout';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const { cartData, fetchCart, getItemCount, getTotalPrice, clear } = useCartStore();
  const { createOrder } = useOrdersStore();

  const [mounted, setMounted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1 = address, 2 = payment, 3 = review
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');

  const cartItems = cartData?.products || [];
  const itemCount = getItemCount();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 500 ? 0 : 30;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  // Wrapper to pass locale to the shared formatPrice utility
  const formatPriceWithLocale = (price: number) => formatPrice(price, locale);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(createCheckoutSchema(t)),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'egypt',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && itemCount === 0) {
      router.push('/cart');
    }
  }, [mounted, itemCount, router]);

  // Check if user is logged in
  useEffect(() => {
    if (mounted) {
      const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('auth_token');
      if (!isLoggedIn) {
        router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      }
    }
  }, [mounted, router]);

  const isFreeShipping = shipping === 0;

  const paymentOptions = [
    {
      value: 'cash' as const,
      label: t('cashOnDelivery'),
      description: t('cashOnDeliveryDesc'),
      icon: <Truck className="size-5" />,
    },
    {
      value: 'card' as const,
      label: t('cardPayment'),
      description: t('cardPaymentDesc'),
      icon: <CreditCard className="size-5" />,
    },
    {
      value: 'wallet' as const,
      label: t('walletPayment'),
      description: t('walletPaymentDesc'),
      icon: <Smartphone className="size-5" />,
    },
  ];

  const handleNext = async () => {
    if (activeStep === 1) {
      const isValid = await trigger(['fullName', 'phone', 'address', 'city', 'postalCode', 'country']);
      if (isValid) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      setActiveStep(3);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handlePlaceOrder = handleSubmit(async (formData) => {
    setIsPlacingOrder(true);

    try {
      const order = await createOrder({
        items: cartItems.map((item) => ({
          _id: item._id,
          product: item.product,
          count: item.count,
          price: item.price,
          total: item.price * item.count,
        })),
        shippingAddress: formData as ShippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
      });

      if (order) {
        await clear();
        router.push(`/checkout/success?orderId=${order._id}`);
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  });

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse space-y-6 max-w-3xl mx-auto px-4">
          <div className="h-8 bg-white/5 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-white/5 rounded-xl"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="relative min-h-screen">
      {/* Interactive Background */}
      <InteractiveGrid />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: t('shippingAddress'), Icon: MapPin },
              { step: 2, label: t('paymentMethod'), Icon: CreditCard },
              { step: 3, label: t('orderSummary'), Icon: CheckCircle },
            ].map(({ step, label, Icon }, index) => (
              <div key={step} className="flex flex-col items-center relative">
                {index < 2 && (
                  <div
                    className={cn(
                      'absolute top-[14px] w-full h-0.5 z-0',
                      isRTL ? 'right-full pr-4' : 'left-full pl-4',
                      step <= activeStep ? 'bg-primary' : 'bg-white/10'
                    )}
                  />
                )}
                <div
                  className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300',
                    step === activeStep
                      ? 'bg-primary border-primary text-background'
                      : step < activeStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white/5 border-white/10 text-foreground-muted'
                  )}
                >
                  {step <= activeStep ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <span className={cn('mt-2 text-sm font-medium text-center w-32', step <= activeStep ? 'text-foreground' : 'text-foreground-muted')}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - 2/3 width */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/20 text-primary">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{t('shippingAddress')}</h2>
                        <p className="text-foreground-muted text-sm">{t('subtitle')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                          {t('fullName')} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder={t('fullNamePlaceholder')}
                          className={cn('bg-white/5 border-white/10', errors.fullName && 'border-red-400 focus:border-red-400')}
                          disabled={isPlacingOrder}
                          {...register('fullName')}
                        />
                        {errors.fullName && <p className="text-sm text-red-400">{errors.fullName.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                          {t('phone')} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t('phonePlaceholder')}
                          className={cn('bg-white/5 border-white/10', errors.phone && 'border-red-400 focus:border-red-400')}
                          disabled={isPlacingOrder}
                          {...register('phone')}
                        />
                        {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-foreground">
                        {t('address')} <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="address"
                        placeholder={t('addressPlaceholder')}
                        className={cn('bg-white/5 border-white/10', errors.address && 'border-red-400 focus:border-red-400')}
                        disabled={isPlacingOrder}
                        {...register('address')}
                      />
                      {errors.address && <p className="text-sm text-red-400">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-foreground">
                          {t('city')} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder={t('cityPlaceholder')}
                          className={cn('bg-white/5 border-white/10', errors.city && 'border-red-400 focus:border-red-400')}
                          disabled={isPlacingOrder}
                          {...register('city')}
                        />
                        {errors.city && <p className="text-sm text-red-400">{errors.city.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                          {t('postalCode')} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="postalCode"
                          placeholder={t('postalCodePlaceholder')}
                          className={cn('bg-white/5 border-white/10', errors.postalCode && 'border-red-400 focus:border-red-400')}
                          disabled={isPlacingOrder}
                          {...register('postalCode')}
                        />
                        {errors.postalCode && <p className="text-sm text-red-400">{errors.postalCode.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-foreground">
                          {t('country')} <span className="text-red-400">*</span>
                        </Label>
                        <Select
                          disabled={isPlacingOrder}
                          {...register('country')}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder={t('countryPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="egypt">{t('egypt')}</SelectItem>
                            <SelectItem value="saudiArabia">{t('saudiArabia')}</SelectItem>
                            <SelectItem value="uae">{t('uae')}</SelectItem>
                            <SelectItem value="kuwait">{t('kuwait')}</SelectItem>
                            <SelectItem value="qatar">{t('qatar')}</SelectItem>
                            <SelectItem value="bahrain">{t('bahrain')}</SelectItem>
                            <SelectItem value="oman">{t('oman')}</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.country && <p className="text-sm text-red-400">{errors.country.message}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/20 text-primary">
                        <CreditCard className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{t('paymentMethod')}</h2>
                        <p className="text-foreground-muted text-sm">Choose your preferred payment method</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPaymentMethod(option.value)}
                          className={cn(
                            'w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 text-left',
                            paymentMethod === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
                          )}
                          disabled={isPlacingOrder}
                        >
                          <div
                            className={cn(
                              'p-3 rounded-xl flex-shrink-0',
                              paymentMethod === option.value
                                ? 'bg-primary text-background'
                                : 'bg-white/5 text-foreground-muted'
                            )}
                          >
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <p className={cn('font-medium', paymentMethod === option.value ? 'text-foreground' : 'text-foreground')}>
                              {option.label}
                            </p>
                            <p className="text-sm text-foreground-muted">{option.description}</p>
                          </div>
                          <div
                            className={cn(
                              'h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all',
                              paymentMethod === option.value
                                ? 'border-primary bg-primary'
                                : 'border-white/20'
                            )}
                          >
                            {paymentMethod === option.value && (
                              <CheckCircle className="size-4 text-background" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Place Order */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-primary/20 text-primary">
                        <CheckCircle className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{t('orderSummary')}</h2>
                        <p className="text-foreground-muted text-sm">Review your order before placing</p>
                      </div>
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="size-4" />
                        {t('shippingAddress')}
                      </h3>
                      <div className="text-foreground-muted space-y-1">
                        <p>{watch('fullName')}</p>
                        <p>{watch('phone')}</p>
                        <p>{watch('address')}</p>
                        <p>{watch('city')}, {watch('postalCode')}, {watch('country')}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep(1)}
                        className="mt-3 text-primary hover:bg-primary/10 gap-1"
                      >
                        <User className="size-3" />
                        {t('edit')}
                      </Button>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        {paymentMethod === 'cash' ? <Truck className="size-4" /> : paymentMethod === 'card' ? <CreditCard className="size-4" /> : <Smartphone className="size-4" />}
                        {t('paymentMethod')}
                      </h3>
                      <p className="text-foreground-muted">
                        {paymentOptions.find((p) => p.value === paymentMethod)?.label}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveStep(2)}
                        className="mt-3 text-primary hover:bg-primary/10 gap-1"
                      >
                        <CreditCard className="size-3" />
                        {t('edit')}
                      </Button>
                    </div>

                    {/* Order Items Summary */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                            <img
                              src={item.product.imageCover}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.product.title}</p>
                            <p className="text-sm text-foreground-muted">Qty: {item.count}</p>
                          </div>
                          <span className="font-medium text-foreground whitespace-nowrap">
                            {formatPriceWithLocale(item.price * item.count)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-between pt-4"
            >
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 1 || isPlacingOrder}
                className="gap-2"
              >
                <ChevronLeft className={cn('size-4', isRTL && 'rotate-180')} />
                {t('back')}
              </Button>
              <div className={cn('flex gap-3', isRTL ? 'mr-auto' : 'ml-auto')}>
                {activeStep < 3 && (
                  <Button onClick={handleNext} disabled={isPlacingOrder} className="gap-2">
                    {t('next')}
                    <ChevronRight className={cn('size-4', isRTL && 'rotate-180')} />
                  </Button>
                )}
                {activeStep === 3 && (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="gap-2 bg-primary hover:bg-primary/90 text-background"
                    size="lg"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t('placingOrder')}
                      </>
                    ) : (
                      <>
                        {t('placeOrder')}
                        <CheckCircle className="size-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary Sidebar - 1/3 width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('orderSummary')}</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">
                      {t('items')} ({itemCount} {itemCount === 1 ? tCart('item') : t('items')})
                    </span>
                    <span className="text-foreground font-medium">{formatPriceWithLocale(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted flex items-center gap-2">
                      <Truck className="size-4" />
                      {t('shipping')}
                    </span>
                    <span className={cn('font-medium', isFreeShipping && 'text-green-400')}>
                      {isFreeShipping ? t('shippingFree') : formatPriceWithLocale(shipping)}
                    </span>
                  </div>

                  {isFreeShipping && (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      {t('freeShippingInfo')}
                    </p>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted flex items-center gap-2">
                      <Shield className="size-4" />
                      {t('tax')}
                    </span>
                    <span className="text-foreground font-medium">{formatPriceWithLocale(tax)}</span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('total')}</span>
                      <span>{formatPriceWithLocale(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <Shield className="size-5 text-primary/50" />
                    <span>{tCommon('securePaymentDesc')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <RotateCcw className="size-5 text-primary/50" />
                    <span>{tCommon('easyReturnsDesc')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground-muted">
                    <Truck className="size-5 text-primary/50" />
                    <span>{tCommon('fastDeliveryDesc')}</span>
                  </div>
                </div>

                {activeStep === 3 && (
                  <p className="text-center text-xs text-foreground-muted/60 mt-6">
                    {t('termsAgreement')}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}