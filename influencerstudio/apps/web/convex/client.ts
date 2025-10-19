'use client';

import { ConvexReactClient } from 'convex/react';
import { getFirebaseAuth } from '@/lib/firebase-client';

const address = process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://127.0.0.1:8187';

export const convex = new ConvexReactClient(address);

if (typeof window !== 'undefined') {
  convex.setAuth(async ({ forceRefreshToken }) => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    return user.getIdToken(forceRefreshToken);
  });
}
