'use client';

// Wrapper de providers do lado cliente — necessário para o SessionProvider do NextAuth
// no App Router do Next.js (layout.tsx é Server Component e não pode usar hooks)
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = () => sessionStorage.clear();
    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
