import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Botón accesible con soporte completo de teclado y lectores de pantalla
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      loading = false,
      className,
      disabled,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-3
      font-semibold rounded-xl
      transition-all duration-200
      focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
      aria-disabled:opacity-60 aria-disabled:cursor-not-allowed
      touch-target
    `;

    const variantClasses = {
      primary: `
        bg-primary-600 text-white
        hover:bg-primary-700 active:bg-primary-800
        focus-visible:ring-primary-400
        shadow-lg hover:shadow-xl
      `,
      secondary: `
        bg-white text-primary-700
        border-2 border-primary-600
        hover:bg-primary-50 active:bg-primary-100
        focus-visible:ring-primary-400
        shadow-md hover:shadow-lg
      `,
      success: `
        bg-success-600 text-white
        hover:bg-success-700 active:bg-success-800
        focus-visible:ring-success-400
        shadow-lg hover:shadow-xl
      `,
      danger: `
        bg-error-600 text-white
        hover:bg-error-700 active:bg-error-800
        focus-visible:ring-error-400
        shadow-lg hover:shadow-xl
      `,
    };

    const sizeClasses = {
      small: 'px-4 py-2 text-base min-h-[44px]',
      medium: 'px-8 py-4 text-lg min-h-[60px]',
      large: 'px-10 py-5 text-xl min-h-[70px]',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        aria-label={props['aria-label']}
        aria-describedby={props['aria-describedby']}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      >
        {loading && (
          <div
            className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Cargando"
          />
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true">{icon}</span>
        )}

        <span>{children}</span>

        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
