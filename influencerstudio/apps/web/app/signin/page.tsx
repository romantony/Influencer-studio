'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@influencerstudio/ui';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/components/toaster';
import { useAuth } from '@/components/providers';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [federatedLoading, setFederatedLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/app');
    }
  }, [loading, user, router]);

  const handleCredentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    try {
      setSubmitting(true);
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      toast.push({ title: 'Signed in', description: 'Welcome back to InfluencerStudio.' });
      router.replace('/app');
    } catch (error) {
      console.error(error);
      toast.push({
        title: 'Unable to sign in',
        description: 'Check your credentials or reset your password.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setFederatedLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, provider);
      toast.push({ title: 'Signed in with Google' });
      router.replace('/app');
    } catch (error) {
      console.error(error);
      toast.push({
        title: 'Google sign-in failed',
        description: 'Please try again or use email and password.',
        variant: 'destructive'
      });
    } finally {
      setFederatedLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Sign in to InfluencerStudio</h1>
        <p className="text-sm text-muted-foreground">Welcome back to StudioSuite.</p>
      </div>
      <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
        <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        <Input
          name="password"
          type="password"
          placeholder="••••••"
          required
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" disabled={submitting || loading}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>
      </form>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={federatedLoading || loading}>
        {federatedLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continue with Google
      </Button>
      <div className="text-center text-xs text-muted-foreground">
        <Link href="/forgot" className="text-primary-600">
          Forgot your password?
        </Link>
        <div className="mt-2">
          Need an account?{' '}
          <Link href="/signup" className="text-primary-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
