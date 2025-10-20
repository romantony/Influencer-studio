"use client"
import { Button, Tooltip } from '@/components/ui'
import { auth } from '@/lib/firebase'

export function SignOutButton() {
  return (
    <Tooltip content="Sign out">
      <Button
        variant="outline"
        onClick={async () => {
          try {
            const { signOut } = await import('firebase/auth')
            await signOut(auth)
          } finally {
            if (typeof window !== 'undefined') window.location.href = '/signin'
          }
        }}
      >
        Sign out
      </Button>
    </Tooltip>
  )
}

