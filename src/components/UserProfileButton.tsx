'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function UserProfileButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Link
          href="/login"
          className="bg-gold-600 hover:bg-gold-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-center min-w-[80px]"
        >
          ورود
        </Link>
        <Link
          href="/register"
          className="bg-gold-600 hover:bg-gold-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-center min-w-[80px]"
        >
          ثبت نام
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 text-gold-600 hover:text-gold-800"
      >
        <FaUser className="text-xl" />
        <span className="font-medium">{session?.user?.name}</span>
      </button>

      {showMenu && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gold-50"
            onClick={() => setShowMenu(false)}
          >
            پروفایل
          </Link>
          <Link
            href="/profile/wallet"
            className="block px-4 py-2 text-gray-700 hover:bg-gold-50"
            onClick={() => setShowMenu(false)}
          >
            کیف پول
          </Link>
          <button
            onClick={() => {
              router.push('/api/auth/signout');
              setShowMenu(false);
            }}
            className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 flex items-center justify-end"
          >
            <span className="ml-2">خروج</span>
            <FaSignOutAlt />
          </button>
        </div>
      )}
    </div>
  );
} 