'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }
    
    try {
      setLoading(true);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: phone, // استفاده از شماره تلفن در فیلد email
        password,
      });
      
      if (result?.error) {
        toast.error('شماره موبایل یا رمز عبور اشتباه است');
        return;
      }
      
      toast.success('با موفقیت وارد شدید');
      router.push(callbackUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Decorative Side */}
            <div className="hidden md:flex bg-gradient-to-br from-gold-400 to-gold-600 p-8 items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">طلانور</div>
                <div className="text-xl text-white mb-6">خرید و فروش طلا با کمترین کارمزد</div>
                <div className="glass-gold bg-white bg-opacity-20 p-6 rounded-lg text-white text-right">
                  <p className="mb-4">با عضویت در طلانور از مزایای زیر بهره‌مند شوید:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      خرید و فروش آسان و سریع
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      کیف پول اختصاصی
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      قیمت‌های رقابتی
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 ml-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      پشتیبانی ۲۴ ساعته
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Login Form */}
            <div className="p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gold-800 mb-2">ورود به حساب کاربری</h1>
                <p className="text-gray-600">برای دسترسی به حساب خود وارد شوید</p>
              </div>
              
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">شماره موبایل</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    dir="ltr"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">رمز عبور</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    dir="ltr"
                    required
                  />
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="h-4 w-4 text-gold-500 focus:ring-gold-400"
                    />
                    <label htmlFor="remember" className="mr-2 text-sm text-gray-700">مرا به خاطر بسپار</label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-gold-600 hover:text-gold-800">
                    فراموشی رمز عبور
                  </Link>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:opacity-70"
                >
                  {loading ? 'در حال پردازش...' : 'ورود به حساب'}
                </button>
              </form>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">یا</span>
                </div>
              </div>
              
              <div className="mb-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-center bg-white border border-gold-200 text-gold-700 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  ورود با رمز یکبار مصرف
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">
                  حساب کاربری ندارید؟{' '}
                  <Link href="/register" className="text-gold-600 hover:text-gold-800 font-medium">
                    ثبت نام
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 