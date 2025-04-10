import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Schema for API request validation
const registerSchema = z.object({
  firstName: z.string().min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد' }),
  lastName: z.string().min(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد' }),
  phone: z.string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد' }),
  email: z.string().email({ message: 'ایمیل نامعتبر است' }).optional().or(z.literal('')),
  password: z.string()
    .min(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' }),
  referralCode: z.string().optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request data
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'اطلاعات ورودی نامعتبر است',
          errors: result.error.flatten() 
        }, 
        { status: 400 }
      );
    }
    
    const { firstName, lastName, phone, email, password, referralCode } = result.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'کاربری با این شماره موبایل یا ایمیل قبلاً ثبت نام کرده است' 
        }, 
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email || `${phone}@example.com`, // If no email provided, create a placeholder
        phone,
        password: hashedPassword,
      }
    });
    
    // Create a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Return success with user data (excluding password)
    return NextResponse.json({
      success: true,
      message: 'ثبت نام با موفقیت انجام شد',
      verificationCode,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در ثبت نام. لطفا دوباره تلاش کنید' 
      }, 
      { status: 500 }
    );
  }
} 