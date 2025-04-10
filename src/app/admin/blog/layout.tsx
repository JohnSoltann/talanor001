import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FaNewspaper, FaFolderOpen, FaComments, FaChartBar, FaCog } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'پنل مدیریت بلاگ | طلانوز',
  description: 'پنل مدیریت بلاگ طلانوز',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-100 ${inter.className}`} dir="rtl">
      <Toaster position="top-center" />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-800 text-white md:min-h-screen">
          <div className="p-4 font-bold text-xl border-b border-gray-700">
            <Link href="/admin/blog">پنل مدیریت بلاگ</Link>
          </div>
          <nav className="p-2">
            <ul>
              <li className="mb-1">
                <Link href="/admin/blog" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaNewspaper />
                  <span>همه پست‌ها</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/admin/blog/new" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaNewspaper />
                  <span>پست جدید</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/admin/blog/categories" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaFolderOpen />
                  <span>دسته‌بندی‌ها</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/admin/blog/comments" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaComments />
                  <span>نظرات</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/admin/blog/analytics" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaChartBar />
                  <span>آمار و تحلیل</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/admin/blog/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                  <FaCog />
                  <span>تنظیمات</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 