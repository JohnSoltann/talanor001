'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useBlogData } from '@/contexts/BlogDataContext';
import { BlogPost, CategoryInfo } from '@/lib/types';
import BlogCard from '@/components/BlogCard';

export const dynamic = 'force-dynamic';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Array.isArray(params.category) ? params.category[0] : params.category.toString();
  
  const { posts, categories, isLoading, refreshData, getCategoryById } = useBlogData();
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [categoryPosts, setCategoryPosts] = useState<BlogPost[]>([]);

  // Load category data and filter posts
  useEffect(() => {
    console.log("Category ID:", categoryId);
    if (categoryId) {
      // Try to get the category directly
      const foundCategory = getCategoryById(categoryId);
      console.log("Found category using helper:", foundCategory);
      
      if (foundCategory) {
        setCategoryInfo(foundCategory);
        
        // Filter posts by category
        const filteredPosts = posts.filter(post => post.category === categoryId);
        setCategoryPosts(filteredPosts);
      } 
      // Fallback to searching in the categories array
      else if (categories.length > 0) {
        const categoryFromArray = categories.find(c => c.id === categoryId);
        console.log("Found category from array:", categoryFromArray);
        
        if (categoryFromArray) {
          setCategoryInfo(categoryFromArray);
          
          // Filter posts by category
          const filteredPosts = posts.filter(post => post.category === categoryId);
          setCategoryPosts(filteredPosts);
        }
      }
    }
  }, [categoryId, posts, categories, getCategoryById]);

  // Force refresh data if needed
  useEffect(() => {
    if (!categoryInfo) {
      console.log("Category not found, refreshing data...");
      refreshData();
    }
  }, [categoryInfo, refreshData]);

  // Loading state
  if (isLoading && !categoryInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-yellow-500 text-4xl" />
      </div>
    );
  }

  // Category not found after trying to load
  if (!categoryInfo && !isLoading) {
    console.error("Category not found for ID:", categoryId);
    console.log("Available categories:", categories.map(c => `${c.id} (${c.title})`));
    return notFound();
  }

  // Category found, render content
  if (categoryInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/blog" className="text-yellow-600 hover:text-yellow-700 flex items-center gap-2">
            <FaArrowLeft size={16} />
            بازگشت به بلاگ
          </Link>
        </div>
        
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryInfo.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{categoryInfo.description}</p>
        </header>
        
        {categoryPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-gray-600 mb-4">در حال حاضر مقاله‌ای در این دسته‌بندی وجود ندارد.</p>
            <Link 
              href="/blog"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-colors"
            >
              بازگشت به بلاگ
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FaSpinner className="animate-spin text-yellow-500 text-4xl" />
    </div>
  );
} 