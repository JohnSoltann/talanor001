'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  wallet: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile`);
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات پروفایل');
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات پروفایل');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gold-800 mb-2">پروفایل کاربری</h1>
              <p className="text-gray-600">اطلاعات و موجودی حساب شما</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* اطلاعات شخصی */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gold-800 mb-4">اطلاعات شخصی</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">نام و نام خانوادگی</label>
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">شماره موبایل</label>
                    <p className="mt-1 text-gray-900">{profile.phone || 'ثبت نشده'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ایمیل</label>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">آدرس</label>
                    <p className="mt-1 text-gray-900">{profile.address || 'ثبت نشده'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">تاریخ عضویت</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* کیف پول */}
              <div className="bg-gold-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gold-800 mb-4">کیف پول</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-600">موجودی تومان</label>
                    <p className="mt-1 text-2xl font-bold text-gold-600">
                      {profile.wallet.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-600">موجودی طلا</label>
                    <p className="mt-1 text-2xl font-bold text-gold-600">
                      {(profile.wallet / 1000000).toFixed(4)} گرم
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/wallet/deposit')}
                      className="w-full bg-gold-500 hover:bg-gold-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      افزایش موجودی
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 py-2 px-6 rounded-lg font-medium transition-colors"
              >
                ویرایش پروفایل
              </button>
              <button
                onClick={() => router.push('/wallet/transactions')}
                className="bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 py-2 px-6 rounded-lg font-medium transition-colors"
              >
                تاریخچه تراکنش‌ها
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 