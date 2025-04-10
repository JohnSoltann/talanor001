'use client';

import React, { useEffect } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { registerServiceWorker } from './service-worker';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { BlogDataProvider } from '@/contexts/BlogDataContext';
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { AdminProvider } from '@/contexts/AdminContext';

// Dynamic import for DebugPanel to avoid SSR issues
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), {
  ssr: false
});

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Show debug panel only in development
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <SessionProvider>
      <BlogDataProvider>
        <AdminProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AdminProvider>
      </BlogDataProvider>
      <Toaster position="bottom-center" />
      {isDev && <DebugPanel />}
    </SessionProvider>
  );
} 