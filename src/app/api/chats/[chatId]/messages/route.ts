import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// GET /api/chats/[chatId]/messages - دریافت پیام‌های یک چت
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'لطفا ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }
    
    const chatId = params.chatId;
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'شناسه چت مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // بررسی دسترسی کاربر به چت
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
      include: {
        user: true,
      },
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'چت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    // فقط صاحب چت یا ادمین می‌توانند پیام‌ها را ببینند
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = chat.userId === parseInt(session.user.id);
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'شما اجازه دسترسی به این چت را ندارید' },
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
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}

// POST /api/chats/[chatId]/messages - ارسال پیام جدید
export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'لطفا ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }
    
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
      include: {
        user: true,
      },
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'چت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    // بررسی وضعیت چت
    if (chat.status === 'closed') {
      return NextResponse.json(
        { error: 'این چت بسته شده است و امکان ارسال پیام وجود ندارد' },
        { status: 400 }
      );
    }
    
    // بررسی دسترسی کاربر به چت
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = chat.userId === parseInt(session.user.id);
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'شما اجازه دسترسی به این چت را ندارید' },
        { status: 403 }
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
    
    // کاربر عادی فقط می‌تواند پیام کاربر ارسال کند
    if (!isAdmin && !isFromUser) {
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
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام' },
      { status: 500 }
    );
  }
} 