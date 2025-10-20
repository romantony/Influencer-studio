"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'
import { getAuthClient } from '@/lib/firebase'
// Avoid static import of firebase/auth to prevent bundling Node build on server
import { useToast } from '@/components/toaster'

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="1em" height="1em" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.67 4.08-5.5 4.08-3.31 0-6-2.73-6-6.08s2.69-6.08 6-6.08c1.89 0 3.16.8 3.88 1.49l2.64-2.55C16.87 3.14 14.64 2 12 2 6.98 2 2.9 6.03 2.9 12S6.98 22 12 22c6.04 0 9.1-4.25 9.1-8.2 0-.55-.06-.97-.14-1.39H12z"/>
      <path fill="#34A853" d="M3.9 7.15l3.2 2.35C8.02 7.16 9.86 5.92 12 5.92c1.89 0 3.16.8 3.88 1.49l2.64-2.55C16.87 3.14 14.64 2 12 2 8.41 2 5.25 3.95 3.9 7.15z" opacity=".2"/>
      <path fill="#4285F4" d="M21.1 13.8c0-.55-.06-.97-.14-1.39H12v3.9h5.5c-.24 1.4-1.67 4.08-5.5 4.08-2.76 0-5.09-1.86-5.83-4.36l-3.27 2.53C4.93 21.21 8.19 23 12 23c6.04 0 9.1-4.25 9.1-8.2z" opacity=".2"/>
    </svg>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const { push } = useToast()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    try {
      setLoading(true)
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const auth = await getAuthClient()
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(cred.user, { displayName: name })
      push({ title: 'Welcome!', description: 'Your account was created.', variant: 'success' })
      router.push('/app')
    } catch (err: any) {
      push({ title: 'Sign up failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    try {
      setLoading(true)
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      const auth = await getAuthClient()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/app')
    } catch (err: any) {
      push({ title: 'Google sign up failed', description: err?.message ?? 'Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-20%,_oklch(0.837_0.128_66.29_/_0.25),transparent_60%)]" />
        <div className="flex h-full items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-semibold">Join InfluencerStudio</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create on-brand content faster with AI personas, scheduling, and analytics.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Unlock AI avatars, post generation, and analytics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={onGoogle} disabled={loading}>
              <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
            </Button>
            <div className="relative text-center text-xs text-muted-foreground">
              <span className="px-2">or</span>
            </div>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input name="name" placeholder="Name" required />
              <Input name="email" type="email" placeholder="you@example.com" required />
              <Input name="password" type="password" placeholder="••••••" required />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating…' : 'Continue'}
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="text-primary-600">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
