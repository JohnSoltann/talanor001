'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/persian';

export default function CartPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  
  // Shipping cost (can be calculated based on weight, location, etc.)
  const shippingCost = cart.length > 0 ? 250000 : 0;
  
  // Calculate final price
  const finalPrice = totalPrice + shippingCost - couponDiscount;
  
  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };
  
  // Handle remove item
  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId);
  };
  
  // Handle apply coupon
  const handleApplyCoupon = () => {
    setCouponError(null);
    // Simple validation for demo purposes
    if (couponCode.toLowerCase() === 'talanor10') {
      const discount = Math.round(totalPrice * 0.1); // 10% discount
      setCouponDiscount(discount);
    } else {
      setCouponError('کد تخفیف نامعتبر است');
      setCouponDiscount(0);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gold-800 mb-6">سبد خرید</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-xl p-10 shadow-gold-lg text-center">
          <div className="text-gold-500 text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gold-700 mb-4">سبد خرید شما خالی است</h2>
          <p className="text-gray-600 mb-6">محصولات مورد نظر خود را به سبد خرید اضافه کنید</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg">
              <div className="p-6 border-b border-gold-100">
                <h2 className="text-xl font-semibold text-gold-700">محصولات</h2>
              </div>
              
              <div className="divide-y divide-gold-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="w-full sm:w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center text-3xl mb-4 sm:mb-0 sm:mr-4">
                      💫
                    </div>
                    
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gold-800">{item.name}</h3>
                      <div className="mt-1 text-gold-600 font-bold">
                        {formatPrice(item.price)} <span className="text-xs text-gray-500">تومان</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center border border-gold-200 rounded-md">
                        <button 
                          onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gold-600 hover:bg-gold-50"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-x border-gold-200">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gold-600 hover:bg-gold-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="mr-4 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-gold-lg sticky top-24">
              <div className="p-6 border-b border-gold-100">
                <h2 className="text-xl font-semibold text-gold-700">خلاصه سفارش</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">قیمت محصولات:</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice)} <span className="text-xs text-gray-500">تومان</span>
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">هزینه ارسال:</span>
                  <span className="font-semibold">
                    {formatPrice(shippingCost)} <span className="text-xs text-gray-500">تومان</span>
                  </span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف:</span>
                    <span className="font-semibold">
                      {formatPrice(couponDiscount)} <span className="text-xs">تومان</span>
                    </span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gold-100">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gold-700">مبلغ قابل پرداخت:</span>
                    <span className="font-bold text-gold-700">
                      {formatPrice(finalPrice)} <span className="text-xs text-gray-500">تومان</span>
                    </span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="mb-4">
                    <label htmlFor="coupon" className="block text-gray-700 font-medium mb-2">کد تخفیف</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="کد تخفیف را وارد کنید"
                        className="flex-1 px-4 py-2 border border-gold-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-gold-500 text-white rounded-l-md hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        اعمال
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                  
                  <Link 
                    href="/checkout" 
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                  >
                    ادامه فرآیند خرید
                  </Link>
                  
                  <Link 
                    href="/" 
                    className="w-full flex items-center justify-center px-6 py-3 mt-3 border border-gold-200 rounded-md text-base font-medium text-gold-600 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
                  >
                    بازگشت به صفحه اصلی
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 