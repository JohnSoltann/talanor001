import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get the file extension
    const originalExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // تشخیص نوع واقعی فایل
    const detectedExtension = detectFileType(buffer, originalExtension);
    
    // لیست پسوندهای تصویری معتبر
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    
    if (!validExtensions.includes(detectedExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only image files are allowed.' },
        { status: 400 }
      );
    }

    // نام فایل با پسوند صحیح
    const timestamp = Date.now();
    const baseFilename = file.name.replace(/\.\w+$/, '').replace(/\s+/g, '-');
    const filename = `${timestamp}-${baseFilename}.${detectedExtension}`;
    
    // Define directory paths
    const blogDirPath = path.join(process.cwd(), 'public', 'images', 'blog');
    
    // Ensure directories exist
    if (!existsSync(blogDirPath)) {
      await mkdir(blogDirPath, { recursive: true });
    }
    
    // Save to public/images/blog directory
    const filePath = path.join(blogDirPath, filename);
    
    await writeFile(filePath, buffer);
    
    console.log(`File saved to: ${filePath} (detected as ${detectedExtension})`);
    
    // Return the path that can be used in <Image> component
    return NextResponse.json({ 
      success: true, 
      filePath: `/images/blog/${filename}`,
      detectedType: detectedExtension
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 