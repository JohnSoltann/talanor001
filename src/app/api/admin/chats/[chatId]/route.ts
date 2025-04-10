import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// GET /api/admin/chats/[chatId] - دریافت اطلاعات کامل یک چت
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // بررسی دسترسی ادمین
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'شما دسترسی ادمین ندارید' },
        { status: 403 }
      );
    }
    
    const chatId = params.chatId;
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'شناسه چت مشخص نشده است' },
        { status: 400 }
      );
    }
    
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    
    if (!chat) {
      return NextResponse.json(
        { error: 'چت مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات چت' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/chats/[chatId] - بروزرسانی وضعیت چت
export async function PATCH(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // بررسی دسترسی ادمین
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'شما دسترسی ادمین ندارید' },
        { status: 403 }
      );
    }
    
    const chatId = params.chatId;
    
    if (!chatId) {
      return NextResponse.json(
        { error: 'شناسه چت مشخص نشده است' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { status } = body;
    
    if (!status || (status !== 'open' && status !== 'closed')) {
      return NextResponse.json(
        { error: 'وضعیت چت نامعتبر است' },
        { status: 400 }
      );
    }
    
    const updatedChat = await prisma.chat.update({
      where: {
        id: parseInt(chatId),
      },
      data: {
        status,
      },
    });
    
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Error updating chat status:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی وضعیت چت' },
      { status: 500 }
    );
  }
} 