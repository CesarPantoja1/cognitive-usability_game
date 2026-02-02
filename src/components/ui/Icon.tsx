import React from 'react';
import { iconMap, IconName } from '../../utils/iconMapping';
import clsx from 'clsx';

export interface IconProps {
  name: IconName;
  size?: number | 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
}

/**
 * Componente de icono accesible
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
    xl: 48,
  };

  const iconSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <IconComponent
      size={iconSize}
      className={clsx('inline-block', className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    />
  );
};
