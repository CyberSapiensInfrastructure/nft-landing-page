import React from 'react';

export const DecoElements = React.memo(() => (
  <>
    {/* Noise overlay */}
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-soft-light">
      <div className="absolute inset-0 bg-noise animate-noise" />
    </div>

    {/* Particle grid */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#7042f88b]/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>

    {/* Cyber circles */}
    <div className="fixed left-10 top-40 opacity-30 pointer-events-none z-0">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 border border-[#7042f88b]/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-2 border border-[#7042f88b]/10 rounded-full animate-spin-reverse" />
        <div className="absolute inset-4 border border-[#7042f88b]/5 rounded-full animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#7042f88b]/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  </>
)); 