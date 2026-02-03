import React from 'react';

export const NeonHi: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Main Text */}
      <h1 className="text-9xl font-bold text-red-600 animate-deep-pulse select-none cursor-default tracking-wider">
        Hi
      </h1>
      
      {/* Optional: Subtle ambient glow behind the text for extra depth */}
      <div className="absolute inset-0 bg-red-600 blur-[100px] opacity-10 rounded-full pointer-events-none animate-pulse" />
    </div>
  );
};