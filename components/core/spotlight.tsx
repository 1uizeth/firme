'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  size?: number;
  springOptions?: {
    bounce?: number;
    duration?: number;
  };
}

export function Spotlight({ className, size = 64, springOptions }: SpotlightProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const springStyle = springOptions ? {
    transition: `all ${springOptions.duration || 0.1}s cubic-bezier(0.175, 0.885, ${springOptions.bounce || 0.3}, 1.275)`
  } : {};

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          'absolute rounded-full bg-gradient-to-br transition-opacity duration-300',
          className,
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          left: position.x - size,
          top: position.y - size,
          width: size * 2,
          height: size * 2,
          ...springStyle,
        }}
      />
    </div>
  );
} 