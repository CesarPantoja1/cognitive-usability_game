import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/**
 * Toggle/Switch accesible con etiqueta y descripción
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      checked,
      onCheckedChange,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className={clsx('flex items-start gap-4', className)}>
        <div className="flex-1">
          <label
            htmlFor={toggleId}
            className="block text-lg font-medium text-gray-900 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-600" id={`${toggleId}-description`}>
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={toggleId}
          aria-describedby={description ? `${toggleId}-description` : undefined}
          onClick={() => !disabled && onCheckedChange(!checked)}
          disabled={disabled}
          title={checked ? `${label}: Activado` : `${label}: Desactivado`}
          className={clsx(
            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            checked ? 'bg-primary-600' : 'bg-gray-300'
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="sr-only"
            disabled={disabled}
            {...props}
          />

          <motion.span
            className="inline-block h-6 w-6 rounded-full bg-white shadow-lg"
            initial={false}
            animate={{
              x: checked ? 28 : 4,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        </button>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
