import GoldPriceWidget from '../components/GoldPriceWidget';
import FAQ from '../components/FAQ';
import DailyPurchases from '../components/DailyPurchases';
import Hero from '../components/Hero';
import Link from 'next/link';
import InvestmentSteps from '../components/InvestmentSteps';
import GoldCalculator from '../components/GoldCalculator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF7]">
      {/* Hero Section */}
      <Hero />

      {/* Gold Price Section */}
      <section className="container mx-auto px-4 py-12">
        <div 
          className="glass-gold p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl md:text-3xl font-bold mb-8 text-center">قیمت لحظه‌ای طلا</h2>
          <GoldPriceWidget />
        </div>
      </section>

      {/* Gold Calculator Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="lg:col-span-1">
            <GoldCalculator />
          </div>
        </div>
      </section>

      {/* Investment Steps Section */}
      <InvestmentSteps />
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-xl md:text-3xl font-bold mb-12 text-center"
          >
            چرا طلانور انتخاب اول شماست؟
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div 
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">قیمت‌های رقابتی</h3>
              <p className="text-gray-600">بدون کارمزد و با کمترین حاشیه سود، بهترین قیمت‌ها را ارائه می‌دهیم.</p>
            </div>
            
            <div 
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">امنیت بی‌نظیر</h3>
              <p className="text-gray-600">با استفاده از پیشرفته‌ترین سیستم‌های امنیتی، سرمایه شما در امن‌ترین شرایط نگهداری می‌شود.</p>
            </div>
            
            <div 
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">تحویل سریع</h3>
              <p className="text-gray-600">امکان تحویل فیزیکی طلا در سریع‌ترین زمان ممکن و با ضمانت اصالت طلا.</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-gold-300 text-white font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span>درباره طلانور بیشتر بدانید</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 15.707a1 1 0 010-1.414L14.586 12H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-[#FFF8E1]">
        <div className="container mx-auto px-4">
          <div 
            className="glass-gold p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl md:text-3xl font-bold mb-8 text-center">سوالات متداول</h2>
            <FAQ />
          </div>
        </div>
      </section>
      
      {/* Recent Transactions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 
            className="text-xl md:text-3xl font-bold mb-8 text-center"
          >
            معاملات امروز طلانور
          </h2>
          
          <div>
            <DailyPurchases />
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gold-400 text-gold-600 font-medium hover:bg-gold-50 transition-all duration-300"
            >
              <span>مشاهده محصولات</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 15.707a1 1 0 010-1.414L14.586 12H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold-500 to-gold-300 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-xl md:text-3xl font-bold mb-6"
          >
            آینده مالی درخشان خود را با طلانور آغاز کنید
          </h2>
          
          <p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto"
          >
            همین امروز با کوچکترین سرمایه عضو خانواده بزرگ طلانور شوید و از مزایای سرمایه‌گذاری در طلا بهره‌مند شوید.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/register"
              className="px-8 py-3 bg-white text-gold-600 rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              ثبت‌نام کنید
            </Link>
            <Link 
              href="/gold-test"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-all duration-300"
            >
              طلای خود را محک بزنید
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 