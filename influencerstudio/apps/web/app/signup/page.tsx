import Link from 'next/link';
import { Button, Input } from '@/components/ui';

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Create your StudioSuite account</h1>
        <p className="text-sm text-muted-foreground">
          Unlock AI avatars, post generation, and analytics.
        </p>
      </div>
      <form className="space-y-4">
        <Input name="name" placeholder="Name" required />
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Input name="password" type="password" placeholder="••••••" required />
        <Button type="submit" className="w-full">Continue</Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account? <Link href="/signin" className="text-primary-600">Sign in</Link>
      </p>
    </div>
  );
}
