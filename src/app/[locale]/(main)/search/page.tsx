'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/shared/SafeImage';
import { InteractiveGrid } from '@/components/ui/aceternity/InteractiveGrid';
import { MagicCard } from '@/components/ui/magicui/MagicCard';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  ChevronDown,
  Loader2,
  X,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { getProducts, getCategories, getBrands, Product, ProductFilters, Category, Brand } from '@/services/api';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('common');
  const tSearch = useTranslations('search');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<{
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
    results?: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [globalPriceRange, setGlobalPriceRange] = useState<{ minPrice: number; maxPrice: number }>({ minPrice: 0, maxPrice: 10000 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // Debounced search function
  const performSearch = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const filters: ProductFilters = {
        page,
        limit: 20,
        sortBy: sortBy !== 'default' ? sortBy : undefined,
        category: selectedCategory.length > 0 ? selectedCategory : undefined,
        brand: selectedBrand.length > 0 ? selectedBrand : undefined,
        minPrice: priceRange[0] > globalPriceRange.minPrice ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < globalPriceRange.maxPrice ? priceRange[1] : undefined,
      };

      // Note: The external API doesn't support text search (keyword/search params return 0 results).
      // We'll fetch filtered results from API and apply text search client-side.

      const response = await getProducts(filters);
      let filteredData = response.data;

      // Apply client-side text search if query exists
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter((product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query) ||
          product.brand?.name.toLowerCase().includes(query)
        );
      }

      setProducts(filteredData);
      setMetadata({
        ...response.metadata,
        results: filteredData.length // Update results count to reflect filtered data
      });
    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, globalPriceRange]);

  // Fetch global price range on mount
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        // We'll use a broad search to get price range
        const response = await getProducts({ limit: 1000, page: 1 });
        const prices = response.data.map(p => p.price).filter(p => p > 0);
        if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setGlobalPriceRange({ minPrice: min, maxPrice: max });
          setPriceRange([min, max]);
        }
      } catch (error) {
        console.error('Failed to fetch price range:', error);
      }
    };
    fetchPriceRange();
  }, []);

  // Perform search when filters change
  useEffect(() => {
    performSearch(1);
  }, [performSearch]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Sync searchQuery with URL search params (handles Navbar search navigation)
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  const handlePageChange = (newPage: number) => {
    performSearch(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory([]);
    setSelectedBrand([]);
    setPriceRange([globalPriceRange.minPrice, globalPriceRange.maxPrice]);
    setSortBy('default');
  };

  const hasActiveFilters = selectedCategory.length > 0 || selectedBrand.length > 0 ||
    priceRange[0] > globalPriceRange.minPrice || priceRange[1] < globalPriceRange.maxPrice ||
    sortBy !== 'default';

  if (isLoading && products.length === 0) {
    return (
      <div className="relative min-h-screen">
        <InteractiveGrid />
        <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-64 bg-white/10 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                  <div className="h-5 w-24 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <InteractiveGrid />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                  {tSearch('resultsTitle', { count: metadata?.results || products.length })}
                </h1>
                {searchQuery && (
                  <p className="mt-1 text-foreground-muted">
                    {tSearch('searchResultsFor', { query: searchQuery })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle (visible on mobile/tablet, hidden on desktop lg+) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden gap-2"
                >
                  <Filter className="size-4" />
                  {t('filters')}
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      {selectedCategory.length + selectedBrand.length}
                    </span>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSortOpen(!sortOpen)}
                  >
                    <ChevronDown className={cn('size-4 transition-transform', sortOpen && 'rotate-180')} />
                    {t('sortBy')}
                  </Button>
                  {sortOpen && (
                    <div className={cn(
                      'absolute mt-2 w-48 glass rounded-xl border border-border py-2 shadow-lg z-50 animate-fade-in-up',
                      isRTL ? 'left-0' : 'right-0'
                    )}>
                      {[
                        { value: 'default', label: t('sortDefault') },
                        { value: 'price', label: t('sortPriceLowHigh') },
                        { value: '-price', label: t('sortPriceHighLow') },
                        { value: '-createdAt', label: t('sortNewest') },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortOpen(false);
                          }}
                          className={cn(
                            'w-full px-4 py-2 text-sm text-left transition-colors',
                            sortBy === option.value ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-white/5'
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop Filters Button (visible on desktop lg+, hidden on mobile/tablet) - Just a label since sidebar is always visible */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex gap-2"
                  disabled
                  aria-disabled="true"
                >
                  <Filter className="size-4" />
                  {t('filters')}
                  {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      {selectedCategory.length + selectedBrand.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters Sidebar (Mobile) */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                  onClick={() => setShowFilters(false)}
                  aria-hidden="true"
                />
                <motion.div
                  initial={{ x: isRTL ? '-100%' : '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: isRTL ? '-100%' : '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn(
                    'fixed top-0 h-full w-[85%] max-w-sm bg-background/95 backdrop-blur-2xl border-white/10 z-[60] flex flex-col overflow-y-auto p-4 lg:hidden',
                    isRTL ? 'left-0 border-r' : 'right-0 border-l'
                  )}
                  role="dialog"
                  aria-modal="true"
                  aria-label={t('filters')}
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold">{t('filters')}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} aria-label={t('close')}>
                      <X className="size-6" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <FilterSection
                      title={tProduct('categories')}
                      items={categories.map(c => ({ id: c._id, name: c.name }))}
                      loading={categoriesLoading}
                      selected={selectedCategory}
                      onChange={setSelectedCategory}
                      globalPriceRange={globalPriceRange}
                    />
                    <FilterSection
                      title={tProduct('brands')}
                      items={brands.map(b => ({ id: b._id, name: b.name }))}
                      loading={brandsLoading}
                      selected={selectedBrand}
                      onChange={setSelectedBrand}
                    />
                    <PriceFilterSection
                      title={t('priceRange')}
                      priceRange={priceRange}
                      onChange={setPriceRange}
                      globalPriceRange={globalPriceRange}
                    />
                  </div>
                  <div className="p-4 border-t border-white/10 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      <X className={cn('size-4', isRTL ? 'ml-2' : 'mr-2')} />
                      {t('clearFilters')}
                    </Button>
                    <Button className="flex-1" onClick={() => setShowFilters(false)}>
                      {t('apply')}
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Filters Sidebar + Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <FilterSection
                  title={tProduct('categories')}
                  items={categories.map(c => ({ id: c._id, name: c.name }))}
                  loading={categoriesLoading}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
                <FilterSection
                  title={tProduct('brands')}
                  items={brands.map(b => ({ id: b._id, name: b.name }))}
                  loading={brandsLoading}
                  selected={selectedBrand}
                  onChange={setSelectedBrand}
                />
                <PriceFilterSection
                  title={t('priceRange')}
                  priceRange={priceRange}
                  onChange={setPriceRange}
                  globalPriceRange={globalPriceRange}
                />
                {hasActiveFilters && (
                  <Button variant="outline" className="w-full gap-2" onClick={clearFilters}>
                    <X className="size-4" />
                    {t('clearFilters')}
                  </Button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20"
                >
                  <Package className="size-16 text-foreground-muted/50 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">{tSearch('noResultsTitle')}</h2>
                  <p className="text-foreground-muted mb-6 max-w-md">
                    {searchQuery
                      ? tSearch('noResultsDesc', { query: searchQuery })
                      : tSearch('noResultsDescGeneral')}
                  </p>
                  <Button variant="outline" onClick={() => router.push('/shop')}>
                    <ArrowLeft className={cn('size-4', isRTL ? 'rotate-180 ml-2' : 'mr-2')} />
                    {t('continueShopping')}
                  </Button>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={metadata?.currentPage || 1}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {products.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <ProductCard product={product} locale={locale} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Pagination */}
                  {metadata && (metadata.numberOfPages ?? 1) > 1 && (
                    <motion.nav
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="mt-12 flex items-center justify-center gap-2"
                      aria-label={t('pagination')}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange((metadata.currentPage || 1) - 1)}
                        disabled={(metadata.currentPage || 1) <= 1}
                        aria-label={t('previous')}
                      >
                        <ChevronLeft className={cn('size-4', isRTL && 'rotate-180')} />
                      </Button>
                      {Array.from({ length: metadata.numberOfPages || 1 }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === (metadata.numberOfPages || 1) ||
                            (page >= (metadata.currentPage || 1) - 1 && page <= (metadata.currentPage || 1) + 1)
                        )
                        .map((page, index, arr) => (
                          <span key={page} className="flex items-center gap-1">
                            {index > 0 && arr[index - 1] !== page - 1 && (
                              <span className="px-2 text-foreground-muted">...</span>
                            )}
                            <Button
                              variant={(metadata.currentPage || 1) === page ? 'default' : 'outline'}
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          </span>
                        ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange((metadata.currentPage || 1) + 1)}
                        disabled={(metadata.currentPage || 1) >= (metadata.numberOfPages || 1)}
                        aria-label={t('next')}
                      >
                        <ChevronRight className={cn('size-4', isRTL && 'rotate-180')} />
                      </Button>
                    </motion.nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterItem {
  id: string;
  name: string;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selected: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
  globalPriceRange?: { minPrice: number; maxPrice: number };
}

function FilterSection({ title, items, selected, onChange, loading }: FilterSectionProps) {
  const tCommon = useTranslations('common');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-between text-left p-0 font-medium text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {title}
        </span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-2 overflow-hidden"
        >
          {loading ? (
            <p className="text-sm text-foreground-muted py-4 text-center">
              {tCommon('loading')}
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-foreground-muted py-4 text-center">
              {tCommon('noResults')}
            </p>
          ) : (
            items.map((item) => (
              <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={(e) =>
                    onChange(e.target.checked ? [...selected, item.id] : selected.filter((s) => s !== item.id))
                  }
                  className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-foreground">{item.name}</span>
              </label>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}

interface PriceFilterSectionProps {
  title: string;
  priceRange: [number, number];
  onChange: (value: [number, number]) => void;
  globalPriceRange: { minPrice: number; maxPrice: number };
}

function PriceFilterSection({ title, priceRange, onChange, globalPriceRange }: PriceFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-between text-left p-0 font-medium text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {title}
        </span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground-muted w-16">
              {formatPrice(globalPriceRange.minPrice)}
            </span>
            <input
              type="range"
              min={globalPriceRange.minPrice}
              max={globalPriceRange.maxPrice}
              value={priceRange[0]}
              onChange={(e) => onChange([Number(e.target.value), priceRange[1]])}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none accent-primary"
            />
            <span className="text-foreground-muted w-16 text-right">
              {formatPrice(globalPriceRange.maxPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground-muted w-16">
              {formatPrice(priceRange[0])}
            </span>
            <input
              type="range"
              min={globalPriceRange.minPrice}
              max={globalPriceRange.maxPrice}
              value={priceRange[1]}
              onChange={(e) => onChange([priceRange[0], Number(e.target.value)])}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none accent-primary"
            />
            <span className="text-foreground-muted w-16 text-right">
              {formatPrice(priceRange[1])}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-foreground-muted">{globalPriceRange.minPrice.toLocaleString()} EGP</span>
            <span className="text-foreground-muted text-right">{globalPriceRange.maxPrice.toLocaleString()} EGP</span>
            <span className="font-medium">{priceRange[0].toLocaleString()} EGP</span>
            <span className="font-medium text-right">{priceRange[1].toLocaleString()} EGP</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  locale: string;
}

function ProductCard({ product, locale }: ProductCardProps) {
  const tProduct = useTranslations('product');
  const tCart = useTranslations('cart');
  const isRTL = locale === 'ar';
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price;

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-white/10 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <SafeImage
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDiscount && (
            <div className={cn(
              'absolute top-3 z-10 px-2 py-1 rounded text-xs font-bold bg-red-500 text-white',
              isRTL ? 'right-3' : 'left-3'
            )}>
              -{Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)}%
            </div>
          )}
          <div className={cn(
            'absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            isRTL ? 'left-3' : 'right-3'
          )}>
            <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-colors">
              <Heart className="size-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Category & Brand */}
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            {product.category && (
              <span className="px-2 py-0.5 rounded bg-white/5">{product.category.name}</span>
            )}
            {product.brand && (
              <span className="px-2 py-0.5 rounded bg-white/5">{product.brand.name}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {displayPrice.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} EGP
            </span>
            {hasDiscount && (
              <span className="text-sm text-foreground-muted line-through">
                {product.price.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} EGP
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                product.quantity > 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              )}
            >
              {product.quantity > 0 ? tProduct('inStock', { count: product.quantity }) : tProduct('outOfStock')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}