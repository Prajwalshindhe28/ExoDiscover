import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-2xl shadow-blue-900/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20 relative overflow-hidden group ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 animate-spin-slow"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;

// Add this to your tailwind.config.js or in a <style> tag in index.html if needed for animation
/*
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
animation: {
  'spin-slow': 'spin-slow 6s linear infinite',
}
backgroundImage: {
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
}
*/