'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BsChatDots, BsSend, BsX, BsPersonCircle, BsTelephone } from 'react-icons/bs';

interface Message {
  id: number;
  content: string;
  isFromUser: boolean;
  createdAt: string;
}

interface Chat {
  id: number;
  messages: Message[];
  status: string;
}

export default function ChatSupport() {
  const { data: session, status: sessionStatus } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // اطلاعات مهمان
  const [guestMode, setGuestMode] = useState(true); // آیا حالت مهمان فعال است
  const [showGuestForm, setShowGuestForm] = useState(false); // نمایش فرم اطلاعات مهمان
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestChatId, setGuestChatId] = useState<number | null>(null);

  // وقتی چت باز می‌شود بررسی می‌کنیم کاربر لاگین است یا باید به صورت مهمان وارد شود
  useEffect(() => {
    if (isOpen) {
      if (sessionStatus === 'authenticated' && session?.user?.id) {
        // کاربر لاگین شده است
        setGuestMode(false);
        setInitialLoading(true);
        fetchOrCreateChat();
      } else if (sessionStatus === 'unauthenticated') {
        // کاربر لاگین نیست - حالت مهمان
        setGuestMode(true);
        // اگر قبلاً چت مهمان ایجاد شده بود
        if (guestChatId) {
          fetchGuestChat(guestChatId);
        } else {
          setShowGuestForm(true);
        }
      }
      
      // پولینگ برای چک کردن پیام‌های جدید
      if (chat?.id) {
        chatPollInterval.current = setInterval(() => {
          fetchChatMessages(chat.id);
        }, 10000); // هر 10 ثانیه چک می‌کند
      }
    }
    
    return () => {
      if (chatPollInterval.current) {
        clearInterval(chatPollInterval.current);
      }
    };
  }, [sessionStatus, isOpen, chat?.id, guestChatId]);

  // اسکرول به پایین با تغییر پیام‌ها
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chat?.messages, isOpen]);
  
  // ایجاد یا بازیابی چت برای کاربران ثبت نام شده
  const fetchOrCreateChat = async () => {
    if (!session?.user?.id) {
      setInitialLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // ابتدا چت‌های موجود را چک می‌کنیم
      const response = await axios.get(`/api/chats?userId=${session.user.id}`);
      
      if (response.data.length > 0) {
        // چت موجود است
        const activeChats = response.data.filter((c: Chat) => c.status === 'open');
        if (activeChats.length > 0) {
          setChat(activeChats[0]);
        } else {
          // اگر چت باز وجود ندارد چت جدید می‌سازیم
          const newChat = await axios.post('/api/chats', { userId: session.user.id });
          setChat(newChat.data);
        }
      } else {
        // چت وجود ندارد، جدید می‌سازیم
        const newChat = await axios.post('/api/chats', { userId: session.user.id });
        setChat(newChat.data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  
  // ایجاد چت برای مهمان
  const createGuestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName || !guestPhone) {
      toast.error('لطفاً نام و شماره تلفن خود را وارد کنید');
      return;
    }
    
    try {
      setLoading(true);
      // ایجاد چت جدید برای مهمان
      const response = await axios.post('/api/chats/guest', { 
        phone: guestPhone,
        name: guestName 
      });
      
      setChat(response.data);
      setGuestChatId(response.data.id);
      setShowGuestForm(false);
      
      // ذخیره شناسه چت در localStorage برای استفاده بعدی
      localStorage.setItem('guestChatId', response.data.id.toString());
      localStorage.setItem('guestPhone', guestPhone);
    } catch (error) {
      console.error('Error creating guest chat:', error);
      toast.error('خطا در ایجاد چت. لطفاً مجدداً تلاش کنید');
    } finally {
      setLoading(false);
    }
  };
  
  // بازیابی چت مهمان با شناسه
  const fetchGuestChat = async (chatId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/chats/guest/${chatId}`);
      setChat(response.data);
      setShowGuestForm(false);
    } catch (error) {
      console.error('Error fetching guest chat:', error);
      // اگر چت قبلی پیدا نشد، فرم را نمایش میدهیم
      setShowGuestForm(true);
      setGuestChatId(null);
      localStorage.removeItem('guestChatId');
    } finally {
      setLoading(false);
    }
  };

  // بررسی چت‌های قبلی مهمان در localStorage هنگام بارگذاری کامپوننت
  useEffect(() => {
    const savedChatId = localStorage.getItem('guestChatId');
    const savedPhone = localStorage.getItem('guestPhone');
    
    if (savedChatId && savedPhone) {
      setGuestChatId(parseInt(savedChatId));
      setGuestPhone(savedPhone);
    }
  }, []);

  const fetchChatMessages = async (chatId: number) => {
    try {
      const endpoint = guestMode 
        ? `/api/chats/guest/${chatId}/messages` 
        : `/api/chats/${chatId}/messages`;
        
      const response = await axios.get(endpoint);
      
      if (chat) {
        setChat({
          ...chat,
          messages: response.data
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chat) return;

    try {
      const endpoint = guestMode 
        ? `/api/chats/guest/${chat.id}/messages` 
        : `/api/chats/${chat.id}/messages`;
      
      const response = await axios.post(endpoint, {
        content: message,
        isFromUser: true
      });
      
      // بروزرسانی چت با پیام جدید
      setChat({
        ...chat,
        messages: [...(chat.messages || []), response.data]
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // نمایش دکمه چت
  const renderChatButton = () => (
    <button
      onClick={toggleChat}
      className="fixed bottom-5 left-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50"
      aria-label="پشتیبانی آنلاین"
    >
      <BsChatDots size={24} />
    </button>
  );
  
  // نمایش فرم ورود اطلاعات مهمان
  const renderGuestForm = () => (
    <div className="flex-1 p-4 overflow-y-auto min-h-[300px] flex items-center">
      <form onSubmit={createGuestChat} className="w-full">
        <div className="text-center mb-4">
          <h3 className="font-bold text-gray-800">ثبت اطلاعات برای چت</h3>
          <p className="text-sm text-gray-500">لطفاً اطلاعات خود را وارد کنید تا بتوانیم به شما پاسخ دهیم.</p>
        </div>
        
        <div className="mb-3">
          <label htmlFor="guestName" className="block text-sm text-gray-700 mb-1">نام و نام خانوادگی</label>
          <div className="flex border rounded overflow-hidden">
            <span className="bg-gray-100 flex items-center px-3">
              <BsPersonCircle className="text-gray-500" />
            </span>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="flex-1 p-2 focus:outline-none"
              placeholder="نام خود را وارد کنید"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="guestPhone" className="block text-sm text-gray-700 mb-1">شماره تلفن</label>
          <div className="flex border rounded overflow-hidden">
            <span className="bg-gray-100 flex items-center px-3">
              <BsTelephone className="text-gray-500" />
            </span>
            <input
              type="tel"
              id="guestPhone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="flex-1 p-2 focus:outline-none"
              placeholder="مثلا: ۰۹۱۲۳۴۵۶۷۸۹"
              required
              dir="ltr"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {loading ? 'لطفا صبر کنید...' : 'شروع گفتگو'}
        </button>
      </form>
    </div>
  );

  // نمایش باکس چت
  const renderChatBox = () => (
    <div className="fixed bottom-5 left-5 z-50 bg-white rounded-lg shadow-xl border w-[350px] max-h-[500px] flex flex-col">
      {/* هدر چت */}
      <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-bold">پشتیبانی آنلاین</h2>
        <button onClick={toggleChat} className="text-white hover:text-gray-200">
          <BsX size={24} />
        </button>
      </div>
      
      {/* بخش پیام‌ها یا فرم مهمان */}
      {initialLoading ? (
        <div className="flex-1 p-4 overflow-y-auto max-h-[350px] min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : guestMode && showGuestForm ? (
        renderGuestForm()
      ) : (
        <div className="flex-1 p-4 overflow-y-auto max-h-[350px] min-h-[300px]">
          {!chat ? (
            <div className="text-center text-gray-500 p-4">
              {guestMode ? 'لطفا اطلاعات خود را وارد کنید.' : 'در حال آماده‌سازی چت...'}
            </div>
          ) : chat.messages?.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              به چت پشتیبانی خوش آمدید. پیام خود را بنویسید و ما در اسرع وقت پاسخ خواهیم داد.
            </div>
          ) : (
            chat.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`my-2 p-3 rounded-lg max-w-[80%] ${
                  msg.isFromUser 
                    ? 'bg-blue-100 mr-auto text-gray-800' 
                    : 'bg-gray-100 ml-auto text-gray-800'
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-500 mt-1 text-left">
                  {new Date(msg.createdAt).toLocaleTimeString('fa-IR')}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {/* فرم ارسال پیام */}
      {((!guestMode && chat) || (guestMode && chat && !showGuestForm)) && (
        <form onSubmit={sendMessage} className="p-3 border-t">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="پیام خود را بنویسید..."
              disabled={loading || chat?.status === 'closed'}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading || !message.trim() || chat?.status === 'closed'}
            >
              <BsSend />
            </button>
          </div>
          {chat?.status === 'closed' && (
            <div className="text-xs text-red-500 mt-1 text-center">
              این چت بسته شده است و امکان ارسال پیام وجود ندارد.
            </div>
          )}
        </form>
      )}
    </div>
  );

  return (
    <>
      {renderChatButton()}
      {isOpen && renderChatBox()}
    </>
  );
} 