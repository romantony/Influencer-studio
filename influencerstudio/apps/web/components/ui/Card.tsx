// ...existing code...
'use client'
import React from 'react'

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={[
        'w-full overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
// ...existing code...