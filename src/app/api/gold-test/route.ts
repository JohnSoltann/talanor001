import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // تنظیمات درخواست به TGJU API
    const apiConfig = {
      headers: {
        'Authorization': 'Bearer 0bslbsaukfnzp8e8f9u5',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    // آرایه‌ای از سمبل‌های مختلف که می‌خواهیم تست کنیم
    const goldSymbols = ['geram18', 'geram24', 'ons', 'emami', 'mesghal'];
    const baseUrl = 'https://api.tgju.org';
    
    // ساختارهای مختلفی از مسیر API را تست می‌کنیم
    const apiPaths = [
      '/v1/data/indicator/summary',
      '/v1/market/indicator/summary/price',
      '/v1/market/indicator/latest',
      '/v1/data/price/latest'
    ];
    
    const results = {
      summaryRequests: [],
      individualRequests: {},
    };
    
    // تست مسیرهای مختلف برای کل داده‌های طلا
    for (const path of apiPaths) {
      try {
        const url = `${baseUrl}${path}`;
        console.log(`Trying path: ${url}`);
        const response = await axios.get(url, apiConfig);
        results.summaryRequests.push({
          path,
          status: response.status,
          success: true,
          data: response.data,
        });
      } catch (error: any) {
        results.summaryRequests.push({
          path,
          status: error.response?.status || 'unknown',
          success: false,
          error: error.message,
        });
      }
    }
    
    // تست دریافت داده‌های هر سمبل به صورت جداگانه
    for (const symbol of goldSymbols) {
      results.individualRequests[symbol] = [];
      
      for (const path of apiPaths) {
        try {
          const url = `${baseUrl}${path}/${symbol}`;
          console.log(`Trying path for ${symbol}: ${url}`);
          const response = await axios.get(url, apiConfig);
          results.individualRequests[symbol].push({
            path: `${path}/${symbol}`,
            status: response.status,
            success: true,
            data: response.data,
          });
        } catch (error: any) {
          results.individualRequests[symbol].push({
            path: `${path}/${symbol}`,
            status: error.response?.status || 'unknown',
            success: false,
            error: error.message,
          });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error testing gold API:', error);
    return NextResponse.json(
      { error: 'Failed to test API', message: error.message },
      { status: 500 }
    );
  }
} 