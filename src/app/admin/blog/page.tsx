'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { blogAPI } from '@/lib/api';
import { BlogPost, CategoryInfo } from '@/lib/types';
import SafeImage from '@/components/SafeImage';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  
  // Load posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allPosts, allCategories] = await Promise.all([
          blogAPI.posts.getAll(),
          blogAPI.categories.getAll()
        ]);
        setPosts(allPosts);
        setCategories(allCategories);
        setError('');
      } catch (err) {
        setError('خطا در بارگیری اطلاعات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle post deletion
  const handleDeletePost = async (id: string, title: string) => {
    if (window.confirm(`آیا از حذف پست "${title}" اطمینان دارید؟`)) {
      try {
        // Call the API to delete the post
        const success = await blogAPI.posts.delete(id);
        
        if (success) {
          // Update local state
          setPosts(prev => prev.filter(post => post.id !== id));
          toast.success('پست با موفقیت حذف شد');
        } else {
          toast.error('خطا در حذف پست');
        }
      } catch (err) {
        toast.error('خطا در حذف پست');
        console.error(err);
      }
    }
  };
  
  // Filter posts based on search term and category
  const filteredPosts = posts.filter(post => {
    // فیلتر بر اساس متن جستجو
    const matchesSearchTerm = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // فیلتر بر اساس دسته‌بندی
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearchTerm && matchesCategory;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت پست‌های بلاگ</h1>
        <Link 
          href="/admin/blog/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> پست جدید
        </Link>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="جستجو در پست‌ها..."
            className="w-full p-3 pr-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div>
          <select
            className="w-full p-3 border rounded-lg bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-blue-600 border-e-transparent"></div>
          <p className="mt-2">در حال بارگذاری...</p>
        </div>
      ) : (
        /* Posts table */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  پست
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  دسته‌بندی
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ویژه
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <SafeImage
                            src={post.imagePath}
                            alt={post.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <Link href={`/blog/${post.slug}`} className="text-xs text-blue-600 hover:underline" target="_blank">
                            مشاهده
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categories.find(cat => cat.id === post.category)?.title || post.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          بله
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          خیر
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link href={`/admin/blog/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900 ml-3">
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    هیچ پستی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 