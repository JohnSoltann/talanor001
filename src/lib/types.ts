export type Category = 'market-analysis' | 'investment' | 'global-market' | 'education';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  date: string;
  author: string;
  content: string;
  imagePath: string;
  featured?: boolean;
}

export interface CategoryInfo {
  id: Category;
  title: string;
  description: string;
  icon: string;
} 