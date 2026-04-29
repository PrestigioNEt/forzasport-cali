'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Toast } from '@/components/ui/toast';
import { newsletterSchema } from '@/lib/validations/forms';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = () => {
    // Validación con Zod
    const result = newsletterSchema.safeParse({ email });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Error de validación';
      setToast({ message: errorMessage, type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrar con servicio de email marketing (Mailchimp, SendGrid, etc.)
    // Por ahora solo simulación
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ message: '¡Gracias por suscribirte!', type: 'success' });
      setEmail('');
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  };

  return (
    <div className="bg-white py-10 sm:py-14">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2d7a3e]/10 mb-6">
          <Mail className="h-8 w-8 text-[#2d7a3e]" />
        </div>

        <h2 className="font-belleza text-2xl sm:text-3xl lg:text-5xl font-light tracking-wide mb-6 leading-tight text-gray-900">
          Suscríbete a nuestro Newsletter
        </h2>
        
        <p className="font-moderat text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
          Recibe consejos de jardinería, nuevas plantas y ofertas especiales directamente en tu bandeja de entrada.
        </p>

        <div className="mt-10 mx-auto max-w-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="email-address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              className="font-moderat flex-auto border border-gray-300 bg-white px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-[#2d7a3e] focus:ring-2 focus:ring-[#2d7a3e] focus:outline-none transition-all duration-300 text-base"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="font-moderat flex-none bg-[#2d7a3e] px-8 py-3.5 text-sm tracking-[0.15em] uppercase font-medium text-white hover:bg-[#1e5a2a] focus:outline-none focus:ring-2 focus:ring-[#2d7a3e] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? 'Enviando...' : 'Suscribirse'}
            </button>
          </div>
          
          <p className="font-moderat text-xs text-gray-500 mt-4 leading-relaxed">
            Al suscribirte, aceptas recibir correos de servigreen. Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
}