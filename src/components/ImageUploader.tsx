'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { FaUpload, FaSpinner } from 'react-icons/fa';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  type?: 'thumbnail' | 'content';
}

export default function ImageUploader({ onImageUploaded, type = 'content' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً فقط فایل‌های تصویری آپلود کنید');
      return;
    }
    
    // بررسی سایز فایل (حداکثر 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }
    
    try {
      setUploading(true);
      toast.loading('در حال آپلود تصویر...', { id: 'upload' });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', type);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('خطا در آپلود تصویر');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('تصویر با موفقیت آپلود شد', { id: 'upload' });
        onImageUploaded(data.filePath);
      } else {
        throw new Error(data.error || 'خطا در آپلود تصویر');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر', { id: 'upload' });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="text-center">
        {uploading ? (
          <FaSpinner className="h-8 w-8 mx-auto text-blue-500 animate-spin" />
        ) : (
          <FaUpload className="h-8 w-8 mx-auto text-gray-400" />
        )}
        <p className="mt-2 text-sm text-gray-600">
          {uploading ? 'در حال آپلود...' : 'برای آپلود تصویر کلیک کنید یا فایل را بکشید و رها کنید'}
        </p>
        <p className="mt-1 text-xs text-gray-500">PNG, JPG یا WEBP (حداکثر 5MB)</p>
      </div>
      <input 
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
    </label>
  );
} 