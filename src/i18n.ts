import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Static imports for messages
const messages = {
  en: () => import('./messages/en.json').then((m) => m.default),
  ar: () => import('./messages/ar.json').then((m) => m.default),
};

export default getRequestConfig(async ({ locale }) => {
  const localeKey = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
  return {
    locale: localeKey,
    messages: await messages[localeKey](),
  };
});