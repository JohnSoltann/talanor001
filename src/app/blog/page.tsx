'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSpinner, FaChartLine, FaCoins, FaGlobe, FaBook } from 'react-icons/fa';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import BlogIcon from '@/components/BlogIcon';
import { useBlogData } from '@/contexts/BlogDataContext';
import { BlogPost } from '@/lib/types';
import Image from 'next/image';

export default function BlogPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const { posts, categories, isLoading, refreshData } = useBlogData();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const POSTS_PER_PAGE = 5;

  // Process posts when they change
  useEffect(() => {
    if (posts.length === 0) {
      // Fallback post when no posts are available
      const fallbackPost: BlogPost = {
        id: 'fallback',
        title: 'به وبلاگ طلا نور خوش آمدید',
        description: 'به زودی مطالب جذابی در مورد بازار طلا و جواهر در اینجا منتشر خواهد شد.',
        content: '',
        slug: 'welcome',
        category: 'عمومی',
        imagePath: '/uploads/blog/thumbnails/gold-hero.svg',
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFeaturedPost(fallbackPost);
      setFilteredPosts([fallbackPost]);
      setTotalPages(1);
      return;
    }

    // Find featured post
    const featured = posts.find(post => post.featured) || posts[0];
    setFeaturedPost(featured);
    
    // Paginate posts
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    setFilteredPosts(posts.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(posts.length / POSTS_PER_PAGE));
    
  }, [posts, currentPage]);
  
  // Refresh data when page loads
  useEffect(() => {
    refreshData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-yellow-500 text-4xl" />
      </div>
    );
  }

  if (!featuredPost) {
    return <div>هیچ پستی یافت نشد.</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-[500px] rounded-2xl overflow-hidden">
          {featuredPost.imagePath ? (
            <Image
              src={featuredPost.imagePath}
              alt={featuredPost.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300">
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <BlogIcon 
                  category={featuredPost.category} 
                  size={120} 
                  className="opacity-20"
                />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-center p-8 md:p-12 z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <BlogIcon category={featuredPost.category} size={24} />
                <span className="bg-yellow-500 text-black py-2 px-4 rounded-full text-sm font-medium shadow-lg">
                  {featuredPost.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-shadow-lg">
                {featuredPost.title}
              </h1>
              <p className="text-white text-lg mb-8 text-shadow">
                {featuredPost.description}
              </p>
              <Link href={`/blog/${featuredPost.slug}`} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full shadow-lg transition-colors">
                ادامه مطلب
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">آخرین مطالب بلاگ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => {
            let Icon;
            switch (category.icon) {
              case 'FaChartLine':
                Icon = FaChartLine;
                break;
              case 'FaCoins':
                Icon = FaCoins;
                break;
              case 'FaGlobe':
                Icon = FaGlobe;
                break;
              case 'FaBook':
                Icon = FaBook;
                break;
              default:
                Icon = FaBook;
            }

            return (
              <Link 
                key={category.id}
                href={`/blog/categories/${category.id}`} 
                className="bg-white p-8 rounded-xl text-center shadow-md transition-transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="text-5xl text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
} 