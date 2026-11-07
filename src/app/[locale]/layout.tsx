import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '@/providers/Providers';
import { Syne, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { locales } from '@/i18n';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import '../globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-ibm-plex-arabic',
  subsets: ['arabic'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  // Get messages for the locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  // Server can't read localStorage, pass false to avoid hydration mismatch
  // Client-side Navbar will check localStorage and fetch cart/wishlist
  const isLoggedIn = false;

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${isRTL ? ibmPlexSansArabic.variable : syne.variable} h-full dark`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers locale={locale}>
            <div className={`${isRTL ? ibmPlexSansArabic.className : syne.className} flex-1`}>
              <NavbarWrapper>
                {children}
              </NavbarWrapper>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}