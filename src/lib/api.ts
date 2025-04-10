// This is a simulation of API calls to a database or CMS
// In a real application, this would be replaced with actual API calls

import { 
  blogPosts, 
  categories, 
  getBlogPostsByCategory, 
  getBlogPostBySlug,
  getBlogPostById, 
  getPaginatedBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createCategory,
  updateCategory,
  deleteCategory
} from './data/blogData';
import { BlogPost, Category, CategoryInfo } from './types';

// Simulate fetching delay
const SIMULATED_DELAY_MS = 100;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Blog post API methods
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await delay(SIMULATED_DELAY_MS);
  return blogPosts;
}

export async function getPaginatedPosts(page: number, limit: number): Promise<{
  posts: BlogPost[],
  totalPages: number,
  currentPage: number
}> {
  await delay(SIMULATED_DELAY_MS);
  return getPaginatedBlogPosts(page, limit);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await delay(SIMULATED_DELAY_MS);
  const post = getBlogPostBySlug(slug);
  return post || null;
}

export async function getBlogPostsForCategory(category: Category): Promise<BlogPost[]> {
  await delay(SIMULATED_DELAY_MS);
  return getBlogPostsByCategory(category);
}

export async function getFeaturedPost(): Promise<BlogPost> {
  await delay(SIMULATED_DELAY_MS);
  const featured = blogPosts.find(post => post.featured);
  return featured || blogPosts[0];
}

// New API methods for CRUD operations
export async function createPost(postData: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  await delay(SIMULATED_DELAY_MS);
  return createBlogPost(postData);
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  await delay(SIMULATED_DELAY_MS);
  return updateBlogPost(id, updates);
}

export async function deletePost(id: string): Promise<boolean> {
  await delay(SIMULATED_DELAY_MS);
  return deleteBlogPost(id);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  await delay(SIMULATED_DELAY_MS);
  const post = getBlogPostById(id);
  return post || null;
}

// Category API methods
export async function getAllCategories(): Promise<CategoryInfo[]> {
  await delay(SIMULATED_DELAY_MS);
  return categories;
}

export async function getCategory(categoryId: Category): Promise<CategoryInfo | null> {
  await delay(SIMULATED_DELAY_MS);
  const category = categories.find(cat => cat.id === categoryId);
  return category || null;
}

export async function createNewCategory(categoryData: CategoryInfo): Promise<CategoryInfo> {
  await delay(SIMULATED_DELAY_MS);
  return createCategory(categoryData);
}

export async function updateExistingCategory(id: Category, updates: Partial<CategoryInfo>): Promise<CategoryInfo | null> {
  await delay(SIMULATED_DELAY_MS);
  return updateCategory(id, updates);
}

export async function deleteExistingCategory(id: Category): Promise<boolean> {
  await delay(SIMULATED_DELAY_MS);
  return deleteCategory(id);
}

// This interface would be extended in a real application to include more functionality
// such as creating, updating, and deleting posts
export const blogAPI = {
  posts: {
    getAll: getAllBlogPosts,
    getPaginated: getPaginatedPosts,
    getBySlug: getBlogPost,
    getById: getPostById,
    getByCategory: getBlogPostsForCategory,
    getFeatured: getFeaturedPost,
    create: createPost,
    update: updatePost,
    delete: deletePost
  },
  categories: {
    getAll: getAllCategories,
    getById: getCategory,
    create: createNewCategory,
    update: updateExistingCategory,
    delete: deleteExistingCategory
  }
}; 