'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { blogAPI } from '@/lib/api';
import { Category, CategoryInfo } from '@/lib/types';
import { useBlogData } from '@/contexts/BlogDataContext';
import ImageUploader from '@/components/ImageUploader';
import ImageGallery from '@/components/ImageGallery';
import QuillEditor from '@/components/QuillEditor';
import 'quill/dist/quill.snow.css';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { refreshData } = useBlogData();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '' as Category,
    content: '',
    featured: false,
    imagePath: '', // Remove default image path
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
  
  // تابع آپلود تصویر برای ویرایشگر
  function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          setUploadingContentImage(true);
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('uploadType', 'content');
          
          toast.loading('در حال آپلود تصویر...', { id: 'content-upload' });
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('خطا در آپلود تصویر');
          }
          
          const data = await response.json();
          
          if (data.success) {
            // اضافه کردن تصویر به ویرایشگر
            const editor = document.querySelector('.ql-editor');
            const range = window.getSelection()?.getRangeAt(0);
            
            // ایجاد تگ تصویر
            const img = document.createElement('img');
            img.src = data.filePath;
            img.alt = 'تصویر آپلود شده';
            img.style.maxWidth = '100%';
            
            // درج تصویر در محل مکان‌نما
            if (range) {
              range.deleteContents();
              range.insertNode(img);
            } else {
              editor.appendChild(img);
            }
            
            toast.success('تصویر با موفقیت اضافه شد', { id: 'content-upload' });
          } else {
            throw new Error(data.error || 'خطا در آپلود تصویر');
          }
        } catch (error) {
          console.error('Error uploading content image:', error);
          toast.error('خطا در آپلود تصویر', { id: 'content-upload' });
        } finally {
          setUploadingContentImage(false);
        }
      }
    };
  }

  // تنظیمات ویرایشگر
  const modules = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        'image': imageHandler
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
            
            {/* تصویر شاخص */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">تصویر شاخص</label>
              
              <div className="flex space-x-2 items-center mb-4">
                <button
                  type="button"
                  onClick={() => setShowGallery(!showGallery)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  {showGallery ? 'بستن گالری' : 'انتخاب از گالری'}
                </button>
              </div>
              
              {!showGallery && (
                <ImageUploader 
                  type="thumbnail"
                  onImageUploaded={(filePath) => setFormData(prev => ({ ...prev, imagePath: filePath }))} 
                />
              )}
              
              {showGallery && (
                <ImageGallery 
                  type="thumbnail"
                  onSelectImage={(url) => {
                    setFormData(prev => ({ ...prev, imagePath: url }));
                    setShowGallery(false);
                    toast.success('تصویر انتخاب شد');
                  }} 
                />
              )}
              
              {formData.imagePath && (
                <div className="mt-4 relative w-full h-48 border rounded overflow-hidden">
                  <Image
                    src={formData.imagePath}
                    alt="پیش‌نمایش تصویر"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            
            {/* محتوای مقاله */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">محتوای مقاله</label>
              <QuillEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="محتوای مقاله را وارد کنید..."
              />
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