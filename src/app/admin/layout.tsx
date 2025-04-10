import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'پنل مدیریت | تالا جولری',
  description: 'پنل مدیریت طلا و جواهرات تالا',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 