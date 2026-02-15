'use client';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { ToastContainerProps, ToastData } from './Toast.types';
import { toast } from './toast';
import { toastStyles } from '@theme/styles/Toast.styles';

const DEFAULT_DURATION = 5000;

const ToastContainer = ({ className }: ToastContainerProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const latest = toasts[toasts.length - 1];
    const duration = latest.duration ?? DEFAULT_DURATION;

    const timer = setTimeout(() => {
      removeToast(latest.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="region"
      className={twMerge(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2',
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={toastStyles.base({ variant: t.variant })}
            role="status"
          >
            <div className={toastStyles.accentBar({ variant: t.variant })} />
            <div className="flex-1 min-w-0">
              {t.title && (
                <p className="text-sm font-medium text-fg">{t.title}</p>
              )}
              {t.description && (
                <p className="text-sm text-fg-muted">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-fg-subtle hover:text-fg transition-colors"
              aria-label="Dismiss notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
