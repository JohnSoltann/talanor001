'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaUpload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { blogAPI } from '@/lib/api';
import { BlogPost, Category, CategoryInfo } from '@/lib/types';
import { useBlogData } from '@/contexts/BlogDataContext';
import ImageUploader from '@/components/ImageUploader';
import ImageGallery from '@/components/ImageGallery';
import QuillEditor from '@/components/QuillEditor';
import BlogIcon from '@/components/BlogIcon';
import 'quill/dist/quill.snow.css';

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter();
  const { refreshData } = useBlogData();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    description: '',
    category: '' as Category,
    content: '',
    featured: false,
    imagePath: '',
    date: '',
    author: '',
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });
  
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
  
  // بررسی وجود تصویر
  const checkImageExists = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        setFormData(prev => ({ ...prev, imagePath: '' }));
      }
    } catch (error) {
      console.error('Error checking image:', error);
      setFormData(prev => ({ ...prev, imagePath: '' }));
    }
  };

  // Load post and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPost(true);
        setIsSubmitDisabled(true);
        const [post, categoriesData] = await Promise.all([
          blogAPI.posts.getById(params.id),
          blogAPI.categories.getAll()
        ]);
        
        if (!post) {
          setError('پست مورد نظر یافت نشد');
          router.push('/admin/blog');
          return;
        }
        
        setFormData(post);
        // بررسی وجود تصویر پست
        if (post.imagePath) {
          await checkImageExists(post.imagePath);
        }
        setCategories(categoriesData);
        setError('');
      } catch (error) {
        console.error('Error fetching post data:', error);
        setError('خطا در بارگیری اطلاعات');
      } finally {
        setLoadingPost(false);
        setIsSubmitDisabled(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !formData.slug) {
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (params.id === 'new') {
        await blogAPI.posts.create(formData);
        toast.success('پست جدید با موفقیت ایجاد شد');
      } else {
        await blogAPI.posts.update(params.id, formData);
        toast.success('پست با موفقیت به‌روزرسانی شد');
      }
      
      await refreshData();
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      setError('خطا در ذخیره پست');
      toast.error('خطا در ذخیره پست');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-yellow-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin/blog" className="flex items-center text-yellow-500 hover:text-yellow-600">
          <FaArrowLeft className="ml-2" />
          بازگشت به لیست پست‌ها
        </Link>
        <h1 className="text-2xl font-bold">
          {params.id === 'new' ? 'ایجاد پست جدید' : 'ویرایش پست'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FaExclamationTriangle className="ml-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 appearance-none"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <BlogIcon category={formData.category} size={20} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نامک (Slug)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاریخ
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان متا
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات متا
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            کلمات کلیدی
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="کلمات کلیدی را با کاما جدا کنید"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            تصویر اصلی پست
          </label>
          
          <div className="flex flex-col items-center space-y-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            {formData.imagePath ? (
              <div className="relative w-full max-w-md">
                <Image
                  src={formData.imagePath}
                  alt="تصویر پست"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/placeholder.svg';
                  }}
                  loader={({ src }) => src.startsWith('/') ? src : `/${src}`}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imagePath: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="حذف تصویر"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">تصویری انتخاب نشده است</p>
              </div>
            )}
            
            <div className="flex space-x-4 rtl:space-x-reverse">
              <ImageUploader
                onImageUploaded={(path) => setFormData(prev => ({ ...prev, imagePath: path }))}
                type="thumbnail"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow transition-colors flex items-center"
              >
                <FaUpload className="ml-2" />
                آپلود تصویر جدید
              </ImageUploader>
              
              <button
                type="button"
                onClick={() => setShowGallery(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition-colors flex items-center"
              >
                انتخاب از گالری
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || isSubmitDisabled}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin ml-2" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <FaSave className="ml-2" />
                {params.id === 'new' ? 'ایجاد پست' : 'ذخیره تغییرات'}
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* مدال گالری تصاویر */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">گالری تصاویر</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 8rem)' }}>
              <ImageGallery
                type="thumbnail"
                onSelect={(path) => {
                  setFormData(prev => ({ ...prev, imagePath: path }));
                  setShowGallery(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 