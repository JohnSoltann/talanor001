import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Providers from './providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatSupport from '../components/ChatSupport';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'طلانور - سرمایه‌گذاری در طلا',
  description: 'خرید و فروش طلا به صورت آنلاین با اپلیکیشن طلانور',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap" />
      </head>
      <body className={`${inter.className} font-vazirmatn`}>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <ChatSupport />
        </Providers>
      </body>
    </html>
  );
} 