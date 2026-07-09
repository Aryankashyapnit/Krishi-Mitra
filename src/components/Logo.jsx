import React from 'react';

export default function Logo({ width = 48, height = 48, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Krishi Mitra Logo"
    >
      <defs>
        {/* Deep Green to Emerald Gradient for Left Leaf */}
        <linearGradient id="green-leaf-grad" x1="15" y1="85" x2="40" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B4B28" />
          <stop offset="50%" stopColor="#1B5E20" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        
        {/* Ochre to Gold Gradient for Right Leaf */}
        <linearGradient id="gold-leaf-grad" x1="45" y1="85" x2="85" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A87F18" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F3E5AB" />
        </linearGradient>

        {/* Sun Gradient */}
        <linearGradient id="sun-grad" x1="55" y1="15" x2="55" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E5A93B" />
          <stop offset="100%" stopColor="#F7D373" />
        </linearGradient>
      </defs>

      {/* Sun in the background */}
      <circle 
        cx="56" 
        cy="36" 
        r="18" 
        fill="url(#sun-grad)" 
      />
      
      {/* Curved Green Leaf (Left Side) */}
      <path
        d="M50 82 C40 82 23 70 16 50 C10 35 12 21 16 14 C27 19 37 32 39 46 C41 60 48 76 50 82 Z"
        fill="url(#green-leaf-grad)"
      />
      
      {/* Light veins detail inside green leaf */}
      <path
        d="M18 16 C23 32 31 49 47 67"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Golden Leaf (Right Side) */}
      <path
        d="M50 82 C53 71 63 56 78 52 C88 48 90 60 84 68 C76 76 63 81 50 82 Z"
        fill="url(#gold-leaf-grad)"
      />

      {/* Veins detail inside gold leaf */}
      <path
        d="M51 82 C61 74 72 70 81 68"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Underlying connecting stem details */}
      <path
        d="M50 82 C44 82 40 76 42 70 C44 64 50 60 56 60"
        stroke="#0B4B28"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
