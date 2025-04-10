'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { blogAPI } from '@/lib/api';
import { BlogPost, CategoryInfo } from '@/lib/types';

interface BlogDataContextType {
  posts: BlogPost[];
  categories: CategoryInfo[];
  refreshData: () => Promise<void>;
  isLoading: boolean;
  getPostBySlug: (slug: string) => BlogPost | null;
  getCategoryById: (id: string) => CategoryInfo | null;
}

const BlogDataContext = createContext<BlogDataContextType | undefined>(undefined);

export const useBlogData = () => {
  const context = useContext(BlogDataContext);
  if (!context) {
    throw new Error('useBlogData must be used within a BlogDataProvider');
  }
  return context;
};

interface BlogDataProviderProps {
  children: ReactNode;
}

export const BlogDataProvider: React.FC<BlogDataProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Default placeholder image that doesn't rely on blog folder
  const DEFAULT_IMAGE = '/images/gold-hero.svg';

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Check if data exists in localStorage and is not expired
      if (typeof window !== 'undefined') {
        const cachedPosts = localStorage.getItem('blog_posts');
        const cachedCategories = localStorage.getItem('blog_categories');
        const lastFetchTime = localStorage.getItem('blog_data_last_fetch');
        
        if (cachedPosts && cachedCategories && lastFetchTime) {
          const timeSinceLastFetch = Date.now() - parseInt(lastFetchTime);
          // Refresh data if it's older than 5 minutes
          if (timeSinceLastFetch < 5 * 60 * 1000) {
            setPosts(JSON.parse(cachedPosts));
            setCategories(JSON.parse(cachedCategories));
            setDataInitialized(true);
            setIsLoading(false);
            return;
          }
        }
      }
      
      const [allPosts, allCategories] = await Promise.all([
        blogAPI.posts.getAll(),
        blogAPI.categories.getAll()
      ]);
      
      console.log("Fetched posts:", allPosts);
      console.log("Fetched categories:", allCategories);
      
      const updatedPosts = allPosts.map(post => ({
        ...post,
        imagePath: DEFAULT_IMAGE
      }));
      
      setPosts(updatedPosts);
      setCategories(allCategories);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('blog_posts', JSON.stringify(updatedPosts));
        localStorage.setItem('blog_categories', JSON.stringify(allCategories));
        localStorage.setItem('blog_data_last_fetch', Date.now().toString());
      }
      
      setDataInitialized(true);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      handleFallbackData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fallback to default data if API fails
  const handleFallbackData = () => {
    try {
      // import default posts
      import('@/lib/data/blogData').then(module => {
        // Check if module exists and has the required properties
        if (!module || !module.defaultBlogPosts) {
          console.error('Default blog posts not found in module:', module);
          // Create empty arrays as fallback if data not found
          setPosts([]);
          setCategories([]);
          setDataInitialized(true);
          setIsLoading(false);
          return;
        }
        
        const defaultPosts = module.defaultBlogPosts.map((post: BlogPost) => ({
          ...post,
          imagePath: DEFAULT_IMAGE
        }));
        const defaultCategories = module.defaultCategories || [];
        
        setPosts(defaultPosts);
        setCategories(defaultCategories);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('blog_posts', JSON.stringify(defaultPosts));
          localStorage.setItem('blog_categories', JSON.stringify(defaultCategories));
        }
        
        setDataInitialized(true);
      }).catch(err => {
        console.error("Error importing default posts:", err);
        // Create empty arrays as fallback
        setPosts([]);
        setCategories([]);
        setDataInitialized(true);
      });
    } catch (error) {
      console.error("Failed to load fallback data:", error);
      // Create empty arrays as fallback
      setPosts([]);
      setCategories([]);
      setDataInitialized(true);
    }
  };

  // Helper function to get post by slug
  const getPostBySlug = (slug: string): BlogPost | null => {
    if (!slug) return null;
    
    console.log(`Looking for post with slug: ${slug} in ${posts.length} posts`);
    
    // First try exact match
    const directMatch = posts.find(p => p.slug === slug);
    if (directMatch) {
      console.log("Found direct match:", directMatch.title);
      return directMatch;
    }
    
    // Try case insensitive match
    const caseInsensitiveMatch = posts.find(p => 
      p.slug.toLowerCase() === slug.toLowerCase()
    );
    if (caseInsensitiveMatch) {
      console.log("Found case insensitive match:", caseInsensitiveMatch.title);
      return caseInsensitiveMatch;
    }
    
    // If post not found and data is loaded, try localStorage
    if (typeof window !== 'undefined' && dataInitialized) {
      try {
        const storedPosts = localStorage.getItem('blog_posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            // Look for post in localStorage
            const storedPost = parsedPosts.find((p: BlogPost) => p.slug === slug);
            if (storedPost) {
              console.log(`Found post with slug '${slug}' in localStorage!`);
              
              // Fix the image path
              const fixedPost = {
                ...storedPost,
                imagePath: DEFAULT_IMAGE
              };
              
              // Add to posts array for future use
              setPosts(prevPosts => {
                // Only add if not already in array
                if (!prevPosts.some(p => p.id === fixedPost.id)) {
                  return [...prevPosts, fixedPost];
                }
                return prevPosts;
              });
              return fixedPost;
            }
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }
    
    // Don't use async approach for defaultBlogPosts, use synchronous approach instead
    console.log('Loading default blog posts synchronously for slug:', slug);
    try {
      // Try to directly use the defaultBlogPosts from the imported module
      const defaultBlogPostsModule = require('@/lib/data/blogData').defaultBlogPosts;
      
      if (defaultBlogPostsModule && Array.isArray(defaultBlogPostsModule)) {
        console.log('Successfully loaded default blog posts:', defaultBlogPostsModule.length);
        
        // Find post with matching slug
        const defaultPost = defaultBlogPostsModule.find((p: BlogPost) => 
          p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase()
        );
        
        if (defaultPost) {
          const fixedPost = {
            ...defaultPost,
            imagePath: DEFAULT_IMAGE
          };
          
          console.log(`Found post with slug '${slug}' in default posts! Title: ${fixedPost.title}`);
          
          // Update the posts state
          setPosts(prevPosts => {
            const newPosts = [...prevPosts];
            if (!newPosts.some(p => p.id === fixedPost.id)) {
              newPosts.push(fixedPost);
            }
            return newPosts;
          });
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            try {
              const currentPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
              if (!currentPosts.some((p: BlogPost) => p.id === fixedPost.id)) {
                localStorage.setItem('blog_posts', JSON.stringify([...currentPosts, fixedPost]));
              }
            } catch (e) {
              console.error('Error saving to localStorage:', e);
            }
          }
          
          return fixedPost;
        }
      } else {
        console.error('Default blog posts could not be loaded synchronously');
      }
    } catch (error) {
      console.error('Error loading default blog posts synchronously:', error);
      
      // As a fallback, try dynamic import if synchronous import fails
      import('@/lib/data/blogData').then(module => {
        if (module && module.defaultBlogPosts) {
          const defaultPost = module.defaultBlogPosts.find((p: BlogPost) => 
            p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase()
          );
          
          if (defaultPost) {
            const fixedPost = {
              ...defaultPost,
              imagePath: DEFAULT_IMAGE
            };
            
            setPosts(prevPosts => {
              const newPosts = [...prevPosts];
              if (!newPosts.some(p => p.id === fixedPost.id)) {
                newPosts.push(fixedPost);
              }
              return newPosts;
            });
            
            console.log('Found post via async import, but too late to return it directly');
          }
        }
      }).catch(e => console.error('Error in fallback dynamic import:', e));
    }
    
    console.log(`Post with slug '${slug}' not found`);
    return null;
  };

  // Helper function to get category by id
  const getCategoryById = (id: string): CategoryInfo | null => {
    if (!id) return null;
    
    const category = categories.find(c => c.id === id);
    return category || null;
  };

  // Listen for storage update events from other components
  useEffect(() => {
    // First initialization - attempt to load directly from localStorage
    if (typeof window !== 'undefined' && !dataInitialized) {
      try {
        const storedPosts = localStorage.getItem('blog_posts');
        const storedCategories = localStorage.getItem('blog_categories');
        
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            // Fix image paths
            const fixedPosts = parsedPosts.map((post: BlogPost) => ({
              ...post,
              imagePath: DEFAULT_IMAGE
            }));
            
            console.log("Loaded posts from localStorage:", fixedPosts);
            setPosts(fixedPosts);
          }
        }
        
        if (storedCategories) {
          const parsedCategories = JSON.parse(storedCategories);
          if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
            console.log("Loaded categories from localStorage:", parsedCategories);
            setCategories(parsedCategories);
          }
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        // Fall back to API if localStorage fails
        fetchAllData();
      }
    }

    const handleStorageUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.key === 'blog_posts' || customEvent.detail?.key === 'blog_categories') {
        console.log('Blog data changed, refreshing...', customEvent.detail);
        fetchAllData();
      }
    };

    // Listen to localStorage changes via custom event
    window.addEventListener('storage-updated', handleStorageUpdate);
    
    // Also listen to actual localStorage changes (for cross-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'blog_posts' || e.key === 'blog_categories') {
        console.log('Blog data changed in another tab, refreshing...');
        fetchAllData();
      }
    });

    // Initial fetch
    fetchAllData();

    return () => {
      window.removeEventListener('storage-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate as any);
    };
  }, [fetchAllData]);

  return (
    <BlogDataContext.Provider 
      value={{ 
        posts, 
        categories, 
        refreshData: fetchAllData,
        isLoading,
        getPostBySlug,
        getCategoryById
      }}
    >
      {children}
    </BlogDataContext.Provider>
  );
};

export default BlogDataProvider; 