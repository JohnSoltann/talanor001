import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import BlogIcon from './BlogIcon';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-2">
      <div className="h-52 relative">
        {post.imagePath ? (
          <Image
            src={post.imagePath}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
            <BlogIcon category={post.category} size={64} className="opacity-50" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <BlogIcon category={post.category} size={16} />
          <span className="text-gray-500 text-sm">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.description}
        </p>
        <Link href={`/blog/${post.slug}`} className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full shadow transition-colors">
          ادامه مطلب
        </Link>
      </div>
    </article>
  );
};

export default BlogCard; 