'use client';

import React, { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: 'آیا سرمایه‌گذاری در طلا از طریق طلانور امنیت کافی دارد؟',
    answer: 'بله، سامانه طلانور با پشتوانه مالی قوی و تحت نظارت مراجع قانونی فعالیت می‌کند. تمام طلاهای خریداری شده دارای گواهی اصالت و عیارسنجی معتبر بوده و در خزانه‌های امن نگهداری می‌شوند.'
  },
  {
    question: 'حداقل میزان سرمایه‌گذاری در طلانور چقدر است؟',
    answer: 'برای شروع سرمایه‌گذاری در طلانور، تنها با ۱۰۰,۰۰۰ تومان می‌توانید اقدام کنید. این امکان به شما اجازه می‌دهد در هر سطحی که هستید، بدون نیاز به سرمایه کلان، خرید طلا را شروع کنید.'
  },
  {
    question: 'کارمزد معاملات در سامانه طلانور چگونه محاسبه می‌شود؟',
    answer: 'طلانور با هدف دسترسی آسان همه افراد به بازار طلا، کارمزد بسیار رقابتی ارائه می‌دهد. کارمزد خرید تنها ۰.۳ درصد و کارمزد فروش ۰.۱ درصد است که یکی از پایین‌ترین نرخ‌های کارمزد در بازار سرمایه می‌باشد.'
  },
  {
    question: 'آیا امکان تحویل فیزیکی طلای خریداری شده وجود دارد؟',
    answer: 'بله، شما می‌توانید طلای خریداری شده را در حساب خود نگهداری کنید یا درخواست تحویل فیزیکی دهید. برای این منظور، باید حداقل 10 گرم طلا در حساب خود داشته باشید. هزینه ارسال بر اساس وزن و مسافت محاسبه می‌شود و از طریق شرکت‌های معتبر حمل و با بیمه کامل انجام می‌گیرد.'
  },
  {
    question: 'فرآیند فروش طلا در طلانور چگونه است؟',
    answer: 'برای فروش طلا کافیست در حساب کاربری خود، از بخش کیف پول، درخواست فروش دارایی خود را با مقدار مدنظر ثبت کنید. پس از تایید درخواست، وجه حاصل از فروش در کمتر از یک ساعت به کیف پول شما در طلانور واریز می‌شود و می‌توانید آن را به حساب بانکی خود منتقل کنید.'
  },
  {
    question: 'قیمت‌گذاری طلا در طلانور بر چه اساسی انجام می‌شود؟',
    answer: 'قیمت‌گذاری طلا در طلانور بر اساس قیمت‌های جهانی، نرخ ارز و مکانیزم عرضه و تقاضای بازار داخلی، به صورت لحظه‌ای به‌روزرسانی می‌شود. سیستم هوشمند ما قیمت‌ها را هر ۵ ثانیه یکبار به‌روز می‌کند تا اطمینان حاصل شود شما همیشه با منصفانه‌ترین قیمت‌ها معامله می‌کنید.'
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqData.map((faq, index) => (
        <div key={index} className="glass rounded-xl overflow-hidden">
          <button
            className="w-full px-6 py-4 text-right flex justify-between items-center focus:outline-none"
            onClick={() => toggleFAQ(index)}
          >
            <span className="font-bold text-base md:text-lg">{faq.question}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                activeIndex === index ? 'transform rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`px-6 transition-all duration-300 overflow-hidden ${
              activeIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'
            }`}
          >
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ; 