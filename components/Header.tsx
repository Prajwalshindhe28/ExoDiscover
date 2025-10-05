
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6 pb-2 border-b border-gray-700/50">
      <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">{title}</h1>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
};

export default Header;