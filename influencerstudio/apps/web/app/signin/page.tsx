import { signIn } from '@/lib/auth';
import { Button, Input } from '@influencerstudio/ui';

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Sign in to InfluencerStudio</h1>
        <p className="text-sm text-muted-foreground">Welcome back to StudioSuite.</p>
      </div>
      <form className="space-y-4" action={async (formData) => {
        'use server';
        await signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirectTo: '/app'
        });
      }}>
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Input name="password" type="password" placeholder="••••••" required />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <Button variant="outline" className="w-full" asChild>
        <form action={async () => {
          'use server';
          await signIn('google');
        }}>
          <button type="submit" className="w-full">Continue with Google</button>
        </form>
      </Button>
    </div>
  );
}
