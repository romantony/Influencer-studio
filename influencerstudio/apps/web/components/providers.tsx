'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider } from 'convex/react';
import { convex } from '@/convex/client';
import { Toaster } from '@/components/toaster';

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <ConvexProvider client={convex}>
        {children}
        <Toaster />
      </ConvexProvider>
    </QueryClientProvider>
  );
}
