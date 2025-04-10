'use client';

import { useState, useEffect } from 'react';

export default function GoldApiTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gold-test');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Test results:', data);
        setTestResults(data.results);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching test results:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تست API قیمت طلا</h1>
      
      {loading && (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p>در حال بررسی مسیرهای API...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg mb-2">خطا در تست API</h2>
          <p>{error}</p>
        </div>
      )}
      
      {testResults && (
        <div>
          <h2 className="text-xl font-bold mb-4">نتایج تست API</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">درخواست‌های کلی</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b">مسیر</th>
                    <th className="py-2 px-4 border-b">وضعیت</th>
                    <th className="py-2 px-4 border-b">نتیجه</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.summaryRequests.map((result: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-4 border-b">{result.path}</td>
                      <td className="py-2 px-4 border-b">{result.status}</td>
                      <td className="py-2 px-4 border-b">
                        {result.success ? (
                          <span className="text-green-600">موفق</span>
                        ) : (
                          <span className="text-red-600">ناموفق: {result.error}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-3">درخواست‌های فردی</h3>
          {Object.keys(testResults.individualRequests).map((symbol) => (
            <div key={symbol} className="mb-6">
              <h4 className="font-medium mb-2">سمبل: {symbol}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b">مسیر</th>
                      <th className="py-2 px-4 border-b">وضعیت</th>
                      <th className="py-2 px-4 border-b">نتیجه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.individualRequests[symbol].map((result: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 border-b">{result.path}</td>
                        <td className="py-2 px-4 border-b">{result.status}</td>
                        <td className="py-2 px-4 border-b">
                          {result.success ? (
                            <span className="text-green-600">موفق</span>
                          ) : (
                            <span className="text-red-600">ناموفق: {result.error}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {testResults.individualRequests[symbol].some((r: any) => r.success) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">نمونه داده دریافتی:</h5>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(
                      testResults.individualRequests[symbol].find((r: any) => r.success)?.data,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 