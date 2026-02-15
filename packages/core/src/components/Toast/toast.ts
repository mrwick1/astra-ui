import { ToastData } from './Toast.types';

type ToastListener = (toast: ToastData) => void;

const listeners: Set<ToastListener> = new Set();
let toastId = 0;

function emit(data: Omit<ToastData, 'id'>) {
  const toast: ToastData = { ...data, id: String(++toastId) };
  listeners.forEach((fn) => fn(toast));
}

export const toast = {
  info: (title: string, description?: string) =>
    emit({ variant: 'info', title, description }),
  success: (title: string, description?: string) =>
    emit({ variant: 'success', title, description }),
  warning: (title: string, description?: string) =>
    emit({ variant: 'warning', title, description }),
  error: (title: string, description?: string) =>
    emit({ variant: 'error', title, description }),
  subscribe: (fn: ToastListener) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
