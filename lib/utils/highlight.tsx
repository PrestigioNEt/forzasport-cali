import React from 'react';

/**
 * Resalta los términos de búsqueda en un texto
 * @param text - El texto completo
 * @param query - El término de búsqueda
 * @returns JSX con las partes resaltadas
 */
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-yellow-200 text-black dark:bg-yellow-500 dark:text-black font-medium rounded px-0.5"
        >
          {part}
        </mark>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Escapa caracteres especiales de regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
