import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Protected routes that require authentication
const protectedRoutes = ['/profile', '/checkout', '/cart', '/wishlist', '/orders'];

export default function middleware(request: NextRequest) {
  // Check if the path is a protected route (with locale prefix)
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname (e.g., /en/profile -> profile)
  const localeMatch = pathname.match(/^\/(en|ar)(?:\/|$)/);
  const pathWithoutLocale = localeMatch ? pathname.slice(localeMatch[0].length) : pathname;

  const isProtectedRoute = protectedRoutes.some(route => pathWithoutLocale.startsWith(route));

  if (isProtectedRoute) {
    // Check for auth_token in cookies
    const authToken = request.cookies.get('auth_token');

    if (!authToken) {
      // Redirect to login with redirect parameter
      const loginUrl = new URL(`/${localeMatch ? localeMatch[1] : defaultLocale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};