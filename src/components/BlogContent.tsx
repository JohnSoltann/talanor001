'use client';

import React, { useEffect, useRef } from 'react';

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Fix images after component mounts
  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.querySelectorAll('img');
      
      images.forEach(img => {
        // تبدیل خودکار پسوند jpg به svg برای تصاویر
        if (img.src.includes('.jpg') && !img.src.includes('?')) {
          // تصاویر داخلی سایت - احتمالاً آنهایی که در مسیر blog هستند
          if (img.src.includes('/images/blog/')) {
            const newSrc = img.src.replace('.jpg', '.svg');
            console.log(`Converting image src from ${img.src} to ${newSrc}`);
            img.src = newSrc;
          }
        }
        
        // Add error handling for images
        img.onerror = () => {
          console.error(`Failed to load image: ${img.src}`);
          
          // تلاش برای تبدیل فرمت در صورت خطا
          if (img.src.endsWith('.jpg') && !img.hasAttribute('data-error-handled')) {
            const svgSrc = img.src.replace('.jpg', '.svg');
            console.log(`Image error, trying SVG: ${svgSrc}`);
            img.src = svgSrc;
            img.setAttribute('data-error-handled', 'true');
          } else if (!img.hasAttribute('data-error-handled')) {
            // استفاده از تصویر پیش‌فرض در صورت ادامه خطا
            img.src = '/images/blog/gold-hero.svg';
            img.classList.add('error-image');
            img.setAttribute('data-error-handled', 'true');
          }
        };
        
        // Force images to be unoptimized
        if (!img.hasAttribute('data-processed')) {
          // Add responsive classes
          img.classList.add('w-full', 'h-auto', 'rounded-md', 'my-4');
          
          // Mark as processed
          img.setAttribute('data-processed', 'true');
        }
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-lg max-w-none rtl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent; 