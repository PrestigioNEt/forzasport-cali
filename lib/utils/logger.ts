/**
 * Utilidades de logging que solo se ejecutan en desarrollo
 * En producción, estos logs no se imprimen para evitar exponer información sensible
 */

const isDevelopment = process.env.NODE_ENV === 'development';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Log de información - Solo en desarrollo
 */
export function logInfo(message: string, context?: LogContext): void {
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, context || '');
  }
}

/**
 * Log de advertencia - Solo en desarrollo
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logWarning(_message: string, _context?: LogContext): void {
  // Esta función se mantiene para posible uso futuro, pero actualmente está vacía.
}

/**
 * Log de error - En desarrollo muestra todo, en producción solo mensajes generales
 */
export function logError(message: string, error?: unknown, context?: LogContext): void {
  if (isDevelopment) {
    console.error(`[ERROR] ${message}:`, {
      error,
      ...context
    });
  } else {
    // En producción, solo loguear el mensaje sin detalles sensibles
    // console.error(`[ERROR] ${message}`);
  }
}

/**
 * Clase de error personalizada para errores de Shopify
 */
export class ShopifyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: string
  ) {
    super(message);
    this.name = 'ShopifyAPIError';
  }
}

/**
 * Clase de error para datos no encontrados
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
