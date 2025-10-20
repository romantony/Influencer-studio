'use client'
import React from 'react'

type Variant = 'default' | 'outline' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    asChild?: boolean
    className?: string
}

const base = 'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

const variants: Record<Variant, string> = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted/50',
    ghost: 'bg-transparent text-foreground hover:bg-muted/50'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'default', className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={[base, variants[variant], className].filter(Boolean).join(' ')}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'