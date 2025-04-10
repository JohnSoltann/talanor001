# پروژه طلانوز

این پروژه شامل سایت اطلاعات و قیمت طلا است که با Next.js پیاده‌سازی شده است.

## نصب

برای نصب وابستگی‌های پروژه، دستور زیر را اجرا کنید:

```bash
npm install
```

## اجرا

برای اجرای پروژه در محیط توسعه، دستور زیر را اجرا کنید:

```bash
npm run dev
```

پس از اجرا، پروژه در آدرس [http://localhost:3000](http://localhost:3000) قابل دسترسی خواهد بود.

## ساختار پروژه

ساختار اصلی پروژه به صورت زیر است:

- `src/app`: صفحات اصلی برنامه (با استفاده از App Router در Next.js)
- `src/components`: کامپوننت‌های استفاده شده در برنامه
- `src/utils`: توابع کمکی
- `src/lib`: کتابخانه‌ها و تنظیمات
- `prisma`: مدل‌های پایگاه داده
- `public`: فایل‌های استاتیک و HTML

### بخش وبلاگ

صفحات بلاگ در مسیر `src/app/blog` قرار دارند و شامل موارد زیر هستند:

- صفحه اصلی بلاگ (`src/app/blog/page.tsx`)
- مقالات جداگانه در پوشه‌های مخصوص به خود:
  - `gold-price-trends`
  - `gold-demand-increase`
  - `weekly-gold-analysis`
  - `gold-investment-guide`

## تکنولوژی‌های استفاده شده

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
