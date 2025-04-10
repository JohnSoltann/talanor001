import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY must be defined in environment variables');
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// تابع برای رمزنگاری مقادیر عددی (مثل موجودی کیف پول)
export function encryptNumber(num: number): string {
  return encrypt(num.toString());
}

// تابع برای رمزگشایی مقادیر عددی
export function decryptNumber(encrypted: string): number {
  return parseFloat(decrypt(encrypted));
}

// تابع برای رمزنگاری آدرس
export function encryptAddress(address: string): string {
  return encrypt(address);
}

// تابع برای رمزگشایی آدرس
export function decryptAddress(encrypted: string): string {
  return decrypt(encrypted);
}

// تابع برای رمزنگاری شماره تلفن
export function encryptPhone(phone: string): string {
  return encrypt(phone);
}

// تابع برای رمزگشایی شماره تلفن
export function decryptPhone(encrypted: string): string {
  return decrypt(encrypted);
} 