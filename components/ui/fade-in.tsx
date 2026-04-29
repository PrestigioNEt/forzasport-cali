'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = ''
}: FadeInProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(30px)';
        case 'down':
          return 'translateY(-30px)';
        case 'left':
          return 'translateX(30px)';
        case 'right':
          return 'translateX(-30px)';
        case 'none':
          return 'none';
      }
    }
    return 'none';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
}

export function FadeInStagger({
  children,
  staggerDelay = 0.1,
  ...props
}: Omit<FadeInProps, 'delay'> & { staggerDelay?: number }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <FadeIn key={index} delay={index * staggerDelay} {...props}>
              {child}
            </FadeIn>
          ))
        : children}
    </>
  );
}
