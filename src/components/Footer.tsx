import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-auto">
      <div className="gold-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">طلانور</h3>
              <p className="mb-4">معتبرترین سامانه سرمایه‌گذاری طلا در ایران</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform">
                  <span className="sr-only">Instagram</span>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">
                  <span className="sr-only">Twitter</span>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform">
                  <span className="sr-only">Telegram</span>
                  <i className="fab fa-telegram"></i>
                </a>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">خدمات سرمایه‌گذاری</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/buy-gold" className="hover:underline">
                    سرمایه‌گذاری در طلا
                  </Link>
                </li>
                <li>
                  <Link href="/wallet" className="hover:underline">
                    کیف پول هوشمند طلا
                  </Link>
                </li>
                <li>
                  <Link href="/price" className="hover:underline">
                    نمودار قیمت‌های جهانی
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:underline">
                    آکادمی سرمایه‌گذاری طلانور
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">راهنمای کاربران</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:underline">
                    درباره طلانور
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    پشتیبانی ۲۴ ساعته
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    پرسش‌های متداول
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    قوانین و مقررات
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">ارتباط با ما</h3>
              <p className="mb-2">تهران، خیابان شریعتی، بالاتر از میرداماد، برج نگین، طبقه ۷</p>
              <p className="mb-2">تلفن پشتیبانی: ۰۲۱-۷۷۸۸۹۹۶۶</p>
              <p className="mb-2">ایمیل: info@talanor.ir</p>
              <div className="mt-4">
                <Link href="/app" className="glass-gold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-block">
                  دانلود اپلیکیشن رسمی طلانور
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-4 border-t border-gold-200 bg-gold-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            تمامی حقوق این وب‌سایت برای شرکت طلانور (سهامی خاص) محفوظ است. &copy; {year}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 