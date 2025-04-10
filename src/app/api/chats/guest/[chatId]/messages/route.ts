import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chats/guest/[chatId]/messages - دریافت پیام‌های چت مهمان
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'شناسه چت مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // بررسی وجود چت
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'چت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    // اطمینان از اینکه این چت واقعاً یک چت مهمان است
    if (chat.userId !== null) {
      return NextResponse.json(
        { error: 'این چت مربوط به کاربر ثبت نام شده است' },
        { status: 403 }
      );
    }
    
    const messages = await prisma.message.findMany({
      where: {
        chatId: parseInt(chatId),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching guest messages:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}

// POST /api/chats/guest/[chatId]/messages - ارسال پیام جدید در چت مهمان
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const chatId = params.chatId;
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'شناسه چت مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // بررسی وجود چت
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'چت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    // اطمینان از اینکه این چت واقعاً یک چت مهمان است
    if (chat.userId !== null) {
      return NextResponse.json(
        { error: 'این چت مربوط به کاربر ثبت نام شده است' },
        { status: 403 }
      );
    }
    
    // بررسی وضعیت چت
    if (chat.status === 'closed') {
      return NextResponse.json(
        { error: 'این چت بسته شده است و امکان ارسال پیام وجود ندارد' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { content, isFromUser = true } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'متن پیام نمی‌تواند خالی باشد' },
        { status: 400 }
      );
    }
    
    // مهمان فقط می‌تواند پیام کاربر ارسال کند
    if (!isFromUser) {
      return NextResponse.json(
        { error: 'شما فقط می‌توانید به عنوان کاربر پیام ارسال کنید' },
        { status: 403 }
      );
    }
    
    // ایجاد پیام جدید
    const message = await prisma.message.create({
      data: {
        chatId: parseInt(chatId),
        content,
        isFromUser,
      },
    });
    
    // بروزرسانی زمان آخرین تغییر چت
    await prisma.chat.update({
      where: {
        id: parseInt(chatId),
      },
      data: {
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating guest message:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام' },
      { status: 500 }
    );
  }
} 