'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { blogAPI } from '@/lib/api';
import { Category, CategoryInfo } from '@/lib/types';
import { useBlogData } from '@/contexts/BlogDataContext';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { refreshData } = useBlogData();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '' as Category,
    content: '',
    featured: false,
    imagePath: '/images/blog/gold-hero.svg', // Default image path - updated to .svg
    date: generatePersianDate(),
    author: 'تیم کارشناسان طلانوز',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  
  // تابع برای تولید تاریخ شمسی فعلی به فرمت مناسب
  function generatePersianDate() {
    // این یک نمونه ساده است - در حالت واقعی از کتابخانه‌های تبدیل تاریخ شمسی استفاده کنید
    // مانند moment-jalaali
    const persianMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    const now = new Date();
    // فرض کنید این سال شمسی است - در حالت واقعی باید تبدیل شود
    const persianYear = now.getFullYear();
    const persianMonth = persianMonths[now.getMonth()];
    const persianDay = now.getDate();
    
    return `${persianDay} ${persianMonth} ${persianYear}`;
  }
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogAPI.categories.getAll();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('خطا در بارگیری دسته‌بندی‌ها');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Create a temporary URL for preview
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);
        
        // Display loading toast
        toast.loading('در حال آپلود تصویر...', { id: 'upload' });
        
        // Send the file to our API endpoint
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('خطا در آپلود تصویر');
        }
        
        const data = await response.json();
        
        // Update formData with the new image path returned from server
        if (data.success) {
          setFormData(prev => ({ ...prev, imagePath: data.filePath }));
          toast.success('تصویر با موفقیت بارگذاری شد', { id: 'upload' });
        } else {
          throw new Error(data.error || 'خطا در آپلود تصویر');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('خطا در آپلود تصویر', { id: 'upload' });
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // اطمینان از صحت فرمت فایل تصویر
      let finalImagePath = formData.imagePath;
      if (finalImagePath.endsWith('.jpg')) {
        finalImagePath = finalImagePath.replace('.jpg', '.svg');
      }
      
      // ساخت داده‌های پست برای ارسال به API
      const postData = {
        ...formData,
        imagePath: finalImagePath
      };
      
      // ارسال به API
      await blogAPI.posts.create(postData);
      
      // به‌روزرسانی داده‌های بلاگ
      await refreshData();
      
      toast.success('پست جدید با موفقیت ایجاد شد');
      
      // هدایت به صفحه بلاگ
      router.push('/blog');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('خطا در ایجاد پست');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">افزودن پست جدید</h1>
        <Link 
          href="/admin/blog" 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> بازگشت
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic info section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">اطلاعات اصلی</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  عنوان
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                  نامک (Slug)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  توضیح کوتاه
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                  نویسنده
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
            
            {/* Content section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">محتوا</h2>
              
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  {showPreview ? 'نمایش ویرایشگر' : 'پیش‌نمایش محتوا'}
                </button>
              </div>
              
              {showPreview ? (
                <div className="mb-4 border p-4 rounded-lg min-h-[300px] prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    محتوای پست
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={15}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    می‌توانید از HTML برای قالب‌بندی متن استفاده کنید.
                  </p>
                </div>
              )}
            </div>
            
            {/* SEO section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">تنظیمات سئو</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaTitle">
                  عنوان متا
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-1">
                  اگر خالی باشد، از عنوان پست استفاده می‌شود.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaDescription">
                  توضیحات متا
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-1">
                  اگر خالی باشد، از توضیح کوتاه پست استفاده می‌شود.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keywords">
                  کلمات کلیدی
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="کلمات کلیدی را با کاما جدا کنید"
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Publish section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">انتشار</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  تاریخ انتشار
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  دسته‌بندی
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">پست ویژه</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  پست‌های ویژه در صفحه‌ی اصلی بلاگ نمایش داده می‌شوند.
                </p>
              </div>
            </div>
            
            {/* Featured image section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">تصویر شاخص</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  تصویر فعلی
                </label>
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={previewImage || formData.imagePath}
                    alt="تصویر شاخص"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  آپلود تصویر جدید
                </label>
                <label className="flex items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center">
                    <FaUpload className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">انتخاب تصویر</span>
                  </div>
                  <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  حداکثر 2 مگابایت، فرمت‌های JPEG، PNG
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent"></div>
                در حال ذخیره...
              </>
            ) : (
              <>
                <FaSave /> ذخیره پست
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 