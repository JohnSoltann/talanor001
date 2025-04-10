import jalaali from 'jalaali-js';

/**
 * Convert numbers to Persian
 * @param num - Number or string to convert
 * @returns Persian number string
 */
export const toPersianNum = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/[0-9]/g, (w) => persianDigits[+w]);
};

/**
 * Format price with commas and convert to Persian
 * @param price - Price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return toPersianNum(price.toLocaleString('fa-IR'));
};

/**
 * Convert Gregorian date to Persian (Jalali) date
 * @param date - Date to convert
 * @param format - Format of the date (default: 'YYYY/MM/DD')
 * @returns Persian date string
 */
export const toPersianDate = (date: Date, format: string = 'YYYY/MM/DD'): string => {
  const { jy, jm, jd } = jalaali.toJalaali(date);
  
  let result = format;
  result = result.replace(/YYYY/g, toPersianNum(jy));
  result = result.replace(/MM/g, toPersianNum(jm < 10 ? `0${jm}` : jm));
  result = result.replace(/DD/g, toPersianNum(jd < 10 ? `0${jd}` : jd));
  
  // Add time if requested
  if (format.includes('HH')) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    result = result.replace(/HH/g, toPersianNum(hours < 10 ? `0${hours}` : hours));
    result = result.replace(/mm/g, toPersianNum(minutes < 10 ? `0${minutes}` : minutes));
  }
  
  return result;
};

/**
 * Get the name of the Persian month
 * @param month - Month number (1-12)
 * @returns Persian month name
 */
export const getPersianMonthName = (month: number): string => {
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  return months[month - 1];
};

/**
 * Convert Persian (Jalali) date to Gregorian date
 * @param jYear - Jalali year
 * @param jMonth - Jalali month
 * @param jDay - Jalali day
 * @returns JavaScript Date object
 */
export const toGregorianDate = (jYear: number, jMonth: number, jDay: number): Date => {
  const { gy, gm, gd } = jalaali.toGregorian(jYear, jMonth, jDay);
  return new Date(gy, gm - 1, gd);
};

/**
 * Format number with commas
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR');
};

/**
 * Convert Persian numbers to English
 * @param str - String containing Persian numbers
 * @returns String with English numbers
 */
export const toEnglishNum = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianDigits[i], 'g'), i.toString());
  }
  return str;
}; 