'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import PasswordStrengthBar from 'react-password-strength-bar';

// Schema for form validation
const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' }),
  lastName: z.string().min(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد' }),
  phone: z.string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد' }),
  email: z.string().email({ message: 'ایمیل نامعتبر است' }).optional().or(z.literal('')),
  password: z.string()
    .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
    .regex(/[A-Z]/, { message: 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد' })
    .regex(/[a-z]/, { message: 'رمز عبور باید حداقل یک حرف کوچک داشته باشد' })
    .regex(/[0-9]/, { message: 'رمز عبور باید حداقل یک عدد داشته باشد' }),
  confirmPassword: z.string(),
  referralCode: z.string().optional().or(z.literal('')),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'پذیرش قوانین و مقررات الزامی است' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمز عبور و تکرار آن باید یکسان باشند',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Custom Password Strength Component to use when PasswordStrengthBar has issues
function CustomPasswordStrength({ password }: { password: string }) {
  // Simple password strength calculation
  const calculateStrength = (pass: string): number => {
    if (!pass) return 0;
    
    let score = 0;
    // Length check
    if (pass.length >= 8) score += 1;
    // Contains lowercase
    if (/[a-z]/.test(pass)) score += 1;
    // Contains uppercase
    if (/[A-Z]/.test(pass)) score += 1;
    // Contains number
    if (/[0-9]/.test(pass)) score += 1;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    return score;
  };

  const strength = calculateStrength(password);
  
  const getColor = () => {
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };
  
  const getLabel = () => {
    switch (strength) {
      case 0: return 'خیلی ضعیف';
      case 1: return 'ضعیف';
      case 2: return 'متوسط';
      case 3: return 'قوی';
      case 4: return 'قوی';
      case 5: return 'خیلی قوی';
      default: return '';
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`${getColor()} h-full`} style={{ width: `${(strength/5) * 100}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-gray-600">{password && getLabel()}</p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
      terms: false,
    },
  });

  const password = watch('password');

  const handleVerificationSubmit = async () => {
    if (verificationCode.length !== 6) {
      toast.error('کد تایید باید ۶ رقم باشد');
      return;
    }

    setLoading(true);
    try {
      // در دنیای واقعی، اینجا باید یک درخواست API برای تایید کد ارسال شود
      // برای نمایش، ما کد را با آنچه در localStorage ذخیره کرده‌ایم مقایسه می‌کنیم
      const savedCode = localStorage.getItem('verificationCode');
      
      if (verificationCode !== savedCode) {
        toast.error('کد تایید اشتباه است');
        return;
      }
      
      // پاکسازی کد تایید از حافظه محلی
      localStorage.removeItem('verificationCode');
      
      toast.success('ثبت نام با موفقیت انجام شد');
      router.push('/login');
    } catch (error) {
      toast.error('خطا در تایید کد. لطفا دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // ارسال اطلاعات به API ثبت نام
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'خطا در ثبت نام');
      }
      
      // ذخیره کد تایید برای مقایسه
      // در دنیای واقعی این کد باید به تلفن کاربر ارسال شود و نباید در سمت کلاینت ذخیره شود
      localStorage.setItem('verificationCode', result.verificationCode);
      
      setPhoneToVerify(data.phone);
      setVerificationStep(true);
      toast.success(`کد تایید به شماره ${data.phone} ارسال شد`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    toast.loading('در حال ارسال مجدد کد تایید...');
    // شبیه‌سازی ارسال مجدد کد
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.dismiss();
    toast.success(`کد تایید جدید به شماره ${phoneToVerify} ارسال شد`);
  };

  if (verificationStep) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gold-800 mb-2">تایید شماره موبایل</h1>
              <p className="text-gray-600">کد ۶ رقمی ارسال شده به شماره {phoneToVerify} را وارد کنید</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-2">کد تایید</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="کد ۶ رقمی"
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-center tracking-widest"
                dir="ltr"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={handleVerificationSubmit}
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:opacity-70 mb-4"
            >
              {loading ? 'در حال بررسی...' : 'تایید و تکمیل ثبت نام'}
            </button>
            
            <div className="text-center">
              <button 
                onClick={resendVerificationCode} 
                className="text-gold-600 hover:text-gold-800"
                disabled={loading}
              >
                ارسال مجدد کد
              </button>
              <span className="mx-2 text-gray-400">|</span>
              <button 
                onClick={() => setVerificationStep(false)} 
                className="text-gold-600 hover:text-gold-800"
                disabled={loading}
              >
                اصلاح شماره موبایل
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Decorative Side */}
            <div className="hidden md:flex bg-gradient-to-br from-gold-400 to-gold-600 p-8 items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-4">طلانور</div>
                <div className="text-xl text-white mb-6">سرمایه‌گذاری امن در طلا</div>
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
            
            {/* Register Form */}
            <div className="p-8">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gold-800 mb-2">ثبت نام در طلانور</h1>
                <p className="text-gray-600">حساب کاربری جدید ایجاد کنید</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">نام</label>
                    <input
                      type="text"
                      id="firstName"
                      {...register('firstName')}
                      placeholder="نام خود را وارد کنید"
                      className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">نام خانوادگی</label>
                    <input
                      type="text"
                      id="lastName"
                      {...register('lastName')}
                      placeholder="نام خانوادگی خود را وارد کنید"
                      className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">شماره موبایل</label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    dir="ltr"
                  />
                  {errors.phone ? (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">از این شماره برای تایید و ورود به حساب کاربری استفاده خواهد شد</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">ایمیل (اختیاری)</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="example@mail.com"
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">رمز عبور</label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    placeholder="حداقل ۸ کاراکتر"
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    dir="ltr"
                  />
                  {password && <CustomPasswordStrength password={password} />}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">تکرار رمز عبور</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    placeholder="تکرار رمز عبور"
                    className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gold-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500`}
                    dir="ltr"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="referralCode" className="block text-gray-700 font-medium mb-2">کد معرف (اختیاری)</label>
                  <input
                    type="text"
                    id="referralCode"
                    {...register('referralCode')}
                    placeholder="کد معرف را وارد کنید"
                    className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    dir="ltr"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register('terms')}
                      className={`h-4 w-4 text-gold-500 focus:ring-gold-400 ${errors.terms ? 'border-red-500' : ''}`}
                    />
                    <label htmlFor="terms" className={`mr-2 text-sm ${errors.terms ? 'text-red-500' : 'text-gray-700'}`}>
                      <span>من </span>
                      <Link href="/terms" className="text-gold-600 hover:text-gold-800">
                        قوانین و مقررات
                      </Link>
                      <span> را خوانده و می‌پذیرم</span>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isSubmitting || loading ? 'در حال پردازش...' : 'ثبت نام'}
                </button>
              </form>
              
              <div className="text-center">
                <p className="text-gray-600">
                  قبلاً ثبت نام کرده‌اید؟{' '}
                  <Link href="/login" className="text-gold-600 hover:text-gold-800 font-medium">
                    ورود به حساب
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