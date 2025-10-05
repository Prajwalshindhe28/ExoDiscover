import React from 'react';
import { Exoplanet } from '../types';

const getPlanetStyle = (planet: Exoplanet): React.CSSProperties => {
    // A simplified texture mapping based on planet properties
    if (planet.insolation > 50) { // Hot Jupiters / Molten
        return { backgroundImage: `radial-gradient(circle at 20% 20%, #ffcc00, #ff6600 70%, #990000 100%)` };
    }
    if (planet.starType.includes('M-type')) { // Tidally locked worlds around red dwarfs
        return { backgroundImage: `linear-gradient(90deg, #222 40%, #555 50%, #ddd 60%)` };
    }
    if (planet.radius > 10) { // Gas Giants
        return { backgroundImage: `linear-gradient(45deg, #c3bfae 25%, #8f8f87 25%, #8f8f87 50%, #c3bfae 50%, #c3bfae 75%, #8f8f87 75%, #8f8f87 100%)`, backgroundSize: '56.57px 56.57px' };
    }
    // Default to rocky/terrestrial
    return { backgroundImage: `radial-gradient(circle at 80% 30%, #a89e8d, #6b5b4e 80%)` };
}

interface PlanetVisualProps {
    planet: Exoplanet | null;
    esi: number;
    size?: number; // Optional size prop
}

const PlanetVisual: React.FC<PlanetVisualProps> = ({ planet, esi, size: propSize }) => {
    if (!planet) {
        const defaultSize = propSize || 192; // 192px = w-48, h-48
        return <div style={{width: `${defaultSize}px`, height: `${defaultSize}px`}} className="rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center"><p className="text-gray-500 text-sm">Select Planet</p></div>;
    }
    
    const size = propSize || Math.min(220, 40 + Math.log1p(planet.radius) * 30);
    const surfaceStyle = getPlanetStyle(planet);
    const atmosphereColor = `hsl(${esi * 120}, 90%, 65%)`;

    return (
        <div className="flex flex-col items-center space-y-3 group">
            <div
                className="relative rounded-full shadow-lg"
                style={{ 
                    width: `${size}px`, 
                    height: `${size}px`, 
                }}
            >
                <div 
                    className="absolute inset-0 rounded-full transition-all duration-500 group-hover:animate-pulse-glow-esi"
                    style={{ boxShadow: `0 0 ${15 + esi*20}px ${2 + esi*5}px ${atmosphereColor}` }}
                />
                <div 
                    className="absolute inset-0 rounded-full planet-surface overflow-hidden"
                    style={surfaceStyle}
                >
                    <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset -20px -20px 40px 10px rgba(0,0,0,0.5)' }} />
                </div>
                <div 
                    className="absolute inset-0 rounded-full opacity-40 planet-clouds"
                    style={{
                        backgroundImage: `url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')`,
                        mixBlendMode: 'overlay'
                    }}
                />
            </div>
            <p className="font-orbitron font-bold text-lg mt-4">{planet.name}</p>
        </div>
    );
};

export const PlanetStat: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-gray-700/50">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="font-semibold text-white">{value} <span className="text-gray-500 text-xs">{unit}</span></p>
  </div>
);


export default PlanetVisual;