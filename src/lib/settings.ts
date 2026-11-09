import { z } from 'zod';

export const ContactInfoSchema = z.object({
  email: z.string().email().optional().default('support@jainsaathi.com'),
  phone: z.string().optional().default('+91 98765 43210'),
  whatsapp: z.string().optional().default('+91 98765 43210'),
  address: z.string().optional().default('Mumbai, Maharashtra, India'),
  support_hours: z.string().optional().default('9:00 AM - 7:00 PM IST'),
});

export const PricingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  duration_days: z.number().int().positive(),
  features: z.array(z.string()).default([]),
  popular: z.boolean().optional().default(false),
  badge: z.string().optional(),
});

export const SiteSettingsSchema = z.object({
  contact_info: ContactInfoSchema.optional(),
  privacy_policy: z.string().optional(),
  terms_conditions: z.string().optional(),
  pricing_plans: z.array(PricingPlanSchema).optional(),
  site_metadata: z.record(z.any()).optional(),
});

/**
 * Safely parse settings value from PostgreSQL (JSONB or TEXT)
 */
export function safeParseSettingValue<T = any>(val: any, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val as T;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      // If it's a plain string like markdown text for terms or privacy policy
      return val as unknown as T;
    }
  }
  return fallback;
}

/**
 * Safely serialize setting value for database insertion
 */
export function safeSerializeSettingValue(val: any): string {
  if (typeof val === 'string') {
    return val;
  }
  return JSON.stringify(val);
}
