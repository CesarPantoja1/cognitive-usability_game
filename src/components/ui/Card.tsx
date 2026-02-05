import React, { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  elevated?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  as?: 'div' | 'article' | 'section';
}

/**
 * Tarjeta accesible con animaciones opcionales
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      interactive = false,
      elevated = false,
      padding = 'medium',
      as: Component = 'div',
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      bg-white rounded-2xl
      border-2 border-transparent
      transition-all duration-300
    `;

    const interactiveClasses = interactive
      ? `
        cursor-pointer
        hover:scale-105 hover:border-primary-400 hover:shadow-card-hover
        active:scale-95
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2
      `
      : '';

    const elevatedClasses = elevated ? 'shadow-card-hover' : 'shadow-card';

    const paddingClasses = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    };

    const MotionComponent = motion[Component as keyof typeof motion] as any;

    return (
      <MotionComponent
        ref={ref}
        className={clsx(
          baseClasses,
          interactiveClasses,
          elevatedClasses,
          paddingClasses[padding],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Card.displayName = 'Card';
