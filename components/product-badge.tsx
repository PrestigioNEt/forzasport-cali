import clsx from 'clsx';

interface ProductBadgeProps {
  className?: string;
  label?: string;
}

export function ProductBadge({ className, label = 'BLACK DAYS' }: ProductBadgeProps) {
  return (
    <div
      className={clsx(
        'absolute top-3 left-3 z-10',
        'bg-gradient-to-r from-black via-gray-900 to-black',
        'text-white font-bold',
        'px-3 py-1.5',
        'text-xs uppercase tracking-wider',
        'shadow-lg',
        'transform -rotate-3',
        'border border-yellow-500',
        'animate-pulse',
        className
      )}
    >
      <span className="relative">
        {label}
        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-sm"></span>
      </span>
    </div>
  );
}
