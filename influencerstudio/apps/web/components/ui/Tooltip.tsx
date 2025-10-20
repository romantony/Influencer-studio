// ...existing code...
'use client'
import React from 'react'

export const Tooltip: React.FC<{ content: React.ReactNode; className?: string; children: React.ReactNode }> = ({
    content,
    children,
    className
}) => {
    return (
        <span className={['relative inline-block', className].filter(Boolean).join(' ')}>
            <span className="group inline-block">{children}</span>
            <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 bottom-full mb-2 hidden -translate-x-1/2 rounded-md bg-foreground/90 px-2 py-1 text-xs text-background group-hover:block"
            >
                {content}
            </span>
        </span>
    )
}
// ...existing code...