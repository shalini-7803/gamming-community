import React from 'react';

type BadgeColor = 'cyan' | 'orange' | 'purple' | 'gray';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const COLOR_CLASSES: Record<BadgeColor, string> = {
  cyan: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white',
  orange: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
  purple: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
  gray: 'bg-gray-100 text-gray-600',
};

const Badge: React.FC<BadgeProps> = ({ color = 'cyan', className = '', children, ...rest }) => (
  <span
    className={`inline-block px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${COLOR_CLASSES[color]} ${className}`}
    {...rest}
  >
    {children}
  </span>
);

export default Badge;
