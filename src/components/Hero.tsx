"use client";

import Link from "next/link";
import DynamicLight from './DynamicLight';
import { useEffect, useState } from "react";
import ClockWidget from './ClockWidget';
import GoldenClockAnimation from './GoldenClockAnimation';

// کامپوننت برای رندر فقط در سمت کلاینت
const ClientOnlyParticles = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 25 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 3}s`
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold-300 animate-float"
          style={style}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div dir="rtl" className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-b from-gold-500 via-gold-300 to-white">
      {/* Light effect */}
      <div id="lightEffect" className="absolute inset-0 light-effect" />
      <DynamicLight />
      
      {/* Floating particles */}
      <ClientOnlyParticles />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-10">
          
          {/* Text content */}
          <div 
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            className="flex flex-col justify-center space-y-6 text-right order-2 lg:order-1 lg:col-span-6 transition-opacity duration-700 opacity-100"
          >
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              <span className="inline-block">کم کم</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-l from-gold-600 to-gold-400 bg-clip-text text-transparent">
                  طلا
                </span>
                <span className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>{" "}
              <span className="inline-block">پس‌انداز کن</span>
            </h1>
            
            <p className="text-lg text-gray-600 md:text-xl">
              خرید طلای بدون اجرت حتی با ۱۰۰ هزار تومان!
              <br />
              معاملات و پشتیبانی ۲۴ ساعته و تحویل فیزیکی طلا
            </p>
            
            <div className="flex flex-wrap items-center justify-end gap-4">
              <Link 
                href="/register"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-gold-600 to-gold-400 px-8 py-3 text-white shadow-gold transition-all hover:shadow-gold-lg"
              >
                <span className="relative z-10">شروع سرمایه‌گذاری</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold-400 to-gold-600 transition-transform group-hover:translate-x-0" />
                <span 
                  className="absolute inset-0 bg-white/10 animate-pulse"
                />
              </Link>
              
              <Link 
                href="/download"
                className="flex items-center gap-2 rounded-lg border-2 border-gold-400 px-6 py-3 text-gold-600 transition-colors hover:bg-gold-50 relative overflow-hidden"
              >
                <span className="relative z-10">دانلود اپلیکیشن</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="absolute inset-0 opacity-0 bg-gold-50 transition-opacity hover:opacity-100" />
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div 
              className="flex flex-wrap items-center justify-end mt-8 gap-6 text-sm text-gray-500 transition-opacity duration-1000 opacity-100"
            >
              <div className="flex items-center gap-2">
                <span>تضمین اصالت طلا</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span>تحویل امن و سریع</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span>پشتیبانی ۲۴/۷</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Golden Clock Animation */}
          <div
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            className="relative flex items-center justify-center order-1 lg:order-2 lg:col-span-4 transition-opacity duration-1000 opacity-100"
          >
            <div className="relative">
              <GoldenClockAnimation />
            </div>
            
            {/* Gold coins elements */}
            <div
              className="absolute top-1/4 right-0 h-10 w-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold animate-float"
              style={{
                animationDuration: '5s',
                animationDelay: '1s',
              }}
            />
            <div
              className="absolute bottom-[30%] left-[5%] h-8 w-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold animate-float"
              style={{
                animationDuration: '4.5s',
                animationDelay: '0.5s',
              }}
            />
            <div
              className="absolute top-[60%] right-[10%] h-6 w-6 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-gold animate-float"
              style={{
                animationDuration: '6s',
                animationDelay: '1.5s',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Sparkles */}
      <ClientOnlySparkles />
      
      {/* Decorative elements */}
      <div
        className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-gold-200/20 to-transparent blur-3xl animate-pulse"
        style={{
          animationDuration: '4s',
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-radial from-gold-200/20 to-transparent blur-3xl animate-pulse"
        style={{
          animationDuration: '5s',
        }}
      />
    </div>
  );
};

// کامپوننت برای رندر اسپارکل‌ها فقط در سمت کلاینت
const ClientOnlySparkles = () => {
  const [mounted, setMounted] = useState(false);
  const [sparkles, setSparkles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setMounted(true);
    const newSparkles = Array.from({ length: 15 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setSparkles(newSparkles);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {sparkles.map((style, i) => (
        <div
          key={i}
          className="sparkle absolute"
          style={style}
        />
      ))}
    </>
  );
};

export default Hero; 