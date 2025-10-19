'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@influencerstudio/ui';
import {
  BarChart3,
  CalendarDays,
  Camera,
  Library,
  Settings,
  UserCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { useAuth } from '@/components/providers';

const navItems = [
  { href: '/app/avatars', label: 'Avatar Creator', icon: Camera },
  { href: '/app/influencers', label: 'Influencers', icon: UserCircle },
  { href: '/app/posts', label: 'Posts', icon: Sparkles },
  { href: '/app/schedule', label: 'Scheduler', icon: CalendarDays },
  { href: '/app/library', label: 'Library', icon: Library },
  { href: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/app/settings', label: 'Settings', icon: Settings }
];

function NavLink({ href, label, icon: Icon }: (typeof navItems)[number]) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-50',
        active ? 'bg-primary-100 text-primary-700' : 'text-muted-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName ?? user.email ?? 'Creator';

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await firebaseSignOut(getFirebaseAuth());
      router.replace('/signin');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="flex w-64 flex-col border-r border-border bg-background/80 p-6">
        <Link href="/app" className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary-500" />
          InfluencerStudio
        </Link>
        <div className="mt-6 text-xs uppercase tracking-wide text-muted-foreground">{displayName}</div>
        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <Button variant="outline" className="mt-auto" onClick={handleSignOut} disabled={signingOut}>
          {signingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign out
        </Button>
      </aside>
      <main className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
