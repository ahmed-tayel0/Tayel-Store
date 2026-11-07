'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { translateTerm } from '@/lib/translations';
import { Category, Brand } from '@/types/api';

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  isOpen: boolean;
  onClose: () => void;
  minPricePlaceholder?: number;
  maxPricePlaceholder?: number;
}

export function FilterSidebar({ categories, brands, isOpen, onClose, minPricePlaceholder, maxPricePlaceholder }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
  });

  // Parse current filters from URL
  const currentCategories = searchParams.getAll('category');
  const currentBrands = searchParams.getAll('brand');
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  // Refs for uncontrolled price inputs - no React state, no re-renders on typing
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  const updateFilters = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((v) => params.append(key, v));
    params.set('page', '1'); // Reset to first page when filters change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updatePriceFilter = (min?: string, max?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((c: string) => c !== categoryId)
      : [...currentCategories, categoryId];
    updateFilters('category', newCategories);
  };

  const handleBrandToggle = (brandId: string) => {
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter((b: string) => b !== brandId)
      : [...currentBrands, brandId];
    updateFilters('brand', newBrands);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Read values directly from DOM refs - no React state involved
    const minVal = minRef.current?.value || '';
    const maxVal = maxRef.current?.value || '';
    updatePriceFilter(minVal || undefined, maxVal || undefined);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('brand');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('sortBy');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    // Clear input values visually
    if (minRef.current) minRef.current.value = '';
    if (maxRef.current) maxRef.current.value = '';
  };

  const hasActiveFilters =
    currentCategories.length > 0 ||
    currentBrands.length > 0 ||
    currentMinPrice ||
    currentMaxPrice;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-72 flex-shrink-0',
        'animate-fade-in'
      )}
      aria-label={t('filters')}
    >
      <div className="glass rounded-2xl p-6 h-fit lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-primary" aria-hidden="true" />
            {t('filters')}
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary-light transition-colors"
            >
              {t('clearAll')}
            </button>
          )}
        </div>

        <FilterContent />

        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={clearAllFilters}
              className="w-full py-3 px-4 rounded-lg bg-white/5 text-foreground hover:bg-white/10 transition-colors font-medium"
            >
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>
    </aside>
  );

  function FilterContent() {
    return (
      <div className="space-y-6">
        {/* Categories */}
        <FilterSection
          title={t('categories')}
          sectionKey="categories"
          expanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={currentCategories.includes(category._id)}
                  onChange={() => handleCategoryToggle(category._id)}
                  className={cn(
                    'size-4 rounded border-white/20',
                    'bg-background text-primary',
                    'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                    'transition-all duration-200',
                    'checked:border-primary checked:bg-primary',
                    'hover:border-primary/50'
                  )}
                  aria-label={translateTerm(category.name, locale)}
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {translateTerm(category.name, locale)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection
          title={t('brands')}
          sectionKey="brands"
          expanded={expandedSections.brands}
          onToggle={() => toggleSection('brands')}
        >
          <div className="space-y-3">
            {brands.map((brand) => (
              <label
                key={brand._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={currentBrands.includes(brand._id)}
                  onChange={() => handleBrandToggle(brand._id)}
                  className={cn(
                    'size-4 rounded border-white/20',
                    'bg-background text-primary',
                    'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                    'transition-all duration-200',
                    'checked:border-primary checked:bg-primary',
                    'hover:border-primary/50'
                  )}
                  aria-label={translateTerm(brand.name, locale)}
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {translateTerm(brand.name, locale)}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range - Uncontrolled inputs with refs */}
        <FilterSection
          title={t('priceRange')}
          sectionKey="price"
          expanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <form onSubmit={handlePriceSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minPrice" className="block text-xs text-foreground-muted mb-1">
                  {t('min')}
                </label>
                <input
                  id="minPrice"
                  ref={minRef}
                  type="text"
                  inputMode="numeric"
                  defaultValue={currentMinPrice}
                  placeholder={minPricePlaceholder?.toString() || '0'}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-background border border-white/10',
                    'text-foreground placeholder:text-foreground-muted',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-all duration-200',
                    '[appearance:textfield]',
                    '[&::-webkit-outer-spin-button]:appearance-none',
                    '[&::-webkit-inner-spin-button]:appearance-none'
                  )}
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-xs text-foreground-muted mb-1">
                  {t('max')}
                </label>
                <input
                  id="maxPrice"
                  ref={maxRef}
                  type="text"
                  inputMode="numeric"
                  defaultValue={currentMaxPrice}
                  placeholder={maxPricePlaceholder?.toString() || '10000'}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg',
                    'bg-background border border-white/10',
                    'text-foreground placeholder:text-foreground-muted',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-all duration-200',
                    '[appearance:textfield]',
                    '[&::-webkit-outer-spin-button]:appearance-none',
                    '[&::-webkit-inner-spin-button]:appearance-none'
                  )}
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
            >
              {t('apply')}
            </button>
          </form>
        </FilterSection>
      </div>
    );
  }
}

function FilterSection({
  title,
  sectionKey,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2"
        aria-expanded={expanded}
      >
        <span className="font-medium text-foreground">{title}</span>
        <span className="flex items-center gap-1 text-foreground-muted transition-transform duration-200">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>
      {expanded && <div className="mt-4 animate-slide-down">{children}</div>}
    </div>
  );
}