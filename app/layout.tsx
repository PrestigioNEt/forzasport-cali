import type { Metadata } from 'next';
import './globals.css';
import { RecentlyViewedProvider } from '@/components/providers/RecentlyViewedProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'Forza Sport - Tienda Online',
    template: '%s | Forza Sport'
  },
  description: 'Descubre los mejores productos deportivos, fitness y accesorios en Forza Sport. Calidad premium y los mejores precios.',
  keywords: ['deportes', 'fitness', 'accesorios deportivos', 'tienda online', 'Forza Sport'],
  authors: [{ name: 'Forza Sport' }],
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://forzasport.com',
    siteName: 'Forza Sport',
    title: 'Forza Sport - Tienda Online de Productos Deportivos y Fitness',
    description: 'Descubre los mejores productos deportivos y fitness en Forza Sport.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <CartProvider>
          <RecentlyViewedProvider>
            {children}
          </RecentlyViewedProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
