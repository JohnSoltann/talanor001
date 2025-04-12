'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminPass, setAdminPass] = useState('');
  const [showPassPrompt, setShowPassPrompt] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // رمز عبور ادمین از متغیر محیطی
  const ADMIN_PASSWORD = typeof window !== 'undefined' ? window.__NEXT_DATA__?.props?.env?.NEXT_PUBLIC_ADMIN_PASSWORD : process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
  useEffect(() => {
    // بررسی وجود متغیر محیطی
    if (!ADMIN_PASSWORD) {
      console.error('متغیر محیطی NEXT_PUBLIC_ADMIN_PASSWORD تنظیم نشده است');
      toast.error('خطا در تنظیمات سیستم');
      return;
    }
    
    // بررسی لاگین بودن کاربر
    if (status === 'unauthenticated') {
      toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
      router.push('/login?callbackUrl=/admin');
      return;
    }
    
    // بررسی نقش ادمین
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        toast.error('شما دسترسی ادمین ندارید');
        router.push('/');
        return;
      }
      
      // چک کردن احراز هویت قبلی در این session
      const adminAuthTime = sessionStorage.getItem('adminAuthTime');
      if (adminAuthTime) {
        const authTime = parseInt(adminAuthTime);
        const currentTime = new Date().getTime();
        
        // اگر کمتر از 6 ساعت از ورود ادمین گذشته باشد، نیازی به رمز مجدد نیست
        if (currentTime - authTime < 6 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
          return;
        }
      }
      
      // نمایش فرم رمز عبور
      setShowPassPrompt(true);
    }
  }, [status, session, router, ADMIN_PASSWORD]);
  
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    // بررسی رمز عبور
    if (adminPass === ADMIN_PASSWORD) {
      // ذخیره زمان احراز هویت
      sessionStorage.setItem('adminAuthTime', new Date().getTime().toString());
      setIsAuthenticated(true);
      setShowPassPrompt(false);
    } else {
      toast.error('رمز عبور اشتباه است');
    }
    
    setIsAuthenticating(false);
  };
  
  // نمایش لودینگ
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // فرم رمز عبور
  if (showPassPrompt && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaLock className="text-blue-500 text-2xl" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-6">ورود به پنل مدیریت</h2>
          
          <form onSubmit={handleAdminAuth}>
            <div className="mb-4">
              <label htmlFor="adminPass" className="block text-gray-700 mb-2">
                رمز عبور مدیریت را وارد کنید
              </label>
              <input
                type="password"
                id="adminPass"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="رمز عبور"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <FaSpinner className="animate-spin inline ml-2" />
                  درحال بررسی...
                </>
              ) : (
                'ورود به پنل'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // نمایش محتوا در صورت احراز هویت
  return isAuthenticated ? <>{children}</> : null;
} 