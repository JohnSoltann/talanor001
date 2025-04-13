'use client';

import { useEffect, useState } from 'react';
import { fetchGoldPrices } from '@/utils/goldPriceApi';
import { formatNumber } from '@/utils/numberUtils';
import { formatPersianTime } from '@/utils/dateUtils';

// تعریف نوع برای داده‌های قیمت طلا
interface GoldPriceData {
  key?: number | string;
  عنوان: string;
  قیمت: string;
  تغییر: number;
  بیشترین: string;
  کمترین: string;
  'تاریخ بروزرسانی'?: string;
}

const GoldPriceWidget = () => {
  const [prices, setPrices] = useState<GoldPriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadPrices = async () => {
    try {
      setIsLoading(true);
      const data = await fetchGoldPrices();
      
      if (data && data.length > 0) {
        setPrices(data);
        
        // Set last updated time
        if (data[0]['تاریخ بروزرسانی']) {
          setLastUpdated(data[0]['تاریخ بروزرسانی']);
        } else {
          setLastUpdated(new Date().toISOString());
        }
        
        setError(null);
      } else {
        setError('داده‌های قیمت طلا در دسترس نیست');
      }
    } catch (err) {
      console.error('Error loading gold prices:', err);
      setError('خطا در بارگذاری قیمت‌های طلا');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
    
    // Refresh prices every 5 minutes
    const interval = setInterval(loadPrices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-amber-50 p-6">
        <div className="flex justify-center items-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-amber-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={loadPrices}
            className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-2 px-4 rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // Original return block for when data is available
  return (
    <div className="w-full bg-gradient-to-b from-gold-200/80 to-gold-100/60 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600 bg-white/50 inline-block px-4 py-1 rounded-full shadow-sm">
          آخرین بروزرسانی: {formatPersianTime(lastUpdated)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((price) => (
          <div 
            key={price.key || price.عنوان} 
            className="bg-gradient-to-br from-white to-gold-50 rounded-xl border border-gold-200/50 p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{price.عنوان}</h3>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                price.تغییر >= 0 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
              }`}>
                {price.تغییر > 0 ? '▲' : price.تغییر < 0 ? '▼' : '■'} {Math.abs(price.تغییر)}%
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-4 bg-white/70 p-3 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
              {formatNumber(parseInt(price.قیمت))} تومان
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 bg-gold-50/50 p-3 rounded-lg">
              <span>بیشترین: {formatNumber(parseInt(price.بیشترین))}</span>
              <span>کمترین: {formatNumber(parseInt(price.کمترین))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldPriceWidget; 