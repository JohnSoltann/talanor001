import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفا ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(session.user.id),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        wallet: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات پروفایل' },
      { status: 500 }
    );
  }
} 