import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/chats/guest - ایجاد چت جدید برای مهمان
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, name } = body;
    
    if (!phone) {
      return NextResponse.json(
        { error: 'شماره تلفن مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // ایجاد چت جدید برای مهمان
    const chat = await prisma.chat.create({
      data: {
        phone: phone,
        guestName: name || 'مهمان',
        status: 'open',
      },
    });
    
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Error creating guest chat:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد چت' },
      { status: 500 }
    );
  }
} 