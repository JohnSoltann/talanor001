import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// تابعی برای بررسی اینکه محتوا SVG است یا نه
function isSvgContent(buffer: Buffer): boolean {
  try {
    const content = buffer.toString('utf-8', 0, 100).trim(); // فقط بررسی 100 کاراکتر اول
    return content.startsWith('<svg') || content.includes('xmlns="http://www.w3.org/2000/svg"');
  } catch (error) {
    return false;
  }
}

// تشخیص نوع واقعی فایل
function detectFileType(buffer: Buffer, originalExtension: string): string {
  // اگر محتوا SVG است، پسوند SVG را برگردان
  if (isSvgContent(buffer)) {
    return 'svg';
  }
  // در غیر این صورت از پسوند اصلی استفاده کن
  return originalExtension;
}

// ایجاد پوشه‌ها اگر وجود ندارند
const ensureDirectoryExists = (directory: string) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const UPLOAD_DIRS = {
  thumbnail: path.join(process.cwd(), 'public', 'uploads', 'blog', 'thumbnails'),
  content: path.join(process.cwd(), 'public', 'uploads', 'blog', 'content')
};

Object.values(UPLOAD_DIRS).forEach(ensureDirectoryExists);

export async function POST(req: Request) {
  try {
    // استخراج داده‌ها از FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as 'thumbnail' | 'content' || 'content';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'فایلی ارسال نشده است' }, 
        { status: 400 }
      );
    }
    
    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'فقط فایل‌های تصویری مجاز هستند' },
        { status: 400 }
      );
    }
    
    // تبدیل File به Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ایجاد نام فایل منحصر به فرد
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.name).toLowerCase() || '.jpg';
    const filename = `${uniqueId}${fileExtension}`;
    
    // مسیر ذخیره‌سازی
    const uploadDir = UPLOAD_DIRS[uploadType];
    const filePath = path.join(uploadDir, filename);
    
    // بهینه‌سازی و ذخیره تصویر با Sharp
    let sharpInstance = sharp(buffer);
    
    // تنظیمات بهینه‌سازی براساس نوع آپلود
    if (uploadType === 'thumbnail') {
      sharpInstance = sharpInstance
        .resize(800, 450, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true });
    } else {
      sharpInstance = sharpInstance
        .resize(1200, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true });
    }
    
    // ذخیره فایل بهینه‌شده
    await sharpInstance.toFile(filePath);
    
    // مسیر نسبی برای استفاده در URL
    const relativePath = `/uploads/blog/${uploadType === 'thumbnail' ? 'thumbnails' : 'content'}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      filePath: relativePath,
      filename: filename
    });
    
  } catch (error) {
    console.error('خطا در آپلود فایل:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در پردازش درخواست' }, 
      { status: 500 }
    );
  }
} 