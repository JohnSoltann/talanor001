import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

const prisma = new PrismaClient();

// GET /api/chats - دریافت چت‌های کاربر
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API - Session:', session);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'لطفا ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('API - Requested userId:', userId);
    console.log('API - Session userId:', session.user.id);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'شناسه کاربر مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // اطمینان از اینکه کاربر تنها به چت‌های خودش دسترسی دارد
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      console.log('Auth check: userId mismatch', userId, session.user.id);
      console.log('Types:', typeof userId, typeof session.user.id);
      
      // مقایسه با تبدیل نوع
      if (parseInt(userId) !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'شما اجازه دسترسی به این چت را ندارید' },
          { status: 403 }
        );
      }
    }
    
    const chats = await prisma.chat.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    console.log('API - Found chats:', chats.length);
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت چت‌ها' },
      { status: 500 }
    );
  }
}

// POST /api/chats - ایجاد چت جدید
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API POST - Session:', session);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'لطفا ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { userId } = body;
    console.log('API POST - Requested userId:', userId);
    console.log('API POST - Session userId:', session.user.id);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'شناسه کاربر مشخص نشده است' },
        { status: 400 }
      );
    }
    
    // اطمینان از اینکه کاربر تنها برای خودش چت می‌سازد
    if (userId !== session.user.id && session.user.role !== 'ADMIN') {
      console.log('Auth check POST: userId mismatch', userId, session.user.id);
      console.log('Types:', typeof userId, typeof session.user.id);
      
      // مقایسه با تبدیل نوع
      if (parseInt(userId) !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'شما اجازه ایجاد چت برای کاربر دیگر را ندارید' },
          { status: 403 }
        );
      }
    }
    
    const chat = await prisma.chat.create({
      data: {
        userId: parseInt(userId),
      },
    });
    console.log('API POST - Created chat:', chat);
    
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد چت' },
      { status: 500 }
    );
  }
} 