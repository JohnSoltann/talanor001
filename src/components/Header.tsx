'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import UserProfileButton from './UserProfileButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gold-600">
            طلانور
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/gold-price" className="text-gray-700 hover:text-gold-600 transition-colors">
              قیمت طلا
            </Link>
            <Link href="/calculator" className="text-gray-700 hover:text-gold-600 transition-colors">
              محاسبه قیمت طلا
            </Link>
            <Link href="/rules" className="text-gray-700 hover:text-gold-600 transition-colors">
              قوانین و تعرفه‌ها
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gold-600 transition-colors">
              بلاگ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gold-600 transition-colors">
              ارتباط با ما
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <span className="sr-only">سبد خرید</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-gold-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile Button - Desktop */}
            <div className="hidden md:block">
              <UserProfileButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-gold-600 transition-colors"
            >
              <span className="sr-only">منو</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/gold-price" className="text-gray-700 hover:text-gold-600 transition-colors">
                قیمت طلا
              </Link>
              <Link href="/calculator" className="text-gray-700 hover:text-gold-600 transition-colors">
                محاسبه قیمت طلا
              </Link>
              <Link href="/rules" className="text-gray-700 hover:text-gold-600 transition-colors">
                قوانین و تعرفه‌ها
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-gold-600 transition-colors">
                بلاگ
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gold-600 transition-colors">
                ارتباط با ما
              </Link>
              <div className="mt-2">
                <UserProfileButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 