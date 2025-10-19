'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@influencerstudio/ui';
import { Command, Search, Bell, Sun, Moon } from 'lucide-react';

export function Topbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (typeof window !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'light'
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

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
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

