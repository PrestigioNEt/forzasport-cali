import localFont from 'next/font/local';

// Definir la fuente local Belleza
export const belleza = localFont({
  src: './Belleza-Regular.ttf', // Asegúrate que el archivo esté en c:\Users\Usuario\juanBecerra\components\Belleza-Regular.ttf
  display: 'swap',
  variable: '--font-belleza',
  weight: '400',
});

// Definir la fuente local moderat
export const moderat = localFont({
  src: './Moderat-Black.ttf', // Asegúrate que el archivo esté en c:\Users\Usuario\juanBecerra\components\Belleza-Regular.ttf
  display: 'swap',
  variable: '--font-moderat',
  weight: '400',
});
