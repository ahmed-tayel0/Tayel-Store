'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults?: number;
}

export function Pagination({ currentPage, totalPages, totalResults }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8"
      aria-label={t('pagination') || 'Pagination'}
      role="navigation"
    >
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg',
          'bg-background border border-white/10',
          'text-foreground font-medium',
          'hover:bg-white/5 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
        )}
        aria-label={t('previous')}
        aria-disabled={currentPage === 1}
      >
        {isRTL ? (
          <>
            <span>{t('previous')}</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>{t('previous')}</span>
          </>
        )}
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1" role="group" aria-label={t('pagination')}>
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-foreground-muted"
                aria-hidden="true"
              >
                …
              </span>
            );
          }
          const pageNum = page as number;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={cn(
                'w-10 h-10 rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                pageNum === currentPage
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-background border border-white/10 text-foreground hover:bg-white/5 hover:border-primary/50'
              )}
              aria-label={`${t('page')} ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg',
          'bg-background border border-white/10',
          'text-foreground font-medium',
          'hover:bg-white/5 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
        )}
        aria-label={t('next')}
        aria-disabled={currentPage === totalPages}
      >
        {isRTL ? (
          <>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span>{t('next')}</span>
          </>
        ) : (
          <>
            <span>{t('next')}</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </nav>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  // Calculate start and end of middle range
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  // Adjust if near boundaries
  if (currentPage <= 3) {
    end = 4;
  }
  if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
  }

  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push('ellipsis');
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}