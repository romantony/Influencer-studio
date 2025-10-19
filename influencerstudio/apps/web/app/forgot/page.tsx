'use client';

import { FormEvent, useState } from 'react';
import { Button, Input } from '@influencerstudio/ui';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/components/toaster';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));

    try {
      setSubmitting(true);
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      toast.push({
        title: 'Reset email sent',
        description: 'Check your inbox for password reset instructions.'
      });
    } catch (error) {
      console.error(error);
      toast.push({
        title: 'Unable to send reset email',
        description: 'Please verify the address and try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your email to receive a secure reset link.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send reset link
        </Button>
      </form>
    </div>
  );
}
