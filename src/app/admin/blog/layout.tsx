import { Metadata } from 'next';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'پنل مدیریت بلاگ | طلانوز',
  description: 'پنل مدیریت بلاگ طلانوز',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
} 