'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@influencerstudio/ui';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { useToast } from '@/components/toaster';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name'));
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    try {
      setCreating(true);
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      toast.push({ title: 'Account created', description: 'You can now personalize your studio.' });
      router.replace('/app');
    } catch (error) {
      console.error(error);
      toast.push({
        title: 'Unable to create account',
        description: 'Please try again or contact support if the issue persists.',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Create your StudioSuite account</h1>
        <p className="text-sm text-muted-foreground">Unlock AI avatars, post generation, and analytics.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="name" placeholder="Name" required autoComplete="name" />
        <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        <Input
          name="password"
          type="password"
          placeholder="••••••"
          required
          autoComplete="new-password"
          minLength={6}
        />
        <Button type="submit" className="w-full" disabled={creating}>
          {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/signin" className="text-primary-600">
          Sign in
        </Link>
      </p>
    </div>
  );
}
