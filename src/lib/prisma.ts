import { PrismaClient } from '@prisma/client';

// جلوگیری از ساخت نمونه‌های متعدد Prisma Client در محیط development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 