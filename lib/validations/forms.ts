import { z } from 'zod';

/**
 * Esquema de validación para formularios de email/newsletter
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .toLowerCase()
    .trim()
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Esquema de validación para búsqueda
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Ingresa un término de búsqueda')
    .max(100, 'El término de búsqueda es demasiado largo')
    .trim()
});

export type SearchFormData = z.infer<typeof searchSchema>;

/**
 * Esquema de validación para contacto
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .max(200, 'El asunto es demasiado largo')
    .trim(),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo')
    .trim()
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Función helper para validar datos contra un schema
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((err) => err.message);
  return { success: false, errors };
}
