'use client';

import React, { useEffect, useState } from 'react';
import { useBlogData } from '@/contexts/BlogDataContext';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { BlogPost } from '@/lib/types';

export default function DebugPostPage() {
  const { posts, categories, isLoading, refreshData } = useBlogData();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [specificPost, setSpecificPost] = useState<BlogPost | null>(null);
  
  // این slug را برای تست استفاده می‌کنیم
  const testSlug = "gold-demand-increase";
  
  useEffect(() => {
    // جمع‌آوری اطلاعات دیباگ
    const info = {
      browserUrl: window.location.href,
      pathname: window.location.pathname,
      allSlugs: posts.map(p => p.slug),
      postsCount: posts.length,
      categoriesCount: categories.length,
      specificSlugExists: posts.some(p => p.slug === testSlug),
      specificSlugPost: posts.find(p => p.slug === testSlug),
      localStorage: null as any
    };
    
    // بررسی داده‌های localStorage
    try {
      const storedPosts = localStorage.getItem('blog_posts');
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        info.localStorage = {
          postsCount: parsedPosts.length,
          specificSlugExists: parsedPosts.some((p: any) => p.slug === testSlug),
          allSlugs: parsedPosts.map((p: any) => p.slug),
        };
      }
    } catch (error) {
      info.localStorage = { error: String(error) };
    }
    
    setDebugInfo(info);
    
    // تنظیم پست مشخص
    const post = posts.find(p => p.slug === testSlug);
    if (post) {
      setSpecificPost(post);
    } else {
      console.error(`Post with slug '${testSlug}' not found!`);
    }
    
  }, [posts, categories, testSlug]);
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">صفحه دیباگ پست</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">لینک‌های پست مورد نظر:</h2>
        <div className="flex flex-col gap-2">
          <Link href={`/blog/${testSlug}`} className="text-blue-500 hover:underline">
            لینک عادی (Next Link): /blog/{testSlug}
          </Link>
          <a href={`/blog/${testSlug}`} className="text-blue-500 hover:underline">
            لینک عادی (a tag): /blog/{testSlug}
          </a>
          <a href={`http://localhost:3001/blog/${testSlug}`} className="text-blue-500 hover:underline">
            لینک مستقیم با پورت 3001: http://localhost:3001/blog/{testSlug}
          </a>
        </div>
      </div>
      
      {isLoading ? (
        <div>در حال بارگذاری...</div>
      ) : (
        <>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">اطلاعات دیباگ:</h2>
            <pre className="overflow-auto text-sm p-2 bg-gray-200 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          {specificPost ? (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">پست یافت شده:</h2>
              <div className="flex flex-col gap-2">
                <p><span className="font-bold">عنوان:</span> {specificPost.title}</p>
                <p><span className="font-bold">Slug:</span> {specificPost.slug}</p>
                <p><span className="font-bold">دسته‌بندی:</span> {specificPost.category}</p>
                <div className="relative h-40 w-full mt-4">
                  <SafeImage
                    src={specificPost.imagePath}
                    alt={specificPost.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-2 text-red-600">پست مورد نظر یافت نشد!</h2>
              <p>هیچ پستی با slug {testSlug} پیدا نشد.</p>
              <button
                onClick={refreshData}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                بارگذاری مجدد داده‌ها
              </button>
            </div>
          )}
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">همه پست‌ها:</h2>
            <ul className="list-disc pr-6">
              {posts.map(post => (
                <li key={post.id} className="mb-2">
                  <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
                    {post.title} <span className="text-gray-500">({post.slug})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 