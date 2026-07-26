import React from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  /** Bottom-sheet on mobile (CartModal-style) vs. always-centered (LoginModal-style). */
  mobileSheet?: boolean;
  size?: ModalSize;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-3xl',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  mobileSheet = false,
  size = 'sm',
  footer,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex justify-center z-[70] ${
        mobileSheet ? 'items-end sm:items-center p-0 sm:p-4' : 'items-center p-4'
      }`}
    >
      <div
        className={`relative bg-white/95 backdrop-blur-sm w-full ${SIZE_CLASSES[size]} max-h-[90vh] ${
          mobileSheet ? 'rounded-t-3xl sm:rounded-3xl sm:max-h-[80vh]' : 'rounded-2xl'
        } shadow-2xl border border-white/20 overflow-hidden flex flex-col`}
      >
        {title ? (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {icon && (
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-full text-white">
                  {icon}
                </div>
              )}
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="overflow-y-auto flex-1 p-6">{children}</div>

        {footer && (
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
