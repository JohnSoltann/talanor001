import axios from 'axios';

// Configuration for our local API
const API_CONFIG = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Create an axios instance with the config
const apiClient = axios.create(API_CONFIG);

// Types for the API response
export interface GoldPriceData {
  key: number;
  category: string;
  عنوان: string;
  قیمت: string;
  تغییر: number;
  بیشترین: string;
  کمترین: string;
  'تاریخ بروزرسانی': string;
}

// Gold symbols mapping
export const GOLD_SYMBOLS = {
  GOLD_18: 'طلای 18 عیار / 750',
  GOLD_24: 'طلای ۲۴ عیار',
  COIN_EMAMI: 'طلای 18 عیار / 740',
  GOLD_OUNCE: 'طلای دست دوم'
};

/**
 * Fetches the current gold prices from our local API
 * @returns Promise with gold price data
 */
export const fetchGoldPrices = async (): Promise<GoldPriceData[]> => {
  try {
    console.log('Fetching gold prices...');
    const response = await apiClient.get('/gold');
    
    if (response.data && response.data.result && Array.isArray(response.data.result.data)) {
      return response.data.result.data;
    }
    
    console.log('Invalid response format, using defaults');
    return Object.values(getDefaultGoldPrices());
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    return Object.values(getDefaultGoldPrices());
  }
};

/**
 * دریافت مستقیم داده‌های قیمت طلا بدون استفاده از API (مقادیر پیش‌فرض)
 */
export const getDefaultGoldPrices = (): { [key: string]: GoldPriceData } => {
  const now = new Date().toISOString();
  return {
    [GOLD_SYMBOLS.GOLD_18]: {
      key: 1,
      category: "طلا",
      عنوان: GOLD_SYMBOLS.GOLD_18,
      قیمت: "65870000",
      تغییر: 0,
      بیشترین: "66000000",
      کمترین: "65700000",
      "تاریخ بروزرسانی": now
    },
    [GOLD_SYMBOLS.GOLD_24]: {
      key: 2,
      category: "طلا",
      عنوان: GOLD_SYMBOLS.GOLD_24,
      قیمت: "86743000",
      تغییر: 0,
      بیشترین: "87000000",
      کمترین: "86500000",
      "تاریخ بروزرسانی": now
    },
    [GOLD_SYMBOLS.COIN_EMAMI]: {
      key: 3,
      category: "طلا",
      عنوان: GOLD_SYMBOLS.COIN_EMAMI,
      قیمت: "330000000",
      تغییر: 0,
      بیشترین: "332000000",
      کمترین: "328000000",
      "تاریخ بروزرسانی": now
    },
    [GOLD_SYMBOLS.GOLD_OUNCE]: {
      key: 4,
      category: "طلا",
      عنوان: GOLD_SYMBOLS.GOLD_OUNCE,
      قیمت: "2350000",
      تغییر: 0,
      بیشترین: "2360000",
      کمترین: "2340000",
      "تاریخ بروزرسانی": now
    }
  };
};

// Export default object with all methods
const goldPriceApi = {
  fetchGoldPrices,
  GOLD_SYMBOLS,
  getDefaultGoldPrices
};

export default goldPriceApi; 