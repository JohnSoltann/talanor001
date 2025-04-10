'use client';

import { useState } from 'react';
import GoldCalculator from '@/components/GoldCalculator';

export default function GoldCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">محاسبه‌گر قیمت طلا</h1>
        
        <div className="mb-8">
          <div className="bg-gold-50 border-l-4 border-gold-500 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-gold-800 mb-2">راهنمای محاسبه قیمت طلا</h2>
            <ul className="list-disc list-inside space-y-2 text-gold-700">
              <li>قیمت‌ها به صورت لحظه‌ای از بازار دریافت می‌شوند</li>
              <li>امکان محاسبه قیمت خرید و فروش طلای ۱۸ عیار</li>
              <li>محاسبه دقیق وزن طلا بر اساس مبلغ و بالعکس</li>
              <li>نمایش حداقل و حداکثر قیمت روزانه</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GoldCalculator />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">نکات مهم</h3>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">🔍 اطلاعات به روز</h4>
                  <p>قیمت‌ها هر دقیقه به روز می‌شوند تا دقیق‌ترین اطلاعات را در اختیار شما قرار دهیم.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">💰 محاسبه دقیق</h4>
                  <p>محاسبات بر اساس قیمت لحظه‌ای طلای ۱۸ عیار انجام می‌شود.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">⚖️ خرید و فروش</h4>
                  <p>امکان محاسبه قیمت برای هر دو حالت خرید و فروش طلا.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 