'use client';

import { Truck, RefreshCcw, Shield, CreditCard } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const badges = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras >$120 USD'
  },
  {
    icon: RefreshCcw,
    title: '30 Días',
    description: 'Devolución gratis'
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: '100% protegida'
  },
  {
    icon: CreditCard,
    title: 'Pago Seguro',
    description: 'SSL encriptado'
  }
];

export function TrustBadges() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-b border-gray-100">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 group cursor-default"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`
            }}
          >
            <div className="mb-3 relative">
              <div className="absolute inset-0 bg-[#2d7a3e]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gray-50 p-3 rounded-full group-hover:bg-[#2d7a3e]/5 transition-colors duration-300">
                <Icon className="h-6 w-6 text-[#2d7a3e] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <h4 className="font-moderat text-xs uppercase font-semibold text-gray-900 mb-1 tracking-wider">
              {badge.title}
            </h4>
            <p className="text-xs text-gray-500">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
