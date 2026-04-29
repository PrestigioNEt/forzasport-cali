import clsx from 'clsx';
import Image from 'next/image';

export function GridTileImage({
  isInteractive = true,
  active,
  alt,
  src
}: {
  isInteractive?: boolean;
  active?: boolean;
  alt?: string;
  src?: string;
}) {
  return (
    <div
      className={clsx(
        'group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white transition-all duration-300 ease-in-out hover:shadow-lg',
        {
          'border-2 border-blue-600': active,
          'border-neutral-200': !active
        }
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Imagen de producto en servigreen'}
          fill
          className={clsx('object-cover object-center', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : null}
    </div>
  );
}
