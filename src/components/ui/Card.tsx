import React from 'react';

type CardVariant = 'glass' | 'solid';
type CardPadding = 'sm' | 'md' | 'lg';
type CardRounded = 'xl' | '2xl' | '3xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  rounded?: CardRounded;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl',
  solid: 'bg-white border border-gray-200 shadow-md',
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const ROUNDED_CLASSES: Record<CardRounded, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-2xl sm:rounded-3xl',
};

const Card: React.FC<CardProps> = ({
  variant = 'glass',
  padding = 'md',
  rounded = '2xl',
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${ROUNDED_CLASSES[rounded]} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
