import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIRS = {
  thumbnail: path.join(process.cwd(), 'public', 'uploads', 'blog', 'thumbnails'),
  content: path.join(process.cwd(), 'public', 'uploads', 'blog', 'content')
};

export async function DELETE(req: Request, { params }: { params: { filename: string } }) {
  try {
    const { filename } = params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'thumbnail' | 'content' || 'content';
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'نام فایل نامعتبر است' }, 
        { status: 400 }
      );
    }
    
    const filePath = path.join(UPLOAD_DIRS[type], filename);
    
    // بررسی وجود فایل
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'فایل یافت نشد' }, 
        { status: 404 }
      );
    }
    
    // حذف فایل
    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در حذف تصویر' }, 
      { status: 500 }
    );
  }
} 