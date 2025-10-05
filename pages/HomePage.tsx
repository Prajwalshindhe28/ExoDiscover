
import React, { useState } from 'react';
import AnimatedCard from '../components/AnimatedCard';
import { Page } from '../types';
import { EXOPLANET_DB } from '../constants';
import { Exoplanet } from '../types';
import PlanetVisual, { PlanetStat } from '../components/PlanetVisual';
import { calculateESI } from '../components/planetUtil';

export default function HomePage({ setActivePage }: { setActivePage: (page: Page) => void }) {
  const featuredPlanets = [
    EXOPLANET_DB.find(p => p.id === 'trappist-1e'),
    EXOPLANET_DB.find(p => p.id === 'kepler-186f'),
    EXOPLANET_DB.find(p => p.id === 'kepler-452b'),
    EXOPLANET_DB.find(p => p.id === 'proxima-b'),
  ].filter(Boolean) as Exoplanet[];

  const [activePlanet, setActivePlanet] = useState<Exoplanet>(featuredPlanets[0]);

  const activeEsi = activePlanet ? calculateESI(activePlanet.radius, activePlanet.insolation) : 0;

  return (
    <div className="space-y-12" style={{ animation: 'fade-in-up 0.8s ease-out' }}>
      {/* Hero Section */}
      <div className="relative grid grid-cols-1 items-center gap-8 py-16">
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white">
            Exo<span className="text-blue-400">Discover</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
            Automated Exoplanet Identification & Analysis Platform
          </p>
          <p className="mt-2 text-sm text-blue-300 font-semibold">
            2025 NASA Space Apps Challenge Submission
          </p>
        </div>
      </div>

      {/* Interactive Featured Planet Section */}
      <AnimatedCard className="animated-galaxy-card">
        <h2 className="text-3xl font-bold font-orbitron text-center mb-2 text-white">Featured Worlds</h2>
        <p className="text-center text-gray-400 mb-8">Click on a name to explore details from the exoplanet archive.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Planet Selection */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <ul className="space-y-3 w-full max-w-xs">
              {featuredPlanets.map(planet => (
                <li key={planet.id}>
                  <button
                    onClick={() => setActivePlanet(planet)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 border-2 ${
                      activePlanet.id === planet.id
                        ? 'bg-blue-500/30 border-blue-400 scale-105 shadow-lg'
                        : 'bg-gray-800/50 border-transparent hover:bg-gray-700/70'
                    }`}
                  >
                    <p className="font-bold font-orbitron text-white">{planet.name}</p>
                    <p className="text-xs text-gray-400">{planet.starType}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Planet Visual and Data */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              {activePlanet && <PlanetVisual planet={activePlanet} esi={activeEsi} size={250} />}
            </div>
            <div>
              {activePlanet && (
                <div className="space-y-2">
                  <PlanetStat label="Discovery" value={activePlanet.discoveryMethod} />
                  <PlanetStat label="Radius" value={activePlanet.radius.toFixed(2)} unit="x Earth" />
                  <PlanetStat label="Mass" value={activePlanet.mass.toFixed(2)} unit="x Earth" />
                  <PlanetStat label="Year Length" value={activePlanet.orbitalPeriod.toFixed(1)} unit="days" />
                  <PlanetStat label="Energy Received" value={activePlanet.insolation.toFixed(2)} unit="x Earth" />
                  <div className="pt-4 text-center">
                    <p className="text-sm text-blue-300">Habitability (ESI)</p>
                    <p className="text-5xl font-bold font-orbitron" style={{ color: `hsl(${activeEsi * 120}, 90%, 65%)` }}>
                      {activeEsi.toFixed(3)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}