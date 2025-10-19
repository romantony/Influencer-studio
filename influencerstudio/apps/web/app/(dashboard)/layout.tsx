'use client'
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@influencerstudio/ui';
import { BarChart3, CalendarDays, Camera, Library, Settings, UserCircle, Sparkles } from 'lucide-react';

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
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="flex w-64 flex-col border-r border-border bg-background/80 p-6">
        <Link href="/app" className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary-500" />
          InfluencerStudio
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <Button variant="outline" className="mt-auto" asChild>
          <Link href="/api/auth/signout">Sign out</Link>
        </Button>
      </aside>
      <main className="flex-1 p-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
