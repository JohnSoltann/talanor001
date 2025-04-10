'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Purchase {
  id: number;
  userName: string;
  value: string;
  time: string;
  type: 'buy' | 'sell';
}

const CONFIG = {
  MIN_RANDOM_BASE: 15000000, // 15 million Tomans
  MAX_RANDOM_BASE: 25000000, // 25 million Tomans
};

const DailyPurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const periodTotalRef = useRef<number>(0);
  const lastPeriodTimeRef = useRef<number>(0);
  
  useEffect(() => {
    // Generate initial random total and purchases
    generateNewPeriodTotal();
    
    // Check for new period every minute
    const checkInterval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Reset at midnight
      if (hours === 0 && minutes === 0) {
        resetDaily();
      }
      // Generate new total at even hours
      else if (hours % 2 === 0 && minutes === 0) {
        generateNewPeriodTotal();
      }
    }, 60000);
    
    // Add new purchases every 30 seconds
    const purchaseInterval = setInterval(() => {
      addNewRandomPurchase();
    }, 30000);
    
    return () => {
      clearInterval(checkInterval);
      clearInterval(purchaseInterval);
    };
  }, []);
  
  // Helper function to convert numbers to Persian
  const convertToPersianNumber = (num: string | number): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/[0-9]/g, function(w) {
      return persianDigits[+w];
    });
  };
  
  // Reset daily values at midnight
  const resetDaily = () => {
    periodTotalRef.current = 0;
    lastPeriodTimeRef.current = 0;
    setPurchases([]);
    generateNewPeriodTotal();
  };
  
  // Generate new random total for the period
  const generateNewPeriodTotal = () => {
    const randomTotal = Math.floor(Math.random() * (CONFIG.MAX_RANDOM_BASE - CONFIG.MIN_RANDOM_BASE + 1)) + CONFIG.MIN_RANDOM_BASE;
    periodTotalRef.current = randomTotal;
    lastPeriodTimeRef.current = Date.now();
  };
  
  // Add a new random purchase
  const addNewRandomPurchase = () => {
    const firstNames = ['مهدی', 'سعید', 'مینا', 'پریسا', 'شیما', 'علیرضا', 'محسن', 'فرناز', 'آرش', 'نیما', 'حسین', 'مریم', 'فاطمه', 'محمد', 'امیر', 'الهام', 'رضا', 'سارا'];
    const lastNames = ['محمدی', 'کریمی', 'حسینی', 'رضایی', 'نوری', 'طاهری', 'لطفی', 'نجفی', 'تقوی', 'دانشمند', 'سعیدی', 'میرزایی', 'قاسمی', 'عباسی', 'جعفری'];
    
    // Calculate remaining amount for this period
    const now = new Date();
    const currentHour = now.getHours();
    const nextPeriodHour = Math.ceil(currentHour / 2) * 2;
    const minutesLeft = (nextPeriodHour - currentHour) * 60 + (60 - now.getMinutes());
    const averagePerMinute = periodTotalRef.current / 120; // 2 hours = 120 minutes
    const maxValue = Math.min(averagePerMinute * minutesLeft, 5000000);
    
    // Generate random value that won't exceed period total
    const valueInTomans = Math.floor(Math.random() * (maxValue - 1000000)) + 1000000;
    
    // Format value with commas
    const formattedValue = valueInTomans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours < 10 ? '۰' + convertToPersianNumber(hours) : convertToPersianNumber(hours)}:${minutes < 10 ? '۰' + convertToPersianNumber(minutes) : convertToPersianNumber(minutes)}`;
    
    const newPurchase: Purchase = {
      id: Date.now(),
      userName: randomName,
      value: `${convertToPersianNumber(formattedValue)} تومان`,
      time: formattedTime,
      type: Math.random() > 0.3 ? 'buy' : 'sell'
    };
    
    // Update period total
    periodTotalRef.current -= valueInTomans;
    
    setPurchases(prev => [newPurchase, ...prev].slice(0, 9));
  };
  
  return (
    <div className="overflow-hidden rounded-xl shadow-lg border border-gold-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gold-200">
          <thead className="bg-gold-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-gold-800">کاربر</th>
              <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-gold-800">نوع معامله</th>
              <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-gold-800">ارزش معامله</th>
              <th className="px-6 py-4 text-right text-sm md:text-base font-semibold text-gold-800">ساعت ثبت</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gold-100">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gold-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base font-medium">{purchase.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    purchase.type === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {purchase.type === 'buy' ? 'خرید' : 'فروش'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-sm md:text-base text-gold-700">{purchase.value}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{purchase.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gold-50 py-3 text-center text-sm md:text-base text-gold-700 font-medium">
        آخرین معاملات ثبت شده در سامانه (به‌روزرسانی لحظه‌ای)
      </div>
    </div>
  );
};

export default DailyPurchases; 