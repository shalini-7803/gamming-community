import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const BARS = [
  { delay: '0s', color: 'from-violet-400 to-violet-600' },
  { delay: '0.15s', color: 'from-fuchsia-400 to-fuchsia-600' },
  { delay: '0.3s', color: 'from-orange-400 to-orange-600' },
  { delay: '0.15s', color: 'from-fuchsia-400 to-fuchsia-600' },
  { delay: '0s', color: 'from-violet-400 to-violet-600' },
];

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false
}) => {
  const ringSizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-24 h-24',
    large: 'w-28 h-28'
  };

  const iconSizeClasses = {
    small: 'w-7 h-7',
    medium: 'w-9 h-9',
    large: 'w-11 h-11'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const barHeightClasses = {
    small: 'h-5',
    medium: 'h-6',
    large: 'h-8'
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

      <div className="relative flex flex-col items-center space-y-6 sm:space-y-8 animate-loader-fade-in">
        {/* Sparkle accents */}
        <Sparkles
          className="absolute -top-3 -left-4 w-4 h-4 text-fuchsia-300 animate-sparkle-twinkle pointer-events-none"
          style={{ animationDelay: '0.4s' }}
        />
        <Sparkles
          className="absolute -bottom-2 -right-5 w-3.5 h-3.5 text-orange-300 animate-sparkle-twinkle pointer-events-none"
          style={{ animationDelay: '1.2s' }}
        />

        {/* Spinning neon ring with controller at center */}
        <div className={`relative ${ringSizeClasses[size]}`}>
          <div className="absolute -inset-2 bg-fuchsia-500/20 blur-2xl rounded-full animate-loader-breathe" />
          <div className="absolute inset-0 bg-violet-500/25 blur-xl rounded-full animate-loader-breathe" style={{ animationDelay: '0.6s' }} />

          {/* Orbiting satellite dots */}
          <div className="absolute inset-[-6px] animate-loader-ring-spin" style={{ animationDuration: '3s' }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
          </div>
          <div className="absolute inset-[-2px] animate-loader-ring-spin-reverse" style={{ animationDuration: '4s' }}>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.9)]" />
          </div>

          <div
            className="absolute inset-0 rounded-full animate-loader-ring-spin shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(217,70,239,0.9) 25%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-1.5 rounded-full animate-loader-ring-spin-reverse"
            style={{
              background:
                'conic-gradient(from 90deg, transparent 0%, rgba(251,146,60,0.8) 20%, transparent 45%)',
            }}
          />

          <div className="absolute inset-3 rounded-full bg-slate-950 light:bg-white border border-white/10 light:border-gray-200 flex items-center justify-center shadow-[inset_0_0_15px_rgba(217,70,239,0.25)]">
            <Gamepad2 className={`${iconSizeClasses[size]} text-fuchsia-400 animate-controller-bob drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]`} />
          </div>
        </div>

        {/* Equalizer-style loading bars */}
        <div className={`flex items-end gap-1.5 ${barHeightClasses[size]}`}>
          {BARS.map((bar, i) => (
            <div
              key={i}
              className={`w-1.5 sm:w-2 h-full rounded-full bg-gradient-to-t ${bar.color} shadow-[0_0_8px_rgba(217,70,239,0.5)] animate-loader-segment`}
              style={{ animationDelay: bar.delay }}
            />
          ))}
        </div>

        {/* Message */}
        <div className="flex items-center gap-1.5">
          <p
            className={`${textSizeClasses[size]} font-bold uppercase tracking-widest bg-gradient-to-r from-violet-300 via-fuchsia-300 via-orange-300 to-violet-300 light:from-violet-700 light:via-fuchsia-700 light:via-orange-700 light:to-violet-700 bg-clip-text text-transparent animate-strip-gradient-flow`}
          >
            {message}
          </p>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_4px_rgba(217,70,239,0.9)] animate-loader-dot-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_4px_rgba(217,70,239,0.9)] animate-loader-dot-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_4px_rgba(217,70,239,0.9)] animate-loader-dot-bounce" style={{ animationDelay: '0.3s' }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
