import React from 'react';

export const metadata = {
  title: 'بلاگ طلا | اخبار و مقالات طلا',
  description: 'آخرین اخبار و مقالات در مورد بازار طلا، سرمایه‌گذاری و تحلیل قیمت طلا',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
} 