'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { blogAPI } from '@/lib/api';
import { BlogPost, Category, CategoryInfo } from '@/lib/types';
import { useBlogData } from '@/contexts/BlogDataContext';
import BlogIcon from '@/components/BlogIcon';

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { refreshData } = useBlogData();
  
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState('');
  
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state - initialize with empty values
  const [formData, setFormData] = useState<BlogPost & { 
    metaTitle: string, 
    metaDescription: string, 
    keywords: string 
  }>({
    id: '',
    title: '',
    slug: '',
    description: '',
    category: '' as Category,
    date: '',
    author: '',
    content: '',
    imagePath: '', // Keep for backward compatibility
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });
  
  // Fetch post data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPost(true);
        
        // Fetch post by ID
        const post = await blogAPI.posts.getById(id);
        if (!post) {
          setError('پست مورد نظر یافت نشد');
          return;
        }
        
        // Fetch categories
        const categoriesData = await blogAPI.categories.getAll();
        setCategories(categoriesData);
        
        // Set form data with post values
        setFormData({
          ...post,
          metaTitle: post.title,
          metaDescription: post.description,
          keywords: ''
        });
        
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('خطا در بارگیری اطلاعات');
      } finally {
        setLoadingPost(false);
      }
    };
    
    fetchData();
  }, [id]);
  
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (id === 'new') {
        await blogAPI.posts.create(formData);
        toast.success('پست جدید با موفقیت ایجاد شد');
      } else {
        await blogAPI.posts.update(id, formData);
        toast.success('پست با موفقیت به‌روزرسانی شد');
      }
      
      await refreshData();
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error saving post:', err);
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
          {id === 'new' ? 'ایجاد پست جدید' : 'ویرایش پست'}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            محتوا
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-colors flex items-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin ml-2" />
            ) : (
              <FaSave className="ml-2" />
            )}
            {id === 'new' ? 'ایجاد پست' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
} 