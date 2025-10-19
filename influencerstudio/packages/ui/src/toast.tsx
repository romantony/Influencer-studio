import * as React from 'react';
import { clsx } from 'clsx';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

const variantStyles: Record<Required<ToastProps>['variant'], string> = {
  default: 'bg-gray-900 text-white',
  destructive: 'bg-red-600 text-white',
  success: 'bg-emerald-600 text-white'
};

export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default' }) => (
  <div className={clsx('rounded-lg px-4 py-3 shadow-lg', variantStyles[variant])}>
    <p className="font-semibold">{title}</p>
    {description ? <p className="text-sm opacity-80">{description}</p> : null}
  </div>
);
