import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

/**
 * Barra de progreso accesible con aria-valuenow y efectos visuales
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'primary',
  size = 'medium',
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-indigo-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-rose-500',
  };

  const bgClasses = {
    primary: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    error: 'bg-red-100',
  };

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-5',
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700" id={`progress-label-${label}`}>
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={clsx(
          'w-full rounded-full overflow-hidden relative',
          bgClasses[variant],
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progreso'}
        aria-labelledby={label ? `progress-label-${label}` : undefined}
      >
        <motion.div
          className={clsx(
            'h-full rounded-full relative overflow-hidden',
            variantClasses[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Efecto de brillo animado */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};
