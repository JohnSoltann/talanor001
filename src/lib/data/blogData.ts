import { BlogPost, Category, CategoryInfo } from "../types";

// Load data from localStorage or use default if not available
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log(`Successfully loaded ${parsedData.length} items from ${key}`);
          return parsedData as T;
        } else {
          console.log(`Invalid data structure in ${key}, using defaults`);
          return defaultValue;
        }
      } catch (e) {
        console.error('Failed to parse stored data:', e);
        // Clear localStorage on parsing error
        localStorage.removeItem(key);
        return defaultValue;
      }
    }
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
  
  return defaultValue;
};

// Save data to localStorage and dispatch event
const saveToStorage = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  
  // Store data in localStorage
  try {
    // Check if data is valid
    if (Array.isArray(data) && data.length === 0) {
      console.warn(`Attempting to save empty array to ${key}, skipping`);
      return;
    }
    
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data saved to ${key}:`, Array.isArray(data) ? `${data.length} items` : 'object');
    
    // Dispatch a custom event to notify other components of data changes
    const event = new CustomEvent('storage-updated', { detail: { key, data } });
    window.dispatchEvent(event);
  } catch (error) {
    console.error(`Error saving to ${key}:`, error);
  }
};

// Default placeholder image - now using our newly generated SVG
const DEFAULT_IMAGE = '/images/gold-hero.svg';

// Default category information
const defaultCategories: CategoryInfo[] = [
  {
    id: 'market-analysis',
    title: 'تحلیل بازار',
    description: 'تحلیل‌های تخصصی بازار طلا',
    icon: 'FaChartLine'
  },
  {
    id: 'investment',
    title: 'سرمایه‌گذاری',
    description: 'راهنمای سرمایه‌گذاری در طلا',
    icon: 'FaCoins'
  },
  {
    id: 'global-market',
    title: 'بازار جهانی',
    description: 'اخبار و تحلیل بازار جهانی',
    icon: 'FaGlobe'
  },
  {
    id: 'education',
    title: 'آموزش',
    description: 'مقالات آموزشی طلا',
    icon: 'FaBook'
  }
];

// Default blog posts data - updated with different SVG images for variety
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'روند قیمت طلا در بازار جهانی',
    slug: 'gold-price-trends',
    description: 'تحلیل جامع از عوامل موثر بر قیمت طلا در بازار جهانی و پیش‌بینی روند آینده',
    category: 'market-analysis',
    date: '۲۵ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-hero.svg',
    featured: true,
    content: `
      <p>
        قیمت طلا در بازار جهانی همواره تحت تأثیر عوامل مختلفی قرار دارد که شناخت آنها برای سرمایه‌گذاران و علاقه‌مندان به این فلز گرانبها ضروری است. در این مقاله، به بررسی روند قیمت طلا در بازار جهانی و عوامل تأثیرگذار بر آن می‌پردازیم.
      </p>

      <h2>عوامل موثر بر قیمت طلا</h2>
      <p>
        قیمت طلا در بازار جهانی تحت تأثیر عوامل متعددی قرار دارد که مهمترین آنها عبارتند از:
      </p>
      <ul>
        <li>
          <strong>نرخ تورم:</strong> طلا به عنوان یک پناهگاه امن در برابر تورم شناخته می‌شود و افزایش نرخ تورم معمولاً به افزایش قیمت طلا منجر می‌شود.
        </li>
        <li>
          <strong>نرخ بهره:</strong> افزایش نرخ بهره معمولاً باعث کاهش جذابیت طلا می‌شود، زیرا سرمایه‌گذاران به سمت دارایی‌های با درآمد ثابت روی می‌آورند.
        </li>
        <li>
          <strong>ارزش دلار:</strong> از آنجا که قیمت طلا در بازار جهانی به دلار آمریکا تعیین می‌شود، تغییرات ارزش دلار تأثیر مستقیمی بر قیمت طلا دارد.
        </li>
        <li>
          <strong>تنش‌های ژئوپلیتیکی:</strong> در دوران بی‌ثباتی سیاسی و اقتصادی، سرمایه‌گذاران به سمت طلا به عنوان یک پناهگاه امن روی می‌آورند.
        </li>
      </ul>

      <h2>روند قیمت طلا در سال جاری</h2>
      <p>
        در سال جاری، قیمت طلا در بازار جهانی با نوسانات زیادی همراه بوده است. در ابتدای سال، قیمت طلا با افزایش تورم جهانی و تنش‌های ژئوپلیتیکی روند صعودی داشت، اما با افزایش نرخ بهره توسط بانک‌های مرکزی جهان، قیمت طلا با کاهش مواجه شد.
      </p>

      <h2>پیش‌بینی روند آینده قیمت طلا</h2>
      <p>
        پیش‌بینی دقیق قیمت طلا کار دشواری است، اما با توجه به روند فعلی اقتصاد جهانی و سیاست‌های پولی بانک‌های مرکزی، کارشناسان معتقدند که قیمت طلا در میان‌مدت و بلندمدت پتانسیل رشد دارد. با این حال، سرمایه‌گذاران باید همواره به تغییرات اقتصادی و سیاسی جهان توجه داشته باشند.
      </p>

      <h2>نتیجه‌گیری</h2>
      <p>
        طلا همواره به عنوان یک دارایی ارزشمند و پناهگاه امن در سبد سرمایه‌گذاری افراد جایگاه ویژه‌ای داشته است. با شناخت عوامل موثر بر قیمت طلا و رصد تغییرات اقتصادی و سیاسی جهان، سرمایه‌گذاران می‌توانند تصمیمات آگاهانه‌تری در خصوص سرمایه‌گذاری در این فلز گرانبها اتخاذ کنند.
      </p>
    `
  },
  {
    id: '2',
    title: 'افزایش تقاضای طلا در بازار جهانی',
    slug: 'gold-demand-increase',
    description: 'گزارش جدید از افزایش تقاضای طلا در بازارهای جهانی و تاثیر آن بر قیمت‌ها',
    category: 'global-market',
    date: '۲۵ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news1.svg',
    content: `
      <p>
        اخیراً گزارش‌های متعددی از افزایش تقاضای طلا در بازارهای جهانی منتشر شده است که می‌تواند تأثیر قابل توجهی بر قیمت‌های این فلز گرانبها داشته باشد. در این مقاله، به بررسی دلایل این افزایش تقاضا و تأثیر آن بر بازار طلا می‌پردازیم.
      </p>

      <h2>دلایل افزایش تقاضای طلا</h2>
      <p>
        افزایش تقاضای طلا در بازارهای جهانی به دلایل متعددی رخ داده است که مهمترین آنها عبارتند از:
      </p>
      <ul>
        <li>
          <strong>نگرانی‌های تورمی:</strong> با افزایش نرخ تورم در اقتصادهای بزرگ جهان، سرمایه‌گذاران به دنبال دارایی‌هایی هستند که ارزش خود را در برابر تورم حفظ کنند.
        </li>
        <li>
          <strong>کاهش ارزش دلار:</strong> ضعیف شدن ارزش دلار آمریکا در بازارهای جهانی منجر به افزایش جذابیت طلا به عنوان یک دارایی جایگزین شده است.
        </li>
        <li>
          <strong>تنش‌های ژئوپلیتیکی:</strong> افزایش تنش‌های سیاسی و اقتصادی در نقاط مختلف جهان، تقاضا برای طلا به عنوان یک پناهگاه امن را افزایش داده است.
        </li>
        <li>
          <strong>رشد تقاضای بانک‌های مرکزی:</strong> بانک‌های مرکزی کشورهای مختلف به منظور متنوع‌سازی ذخایر ارزی خود، خرید طلا را افزایش داده‌اند.
        </li>
      </ul>
    `
  },
  {
    id: '3',
    title: 'تحلیل بازار طلا در هفته گذشته',
    slug: 'weekly-gold-analysis',
    description: 'بررسی عملکرد بازار طلا در هفته گذشته و عوامل موثر بر نوسانات قیمت',
    category: 'market-analysis',
    date: '۲۴ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news2.svg',
    content: `
      <p>
        هفته گذشته، بازار طلا شاهد نوسانات قابل توجهی بود که تحت تاثیر عوامل مختلف اقتصادی و سیاسی قرار داشت. در این مقاله، به بررسی عملکرد بازار طلا در هفته گذشته و عوامل موثر بر نوسانات قیمت می‌پردازیم.
      </p>

      <h2>خلاصه تغییرات قیمت طلا</h2>
      <p>
        در هفته گذشته، قیمت طلا در بازارهای جهانی با نوساناتی همراه بود. این فلز گرانبها هفته را با قیمت X دلار برای هر اونس آغاز کرد و در پایان هفته به قیمت Y دلار رسید. این تغییرات معادل Z درصد افزایش/کاهش در طول هفته بود.
      </p>
    `
  },
  {
    id: '4',
    title: 'راهنمای سرمایه‌گذاری در طلا',
    slug: 'gold-investment-guide',
    description: 'راهنمای جامع برای سرمایه‌گذاری در طلا و طلای آب‌شده',
    category: 'investment',
    date: '۲۳ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news3.svg',
    content: `
      <p>
        سرمایه‌گذاری در طلا از دیرباز یکی از گزینه‌های مورد علاقه سرمایه‌گذاران برای حفظ ارزش دارایی‌هایشان بوده است. در این راهنما، به بررسی روش‌های مختلف سرمایه‌گذاری در طلا، مزایا و معایب هر کدام، و نکات مهمی که سرمایه‌گذاران باید به آنها توجه کنند، می‌پردازیم.
      </p>

      <h2>چرا سرمایه‌گذاری در طلا؟</h2>
      <p>
        قبل از پرداختن به روش‌های سرمایه‌گذاری در طلا، بهتر است ابتدا بدانیم چرا طلا یک گزینه مناسب برای سرمایه‌گذاری است:
      </p>
    `
  },
  {
    id: '5',
    title: 'تاثیر نرخ بهره بانکی بر قیمت طلا',
    slug: 'interest-rate-impact',
    description: 'بررسی رابطه میان نرخ بهره بانکی و قیمت طلا در بازارهای جهانی',
    category: 'market-analysis',
    date: '۲۲ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news4.svg',
    content: `
      <p>
        نرخ بهره بانکی می‌تواند تأثیر قابل توجهی بر قیمت طلا داشته باشد. در این مقاله، به بررسی رابطه میان نرخ بهره بانکی و قیمت طلا می‌پردازیم.
      </p>

      <h2>رابطه نرخ بهره و قیمت طلا</h2>
      <p>
        یکی از مهم‌ترین ابزارهای سیاست پولی فدرال رزرو، تغییر نرخ بهره است. معمولاً، افزایش نرخ بهره منجر به کاهش قیمت طلا می‌شود، زیرا افزایش نرخ بهره هزینه فرصت نگهداری طلا را افزایش می‌دهد.
      </p>
    `
  },
  {
    id: '6',
    title: 'سرمایه‌گذاری در سکه یا طلای آبشده؟',
    slug: 'coin-vs-melted-gold',
    description: 'مقایسه جامع سرمایه‌گذاری در سکه و طلای آبشده - کدام گزینه برای شما مناسب‌تر است؟',
    category: 'investment',
    date: '۲۱ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news5.svg',
    content: `
      <p>
        سرمایه‌گذاری در سکه یا طلای آبشده؟ این انتخاب به عوامل مختلفی بستگی دارد، از جمله اهداف سرمایه‌گذاری، سطح خطر، و طول زمان سرمایه‌گذاری. در این مقاله، مزایا و معایب هر دو گزینه را بررسی می‌کنیم و به شما کمک می‌کنیم تا بهترین انتخاب را برای سرمایه‌گذاری خود انتخاب کنید.
      </p>
    `
  },
  {
    id: '7',
    title: 'پیش‌بینی قیمت جهانی طلا در سال ۲۰۲۴',
    slug: 'gold-price-prediction-2024',
    description: 'تحلیل و پیش‌بینی روند قیمت طلا در بازارهای جهانی در سال ۲۰۲۴',
    category: 'global-market',
    date: '۲۰ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news1.svg',
    content: `
      <p>
        پیش‌بینی قیمت جهانی طلا در سال ۲۰۲۴ به عنوان یک سرمایه‌گذاری بلندمدت، بسیار مهم است. در این مقاله، به بررسی تحلیل و پیش‌بینی روند قیمت طلا در بازارهای جهانی در سال ۲۰۲۴ می‌پردازیم.
      </p>
    `
  },
  {
    id: '8',
    title: 'تشخیص طلای اصل از بدل',
    slug: 'identifying-real-gold',
    description: 'روش‌های کاربردی برای تشخیص طلای اصل از بدل',
    category: 'education',
    date: '۱۹ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news2.svg',
    content: `
      <p>
        تشخیص طلای اصل از بدل یکی از مهارت‌های ضروری برای خریداران طلا است. در این مقاله، روش‌های ساده و کاربردی برای تشخیص طلای اصل از بدل را بررسی می‌کنیم.
      </p>
    `
  },
  {
    id: '9',
    title: 'بررسی بازار طلا در کشورهای خاورمیانه',
    slug: 'middle-east-gold-market',
    description: 'تحلیل وضعیت بازار طلا در کشورهای خاورمیانه و مقایسه با بازار جهانی',
    category: 'global-market',
    date: '۱۸ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news3.svg',
    content: `
      <p>
        بازار طلا در کشورهای خاورمیانه از اهمیت ویژه‌ای برخوردار است. در این مقاله، به بررسی وضعیت بازار طلا در کشورهای مختلف خاورمیانه و مقایسه آن با بازار جهانی می‌پردازیم.
      </p>
    `
  },
  {
    id: '10',
    title: 'چگونه از طلا و جواهرات خود مراقبت کنیم',
    slug: 'jewelry-care-guide',
    description: 'راهنمای مراقبت از طلا و جواهرات برای افزایش طول عمر و حفظ زیبایی آنها',
    category: 'education',
    date: '۱۷ فروردین ۱۴۰۳',
    author: 'تیم کارشناسان طلانوز',
    imagePath: '/images/gold-news4.svg',
    content: `
      <p>
        مراقبت صحیح از طلا و جواهرات می‌تواند طول عمر و زیبایی آنها را افزایش دهد. در این مقاله، نکات مهم در مراقبت از طلا و جواهرات را بررسی می‌کنیم.
      </p>
    `
  }
];

// Make defaultBlogPosts available for import
export { defaultBlogPosts, defaultCategories };

// Initialize blog posts from localStorage or use default
export let blogPosts: BlogPost[] = loadFromStorage('blog_posts', defaultBlogPosts);

// Export as variables (will be synced with localStorage)
export let categories: CategoryInfo[] = loadFromStorage('blog_categories', defaultCategories);

// If data is empty, use defaults
if (blogPosts.length === 0) {
  console.log('No blog posts found in localStorage, using defaults');
  blogPosts = [...defaultBlogPosts];
  saveToStorage('blog_posts', blogPosts);
}

if (categories.length === 0) {
  console.log('No categories found in localStorage, using defaults');
  categories = [...defaultCategories];
  saveToStorage('blog_categories', categories);
}

// Fix image paths if they still reference old deleted images
blogPosts = blogPosts.map(post => {
  if (post.imagePath && post.imagePath.includes('/images/blog/')) {
    console.log(`Fixing image path for post: ${post.title}`);
    return { ...post, imagePath: DEFAULT_IMAGE };
  }
  return post;
});
saveToStorage('blog_posts', blogPosts);

// CRUD operations for blog posts
export function createBlogPost(post: Omit<BlogPost, 'id'>): BlogPost {
  const newPost = {
    ...post,
    id: Date.now().toString(), // Generate unique ID
  };
  
  blogPosts = [...blogPosts, newPost];
  saveToStorage('blog_posts', blogPosts);
  return newPost;
}

export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const postIndex = blogPosts.findIndex(post => post.id === id);
  if (postIndex === -1) return null;
  
  // Ensure all fields are updated
  console.log("Updating post:", updates);
  
  const updatedPost = { ...blogPosts[postIndex], ...updates };
  blogPosts = blogPosts.map(post => post.id === id ? updatedPost : post);
  
  // Make sure to save to localStorage immediately
  console.log("Saving updated blogPosts to localStorage", blogPosts.length);
  saveToStorage('blog_posts', blogPosts);
  
  // Dispatch a custom event to notify other components of data changes
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('storage-updated', { 
      detail: { key: 'blog_posts', data: blogPosts } 
    });
    window.dispatchEvent(event);
    console.log('Dispatched storage-updated event for blog_posts');
  }
  
  return updatedPost;
}

export function deleteBlogPost(id: string): boolean {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(post => post.id !== id);
  saveToStorage('blog_posts', blogPosts);
  return blogPosts.length < initialLength;
}

// CRUD operations for categories
export function createCategory(category: CategoryInfo): CategoryInfo {
  categories = [...categories, category];
  saveToStorage('blog_categories', categories);
  return category;
}

export function updateCategory(id: Category, updates: Partial<CategoryInfo>): CategoryInfo | null {
  const categoryIndex = categories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) return null;
  
  const updatedCategory = { ...categories[categoryIndex], ...updates };
  categories = categories.map(cat => cat.id === id ? updatedCategory : cat);
  saveToStorage('blog_categories', categories);
  return updatedCategory;
}

export function deleteCategory(id: Category): boolean {
  const initialLength = categories.length;
  categories = categories.filter(cat => cat.id !== id);
  saveToStorage('blog_categories', categories);
  return categories.length < initialLength;
}

// Helper function to get blog posts by category
export function getBlogPostsByCategory(category: Category): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

// Helper function to get category information by ID
export function getCategoryById(categoryId: Category): CategoryInfo | undefined {
  return categories.find(category => category.id === categoryId);
}

// Helper function to get a blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to get a blog post by ID
export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

// Helper function to get paginated blog posts
export function getPaginatedBlogPosts(page: number, limit: number): {
  posts: BlogPost[],
  totalPages: number,
  currentPage: number
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = blogPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    totalPages: Math.ceil(blogPosts.length / limit),
    currentPage: page
  };
} 