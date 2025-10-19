'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, useMutation } from 'convex/react';
import { convex } from '@/convex/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { Toaster } from '@/components/toaster';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

function AuthSynchronizer() {
  const { user } = useAuth();
  const ensureUser = useMutation<any>('auth:ensureUser');
  const [syncedUid, setSyncedUid] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setSyncedUid(null);
      return;
    }
    if (syncedUid === user.uid) return;
    ensureUser({
      email: user.email,
      name: user.displayName ?? user.email.split('@')[0],
      role: 'creator'
    })
      .then(() => setSyncedUid(user.uid))
      .catch((error) => {
        console.error('Failed to synchronize Firebase user with Convex', error);
      });
  }, [user, ensureUser, syncedUid]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user: firebaseUser, loading }), [firebaseUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      <QueryClientProvider client={client}>
        <ConvexProvider client={convex}>
          <AuthSynchronizer />
          {children}
          <Toaster />
        </ConvexProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
