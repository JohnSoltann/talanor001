import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// GET /api/admin/chats - دریافت تمام چت‌ها توسط ادمین
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // بررسی دسترسی ادمین
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'شما دسترسی ادمین ندارید' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // open, closed, all
    const type = searchParams.get('type'); // user, guest, all
    
    // فیلتر بر اساس وضعیت چت و نوع (کاربر یا مهمان)
    let where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (type && type !== 'all') {
      if (type === 'user') {
        // فقط چت‌های کاربران ثبت نام شده
        where.userId = { not: null };
      } else if (type === 'guest') {
        // فقط چت‌های مهمان
        where.userId = null;
      }
    }
    
    const chats = await prisma.chat.findMany({
      where,
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
          take: 1, // فقط آخرین پیام
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching admin chats:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت چت‌ها' },
      { status: 500 }
    );
  }
} 