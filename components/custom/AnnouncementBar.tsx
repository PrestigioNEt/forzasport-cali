// /components/AnnouncementBar.tsx
import React from 'react';

type AnnouncementBarProps = {
  text?: string;
  enabled?: boolean;
};

const AnnouncementBar = ({
  text = 'ENVÍO GRATIS en pedidos superiores a $80.000 CLP',
  enabled = true
}: AnnouncementBarProps) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-sm font-semibold h-10 w-full border-b border-gray-700 shadow-md">
      <div className="h-full flex justify-center items-center text-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="text-green-400">✓</span>
          <span className="tracking-wide">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
