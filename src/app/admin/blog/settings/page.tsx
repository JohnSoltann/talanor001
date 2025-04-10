'use client';

import React, { useState } from 'react';
import { FaSave, FaCog, FaShareAlt, FaSearch, FaComments, FaRss } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// مدل داده تنظیمات بلاگ
interface BlogSettings {
  general: {
    postsPerPage: number;
    showAuthor: boolean;
    showDate: boolean;
    showFeaturedImage: boolean;
    defaultCategory: string;
  };
  comments: {
    enableComments: boolean;
    moderateComments: boolean;
    allowGuestComments: boolean;
    notifyOnNewComment: boolean;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    defaultKeywords: string;
    generateSitemap: boolean;
    canonicalUrl: string;
  };
  social: {
    shareButtons: boolean;
    platforms: {
      twitter: boolean;
      facebook: boolean;
      linkedin: boolean;
      telegram: boolean;
    };
  };
}

export default function SettingsPage() {
  // تنظیمات پیش‌فرض
  const [settings, setSettings] = useState<BlogSettings>({
    general: {
      postsPerPage: 5,
      showAuthor: true,
      showDate: true,
      showFeaturedImage: true,
      defaultCategory: 'market-analysis',
    },
    comments: {
      enableComments: true,
      moderateComments: true,
      allowGuestComments: false,
      notifyOnNewComment: true,
    },
    seo: {
      siteTitle: 'بلاگ طلا | اخبار و مقالات طلا',
      siteDescription: 'آخرین اخبار و مقالات در مورد بازار طلا، سرمایه‌گذاری و تحلیل قیمت طلا',
      defaultKeywords: 'طلا، بازار طلا، سرمایه‌گذاری، سکه، قیمت طلا',
      generateSitemap: true,
      canonicalUrl: 'https://example.com/blog',
    },
    social: {
      shareButtons: true,
      platforms: {
        twitter: true,
        facebook: true,
        linkedin: true,
        telegram: true,
      },
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'comments' | 'seo' | 'social'>('general');
  
  // تغییر مقادیر تنظیمات عددی
  const handleNumberChange = (section: keyof BlogSettings, field: string, value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) || value === '') {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value === '' ? '' : numberValue,
        },
      }));
    }
  };
  
  // تغییر مقادیر تنظیمات متنی
  const handleTextChange = (section: keyof BlogSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  
  // تغییر مقادیر بولین
  const handleBooleanChange = (section: keyof BlogSettings, field: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked,
      },
    }));
  };
  
  // تغییر پلتفرم‌های اشتراک‌گذاری
  const handleSocialPlatformChange = (platform: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      social: {
        ...prev.social,
        platforms: {
          ...prev.social.platforms,
          [platform]: checked,
        },
      },
    }));
  };
  
  // ذخیره تنظیمات
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // در حالت واقعی اینجا یک درخواست API به سرور ارسال می‌شود
      // await fetch('/api/admin/blog/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // شبیه‌سازی تأخیر درخواست
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تنظیمات بلاگ</h1>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent"></div>
              در حال ذخیره...
            </>
          ) : (
            <>
              <FaSave /> ذخیره تنظیمات
            </>
          )}
        </button>
      </div>
      
      {/* تب‌های تنظیمات */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'general' ? 'bg-gray-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaCog /> عمومی
          </button>
          <button
            className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'comments' ? 'bg-gray-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <FaComments /> نظرات
          </button>
          <button
            className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'seo' ? 'bg-gray-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <FaSearch /> سئو
          </button>
          <button
            className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'social' ? 'bg-gray-100 border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <FaShareAlt /> شبکه‌های اجتماعی
          </button>
        </div>
        
        {/* محتوای تنظیمات عمومی */}
        {activeTab === 'general' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">تنظیمات عمومی بلاگ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postsPerPage">
                    تعداد پست در هر صفحه
                  </label>
                  <input
                    type="number"
                    id="postsPerPage"
                    value={settings.general.postsPerPage}
                    onChange={(e) => handleNumberChange('general', 'postsPerPage', e.target.value)}
                    min="1"
                    max="50"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="defaultCategory">
                    دسته‌بندی پیش‌فرض
                  </label>
                  <select
                    id="defaultCategory"
                    value={settings.general.defaultCategory}
                    onChange={(e) => handleTextChange('general', 'defaultCategory', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="market-analysis">تحلیل بازار</option>
                    <option value="investment">سرمایه‌گذاری</option>
                    <option value="global-market">بازار جهانی</option>
                    <option value="education">آموزش</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.showAuthor}
                      onChange={(e) => handleBooleanChange('general', 'showAuthor', e.target.checked)}
                      className="ml-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">نمایش نام نویسنده</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.showDate}
                      onChange={(e) => handleBooleanChange('general', 'showDate', e.target.checked)}
                      className="ml-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">نمایش تاریخ انتشار</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.showFeaturedImage}
                      onChange={(e) => handleBooleanChange('general', 'showFeaturedImage', e.target.checked)}
                      className="ml-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">نمایش تصویر شاخص</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* محتوای تنظیمات نظرات */}
        {activeTab === 'comments' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">تنظیمات نظرات</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.comments.enableComments}
                    onChange={(e) => handleBooleanChange('comments', 'enableComments', e.target.checked)}
                    className="ml-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">فعال‌سازی نظرات</span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  با غیرفعال کردن این گزینه، امکان ارسال نظرات جدید غیرفعال می‌شود.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.comments.moderateComments}
                    onChange={(e) => handleBooleanChange('comments', 'moderateComments', e.target.checked)}
                    className="ml-2"
                    disabled={!settings.comments.enableComments}
                  />
                  <span className={`text-sm font-bold ${settings.comments.enableComments ? 'text-gray-700' : 'text-gray-400'}`}>
                    بررسی نظرات قبل از انتشار
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  نظرات ارسال شده باید قبل از نمایش در سایت توسط مدیر تایید شوند.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.comments.allowGuestComments}
                    onChange={(e) => handleBooleanChange('comments', 'allowGuestComments', e.target.checked)}
                    className="ml-2"
                    disabled={!settings.comments.enableComments}
                  />
                  <span className={`text-sm font-bold ${settings.comments.enableComments ? 'text-gray-700' : 'text-gray-400'}`}>
                    اجازه نظردهی به کاربران مهمان
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  کاربران بدون ثبت‌نام می‌توانند نظر دهند.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.comments.notifyOnNewComment}
                    onChange={(e) => handleBooleanChange('comments', 'notifyOnNewComment', e.target.checked)}
                    className="ml-2"
                    disabled={!settings.comments.enableComments}
                  />
                  <span className={`text-sm font-bold ${settings.comments.enableComments ? 'text-gray-700' : 'text-gray-400'}`}>
                    اطلاع‌رسانی نظرات جدید
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  ارسال ایمیل به مدیر هنگام دریافت نظر جدید.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* محتوای تنظیمات سئو */}
        {activeTab === 'seo' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">تنظیمات سئو</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteTitle">
                  عنوان سایت
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  value={settings.seo.siteTitle}
                  onChange={(e) => handleTextChange('seo', 'siteTitle', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteDescription">
                  توضیحات سایت
                </label>
                <textarea
                  id="siteDescription"
                  value={settings.seo.siteDescription}
                  onChange={(e) => handleTextChange('seo', 'siteDescription', e.target.value)}
                  rows={3}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-1">
                  این متن به عنوان توضیحات متا در صفحات بلاگ استفاده می‌شود.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="defaultKeywords">
                  کلمات کلیدی پیش‌فرض
                </label>
                <input
                  type="text"
                  id="defaultKeywords"
                  value={settings.seo.defaultKeywords}
                  onChange={(e) => handleTextChange('seo', 'defaultKeywords', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-sm text-gray-500 mt-1">
                  کلمات کلیدی را با کاما (،) از هم جدا کنید.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="canonicalUrl">
                  آدرس کانونیکال (Canonical URL)
                </label>
                <input
                  type="text"
                  id="canonicalUrl"
                  value={settings.seo.canonicalUrl}
                  onChange={(e) => handleTextChange('seo', 'canonicalUrl', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.seo.generateSitemap}
                    onChange={(e) => handleBooleanChange('seo', 'generateSitemap', e.target.checked)}
                    className="ml-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">ایجاد خودکار نقشه سایت (Sitemap)</span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  نقشه سایت XML به صورت خودکار برای صفحات بلاگ ایجاد و بروزرسانی شود.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* محتوای تنظیمات شبکه‌های اجتماعی */}
        {activeTab === 'social' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">تنظیمات شبکه‌های اجتماعی</h2>
            
            <div className="space-y-6">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.social.shareButtons}
                    onChange={(e) => handleBooleanChange('social', 'shareButtons', e.target.checked)}
                    className="ml-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">نمایش دکمه‌های اشتراک‌گذاری</span>
                </label>
                <p className="text-sm text-gray-500 mt-1 mr-6">
                  دکمه‌های اشتراک‌گذاری در صفحات پست‌ها نمایش داده شوند.
                </p>
              </div>
              
              <div className={settings.social.shareButtons ? '' : 'opacity-50'}>
                <h3 className="text-lg font-medium mb-4">پلتفرم‌های اشتراک‌گذاری</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.social.platforms.twitter}
                        onChange={(e) => handleSocialPlatformChange('twitter', e.target.checked)}
                        className="ml-2"
                        disabled={!settings.social.shareButtons}
                      />
                      <span className={`text-sm font-bold ${settings.social.shareButtons ? 'text-gray-700' : 'text-gray-400'}`}>
                        توییتر
                      </span>
                    </label>
                  </div>
                  
                  <div className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.social.platforms.facebook}
                        onChange={(e) => handleSocialPlatformChange('facebook', e.target.checked)}
                        className="ml-2"
                        disabled={!settings.social.shareButtons}
                      />
                      <span className={`text-sm font-bold ${settings.social.shareButtons ? 'text-gray-700' : 'text-gray-400'}`}>
                        فیسبوک
                      </span>
                    </label>
                  </div>
                  
                  <div className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.social.platforms.linkedin}
                        onChange={(e) => handleSocialPlatformChange('linkedin', e.target.checked)}
                        className="ml-2"
                        disabled={!settings.social.shareButtons}
                      />
                      <span className={`text-sm font-bold ${settings.social.shareButtons ? 'text-gray-700' : 'text-gray-400'}`}>
                        لینکدین
                      </span>
                    </label>
                  </div>
                  
                  <div className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.social.platforms.telegram}
                        onChange={(e) => handleSocialPlatformChange('telegram', e.target.checked)}
                        className="ml-2"
                        disabled={!settings.social.shareButtons}
                      />
                      <span className={`text-sm font-bold ${settings.social.shareButtons ? 'text-gray-700' : 'text-gray-400'}`}>
                        تلگرام
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">فید RSS</h3>
                
                <div className="flex items-center bg-gray-100 p-3 rounded">
                  <FaRss className="text-orange-500 ml-2" />
                  <input
                    type="text"
                    value="https://example.com/blog/feed"
                    readOnly
                    className="bg-transparent flex-1 outline-none text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://example.com/blog/feed');
                      toast.success('آدرس فید RSS کپی شد');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm py-1 px-2 bg-blue-50 rounded"
                  >
                    کپی
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 