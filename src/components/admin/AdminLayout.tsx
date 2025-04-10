'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { 
  FaHome, 
  FaShoppingCart, 
  FaUsers, 
  FaComments, 
  FaChartBar, 
  FaCog, 
  FaNewspaper,
  FaHeadset,
  FaSignOutAlt
} from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import AdminAuthGuard from './AdminAuthGuard';
import { signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthTime'); // حذف اعتبار رمز ادمین
    signOut({ callbackUrl: '/' });
  };

  return (
    <AdminAuthGuard>
      <div className={`min-h-screen bg-gray-100 ${inter.className}`} dir="rtl">
        <Toaster position="top-center" />
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-gray-800 text-white md:min-h-screen">
            <div className="p-4 font-bold text-xl border-b border-gray-700">
              <Link href="/admin">پنل مدیریت</Link>
            </div>
            <nav className="p-2">
              <ul>
                <li className="mb-1">
                  <Link href="/admin" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaHome />
                    <span>داشبورد</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/orders" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaShoppingCart />
                    <span>سفارش‌ها</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaUsers />
                    <span>کاربران</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/products" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaShoppingCart />
                    <span>محصولات</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/blog" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaNewspaper />
                    <span>بلاگ</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/support" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaHeadset />
                    <span>پشتیبانی</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/analytics" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaChartBar />
                    <span>آمار و تحلیل</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/admin/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                    <FaCog />
                    <span>تنظیمات</span>
                  </Link>
                </li>
                <li className="mt-6 border-t border-gray-700 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 w-full text-left text-red-400 hover:bg-gray-700 rounded"
                  >
                    <FaSignOutAlt />
                    <span>خروج</span>
                  </button>
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
    </AdminAuthGuard>
  );
} 