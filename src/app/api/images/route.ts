import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIRS = {
  thumbnail: path.join(process.cwd(), 'public', 'uploads', 'blog', 'thumbnails'),
  content: path.join(process.cwd(), 'public', 'uploads', 'blog', 'content')
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';
    
    let images = [];
    
    // خواندن فایل‌ها از پوشه‌ها
    if (type === 'thumbnail' || type === 'all') {
      images = [...images, ...getImagesFromDirectory('thumbnail')];
    }
    
    if (type === 'content' || type === 'all') {
      images = [...images, ...getImagesFromDirectory('content')];
    }
    
    // مرتب‌سازی براساس زمان ایجاد (جدیدترین‌ها ابتدا)
    images.sort((a, b) => b.createdAt - a.createdAt);
    
    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در بازیابی تصاویر' }, 
      { status: 500 }
    );
  }
}

function getImagesFromDirectory(dirType: 'thumbnail' | 'content') {
  try {
    const directoryPath = UPLOAD_DIRS[dirType];
    const files = fs.readdirSync(directoryPath);
    
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          type: dirType,
          url: `/uploads/blog/${dirType === 'thumbnail' ? 'thumbnails' : 'content'}/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.getTime()
        };
      });
  } catch (error) {
    console.error(`Error reading directory ${dirType}:`, error);
    return [];
  }
} 