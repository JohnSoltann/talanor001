'use client';

import { useEffect, useState } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate rotations
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourRotation = 30 * hours + minutes / 2;
  const minuteRotation = 6 * minutes;
  const secondRotation = 6 * seconds;
  
  return (
    <div className="relative w-[240px] h-[240px] rounded-full border-8 border-gray-800 bg-gray-900 shadow-xl">
      {/* Clock Face */}
      <div className="absolute inset-2 rounded-full bg-white">
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-4 bg-black"
            style={{
              top: '10px',
              left: '50%',
              marginLeft: '-0.5px',
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
        
        {/* Hour Numbers */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-bold">12</div>
        <div className="absolute top-[30px] right-[60px] font-bold">1</div>
        <div className="absolute top-[60px] right-[30px] font-bold">2</div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold">3</div>
        <div className="absolute bottom-[60px] right-[30px] font-bold">4</div>
        <div className="absolute bottom-[30px] right-[60px] font-bold">5</div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-bold">6</div>
        <div className="absolute bottom-[30px] left-[60px] font-bold">7</div>
        <div className="absolute bottom-[60px] left-[30px] font-bold">8</div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold">9</div>
        <div className="absolute top-[60px] left-[30px] font-bold">10</div>
        <div className="absolute top-[30px] left-[60px] font-bold">11</div>
        
        {/* Hour Hand */}
        <div 
          className="absolute w-2 h-[60px] bg-black rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transform: `rotate(${hourRotation}deg)`,
          }}
        />
        
        {/* Minute Hand */}
        <div 
          className="absolute w-1.5 h-[80px] bg-black rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: 'calc(50% - 0.75px)',
            transform: `rotate(${minuteRotation}deg)`,
          }}
        />
        
        {/* Second Hand */}
        <div 
          className="absolute w-1 h-[90px] bg-red-500 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: 'calc(50% - 0.5px)',
            transform: `rotate(${secondRotation}deg)`,
          }}
        />
        
        {/* Center Dot */}
        <div className="absolute w-4 h-4 bg-black rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default ClockWidget; 