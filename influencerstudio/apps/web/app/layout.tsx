import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfluencerStudio | StudioSuite',
  description:
    'AI-first Instagram influencer and avatar studio built for the StudioSuite platform.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <script
          // Ensure dark theme applies before hydration and ignores any old 'theme' key
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='studio-theme';var t=localStorage.getItem(k)||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}"
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
