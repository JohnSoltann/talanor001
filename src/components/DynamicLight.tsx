'use client';

import { useEffect } from 'react';

export default function DynamicLight() {
  useEffect(() => {
    const lightEffect = document.getElementById('lightEffect');
    if (!lightEffect) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = lightEffect.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      lightEffect.style.setProperty('--x', `${x}%`);
      lightEffect.style.setProperty('--y', `${y}%`);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = lightEffect.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      lightEffect.style.setProperty('--x', `${x}%`);
      lightEffect.style.setProperty('--y', `${y}%`);
    };

    const parent = lightEffect.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('touchmove', handleTouchMove);

      return () => {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  return null;
} 