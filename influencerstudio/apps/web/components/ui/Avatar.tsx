// ...existing code...
'use client'
import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 'md', className }) => {
  const sizeCls = sizeMap[size]
  return (
    <div
      className={[
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-muted/60 text-foreground/90',
        sizeCls,
        className
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={alt}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-medium">{fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : '')}</span>
      )}
    </div>
  )
}
// ...existing code...