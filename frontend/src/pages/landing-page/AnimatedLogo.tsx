import React from 'react';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
  borderColor?: string;
  logoSrc?: string;
  logoSize?: number;
}

/* Logo with animation */
const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 80,
  className = '',
  borderColor = 'border-pink-600',
  logoSrc = '/logo/logo-mascot.svg',
  logoSize = 48
}) => {
  return (
    <div className={`mb-6 flex items-center justify-center ${className} `}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div
          className={`animate-spin-left absolute h-full w-full rounded-full border-t-4 ${borderColor}`}
        ></div>
        <div
          className={`animate-spin-right absolute h-full w-full rounded-full border-b-4 ${borderColor}`}
        ></div>

        {/* Logo */}
        <img
          src={logoSrc} // Replace with your logo's path
          alt="Landing Logo"
          className={`relative z-10 object-contain`} // Adjust size and ensure it fits
          style={{ width: logoSize, height: logoSize }}
        />
      </div>
    </div>
  );
};

export default AnimatedLogo;
