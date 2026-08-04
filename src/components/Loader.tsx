import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const KEYS = [
  { label: 'Y', bg: 'bg-yellow-400', text: 'text-yellow-900', pos: 'col-start-2 row-start-1', delay: '0s' },
  { label: 'X', bg: 'bg-blue-400', text: 'text-blue-900', pos: 'col-start-1 row-start-2', delay: '0.45s' },
  { label: 'B', bg: 'bg-red-400', text: 'text-red-900', pos: 'col-start-3 row-start-2', delay: '0.15s' },
  { label: 'A', bg: 'bg-green-400', text: 'text-green-900', pos: 'col-start-2 row-start-3', delay: '0.3s' },
];

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false
}) => {
  const diamondSizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-28 h-28',
    large: 'w-32 h-32'
  };

  const keySizeClasses = {
    small: 'w-7 h-7 text-xs',
    medium: 'w-9 h-9 text-sm',
    large: 'w-11 h-11 text-base'
  };

  const iconSizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center z-50 overflow-hidden'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      {/* Ambient background glow, full screen only */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-16 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-loader-drift" />
          <div
            className="absolute -bottom-24 -right-16 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-3xl animate-loader-drift"
            style={{ animationDelay: '1.5s' }}
          />
        </div>
      )}

      <div className="relative flex flex-col items-center space-y-8 sm:space-y-10 animate-loader-fade-in">
        {/* Controller image */}
        <div className="relative">
          <div className="absolute inset-0 bg-fuchsia-500/25 blur-xl rounded-full animate-loader-breathe" />
          <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl p-3 shadow-[0_0_25px_rgba(217,70,239,0.45)]">
            <Gamepad2 className={`${iconSizeClasses[size]} text-white animate-controller-bob`} />
          </div>
        </div>

        {/* Message */}
        <p
          className={`${textSizeClasses[size]} font-semibold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent animate-loader-flicker`}
        >
          {message}
        </p>

        {/* Animated controller keys */}
        <div className={`relative grid grid-cols-3 grid-rows-3 place-items-center ${diamondSizeClasses[size]}`}>
          <div className="absolute inset-0 bg-fuchsia-500/10 blur-xl rounded-full" />

          {KEYS.map((key) => (
            <div
              key={key.label}
              className={`relative ${key.pos} ${keySizeClasses[size]} ${key.bg} ${key.text} rounded-xl flex items-center justify-center font-black shadow-lg animate-key-press`}
              style={{ animationDelay: key.delay }}
            >
              {key.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
