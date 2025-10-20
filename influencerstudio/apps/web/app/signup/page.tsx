import dynamic from 'next/dynamic'
import Link from 'next/link'

const SignUpForm = dynamic(() => import('@/components/auth/signup-form'), { ssr: false })

export default function SignUpPage() {
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
        <SignUpForm />
      </div>
    </div>
  )
}

