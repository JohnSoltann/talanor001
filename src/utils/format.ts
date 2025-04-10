export function formatNumber(num: number, currency: 'toman' | 'rial' = 'toman'): string {
  // Convert rial to toman if needed
  const amount = currency === 'toman' ? Math.floor(num / 10) : num;
  
  // Format with Persian digits and commas
  return new Intl.NumberFormat('fa-IR').format(amount);
}

// Convert timestamps to Persian format
export function formatPersianDateTime(date: string): string {
  return new Date(date).toLocaleString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
} 