import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // در اینجا می‌توانید منطق بررسی ادمین را پیاده‌سازی کنید
    // برای مثال، بررسی از طریق دیتابیس یا مقایسه با لیست ادمین‌ها
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'خطا در بررسی وضعیت ادمین' },
      { status: 500 }
    );
  }
} 