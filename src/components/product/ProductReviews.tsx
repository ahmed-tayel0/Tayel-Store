'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeImage } from '@/components/shared/SafeImage';
import { Review } from '@/hooks/useProductReviews';

interface ProductReviewsProps {
  reviews: Review[];
  isLoading: boolean;
  productId: string;
  isRTL: boolean;
}

export function ProductReviews({ reviews, isLoading, productId, isRTL }: ProductReviewsProps) {
  const t = useTranslations('product');
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[...Array(3)].map((_, i) => (
          <ReviewSkeleton key={i} isRTL={isRTL} />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-foreground-muted mb-4 text-4xl">📝</div>
        <h3 className="text-lg font-semibold mb-2">{t('noReviews')}</h3>
        <p className="text-foreground-muted">{t('beFirstToReview')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('reviews')} ({reviews.length})</h2>
      <div className="space-y-4" role="list" aria-label="Product reviews">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} locale={locale} isRTL={isRTL} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review, locale, isRTL }: { review: Review; locale: string; isRTL: boolean }) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article
      className={cn(
        'p-6 rounded-2xl bg-white/5 border border-white/10',
        'transition-colors hover:border-primary/30 hover:bg-white/10'
      )}
      role="listitem"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="size-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold text-foreground">{review.user?.name || 'Anonymous'}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'size-4',
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-foreground-muted'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <time className="text-xs text-foreground-muted" dateTime={review.createdAt}>
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
          {review.title && (
            <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
          )}
          <p className="text-foreground-muted whitespace-pre-line">{review.review}</p>
        </div>
      </div>
    </article>
  );
}

function ReviewSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-white/10 rounded" />
            <div className="h-4 w-20 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-1/3 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-2/3 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}