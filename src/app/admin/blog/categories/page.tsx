'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { blogAPI } from '@/lib/api';
import { CategoryInfo, Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Default form for a new category
  const defaultCategoryForm = {
    id: '',
    title: '',
    description: '',
    icon: 'FaBook'
  };
  
  const [formData, setFormData] = useState<CategoryInfo>(defaultCategoryForm as CategoryInfo);
  
  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.categories.getAll();
        setCategories(data);
        setError('');
      } catch (err) {
        setError('خطا در بارگیری دسته‌بندی‌ها');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate ID from title if this is a new category
    if (name === 'title' && !editMode) {
      const id = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, id: id as Category }));
    }
  };
  
  // Start editing a category
  const handleEdit = (category: CategoryInfo) => {
    setFormData(category);
    setEditMode(true);
    setIsAdding(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.id || !formData.title) {
        toast.error('لطفاً فیلدهای ضروری را پر کنید');
        return;
      }
      
      // Call API to save the category
      if (editMode) {
        // Update existing category
        const updatedCategory = await blogAPI.categories.update(formData.id, formData);
        
        if (updatedCategory) {
          // Update local state
          setCategories(prev => 
            prev.map(cat => cat.id === formData.id ? updatedCategory : cat)
          );
          
          toast.success('دسته‌بندی با موفقیت بروزرسانی شد');
        } else {
          toast.error('خطا در بروزرسانی دسته‌بندی');
        }
      } else {
        // Add new category
        const newCategory = await blogAPI.categories.create(formData);
        
        // Update local state
        setCategories(prev => [...prev, newCategory]);
        
        toast.success('دسته‌بندی با موفقیت اضافه شد');
      }
      
      // Reset form
      setFormData(defaultCategoryForm as CategoryInfo);
      setEditMode(false);
      setIsAdding(false);
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(editMode ? 'خطا در بروزرسانی دسته‌بندی' : 'خطا در ایجاد دسته‌بندی');
    }
  };
  
  // Handle category deletion
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`آیا از حذف دسته‌بندی "${title}" اطمینان دارید؟`)) {
      try {
        // Call API to delete the category
        const success = await blogAPI.categories.delete(id as Category);
        
        if (success) {
          // Update local state
          setCategories(prev => prev.filter(cat => cat.id !== id));
          toast.success('دسته‌بندی با موفقیت حذف شد');
        } else {
          toast.error('خطا در حذف دسته‌بندی');
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('خطا در حذف دسته‌بندی');
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        {!isAdding && (
          <button 
            onClick={() => {
              setFormData(defaultCategoryForm as CategoryInfo);
              setEditMode(false);
              setIsAdding(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> دسته‌بندی جدید
          </button>
        )}
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      
      {/* Add/Edit Category Form */}
      {isAdding && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                    شناسه (ID)
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={editMode}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
                    required
                  />
                  {editMode && (
                    <p className="text-sm text-gray-500 mt-1">
                      شناسه دسته‌بندی قابل تغییر نیست.
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    توضیحات
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                    آیکون
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="FaChartLine">نمودار (تحلیل بازار)</option>
                    <option value="FaCoins">سکه (سرمایه‌گذاری)</option>
                    <option value="FaGlobe">کره زمین (بازار جهانی)</option>
                    <option value="FaBook">کتاب (آموزش)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-3"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {editMode ? 'بروزرسانی' : 'ذخیره'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Categories List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-blue-600 border-e-transparent"></div>
          <p className="mt-2">در حال بارگذاری...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شناسه
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  توضیحات
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آیکون
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.icon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id, category.title)}
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
                    هیچ دسته‌بندی یافت نشد
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