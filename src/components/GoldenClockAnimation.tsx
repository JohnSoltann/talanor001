'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GoldenClockAnimation = () => {
  const [isClient, setIsClient] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isGold, setIsGold] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update clock time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Toggle between clock and gold every 10 seconds
  useEffect(() => {
    const transformTimer = setInterval(() => {
      setIsGold(prev => !prev);
    }, 10000);
    
    return () => clearInterval(transformTimer);
  }, []);

  if (!isClient) {
    return null;
  }
   
  // Calculate clock hand rotations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = 30 * hours + minutes / 2;
  const minuteRotation = 6 * minutes;
  const secondRotation = 6 * seconds;

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: isGold ? 0.85 : 1,
          opacity: 1,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="relative h-[300px] w-[300px] rounded-full"
      >
        {/* Clock/Gold container */}
        <motion.div
          animate={isGold ? "gold" : "clock"}
          variants={{
            clock: {
              borderRadius: "100%",
              backgroundColor: "#1E293B", // Dark slate blue - more luxurious look
              boxShadow: "0 0 30px rgba(0, 0, 0, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)",
            },
            gold: {
              borderRadius: "10px",
              backgroundColor: "#F5D04C",
              boxShadow: "0 10px 25px rgba(245, 208, 76, 0.4), inset 0 -5px 10px rgba(143, 107, 0, 0.3), inset 0 5px 10px rgba(255, 245, 200, 0.5)",
            }
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden"
        >
          {/* Dynamic reflective shine effect */}
          <motion.div
            animate={isGold ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 gold-shine-effect"
          />
          
          {/* Clock markings */}
          <motion.div
            animate={isGold ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Clock numbers - simple approach */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[220px] h-[220px] rounded-full">
                {/* Roman numerals */}
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-base font-serif text-gold-400 font-bold">XII</span>
                <span className="absolute top-[12%] right-[12%] text-base font-serif text-gold-400 font-bold">I</span>
                <span className="absolute top-[30%] right-[4%] text-base font-serif text-gold-400 font-bold">II</span>
                <span className="absolute top-1/2 right-6 -translate-y-1/2 text-base font-serif text-gold-400 font-bold">III</span>
                <span className="absolute bottom-[30%] right-[4%] text-base font-serif text-gold-400 font-bold">IV</span>
                <span className="absolute bottom-[12%] right-[12%] text-base font-serif text-gold-400 font-bold">V</span>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-base font-serif text-gold-400 font-bold">VI</span>
                <span className="absolute bottom-[12%] left-[12%] text-base font-serif text-gold-400 font-bold">VII</span>
                <span className="absolute bottom-[30%] left-[4%] text-base font-serif text-gold-400 font-bold">VIII</span>
                <span className="absolute top-1/2 left-6 -translate-y-1/2 text-base font-serif text-gold-400 font-bold">IX</span>
                <span className="absolute top-[30%] left-[4%] text-base font-serif text-gold-400 font-bold">X</span>
                <span className="absolute top-[12%] left-[12%] text-base font-serif text-gold-400 font-bold">XI</span>
                
                {/* Ornate Border Design */}
                <div className="absolute inset-0 rounded-full border-4 border-gold-400/30" />
                
                {/* Center */}
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-70" />
                <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-500/30" />
              </div>
              
              {/* Hour hand */}
              <motion.div
                className="absolute w-[6px] h-[70px] rounded bg-gradient-to-b from-gold-400 to-gold-300 shadow-md z-[1]"
                style={{ 
                  transformOrigin: 'bottom center',
                  bottom: '50%',
                  left: 'calc(50% - 3px)'
                }}
                animate={{ rotate: hourRotation }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Minute hand */}
              <motion.div
                className="absolute w-[4px] h-[90px] rounded bg-gradient-to-b from-gold-300 to-gold-200 shadow-md z-[2]"
                style={{ 
                  transformOrigin: 'bottom center',
                  bottom: '50%',
                  left: 'calc(50% - 2px)'
                }}
                animate={{ rotate: minuteRotation }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Second hand */}
              <motion.div
                className="absolute w-[2px] h-[100px] rounded bg-red-500 z-[3]"
                style={{ 
                  transformOrigin: 'bottom center',
                  bottom: '50%',
                  left: 'calc(50% - 1px)'
                }}
                animate={{ rotate: secondRotation }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Center cap */}
              <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 shadow-md z-[5]" />
            </div>
          </motion.div>
          
          {/* Gold bar stamp/markings */}
          <motion.div
            animate={isGold ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: isGold ? 0.5 : 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="relative rounded-lg border-2 border-gold-600/30 p-2 text-center">
              <div className="text-sm font-bold text-gold-800">999.9</div>
              <div className="text-xs text-gold-800">FINE GOLD</div>
              <div className="mt-1 text-[10px] text-gold-700">טָלָה</div>
            </div>
            
            {/* 3D effect for gold bar */}
            <motion.div
              animate={isGold ? { opacity: 1 } : { opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-gold-700/40 to-transparent"
            />
            <motion.div
              animate={isGold ? { opacity: 1 } : { opacity: 0 }}
              className="absolute left-0 top-0 h-[15%] w-full bg-gradient-to-b from-gold-100/50 to-transparent"
            />
          </motion.div>
        </motion.div>
        
        {/* Particle effects during transformation */}
        {isGold && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.2, 1] }}
            className="absolute inset-0 pointer-events-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 0,
                }}
                transition={{ duration: 1 }}
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300"
              />
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Ambient light effect */}
      <motion.div
        animate={{
          opacity: isGold ? 0.7 : 0.3,
          scale: isGold ? 1.2 : 1,
        }}
        transition={{ duration: 1.5 }}
        className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-gold-200/30 to-transparent blur-3xl"
      />
    </div>
  );
};

export default GoldenClockAnimation; 