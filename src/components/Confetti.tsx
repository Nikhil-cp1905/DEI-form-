'use client';

import React, { useState, useEffect, useMemo } from 'react';

const EMOJIS = ['🎉', '🎊', '🥳', '✨', '🎈', '🤩', '🚀', '👍', '💯'];
const CONFETTI_COUNT = 100;

interface Particle {
  id: number;
  emoji: string;
  style: React.CSSProperties;
}

const Confetti = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 4}s`, // 4-7 seconds
        animationDelay: `${Math.random() * 2}s`,
        fontSize: `${Math.random() * 1.5 + 1}rem`, // 1rem - 2.5rem
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    }));
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute animate-fall"
          style={particle.style}
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  );
};

export default Confetti;
