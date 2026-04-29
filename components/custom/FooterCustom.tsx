'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { newsletterSchema } from '@/lib/validations/forms';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación con Zod
    const result = newsletterSchema.safeParse({ email });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Error de validación';
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    // TODO: Integrar con servicio de email marketing
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold tracking-wider">
                <span className="text-white">Forza Sport</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Tu tienda online de confianza. Deportes, fitness y accesorios deportivos con los mejores productos y precios.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Menú Inferior */}
          <div>
            <h4 className="text-lg mb-6">Menú inferior</h4>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors duration-200">Búsqueda</Link></li>
              <li><Link href="/terminos-del-servicio" className="text-gray-400 hover:text-white transition-colors duration-200">Términos del servicio</Link></li>
              <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors duration-200">Catálogo</Link></li>
            </ul>
          </div>

          {/* Nuestras Políticas */}
          <div>
            <h4 className="text-lg mb-6">Nuestras Políticas</h4>
            <ul className="space-y-3">
              <li><Link href="/politica-proteccion-datos" className="text-gray-400 hover:text-white transition-colors duration-200">Política de protección de datos</Link></li>
              <li><Link href="/politica-reembolso" className="text-gray-400 hover:text-white transition-colors duration-200">Política de Reembolso</Link></li>
              <li><Link href="/politica-envios" className="text-gray-400 hover:text-white transition-colors duration-200">Política de Envíos</Link></li>
              <li><Link href="/terminos-y-condiciones" className="text-gray-400 hover:text-white transition-colors duration-200">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg mb-6">Conoce sobre Noticias y descuentos</h4>
            <p className="text-gray-400 mb-4">
              Suscríbete y obtén noticias y regalos en todos nuestros productos.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Su e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : 'Suscribir'}
                </button>
              </div>
            </form>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a href="tel:+56946152919" className="text-gray-400 hover:text-white transition-colors duration-200">
                  +56 9 4615 2919
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a href="mailto:contacto@forzasport.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                  contacto@forzasport.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Forza Sport. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-400 text-sm">
                País/región: Chile (CLP $)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}