'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Input, Button } from '@/components/ui';
import { Command, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Topbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => {
    // Ensure default is dark on first mount if system preference is unknown
    if (!theme) setTheme('dark');
    // no-op otherwise; next-themes manages the class
  }, [theme, setTheme]);

  return (
    <div className="sticky top-0 z-10 mb-6 flex items-center gap-3 border-b bg-background/80 px-2 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Command className="h-4 w-4" />
        <span className="hidden sm:inline">Press / to search</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border px-2 py-1 sm:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search…" className="h-7 border-none p-0 focus-visible:ring-0" />
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="#">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme((resolvedTheme === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
