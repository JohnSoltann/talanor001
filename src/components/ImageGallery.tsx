'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { FaTrash, FaSpinner, FaSearch, FaCheck } from 'react-icons/fa';

interface ImageGalleryProps {
  onSelectImage: (url: string) => void;
  type?: 'all' | 'thumbnail' | 'content';
}

interface ImageInfo {
  filename: string;
  type: 'thumbnail' | 'content';
  url: string;
  size: number;
  createdAt: number;
}

export default function ImageGallery({ onSelectImage, type = 'all' }: ImageGalleryProps) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchImages();
  }, [type]);
  
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/images?type=${type}`);
      
      if (!res.ok) {
        throw new Error('خطا در بازیابی تصاویر');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setImages(data.images);
      } else {
        throw new Error(data.error || 'خطا در بازیابی تصاویر');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('خطا در بازیابی تصاویر');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (filename: string, imageType: 'thumbnail' | 'content') => {
    if (window.confirm('آیا از حذف این تصویر اطمینان دارید؟')) {
      try {
        const res = await fetch(`/api/images/${filename}?type=${imageType}`, {
          method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (data.success) {
          setImages(images.filter(img => img.filename !== filename || img.type !== imageType));
          toast.success('تصویر با موفقیت حذف شد');
        } else {
          throw new Error(data.error || 'خطا در حذف تصویر');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('خطا در حذف تصویر');
      }
    }
  };
  
  // فیلتر تصاویر براساس جستجو
  const filteredImages = images.filter(img => 
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">گالری تصاویر</h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی تصویر..."
            className="pl-8 pr-2 py-1 border rounded-lg text-sm"
          />
          <FaSearch className="absolute right-2 top-2 text-gray-400 text-sm" />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        </div>
      ) : (
        <>
          {filteredImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              تصویری یافت نشد
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((img) => (
                <div key={`${img.type}-${img.filename}`} className="relative group">
                  <div className="relative h-24 border rounded overflow-hidden">
                    <Image 
                      src={img.url} 
                      alt={img.filename}
                      fill
                      sizes="100px"
                      className="object-cover" 
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center space-x-2">
                    <button 
                      onClick={() => onSelectImage(img.url)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="انتخاب تصویر"
                    >
                      <FaCheck />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(img.filename, img.type)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      title="حذف تصویر"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500 truncate text-center">
                    {img.filename.substring(0, 10)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 