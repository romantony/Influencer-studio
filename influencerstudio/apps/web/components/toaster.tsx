'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastProps } from '@/components/ui';

const listeners = new Set<(toast: ToastProps) => void>();

export function useToast() {
  return {
    push(toast: ToastProps) {
      listeners.forEach((listener) => listener(toast));
    }
  };
}

export function Toaster() {
  const [toast, setToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    const listener = (next: ToastProps) => {
      setToast(next);
      setTimeout(() => setToast(null), 4000);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (typeof document === 'undefined') return null;
  return toast
    ? createPortal(
        <div className="fixed bottom-4 right-4 z-50">
          <Toast {...toast} />
        </div>,
        document.body
      )
    : null;
}
