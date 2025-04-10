import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = '0bslbsaukfnzp8e8f9u5';
const API_URL = 'https://studio.persianapi.com/index.php/web-service/gold';

export async function GET() {
  try {
    console.log('Fetching gold prices from API...');
    
    const response = await axios.get(API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.data || !response.data.result || !Array.isArray(response.data.result.data)) {
      console.error('Invalid API response format:', response.data);
      return NextResponse.json(getDefaultPrices(), { status: 200 });
    }

    // Convert prices from Rial to Toman
    const prices = response.data.result.data.map((price: any) => ({
      ...price,
      قیمت: (parseInt(price.قیمت) / 10).toString(),
      بیشترین: (parseInt(price.بیشترین) / 10).toString(),
      کمترین: (parseInt(price.کمترین) / 10).toString()
    }));

    return NextResponse.json({ result: { data: prices } }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    return NextResponse.json(getDefaultPrices(), { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

function getDefaultPrices() {
  const now = new Date().toISOString();
  return {
    result: {
      data: [
        {
          key: 1,
          category: "طلا",
          عنوان: "طلای 18 عیار / 750",
          قیمت: "6587000",
          تغییر: 0,
          بیشترین: "6600000",
          کمترین: "6570000",
          "تاریخ بروزرسانی": now
        },
        {
          key: 2,
          category: "طلا",
          عنوان: "طلای ۲۴ عیار",
          قیمت: "8674300",
          تغییر: 0,
          بیشترین: "8700000",
          کمترین: "8650000",
          "تاریخ بروزرسانی": now
        },
        {
          key: 3,
          category: "طلا",
          عنوان: "طلای 18 عیار / 740",
          قیمت: "33000000",
          تغییر: 0,
          بیشترین: "33200000",
          کمترین: "32800000",
          "تاریخ بروزرسانی": now
        },
        {
          key: 4,
          category: "طلا",
          عنوان: "طلای دست دوم",
          قیمت: "235000",
          تغییر: 0,
          بیشترین: "236000",
          کمترین: "234000",
          "تاریخ بروزرسانی": now
        }
      ]
    }
  };
} 