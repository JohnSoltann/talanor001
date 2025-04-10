import React from 'react';
import Link from 'next/link';

// Helper function to convert numbers to Persian
const convertToPersianNumber = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/[0-9]/g, function(w) {
    return persianDigits[+w];
  });
};

// Format price with commas and convert to Persian
const formatPrice = (price: number): string => {
  return convertToPersianNumber(price.toLocaleString('fa-IR'));
};

// Mock transaction data
const transactions = [
  { id: 1, type: 'deposit', amount: 35000000, date: '۱۴۰۴/۰۱/۰۵', status: 'completed', description: 'شارژ کیف پول' },
  { id: 2, type: 'withdraw', amount: 15000000, date: '۱۴۰۴/۰۱/۰۳', status: 'completed', description: 'برداشت از کیف پول' },
  { id: 3, type: 'purchase', amount: 12500000, date: '۱۴۰۳/۱۲/۲۵', status: 'completed', description: 'خرید محصول - دستبند طلا کد #۳۴۵۶' },
  { id: 4, type: 'sell', amount: 28000000, date: '۱۴۰۳/۱۲/۱۰', status: 'completed', description: 'فروش طلا - ۵.۵ گرم طلای ۱۸ عیار' },
  { id: 5, type: 'deposit', amount: 50000000, date: '۱۴۰۳/۱۱/۲۸', status: 'completed', description: 'شارژ کیف پول' },
];

export default function WalletPage() {
  // Mock wallet balance
  const walletBalance = 85500000;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-800">کیف پول من</h1>
        <p className="text-gray-600">مدیریت اعتبار و تراکنش‌های کیف پول</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="lg:col-span-1">
          <div className="glass-gold rounded-xl p-6 shadow-gold-lg">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gold-700 mb-2">موجودی کیف پول</h2>
              <div className="text-3xl font-bold text-gold-600">
                {formatPrice(walletBalance)} <span className="text-sm text-gold-500">تومان</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link 
                href="/profile/wallet/deposit" 
                className="bg-gold-500 hover:bg-gold-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 text-center"
              >
                افزایش موجودی
              </Link>
              <Link 
                href="/profile/wallet/withdraw" 
                className="bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 text-center"
              >
                برداشت وجه
              </Link>
            </div>
            
            <div className="bg-gold-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gold-700 mb-2">کارت‌های بانکی</h3>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gold-100 flex items-center justify-between">
                  <div>
                    <div className="font-medium">بانک ملت</div>
                    <div className="text-gray-500 text-sm mt-1" dir="ltr">•••• •••• •••• ۵۶۷۸</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    کارت اصلی
                  </span>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gold-100 flex items-center justify-between">
                  <div>
                    <div className="font-medium">بانک صادرات</div>
                    <div className="text-gray-500 text-sm mt-1" dir="ltr">•••• •••• •••• ۹۸۴۵</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  href="/profile/wallet/cards"
                  className="text-sm text-gold-600 hover:text-gold-800 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  افزودن کارت جدید
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-gold-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gold-700">تاریخچه تراکنش‌ها</h2>
              
              <div className="flex space-x-2 space-x-reverse">
                <select className="bg-white border border-gold-200 text-gold-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2">
                  <option value="all">همه تراکنش‌ها</option>
                  <option value="deposit">واریز</option>
                  <option value="withdraw">برداشت</option>
                  <option value="purchase">خرید</option>
                  <option value="sell">فروش</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gold-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شرح</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ (تومان)</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gold-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gold-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'sell' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'sell' ? '+' : '-'} {formatPrice(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {transaction.status === 'completed' ? 'موفق' : 'ناموفق'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2 space-x-reverse">
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-gold-500 text-white font-medium">۱</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-500">۲</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-500">۳</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gold-200 text-gold-600 hover:bg-gold-50 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 