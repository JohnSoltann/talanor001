import React from 'react';
import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">محتوای مورد نظر یافت نشد</h1>
      <p className="text-lg text-gray-600 mb-8">
        متأسفانه صفحه یا مقاله‌ای که به دنبال آن هستید در سایت ما موجود نیست.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-colors"
      >
        بازگشت به بلاگ
      </Link>
    </div>
  );
} 