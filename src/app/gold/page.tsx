'use client';

import { useState, useEffect } from 'react';
import { formatNumber, formatPersianDateTime } from '@/utils/format';

interface GoldPrice {
  key: number;
  category: string;
  عنوان: string;
  قیمت: string;
  تغییر: number;
  بیشترین: string;
  کمترین: string;
  'تاریخ بروزرسانی': string;
}

// تابع کمکی برای تبدیل عنوان‌ها به فرمت نمایشی سایت
function getDisplayTitle(title: string): string {
  const titleMap: { [key: string]: string } = {
    'طلای 18 عیار / 750': 'طلای ۱۸ عیار (هر گرم)',
    'طلای ۲۴ عیار': 'طلای ۲۴ عیار (هر گرم)',
    'طلای 18 عیار / 740': 'سکه امامی (تمام بهار)',
    'طلای دست دوم': 'اونس جهانی طلا'
  };
  return titleMap[title] || title;
}

export default function GoldPage() {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gold');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (data && data.result && Array.isArray(data.result.data)) {
          setGoldPrices(data.result.data);
          setError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err: any) {
        console.error('Error fetching gold prices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrices();
    // Refresh data every minute
    const interval = setInterval(fetchGoldPrices, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ترتیب نمایش قیمت‌ها
  const displayOrder = [
    'طلای 18 عیار / 750',
    'طلای ۲۴ عیار',
    'طلای 18 عیار / 740',
    'طلای دست دوم'
  ];

  // مرتب‌سازی آیتم‌ها براساس ترتیب مورد نظر
  const sortedPrices = [...goldPrices].sort((a, b) => {
    return displayOrder.indexOf(a.عنوان) - displayOrder.indexOf(b.عنوان);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">قیمت لحظه‌ای طلا</h1>
      
      {loading && (
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">در حال دریافت قیمت‌ها...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-4 rounded-lg mb-6 text-center">
          <p>توجه: در حال نمایش داده‌های نمونه. اتصال به API در حال بررسی است.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedPrices.map((item) => (
          <div 
            key={item.key} 
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-800">{getDisplayTitle(item.عنوان)}</h3>
                <div className={`px-2 py-1 rounded-lg text-sm ${
                  item.تغییر >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {item.تغییر === 0 ? '٪۰' : `${item.تغییر > 0 ? '▲' : '▼'} ${Math.abs(item.تغییر)}٪`}
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">تومان</span>
                  <span className="text-2xl font-bold text-gray-900" style={{ direction: 'ltr' }}>
                    {formatNumber(parseInt(item.قیمت))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-8 flex items-center justify-center gap-2">
        <span>آخرین به‌روزرسانی قیمت:</span>
        {goldPrices[0] && (
          <span style={{ direction: 'ltr' }}>{formatPersianDateTime(goldPrices[0]['تاریخ بروزرسانی'])}</span>
        )}
        <span>| منبع: مثقال (TGJU.org)</span>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify({ goldPrices, error, loading }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 