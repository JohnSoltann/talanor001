import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg">
          {/* Hero Section */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gold-600 bg-opacity-80 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center">درباره طلانور</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6 text-lg">
                فروشگاه طلانور، مرجع تخصصی خرید و فروش طلا و جواهرات با بیش از یک دهه تجربه در ارائه محصولات با کیفیت و اصیل با کمترین کارمزد در بازار ایران.
              </p>
              
              <h2 className="text-2xl font-bold text-gold-700 mt-8 mb-4">داستان ما</h2>
              <p className="mb-4">
                فروشگاه اینترنتی طلانور با هدف تسهیل خرید و فروش طلا و جواهرات در سال ۱۳۹۲ تاسیس شد. ما با تکیه بر تجربه گرانبهای خود در عرصه طلا و جواهر، تصمیم گرفتیم این تجربه را در قالب یک پلتفرم آنلاین در اختیار مصرف‌کنندگان قرار دهیم.
              </p>
              <p className="mb-4">
                ما در طلانور به دنبال ارائه محصولات اصیل و با کیفیت با قیمتی منصفانه هستیم. هدف ما ایجاد تجربه‌ای لذت‌بخش و اطمینان‌بخش برای مشتریان در خرید آنلاین طلا و جواهرات است.
              </p>
              
              <h2 className="text-2xl font-bold text-gold-700 mt-8 mb-4">چرا طلانور؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
                <div className="glass p-6 rounded-lg">
                  <div className="text-gold-500 text-3xl mb-3">💰</div>
                  <h3 className="text-lg font-semibold text-gold-700 mb-2">کمترین کارمزد</h3>
                  <p>طلانور با ارائه کمترین کارمزد در بازار، امکان خرید و فروش مقرون به صرفه را برای مشتریان فراهم می‌کند.</p>
                </div>
                
                <div className="glass p-6 rounded-lg">
                  <div className="text-gold-500 text-3xl mb-3">✨</div>
                  <h3 className="text-lg font-semibold text-gold-700 mb-2">تضمین اصالت</h3>
                  <p>تمامی محصولات طلانور دارای ضمانت اصالت و کیفیت هستند و با دقت توسط کارشناسان خبره بررسی می‌شوند.</p>
                </div>
                
                <div className="glass p-6 rounded-lg">
                  <div className="text-gold-500 text-3xl mb-3">🔒</div>
                  <h3 className="text-lg font-semibold text-gold-700 mb-2">امنیت در خرید</h3>
                  <p>سیستم پرداخت امن و قابل اعتماد، خرید آنلاین را برای مشتریان ما آسان و بی‌دغدغه کرده است.</p>
                </div>
                
                <div className="glass p-6 rounded-lg">
                  <div className="text-gold-500 text-3xl mb-3">🚚</div>
                  <h3 className="text-lg font-semibold text-gold-700 mb-2">تحویل سریع و امن</h3>
                  <p>تحویل محصولات طلانور در سریع‌ترین زمان ممکن و با رعایت کامل اصول امنیتی انجام می‌شود.</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gold-700 mt-8 mb-4">تیم ما</h2>
              <p className="mb-6">
                تیم طلانور متشکل از افرادی متخصص و مجرب در زمینه طلا و جواهر، فناوری اطلاعات و تجارت الکترونیک است. ما با تکیه بر دانش و تخصص اعضای تیم، به دنبال ارائه بهترین خدمات به مشتریان هستیم.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 mb-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 mx-auto mb-3 flex items-center justify-center text-4xl">👨‍💼</div>
                  <h3 className="font-semibold text-gold-700">محمد امینی</h3>
                  <p className="text-sm text-gray-500">مدیرعامل</p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 mx-auto mb-3 flex items-center justify-center text-4xl">👨‍💻</div>
                  <h3 className="font-semibold text-gold-700">امیر حسینی</h3>
                  <p className="text-sm text-gray-500">مدیر فنی</p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 mx-auto mb-3 flex items-center justify-center text-4xl">👩‍💼</div>
                  <h3 className="font-semibold text-gold-700">مریم صادقی</h3>
                  <p className="text-sm text-gray-500">مدیر بازاریابی</p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-100 mx-auto mb-3 flex items-center justify-center text-4xl">👨‍🏭</div>
                  <h3 className="font-semibold text-gold-700">علی رضایی</h3>
                  <p className="text-sm text-gray-500">کارشناس طلا</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gold-700 mt-8 mb-4">تماس با ما</h2>
              <p className="mb-6">
                ما همیشه آماده پاسخگویی به سوالات و پیشنهادات شما هستیم. از طریق راه‌های ارتباطی زیر می‌توانید با ما در تماس باشید:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gold-700 mb-3">آدرس دفتر مرکزی:</h3>
                  <p className="flex">
                    <svg className="w-5 h-5 text-gold-500 ml-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>تهران، خیابان ولیعصر، مجتمع طلای طلانور، پلاک ۱۲۳</span>
                  </p>
                </div>
                
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gold-700 mb-3">اطلاعات تماس:</h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-gold-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5">📱</span>
                      <span>۰۲۱-۷۷۸۸۹۹۶۶</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5">✉️</span>
                      <span>info@talanor.ir</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 