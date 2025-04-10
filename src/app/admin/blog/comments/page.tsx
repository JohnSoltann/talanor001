'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// تعریف مدل داده برای نظرات
interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  postId: string;
  postTitle: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Mock data for comments - در پروژه واقعی این داده‌ها از API دریافت می‌شوند
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/admin/comments');
        // const data = await response.json();
        
        // Simulating API response with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockComments: Comment[] = [
          {
            id: '1',
            author: 'علی محمدی',
            email: 'ali@example.com',
            content: 'مقاله بسیار مفیدی بود. ممنون از اطلاعات ارزشمندی که ارائه کردید.',
            postId: '1',
            postTitle: 'روند قیمت طلا در بازار جهانی',
            date: '۱۵ فروردین ۱۴۰۳',
            status: 'approved'
          },
          {
            id: '2',
            author: 'سارا احمدی',
            email: 'sara@example.com',
            content: 'آیا می‌توانید در مورد تاثیر نوسانات ارزی بر قیمت طلا هم مطلبی منتشر کنید؟',
            postId: '1',
            postTitle: 'روند قیمت طلا در بازار جهانی',
            date: '۱۶ فروردین ۱۴۰۳',
            status: 'pending'
          },
          {
            id: '3',
            author: 'محمد کریمی',
            email: 'mohamad@example.com',
            content: 'با سپاس از مقاله خوبتان. منابع استفاده شده در این مقاله چیست؟',
            postId: '3',
            postTitle: 'تحلیل بازار طلا در هفته گذشته',
            date: '۱۷ فروردین ۱۴۰۳',
            status: 'pending'
          },
          {
            id: '4',
            author: 'زهرا محمدی',
            email: 'zahra@example.com',
            content: 'محتوای نامناسب که باید رد شود.',
            postId: '4',
            postTitle: 'راهنمای سرمایه‌گذاری در طلا',
            date: '۱۸ فروردین ۱۴۰۳',
            status: 'rejected'
          }
        ];
        
        setComments(mockComments);
        setError('');
      } catch (err) {
        setError('خطا در بارگیری نظرات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, []);
  
  // فیلتر کردن نظرات براساس وضعیت
  const filteredComments = comments.filter(comment => {
    if (activeTab === 'all') return true;
    return comment.status === activeTab;
  });
  
  // تغییر وضعیت نظر
  const handleChangeStatus = async (commentId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // In a real app, you would call an API to update the comment status
      // await fetch(`/api/admin/comments/${commentId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // Update local state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: newStatus } 
            : comment
        )
      );
      
      toast.success(
        newStatus === 'approved' 
          ? 'نظر با موفقیت تایید شد' 
          : 'نظر با موفقیت رد شد'
      );
    } catch (err) {
      console.error('Error updating comment status:', err);
      toast.error('خطا در بروزرسانی وضعیت نظر');
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت نظرات</h1>
      
      {/* Tab navigation */}
      <div className="mb-6">
        <nav className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            همه نظرات ({comments.length})
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            در انتظار بررسی ({comments.filter(c => c.status === 'pending').length})
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('approved')}
          >
            تایید شده ({comments.filter(c => c.status === 'approved').length})
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rejected')}
          >
            رد شده ({comments.filter(c => c.status === 'rejected').length})
          </button>
        </nav>
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
      ) : (
        /* Comments list */
        <div className="space-y-6">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div key={comment.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{comment.author}</h3>
                    <p className="text-sm text-gray-500">{comment.email}</p>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      comment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {
                        comment.status === 'approved' ? 'تایید شده' :
                        comment.status === 'rejected' ? 'رد شده' : 
                        'در انتظار بررسی'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                
                <div className="mb-4 text-sm">
                  <span className="text-gray-500">پست: </span>
                  <a href={`/blog/${comment.postId}`} target="_blank" className="text-blue-500 hover:underline">
                    {comment.postTitle}
                  </a>
                </div>
                
                <div className="flex justify-end space-x-2">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleChangeStatus(comment.id, 'approved')}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm ml-2"
                    >
                      <FaCheckCircle size={14} />
                      <span>تایید</span>
                    </button>
                  )}
                  
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleChangeStatus(comment.id, 'rejected')}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaTimesCircle size={14} />
                      <span>رد</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? 'هیچ نظری یافت نشد'
                  : activeTab === 'pending'
                  ? 'هیچ نظری در انتظار بررسی نیست'
                  : activeTab === 'approved'
                  ? 'هیچ نظر تایید شده‌ای وجود ندارد'
                  : 'هیچ نظر رد شده‌ای وجود ندارد'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 