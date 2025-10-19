import { Button, Input } from '@influencerstudio/ui';

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a secure reset link.
        </p>
      </div>
      <form className="space-y-4">
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
    </div>
  );
}
