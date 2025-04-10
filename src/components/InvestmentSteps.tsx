'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const steps = [
  {
    number: 1,
    title: 'ثبت نام',
    description: 'در سامانه طلانور ثبت‌نام کرده و با تأیید هویت خود، حساب کاربری معتبر ایجاد کنید.',
    icon: (isActive: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 ${isActive ? 'text-gold-600' : 'text-gold-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  },
  {
    number: 2,
    title: 'شارژ حساب',
    description: 'کیف پول دیجیتال خود را از طریق درگاه‌های بانکی امن و با کارمزد صفر شارژ کنید.',
    icon: (isActive: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 ${isActive ? 'text-gold-600' : 'text-gold-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    number: 3,
    title: 'خرید طلا',
    description: 'مقدار طلای موردنظر خود را انتخاب کرده و به صورت آنی معامله را تکمیل کنید.',
    icon: (isActive: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 ${isActive ? 'text-gold-600' : 'text-gold-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    number: 4,
    title: 'مدیریت سرمایه',
    description: 'طلای خود را در حساب امن نگهداری کنید یا در زمان مناسب فروخته و سود کنید.',
    icon: (isActive: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 ${isActive ? 'text-gold-600' : 'text-gold-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  }
];

const InvestmentSteps = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 bg-[#FFF8E1]">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        چگونه در طلانور سرمایه‌گذاری کنیم؟
      </h2>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className={`relative p-6 rounded-xl ${
                activeStep === index ? 'bg-white shadow-gold' : 'bg-transparent'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: activeStep === index ? 1.05 : 1,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto"
                animate={{
                  backgroundColor: activeStep === index ? '#B45309' : '#FCD34D',
                  rotate: activeStep === index ? 360 : 0,
                }}
                transition={{
                  rotate: { duration: 0.5, ease: "easeOut" }
                }}
              >
                {step.number}
              </motion.div>
              
              <motion.div
                className="mb-4 flex justify-center"
                animate={{
                  scale: activeStep === index ? 1.2 : 1,
                  rotate: activeStep === index ? 360 : 0,
                }}
                transition={{ 
                  scale: { type: "spring", stiffness: 200 },
                  rotate: { duration: 0.8, ease: "easeOut" }
                }}
              >
                {step.icon(activeStep === index)}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-center mb-3 text-gold-700">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-1/2 right-[-30%] w-[60%] h-0.5 bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentSteps; 