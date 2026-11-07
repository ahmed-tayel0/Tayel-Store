'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useEffect, useState, Suspense } from 'react';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { Pagination } from '@/components/shop/Pagination';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductListCard } from '@/components/shared/ProductListCard';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { useGlobalPriceRange } from '@/hooks/useGlobalPriceRange';
import { ProductFilters, ProductsResponse } from '@/services/api';
import { Category, Brand } from '@/types/api';
import { Loader2, ShoppingBag, X, ChevronDown, ChevronUp, ArrowUpDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse filters from URL
  const filters: ProductFilters = {
    category: searchParams.getAll('category') || undefined,
    brand: searchParams.getAll('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: searchParams.get('sortBy') || 'default',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 20,
  };

  // Update local sortBy state from URL
  useEffect(() => {
    setSortBy(searchParams.get('sortBy') || 'default');
  }, [searchParams]);

  // Fetch data
  const { data: productsData, isLoading: productsLoading, error: productsError, refetch } = useProducts(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: globalPriceRange, isLoading: priceRangeLoading } = useGlobalPriceRange();

  const products = productsData?.data || [];
  const metadata = productsData?.metadata || {};
  const currentPage = metadata.currentPage || 1;
  const totalPages = metadata.numberOfPages || 1;
  const totalResults = metadata.results || 0;

  // Global min/max prices from entire store (for price range filter placeholders)
  const minPricePlaceholder = globalPriceRange?.minPrice ?? 0;
  const maxPricePlaceholder = globalPriceRange?.maxPrice ?? 10000;

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'default') {
      params.delete('sortBy');
    } else {
      params.set('sortBy', newSort);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setSortBy(newSort);
  };

  const hasActiveFilters =
    (filters.category?.length || 0) > 0 ||
    (filters.brand?.length || 0) > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  const sortOptions = [
    { value: 'default', label: t('sortDefault') },
    { value: '-createdAt', label: t('sortNewest') },
    { value: 'price', label: t('sortPriceLowHigh') },
    { value: '-price', label: t('sortPriceHighLow') },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Interactive Grid Background */}
      <InteractiveGrid />

      <div className="relative z-10 container-custom py-12 lg:py-16">
        {/* Page Header */}
        <header className="mb-8 lg:mb-12 animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">
              {t('products')}
            </h1>
            <p className="mt-2 text-foreground-muted">
              {t('showingProducts', {
                start: (currentPage - 1) * (filters.limit || 20) + 1,
                end: Math.min(currentPage * (filters.limit || 20), totalResults),
                total: totalResults,
              })}
            </p>
          </div>

          {/* Mobile Top Bar: Filters + Sort + View Mode (visible up to 1023px) */}
          <div className="flex lg:hidden items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                  'bg-background border border-white/10',
                  'text-foreground font-medium',
                  'hover:bg-white/5 transition-colors'
                )}
                aria-label={t('filters')}
              >
                <Filter className="size-5" aria-hidden="true" />
                <span>{t('filters')}</span>
                {hasActiveFilters && (
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                    {(filters.category?.length || 0) + (filters.brand?.length || 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowMobileSort(true)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                  'bg-background border border-white/10',
                  'text-foreground font-medium',
                  'hover:bg-white/5 transition-colors'
                )}
                aria-label={t('sortBy')}
              >
                <ArrowUpDown className="size-5" aria-hidden="true" />
                <span>{t('sortBy')}</span>
              </button>
            </div>
            {/* View Mode Toggle (Mobile) */}
            <div className="flex items-center bg-background border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-muted hover:text-foreground'
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-muted hover:text-foreground'
                )}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Filters Bar */}
          <div className="hidden lg:flex flex-wrap items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg',
                  'bg-background border border-white/10',
                  'text-foreground font-medium',
                  'hover:bg-white/5 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                )}
                aria-haspopup="listbox"
                aria-label={t('sortBy')}
              >
                <ChevronDown className="size-4" aria-hidden="true" />
                <span>{t('sortBy')}</span>
                <span className="text-sm text-foreground-muted">
                  {sortOptions.find((o) => o.value === sortBy)?.label || t('sortDefault')}
                </span>
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
              <ul
                id="sort-dropdown"
                className={cn('absolute top-full mt-2 w-56 hidden glass rounded-lg border border-white/10 py-2 shadow-lg z-20 animate-slide-down', isRTL ? 'left-0' : 'right-0')}
                role="listbox"
                aria-label={t('sortBy')}
              >
                {sortOptions.map((option) => (
                  <li key={option.value} role="option" aria-selected={sortBy === option.value}>
                    <button
                      onClick={() => {
                        handleSortChange(option.value);
                        document.getElementById('sort-dropdown')?.classList.add('hidden');
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm transition-colors',
                        'hover:bg-white/5',
                        sortBy === option.value ? 'text-primary bg-primary/10' : 'text-foreground'
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-background border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-muted hover:text-foreground'
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground-muted hover:text-foreground'
                )}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <div className={cn('flex flex-wrap items-center gap-2', isRTL ? 'mr-auto' : 'ml-auto')}>
                {filters.category?.map((catId: string) => {
                  const cat = categories?.find((c) => c._id === catId);
                  return (
                    <FilterChip
                      key={catId}
                      label={cat ? cat.name : catId}
                      onRemove={() => removeFilter('category', catId)}
                    />
                  );
                })}
                {filters.brand?.map((brandId: string) => {
                  const brand = brands?.find((b) => b._id === brandId);
                  return (
                    <FilterChip
                      key={brandId}
                      label={brand ? brand.name : brandId}
                      onRemove={() => removeFilter('brand', brandId)}
                    />
                  );
                })}
                {filters.minPrice && (
                  <FilterChip
                    key="minPrice"
                    label={`${t('min')}: ${filters.minPrice} EGP`}
                    onRemove={() => removeFilter('minPrice')}
                  />
                )}
                {filters.maxPrice && (
                  <FilterChip
                    key="maxPrice"
                    label={`${t('max')}: ${filters.maxPrice} EGP`}
                    onRemove={() => removeFilter('maxPrice')}
                  />
                )}
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  {t('clearAll')}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              categories={categories || []}
              brands={brands || []}
              isOpen={true}
              onClose={() => {}}
              minPricePlaceholder={minPricePlaceholder}
              maxPricePlaceholder={maxPricePlaceholder}
            />
          </aside>

          {/* Mobile Filters Sheet */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
                aria-hidden="true"
              />
              <div
                className={cn(
                  'absolute inset-y-0 right-0 w-full max-w-[85vw] sm:max-w-[400px]',
                  'bg-background border-l border-white/10',
                  'flex flex-col animate-slide-in-right',
                  isRTL ? 'left-0 right-auto border-r border-l-0' : ''
                )}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">{t('filters')}</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label={t('close')}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FilterSidebar
                    categories={categories || []}
                    brands={brands || []}
                    isOpen={true}
                    onClose={() => setShowFilters(false)}
                    minPricePlaceholder={minPricePlaceholder}
                    maxPricePlaceholder={maxPricePlaceholder}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Sort Sheet */}
          {showMobileSort && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileSort(false)}
                aria-hidden="true"
              />
              <div
                className={cn(
                  'absolute inset-y-0 right-0 w-full max-w-[85vw] sm:max-w-[400px]',
                  'bg-background border-l border-white/10',
                  'flex flex-col animate-slide-in-right',
                  isRTL ? 'left-0 right-auto border-r border-l-0' : ''
                )}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">{t('sortBy')}</h2>
                  <button
                    onClick={() => setShowMobileSort(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label={t('close')}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2" role="listbox" aria-label={t('sortBy')}>
                    {sortOptions.map((option) => (
                      <li key={option.value} role="option" aria-selected={sortBy === option.value}>
                        <button
                          onClick={() => {
                            handleSortChange(option.value);
                            setShowMobileSort(false);
                          }}
                          className={cn(
                            'w-full px-4 py-3 text-left text-sm transition-colors rounded-lg',
                            'hover:bg-white/5',
                            sortBy === option.value
                              ? 'text-primary bg-primary/10 font-medium'
                              : 'text-foreground'
                          )}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Products Area */}
          <main className="flex-1 min-w-0">
            {/* Loading State */}
            {productsLoading && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-live="polite">
                    {[...Array(8)].map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4" aria-live="polite">
                    {[...Array(6)].map((_, i) => (
                      <ProductListCardSkeleton key={i} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Error State */}
            {productsError && !productsLoading && (
              <div className="text-center py-16">
                <div className="text-error mb-4 text-2xl">⚠️</div>
                <h3 className="text-lg font-semibold mb-2">{t('error')}</h3>
                <p className="text-foreground-muted mb-6">Failed to load products. Please try again.</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
                >
                  <Loader2 className={cn('size-4 inline animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                  {t('retry')}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="text-center py-16">
                <ShoppingBag className="size-16 mx-auto text-foreground-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-foreground-muted mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
                >
                  {t('clearFilters')}
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!productsLoading && !productsError && products.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    role="list"
                    aria-label={t('products')}
                  >
                    {products.map((product, index) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        priority={index < 4}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col gap-4"
                    role="list"
                    aria-label={t('products')}
                  >
                    {products.map((product, index) => (
                      <ProductListCard
                        key={product._id}
                        product={product}
                        priority={index < 4}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );

  function removeFilter(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'minPrice' || key === 'maxPrice') {
      params.delete(key);
    } else if (value) {
      const values = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAllFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('brand');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('sortBy');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setSortBy('default');
  }
}

function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-500 bg-white/5 rounded-2xl">
      <div className="relative aspect-square w-full overflow-hidden bg-white/5">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse mb-4" />
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-9 w-24 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ProductListCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-stretch w-full gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-[4/3] md:w-48 md:h-48 md:aspect-auto md:shrink-0 rounded-xl bg-white/10" />
      {/* Content placeholder */}
      <div className="flex flex-col gap-2 w-full">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-6 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-white/10 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-white/10 mt-auto">
          <div className="h-7 w-24 bg-white/10 rounded" />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-full md:w-28 md:flex-1 bg-white/10 rounded-full" />
            <div className="h-10 w-10 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
        aria-label="Remove filter"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}