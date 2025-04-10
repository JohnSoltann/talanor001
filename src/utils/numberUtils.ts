export const formatNumber = (num: number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toLocaleString('fa-IR').replace(/[0-9]/g, w => persianDigits[+w]);
}; 