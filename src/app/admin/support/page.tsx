'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  BsCheck2Circle,
  BsChatDots,
  BsXCircle,
  BsSend,
  BsFilter,
  BsChevronLeft,
  BsPerson,
  BsCalendar,
  BsEnvelope,
  BsPhone
} from 'react-icons/bs';

interface Message {
  id: number;
  content: string;
  isFromUser: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Chat {
  id: number;
  userId: number | null;
  user: User | null;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'closed';
  messages: Message[];
  _count: { messages: number };
  phone?: string;
  guestName?: string;
}

enum ChatType {
  ALL = 'all',
  USER = 'user',
  GUEST = 'guest'
}

export default function AdminSupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ChatType>(ChatType.ALL);
  
  // بررسی وضعیت ورود کاربر
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
      toast.error('شما دسترسی ادمین ندارید');
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchChats();
    }
  }, [status, session, router]);
  
  // دریافت چت‌ها با اعمال فیلترها
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/chats?status=${statusFilter}&type=${typeFilter}`);
      setChats(response.data);
      
      // اگر چت انتخاب شده فعلی در لیست جدید نیست، انتخاب را پاک کن
      if (selectedChat && !response.data.find((c: Chat) => c.id === selectedChat.id)) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('خطا در دریافت چت‌ها');
    } finally {
      setLoading(false);
    }
  };
  
  // دریافت اطلاعات کامل چت
  const fetchChatDetails = async (chatId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/chats/${chatId}`);
      setSelectedChat(response.data);
    } catch (error) {
      console.error('Error fetching chat details:', error);
      toast.error('خطا در دریافت اطلاعات چت');
    } finally {
      setLoading(false);
    }
  };
  
  // تغییر وضعیت چت (باز/بسته)
  const toggleChatStatus = async (chatId: number, newStatus: 'open' | 'closed') => {
    try {
      setLoading(true);
      const response = await axios.patch(`/api/admin/chats/${chatId}`, {
        status: newStatus
      });
      
      // بروزرسانی لیست چت‌ها
      setChats(chats.map(chat => 
        chat.id === chatId ? { ...chat, status: newStatus } : chat
      ));
      
      // بروزرسانی چت انتخاب شده
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat({ ...selectedChat, status: newStatus });
      }
      
      toast.success(`چت با موفقیت ${newStatus === 'open' ? 'باز' : 'بسته'} شد`);
    } catch (error) {
      console.error('Error updating chat status:', error);
      toast.error('خطا در بروزرسانی وضعیت چت');
    } finally {
      setLoading(false);
    }
  };
  
  // ارسال پیام جدید
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    try {
      setLoading(true);
      // تعیین endpoint مناسب برای چت‌های کاربر یا مهمان
      const endpoint = selectedChat.userId 
        ? `/api/chats/${selectedChat.id}/messages`
        : `/api/chats/guest/${selectedChat.id}/messages`;
      
      const response = await axios.post(endpoint, {
        content: message,
        isFromUser: false // پیام از طرف ادمین است
      });
      
      // بروزرسانی چت انتخاب شده با پیام جدید
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, response.data]
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
    } finally {
      setLoading(false);
    }
  };
  
  // اعمال فیلترها
  const applyFilters = () => {
    fetchChats();
  };
  
  // نمایش نام یا اطلاعات کاربر
  const getUserInfo = (chat: Chat) => {
    if (chat.userId && chat.user) {
      return chat.user.name || chat.user.email || 'کاربر';
    } else if (chat.guestName) {
      return `${chat.guestName} (مهمان)`;
    } else {
      return 'مهمان';
    }
  };
  
  // نمایش شماره تماس کاربر
  const getContactInfo = (chat: Chat) => {
    if (chat.userId && chat.user && chat.user.phone) {
      return chat.user.phone;
    } else if (chat.phone) {
      return chat.phone;
    } else if (chat.userId && chat.user && chat.user.email) {
      return chat.user.email;
    } else {
      return 'اطلاعات تماس موجود نیست';
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">مدیریت پشتیبانی</h1>
        
        {/* فیلترها */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center mr-4">
            <BsFilter className="text-gray-600 ml-2" />
            <span className="text-gray-600">فیلترها:</span>
          </div>
          
          <div className="flex items-center">
            <label className="ml-2 text-gray-600">وضعیت:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1 ml-4"
            >
              <option value="all">همه</option>
              <option value="open">باز</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="ml-2 text-gray-600">نوع کاربر:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ChatType)}
              className="border rounded px-2 py-1 ml-4"
            >
              <option value={ChatType.ALL}>همه</option>
              <option value={ChatType.USER}>کاربران ثبت نام شده</option>
              <option value={ChatType.GUEST}>مهمان</option>
            </select>
          </div>
          
          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-600 transition"
          >
            اعمال فیلتر
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* لیست چت‌ها */}
          <div className="md:col-span-1 bg-white shadow rounded-lg">
            <h2 className="text-lg font-bold p-4 border-b">چت‌های پشتیبانی</h2>
            
            {loading && chats.length === 0 ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">در حال بارگذاری...</p>
              </div>
            ) : chats.length > 0 ? (
              <div className="overflow-y-auto max-h-[600px]">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => fetchChatDetails(chat.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">
                        {getUserInfo(chat)}
                      </h3>
                      <span 
                        className={`text-xs px-2 py-1 rounded ${
                          chat.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {chat.status === 'open' ? 'باز' : 'بسته شده'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                      <BsPhone className="ml-1" />
                      {getContactInfo(chat)}
                    </div>
                    
                    <div className="text-sm text-gray-500 flex items-center">
                      <BsCalendar className="ml-1" />
                      {new Date(chat.updatedAt).toLocaleDateString('fa-IR')}
                      <span className="mx-2">•</span>
                      <BsChatDots className="ml-1" />
                      {chat._count.messages} پیام
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                هیچ چتی یافت نشد
              </div>
            )}
          </div>
          
          {/* جزئیات چت */}
          <div className="md:col-span-2 bg-white shadow rounded-lg flex flex-col h-[600px]">
            {!selectedChat ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <BsChatDots className="text-4xl mb-4" />
                <p>یک چت از سمت راست انتخاب کنید</p>
              </div>
            ) : loading && !selectedChat.messages ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* هدر چت */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="text-gray-500 hover:text-gray-700 lg:hidden ml-2"
                    >
                      <BsChevronLeft />
                    </button>
                    <span className="font-bold mr-2">{getUserInfo(selectedChat)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {selectedChat.status === 'open' ? (
                      <button
                        onClick={() => toggleChatStatus(selectedChat.id, 'closed')}
                        className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm flex items-center"
                        disabled={loading}
                      >
                        <BsXCircle className="ml-1" />
                        بستن چت
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleChatStatus(selectedChat.id, 'open')}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center"
                        disabled={loading}
                      >
                        <BsCheck2Circle className="ml-1" />
                        بازگشایی چت
                      </button>
                    )}
                  </div>
                </div>
                
                {/* اطلاعات کاربر */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BsPerson className="ml-1" />
                      <span className="ml-1 font-bold">نام:</span>
                      {selectedChat.userId && selectedChat.user 
                        ? selectedChat.user.name || 'نامشخص'
                        : selectedChat.guestName || 'مهمان'}
                    </div>
                    
                    {(selectedChat.userId && selectedChat.user && selectedChat.user.phone) || selectedChat.phone ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <BsPhone className="ml-1" />
                        <span className="ml-1 font-bold">شماره تلفن:</span>
                        {selectedChat.userId && selectedChat.user 
                          ? selectedChat.user.phone
                          : selectedChat.phone}
                      </div>
                    ) : null}
                    
                    {selectedChat.userId && selectedChat.user && selectedChat.user.email ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <BsEnvelope className="ml-1" />
                        <span className="ml-1 font-bold">ایمیل:</span>
                        {selectedChat.user.email}
                      </div>
                    ) : null}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <BsCalendar className="ml-1" />
                      <span className="ml-1 font-bold">تاریخ ایجاد:</span>
                      {new Date(selectedChat.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>
                
                {/* پیام‌ها */}
                <div className="flex-1 overflow-y-auto p-4">
                  {selectedChat.messages.length === 0 ? (
                    <div className="text-center text-gray-500 p-4">
                      هنوز پیامی ارسال نشده است
                    </div>
                  ) : (
                    selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`my-2 p-3 rounded-lg max-w-[80%] ${
                          msg.isFromUser 
                            ? 'bg-blue-100 mr-auto' 
                            : 'bg-gray-100 ml-auto'
                        }`}
                      >
                        {msg.content}
                        <div className="text-xs text-gray-500 mt-1 text-left">
                          {new Date(msg.createdAt).toLocaleTimeString('fa-IR')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* فرم ارسال پیام */}
                <form 
                  onSubmit={sendMessage} 
                  className="p-4 border-t"
                  style={{ display: selectedChat.status === 'closed' ? 'none' : 'block' }}
                >
                  <div className="flex">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 border rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-l-lg hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={loading || !message.trim()}
                    >
                      <BsSend />
                    </button>
                  </div>
                </form>
                
                {selectedChat.status === 'closed' && (
                  <div className="p-4 border-t text-center text-red-500 text-sm">
                    این چت بسته شده است و امکان ارسال پیام وجود ندارد
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 