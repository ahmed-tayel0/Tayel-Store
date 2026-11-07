'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  User,
  Package,
  Settings,
  MapPin,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Home,
  Mail,
  Phone,
  CreditCard,
  Wallet,
  ArrowLeft,
  LogOut,
  Heart,
  ShoppingCart,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useOrdersStore, Order } from '@/store/useOrdersStore';
import { changePasswordAction } from '@/actions/auth';
// import { updateProfile, getUserProfile } from '@/services/api'; // API calls removed - using localStorage only

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number (e.g., 01012345678)'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const addressSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postalCode: z.string().regex(/^\d{5}$/, 'Postal code must be exactly 5 digits'),
  country: z.string().min(1, 'Country is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

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

function getStatusBadge(status: string, t: (key: string) => string) {
  const StatusIcon = STATUS_ICONS[status] || Clock;
  const statusKey = `statuses.${status}` as const;
  return (
    <Badge className={`${STATUS_COLORS[status] || STATUS_COLORS.pending} gap-1`}>
      <StatusIcon className="size-3" />
      {t(statusKey) || status}
    </Badge>
  );
}

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const tCart = useTranslations('cart');
  const tCheckout = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'ar';
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings' | 'addresses'>('overview');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { cartData, getItemCount: getCartItemCount } = useCartStore();
  const { wishlistData, getItemCount: getWishlistItemCount } = useWishlistStore();
  const { orders, fetchOrders, getOrderById } = useOrdersStore();

  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Egypt',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as 'overview' | 'orders' | 'settings' | 'addresses' | null;

  useEffect(() => {
    if (tabParam && ['overview', 'orders', 'settings', 'addresses'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    // Read user data from localStorage (set during login/register)
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (!token || !savedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      if (userData) {
        setUserProfile(userData);
        profileForm.reset({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
      return;
    } finally {
      setIsLoadingProfile(false);
    }

    fetchOrders();

    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('user-addresses');
    if (savedAddresses) {
      try {
        setAddresses(JSON.parse(savedAddresses));
      } catch {
        setAddresses([]);
      }
    }
  }, [router, fetchOrders, profileForm, tCommon]);

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(newAddresses));
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      // Update user data in localStorage only (no API call)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const updatedUser = {
          ...userData,
          name: data.name,
          email: data.email,
          phone: data.phone,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserProfile(updatedUser);
        // Dispatch auth-change event to notify Navbar and other components
        window.dispatchEvent(new Event('auth-change'));
        toast.success(t('settings.success'));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('settings.error'));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    setIsAddingAddress(true);
    try {
      const newAddress: Address = {
        _id: editingAddress?._id || crypto.randomUUID(),
        ...data,
        isDefault: editingAddress?.isDefault || addresses.length === 0,
      };

      let updatedAddresses: Address[];
      if (editingAddress) {
        updatedAddresses = addresses.map((addr) =>
          addr._id === editingAddress._id ? newAddress : addr
        );
      } else {
        // If this is the first address or set as default, unset other defaults
        if (newAddress.isDefault) {
          updatedAddresses = addresses.map((addr) => ({ ...addr, isDefault: false }));
        } else {
          updatedAddresses = [...addresses];
        }
        updatedAddresses.push(newAddress);
      }

      saveAddresses(updatedAddresses);
      addressForm.reset({ country: 'Egypt' });
      setEditingAddress(null);
      setShowAddAddress(false);
      toast.success(t('addresses.success'));
    } catch (error) {
      console.error('Failed to save address:', error);
      toast.error(t('addresses.error'));
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    try {
      const formData = new FormData();
      formData.append('currentPassword', data.currentPassword);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmNewPassword', data.confirmNewPassword);

      const result = await changePasswordAction(formData);

      if (result.success) {
        toast.success(t('settings.passwordUpdated'));
        passwordForm.reset();
      } else {
        toast.error(result.error || t('settings.passwordError'));
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error(t('settings.passwordError'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    addressForm.reset({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setShowAddAddress(true);
  };

  const handleDeleteAddress = (id: string) => {
    setDeleteAddressId(id);
  };

  const confirmDeleteAddress = () => {
    if (deleteAddressId) {
      const updatedAddresses = addresses.filter((addr) => addr._id !== deleteAddressId);
      // If deleted was default, make first one default
      if (!updatedAddresses.some((addr) => addr.isDefault) && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      saveAddresses(updatedAddresses);
      setDeleteAddressId(null);
      toast.success('Address deleted');
    }
  };

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === id,
    }));
    saveAddresses(updatedAddresses);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultAddress = addresses.find((a) => a.isDefault);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveGrid />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                  {t('title')}
                </h1>
                <p className="mt-1 text-foreground-muted">{t('subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Profile Header Card */}
          <Card className="glass mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <User className="size-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{userProfile.name}</h2>
                    <p className="text-foreground-muted">{userProfile.email}</p>
                    {userProfile.phone && (
                      <p className="text-sm text-foreground-muted flex items-center gap-1">
                        <Phone className="size-3" />
                        {userProfile.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
                    <Settings className="size-4" />
                    <span className={cn('mr-2', isRTL ? 'ml-2' : 'mr-2')} aria-hidden="true" />
                    {tCommon('account')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="w-full">
            <TabsList className="glass grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="orders">{t('tabs.orders')}</TabsTrigger>
              <TabsTrigger value="settings">{t('tabs.settings')}</TabsTrigger>
              <TabsTrigger value="addresses">{t('tabs.addresses')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title={t('overview.stats.totalOrders')}
                  value={orders.length}
                  icon={Package}
                  color="from-blue-500 to-blue-600"
                />
                <StatCard
                  title={t('overview.stats.totalSpent')}
                  value={`${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} EGP`}
                  icon={Wallet}
                  color="from-green-500 to-green-600"
                />
                <StatCard
                  title={t('overview.stats.wishlistItems')}
                  value={wishlistItemCount}
                  icon={Heart}
                  color="from-red-500 to-red-600"
                />
                <StatCard
                  title={t('overview.stats.cartItems')}
                  value={cartItemCount}
                  icon={ShoppingCart}
                  color="from-purple-500 to-purple-600"
                />
              </div>

              {/* Recent Orders */}
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('overview.recentOrders')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                    {t('overview.viewAllOrders')}
                    <ChevronDown className={cn('size-4', isRTL ? 'mr-1 rotate-180' : 'ml-1')} />
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="size-12 mx-auto text-foreground-muted/50 mb-4" />
                      <p className="text-foreground-muted mb-4">{t('overview.noOrdersYet')}</p>
                      <Button onClick={() => router.push('/shop')}>
                        <ArrowLeft className={cn('size-4', isRTL ? 'rotate-180 ml-2' : 'mr-2')} />
                        {t('overview.startShopping')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <OrderCard key={order._id} order={order} locale={locale} onClick={() => router.push(`/orders/${order._id}`)} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Default Address Preview */}
              {defaultAddress && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5" />
                      {t('addresses.title')} ({t('addresses.default')})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddressPreview address={defaultAddress} onEdit={() => { setActiveTab('addresses'); handleEditAddress(defaultAddress); }} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 animate-fade-in-up">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('orders.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="size-16 mx-auto text-foreground-muted/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{t('orders.emptyTitle')}</h3>
                      <p className="text-foreground-muted mb-6">{t('orders.emptyDesc')}</p>
                      <Button onClick={() => router.push('/shop')}>
                        <ArrowLeft className={cn('size-4', isRTL ? 'rotate-180 ml-2' : 'mr-2')} />
                        {t('overview.startShopping')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order._id} order={order} locale={locale} onClick={() => router.push(`/orders/${order._id}`)} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 animate-fade-in-up">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('settings.personalInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('settings.fullName')}</Label>
                      <Input
                        id="name"
                        placeholder={t('settings.fullNamePlaceholder')}
                        {...profileForm.register('name')}
                        disabled={isUpdatingProfile}
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('settings.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('settings.emailPlaceholder')}
                        {...profileForm.register('email')}
                        disabled={isUpdatingProfile}
                      />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('settings.phone')}</Label>
                      <Input
                        id="phone"
                        placeholder={t('settings.phonePlaceholder')}
                        {...profileForm.register('phone')}
                        disabled={isUpdatingProfile}
                      />
                      {profileForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className={cn('size-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                          {t('settings.saving')}
                        </>
                      ) : (
                        t('settings.saveChanges')
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change Password Section */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>{t('settings.passwordSection')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                      <div className="relative">
                        <Lock className={cn('absolute top-1/2 -translate-y-1/2 size-5 text-foreground-muted/60 pointer-events-none', isRTL ? 'right-3' : 'left-3')} aria-hidden="true" />
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder={t('settings.currentPassword')}
                          className={cn('pl-11 pr-12 bg-black/20 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300', isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12')}
                          {...passwordForm.register('currentPassword')}
                          disabled={isUpdatingPassword}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className={cn('absolute top-1/2 -translate-y-1/2 text-foreground-muted/60 hover:text-foreground transition-colors', isRTL ? 'left-3' : 'right-3')}
                          aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                          aria-pressed={showCurrentPassword}
                        >
                          {showCurrentPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                      <div className="relative">
                        <Lock className={cn('absolute top-1/2 -translate-y-1/2 size-5 text-foreground-muted/60 pointer-events-none', isRTL ? 'right-3' : 'left-3')} aria-hidden="true" />
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder={t('settings.newPassword')}
                          className={cn('pl-11 pr-12 bg-black/20 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300', isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12')}
                          {...passwordForm.register('newPassword')}
                          disabled={isUpdatingPassword}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={cn('absolute top-1/2 -translate-y-1/2 text-foreground-muted/60 hover:text-foreground transition-colors', isRTL ? 'left-3' : 'right-3')}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          aria-pressed={showNewPassword}
                        >
                          {showNewPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">{t('settings.confirmNewPassword')}</Label>
                      <div className="relative">
                        <Lock className={cn('absolute top-1/2 -translate-y-1/2 size-5 text-foreground-muted/60 pointer-events-none', isRTL ? 'right-3' : 'left-3')} aria-hidden="true" />
                        <Input
                          id="confirmNewPassword"
                          type={showConfirmNewPassword ? 'text' : 'password'}
                          placeholder={t('settings.confirmNewPassword')}
                          className={cn('pl-11 pr-12 bg-black/20 border-white/10 text-foreground placeholder:text-foreground-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus:ring-offset-transparent transition-all duration-300', isRTL ? 'pr-11 pl-12' : 'pl-11 pr-12')}
                          {...passwordForm.register('confirmNewPassword')}
                          disabled={isUpdatingPassword}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className={cn('absolute top-1/2 -translate-y-1/2 text-foreground-muted/60 hover:text-foreground transition-colors', isRTL ? 'left-3' : 'right-3')}
                          aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                          aria-pressed={showConfirmNewPassword}
                        >
                          {showConfirmNewPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmNewPassword && (
                        <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className={cn('size-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                          {t('settings.saving')}
                        </>
                      ) : (
                        t('settings.updatePassword')
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{t('addresses.title')}</h3>
                  <p className="text-foreground-muted">{t('addresses.subtitle')}</p>
                </div>
                <Button onClick={() => { setEditingAddress(null); addressForm.reset({ country: 'Egypt' }); setShowAddAddress(true); }}>
                  <Plus className="size-4" />
                  <span className={cn('mr-2', isRTL ? 'ml-2' : 'mr-2')} aria-hidden="true" />
                  {t('addresses.addNew')}
                </Button>
              </div>

              {addresses.length === 0 && !showAddAddress ? (
                <Card className="glass text-center py-12">
                  <CardContent>
                    <MapPin className="size-16 mx-auto text-foreground-muted/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('addresses.emptyTitle')}</h3>
                    <p className="text-foreground-muted mb-6">{t('addresses.emptyDesc')}</p>
                    <Button onClick={() => { addressForm.reset({ country: 'Egypt' }); setShowAddAddress(true); }}>
                      <Plus className="size-4" />
                      <span className={cn('mr-2', isRTL ? 'ml-2' : 'mr-2')} aria-hidden="true" />
                      {t('addresses.addNew')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      isDefault={address.isDefault}
                      onEdit={() => handleEditAddress(address)}
                      onDelete={() => handleDeleteAddress(address._id)}
                      onSetDefault={() => handleSetDefault(address._id)}
                    />
                  ))}
                </>
              )}

              {/* Add/Edit Address Form */}
              {(showAddAddress || editingAddress) && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>{editingAddress ? 'Edit Address' : t('addresses.addNew')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4 max-w-2xl">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">{t('addresses.fullName')}</Label>
                          <Input
                            id="fullName"
                            {...addressForm.register('fullName')}
                            disabled={isAddingAddress}
                          />
                          {addressForm.formState.errors.fullName && (
                            <p className="text-sm text-red-500">{addressForm.formState.errors.fullName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('addresses.phone')}</Label>
                          <Input
                            id="phone"
                            {...addressForm.register('phone')}
                            disabled={isAddingAddress}
                          />
                          {addressForm.formState.errors.phone && (
                            <p className="text-sm text-red-500">{addressForm.formState.errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">{t('addresses.address')}</Label>
                        <Input
                          id="address"
                          {...addressForm.register('address')}
                          disabled={isAddingAddress}
                        />
                        {addressForm.formState.errors.address && (
                          <p className="text-sm text-red-500">{addressForm.formState.errors.address.message}</p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="city">{t('addresses.city')}</Label>
                          <Input
                            id="city"
                            {...addressForm.register('city')}
                            disabled={isAddingAddress}
                          />
                          {addressForm.formState.errors.city && (
                            <p className="text-sm text-red-500">{addressForm.formState.errors.city.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">{t('addresses.postalCode')}</Label>
                          <Input
                            id="postalCode"
                            {...addressForm.register('postalCode')}
                            disabled={isAddingAddress}
                          />
                          {addressForm.formState.errors.postalCode && (
                            <p className="text-sm text-red-500">{addressForm.formState.errors.postalCode.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">{t('addresses.country')}</Label>
                          <Input
                            id="country"
                            {...addressForm.register('country')}
                            disabled={isAddingAddress}
                          />
                          {addressForm.formState.errors.country && (
                            <p className="text-sm text-red-500">{addressForm.formState.errors.country.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={isAddingAddress}>
                          {isAddingAddress ? (
                            <>
                              <Loader2 className={cn('size-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                              {t('addresses.saving')}
                            </>
                          ) : (
                            t('addresses.save')
                          )}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => { setShowAddAddress(false); setEditingAddress(null); addressForm.reset({ country: 'Egypt' }); }}>
                          {tCommon('cancel')}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Delete Confirmation Dialog */}
              <AlertDialog
                open={deleteAddressId !== null}
                onOpenChange={() => setDeleteAddressId(null)}
                title={t('addresses.confirmDelete')}
                description="This action cannot be undone."
                confirmText={t('addresses.delete')}
                cancelText={tCommon('cancel')}
                onConfirm={confirmDeleteAddress}
                variant="destructive"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string }) {
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

function OrderCard({ order, locale, onClick }: { order: Order; locale: string; onClick: () => void }) {
  const t = useTranslations('profile');
  const tOrders = useTranslations('orders');
  const tCommon = useTranslations('common');
  const tCheckout = useTranslations('checkout');

  return (
    <div
      className="glass p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Package className="size-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{t('orders.orderNumber')}{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-foreground-muted">{formatDate(order.createdAt, locale)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right sm:text-left">
            <p className="font-semibold">{order.total?.toLocaleString()} EGP</p>
            <p className="text-sm text-foreground-muted">{order.items?.length || 0} {t('orders.items')}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(order.orderStatus, tOrders)}
            <ChevronDown className={cn('size-4 text-foreground-muted', isRTL && 'rotate-180')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AddressPreview({ address, onEdit }: { address: Address; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium">{address.fullName}</p>
        <p className="text-sm text-foreground-muted">{address.phone}</p>
        <p className="text-sm text-foreground-muted mt-1">{address.address}, {address.city} {address.postalCode}, {address.country}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit className="size-4" />
      </Button>
    </div>
  );
}

function AddressCard({ address, isDefault, onEdit, onDelete, onSetDefault }: { address: Address; isDefault: boolean; onEdit: () => void; onDelete: () => void; onSetDefault: () => void }) {
  const t = useTranslations('profile');

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-medium">{address.fullName}</p>
              {isDefault && (
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                  {t('addresses.default')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground-muted">{address.phone}</p>
            <p className="text-sm text-foreground-muted mt-1">{address.address}, {address.city} {address.postalCode}, {address.country}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isDefault && (
              <Button variant="ghost" size="sm" onClick={onSetDefault}>
                <MapPin className={cn('size-4', isRTL ? 'ml-1' : 'mr-1')} />
                {t('addresses.setDefault')}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-500">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string, locale: string) {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

