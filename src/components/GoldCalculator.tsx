'use client';

import { useState, useEffect } from 'react';
import { fetchGoldPrices } from '@/utils/goldPriceApi';
import { formatNumber } from '@/utils/format';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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

const GoldCalculator = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const prices: GoldPrice[] = await fetchGoldPrices();
        const gold18k = prices.find(p => p.عنوان === 'طلای 18 عیار / 750');
        if (gold18k) {
          setCurrentPrice(parseInt(gold18k.قیمت) * 10);
          setPriceChange(gold18k.تغییر);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching gold prices:', err);
        setError('خطا در دریافت قیمت طلا');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    if (value && currentPrice) {
      const calculatedWeight = (parseInt(value) / currentPrice).toFixed(3);
      setWeight(calculatedWeight);
    } else {
      setWeight('');
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setWeight(value);
    if (value && currentPrice) {
      const calculatedAmount = Math.round(parseFloat(value) * currentPrice);
      setAmount(calculatedAmount.toString());
    } else {
      setAmount('');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FFF8C0] p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FFF8C0] p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8C0] p-6">
      {/* Header - Right aligned */}
      <div className="text-right mb-4">
        <h2 className="text-2xl font-bold mb-1">خرید و فروش طلای آب شده</h2>
        <p className="text-sm">با هر سرمایه‌ای، همین حالا خرید کنید!</p>
      </div>

      {/* Current Price - Styled like the screenshot */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full ml-2"></span>
          <span>قیمت لحظه ای طلا:</span>
          <span className="font-bold mr-2 ml-auto">{formatNumber(currentPrice)} تومان</span>
          <span className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange === 0 ? '' : priceChange > 0 ? `▲ ${Math.abs(priceChange).toFixed(2)}٪` : `▼ ${Math.abs(priceChange).toFixed(2)}٪`}
          </span>
        </div>
      </div>

      {/* Tabs - Move to left side */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex">
          <button
            onClick={() => setMode('buy')}
            className={`px-6 py-2 text-center font-bold ${
              mode === 'buy' 
                ? 'border-b-4 border-yellow-400' 
                : 'text-gray-500'
            }`}
          >
            خرید
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`px-6 py-2 text-center font-bold ${
              mode === 'sell' 
                ? 'border-b-4 border-yellow-400' 
                : 'text-gray-500'
            }`}
          >
            فروش
          </button>
        </div>
      </div>

      {/* White container with input fields */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex gap-2 mb-4">
          <div className="w-24 text-center py-2 bg-gray-100 rounded text-sm">تومان</div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="مبلغ مورد نظر را وارد کنید"
            className="flex-1 py-2 px-3 bg-gray-100 rounded focus:outline-none text-right"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-24 text-center py-2 bg-gray-100 rounded text-sm">گرم</div>
          <input
            type="text"
            value={weight}
            onChange={handleWeightChange}
            placeholder="وزن طلا"
            className="flex-1 py-2 px-3 bg-gray-100 rounded focus:outline-none text-right"
          />
        </div>
      </div>

      {/* Golden button exactly like screenshot - update text based on mode */}
      {isLoggedIn ? (
        <button className="w-full bg-[#FFD700] text-gray-900 font-bold py-3 rounded">
          {mode === 'buy' ? 'خرید' : 'فروش'}
        </button>
      ) : (
        <Link href="/register" className="w-full block">
          <button className="w-full bg-[#FFD700] text-gray-900 font-bold py-3 rounded">
            {mode === 'buy' ? 'ثبت‌نام و خرید' : 'ثبت‌نام و فروش'}
          </button>
        </Link>
      )}
    </div>
  );
};

export default GoldCalculator; 