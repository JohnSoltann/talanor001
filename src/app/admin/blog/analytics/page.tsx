'use client';

import React, { useState, useEffect } from 'react';
import { FaEye, FaThumbsUp, FaComment, FaExclamationTriangle, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

// داده‌های نمونه آماری
interface BlogStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  avgViewsPerPost: number;
  popularPosts: {
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
  dailyViews: {
    date: string;
    views: number;
  }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  
  // داده‌های نمونه - در پروژه واقعی از API دریافت می‌شوند
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await fetch(`/api/admin/blog/stats?timeRange=${timeRange}`);
        // const data = await response.json();
        
        // Simulating API response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // دریافت داده‌های متفاوت بر اساس بازه زمانی انتخاب‌شده
        let viewsMultiplier = 1;
        switch(timeRange) {
          case '7days':
            viewsMultiplier = 0.3;
            break;
          case '30days':
            viewsMultiplier = 1;
            break;
          case '90days':
            viewsMultiplier = 3.2;
            break;
        }
        
        const mockStats: BlogStats = {
          totalViews: Math.floor(5840 * viewsMultiplier),
          totalLikes: Math.floor(347 * viewsMultiplier),
          totalComments: Math.floor(128 * viewsMultiplier),
          totalPosts: 10,
          avgViewsPerPost: Math.floor(584 * viewsMultiplier),
          popularPosts: [
            {
              id: '1',
              title: 'روند قیمت طلا در بازار جهانی',
              views: Math.floor(1245 * viewsMultiplier),
              likes: Math.floor(87 * viewsMultiplier),
              comments: Math.floor(32 * viewsMultiplier)
            },
            {
              id: '4',
              title: 'راهنمای سرمایه‌گذاری در طلا',
              views: Math.floor(980 * viewsMultiplier),
              likes: Math.floor(75 * viewsMultiplier),
              comments: Math.floor(28 * viewsMultiplier)
            },
            {
              id: '6',
              title: 'تاثیر سیاست‌های فدرال رزرو بر بازار طلا',
              views: Math.floor(856 * viewsMultiplier),
              likes: Math.floor(63 * viewsMultiplier),
              comments: Math.floor(21 * viewsMultiplier)
            },
            {
              id: '3',
              title: 'تحلیل بازار طلا در هفته گذشته',
              views: Math.floor(742 * viewsMultiplier),
              likes: Math.floor(51 * viewsMultiplier),
              comments: Math.floor(17 * viewsMultiplier)
            },
            {
              id: '2',
              title: 'افزایش تقاضای طلا در بازار جهانی',
              views: Math.floor(615 * viewsMultiplier),
              likes: Math.floor(42 * viewsMultiplier),
              comments: Math.floor(15 * viewsMultiplier)
            }
          ],
          categoryDistribution: [
            { category: 'تحلیل بازار', count: 3, percentage: 30 },
            { category: 'سرمایه‌گذاری', count: 2, percentage: 20 },
            { category: 'بازار جهانی', count: 3, percentage: 30 },
            { category: 'آموزش', count: 2, percentage: 20 }
          ],
          dailyViews: generateDailyViewsData(timeRange, viewsMultiplier)
        };
        
        setStats(mockStats);
        setError('');
      } catch (err) {
        setError('خطا در بارگیری آمار');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [timeRange]);
  
  // تولید داده‌های نمونه برای نمودار بازدید روزانه
  function generateDailyViewsData(range: string, multiplier: number) {
    let days = 30;
    
    switch(range) {
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case '90days':
        days = 90;
        break;
    }
    
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // تبدیل تاریخ به فرمت فارسی (مثال: ۱۵ فروردین)
      const formattedDate = `${days - i} روز پیش`;
      
      // مقدار تصادفی بین 100 تا 300 با نوسان نسبی
      const baseViews = Math.floor(100 + Math.random() * 200);
      const views = Math.floor(baseViews * multiplier);
      
      data.push({ date: formattedDate, views });
    }
    
    return data;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">آمار و تحلیل بلاگ</h1>
        
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm rounded-r ${timeRange === '7days' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('7days')}
          >
            ۷ روز
          </button>
          <button
            className={`px-4 py-2 text-sm ${timeRange === '30days' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('30days')}
          >
            ۳۰ روز
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-l ${timeRange === '90days' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTimeRange('90days')}
          >
            ۹۰ روز
          </button>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-blue-600 border-e-transparent"></div>
          <p className="mt-2">در حال بارگذاری...</p>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">بازدید کل</p>
                  <h2 className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</h2>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaEye className="text-blue-500" size={20} />
                </div>
              </div>
              <p className="text-sm text-green-500 mt-2">
                میانگین بازدید هر پست: {stats.avgViewsPerPost.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">لایک‌ها</p>
                  <h2 className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</h2>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaThumbsUp className="text-red-500" size={20} />
                </div>
              </div>
              <p className="text-sm text-green-500 mt-2">
                میانگین لایک هر پست: {Math.floor(stats.totalLikes / stats.totalPosts).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">نظرات</p>
                  <h2 className="text-3xl font-bold">{stats.totalComments.toLocaleString()}</h2>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaComment className="text-yellow-500" size={20} />
                </div>
              </div>
              <p className="text-sm text-green-500 mt-2">
                میانگین نظر هر پست: {Math.floor(stats.totalComments / stats.totalPosts).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">تعداد پست‌ها</p>
                  <h2 className="text-3xl font-bold">{stats.totalPosts.toLocaleString()}</h2>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaChartLine className="text-purple-500" size={20} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                در {stats.categoryDistribution.length} دسته‌بندی
              </p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Views Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <FaChartLine className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold">نمودار بازدید روزانه</h3>
              </div>
              
              <div className="h-80">
                <div className="h-full flex items-end space-x-2">
                  {stats.dailyViews.map((day, index) => {
                    const heightPercentage = (day.views / Math.max(...stats.dailyViews.map(d => d.views))) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex justify-center">
                          <div 
                            className="w-full bg-blue-400 hover:bg-blue-500 rounded-t transition-all cursor-pointer relative group"
                            style={{ height: `${heightPercentage}%` }}
                          >
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.views.toLocaleString()} بازدید
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 whitespace-nowrap rotate-45 origin-left transform translate-x-2">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Category Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <FaChartPie className="text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold">توزیع دسته‌بندی‌ها</h3>
              </div>
              
              <div className="space-y-4">
                {stats.categoryDistribution.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{category.category}</span>
                      <span className="text-sm text-gray-500">{category.count} پست ({category.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          index % 4 === 0 ? 'bg-blue-500' : 
                          index % 4 === 1 ? 'bg-purple-500' : 
                          index % 4 === 2 ? 'bg-green-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Popular Posts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-6">
              <FaChartBar className="text-green-500 mr-2" />
              <h3 className="text-lg font-semibold">پرطرفدارترین پست‌ها</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">عنوان</th>
                    <th className="text-center py-3 px-4">بازدید</th>
                    <th className="text-center py-3 px-4">لایک</th>
                    <th className="text-center py-3 px-4">نظرات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.popularPosts.map((post, index) => (
                    <tr key={post.id} className={index < stats.popularPosts.length - 1 ? 'border-b' : ''}>
                      <td className="py-3 px-4">
                        <a href={`/blog/${post.id}`} className="text-blue-600 hover:underline" target="_blank">
                          {post.title}
                        </a>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaEye className="text-blue-500 mr-1" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaThumbsUp className="text-red-500 mr-1" />
                          <span>{post.likes.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaComment className="text-yellow-500 mr-1" />
                          <span>{post.comments.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 