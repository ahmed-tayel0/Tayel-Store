import { z } from 'zod';

export const createCheckoutSchema = (t: (key: string) => string) => z.object({
  fullName: z.string().min(3, t('checkout.validation.fullNameMin')),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, t('checkout.validation.phoneInvalid')),
  address: z.string().min(5, t('checkout.validation.addressMin')),
  city: z.string().min(2, t('checkout.validation.cityMin')),
  postalCode: z.string().regex(/^\d{5}$/, t('checkout.validation.postalCodeInvalid')),
  country: z.string().min(1, t('checkout.validation.countryRequired')),
});

export type CheckoutFormData = z.infer<ReturnType<typeof createCheckoutSchema>>;