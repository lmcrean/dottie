import { useEffect } from "react";
import { useLocation } from "react-router-dom";

{/* Logo with animation */}
const AnimatedLogo = ({
  size = 80,
  className = '',
  borderColor = 'border-pink-600',
  logoSrc = '/logo-mascot.png',
  logoSize = 48,
}) => {
  return (
    <div className={`flex justify-center items-center mb-6 ${className} `}>
      <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
        <div className={`absolute w-full h-full border-t-4 rounded-full animate-spin-left ${borderColor}`}></div>
        <div className={`absolute w-full h-full border-b-4 rounded-full animate-spin-right ${borderColor}`}></div>

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
