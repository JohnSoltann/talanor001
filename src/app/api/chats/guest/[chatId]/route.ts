import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/chats/guest/[chatId] - دریافت اطلاعات چت مهمان
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
    
    const chat = await prisma.chat.findUnique({
      where: {
        id: parseInt(chatId),
      },
      include: {
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
    
    // اطمینان از اینکه این چت واقعاً یک چت مهمان است
    if (chat.userId !== null) {
      return NextResponse.json(
        { error: 'این چت مربوط به کاربر ثبت نام شده است' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching guest chat:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات چت' },
      { status: 500 }
    );
  }
} 