// ...existing code...
'use client'
import React from 'react'

export const Separator: React.FC<{ className?: string }> = ({ className }) => {
  return <div role="separator" className={['my-4 h-px bg-border', className].filter(Boolean).join(' ')} />
}
// ...existing code...