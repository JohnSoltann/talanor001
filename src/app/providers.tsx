'use client';

import React, { useEffect } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { registerServiceWorker } from './service-worker';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { BlogDataProvider } from '@/contexts/BlogDataContext';
import { SessionProvider } from 'next-auth/react';
import { AdminProvider } from '@/contexts/AdminContext';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  
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
    </SessionProvider>
  );
} 