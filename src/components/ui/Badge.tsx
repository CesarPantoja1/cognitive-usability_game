import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Badge/Etiqueta para mostrar información breve
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium',
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 border border-primary-300',
    success: 'bg-success-100 text-success-800 border border-success-300',
    warning: 'bg-warning-100 text-warning-800 border border-warning-300',
    error: 'bg-error-100 text-error-800 border border-error-300',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-300',
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
