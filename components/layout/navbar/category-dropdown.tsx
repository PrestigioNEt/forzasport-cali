'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Category {
  title: string;
  path: string;
}

interface CategoryDropdownProps {
  categories: Category[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger button */}
      <button
        className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">Categorías</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-56 rounded-md bg-white py-2 shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <Link
              href="/search"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Ver todos los productos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.path}
                href={category.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
