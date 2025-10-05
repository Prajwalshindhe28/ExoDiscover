import React, { useState, useMemo, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend, Cell } from 'recharts';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { EXOPLANET_DB } from '../constants';
import { Exoplanet, ExplorerPlanet } from '../types';
import { generateComparisonReport } from '../services/geminiService';
import { fetchKeplerExoplanets } from '../services/nasaApiService';
import { calculateESI } from '../components/planetUtil';
import PlanetVisual, { PlanetStat } from '../components/PlanetVisual';

// --- Helper Functions & Components ---

const PLANET_TYPE_DESCRIPTIONS: Record<string, string> = {
    'Rocky': 'A terrestrial planet with a radius up to 1.6x that of Earth, likely composed of rock and metal.',
    'Super-Earth': 'A planet with a radius between 1.6x and 2x Earth\'s, potentially rocky or with a gaseous envelope.',
    'Mini-Neptune': 'A planet smaller than Neptune (2x to 4x Earth\'s radius), likely with a thick gas atmosphere.',
    'Gas Giant': 'A large planet over 4x Earth\'s radius, composed mostly of gases like hydrogen and helium.',
};

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 p-3 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-blue-300 text-base">{data.name}</p>
        <p className="text-gray-300">Type: <span className="font-semibold text-white">{data.type}</span></p>
        <p className="text-gray-300">Distance: <span className="font-semibold text-white">{Math.round(data.distance)} ly</span></p>
        <p className="text-gray-300">Radius: <span className="font-semibold text-white">{data.radius.toFixed(2)}x Earth</span></p>
        <p className="text-gray-300">ESI: <span className="font-semibold text-white">{data.esi.toFixed(3)}</span></p>
      </div>
    );
  }
  return null;
};

const CustomScatterLegend = () => (
    <div className="pulsing-legend flex items-center justify-center space-x-6 text-xs text-gray-400 mt-4">
        <div className="flex items-center space-x-2">
            <span>ESI Scale:</span>
            <span className="text-red-400">Low</span>
            <div className="w-16 h-4 rounded" style={{ background: 'linear-gradient(to right, hsl(0, 90%, 65%), hsl(120, 90%, 65%))' }}></div>
            <span className="text-green-400">High</span>
        </div>
        <div className="flex items-center space-x-2">
            <span>Size also reflects ESI</span>
        </div>
    </div>
);

export default function ExplorerPage() {
    const [activeTab, setActiveTab] = useState('comparator');
    // Comparator State
    const [planetAId, setPlanetAId] = useState<string>(EXOPLANET_DB[0].id);
    const [planetBId, setPlanetBId] = useState<string>(EXOPLANET_DB[1].id);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [comparisonReport, setComparisonReport] = useState('');

    // Galaxy Map State
    const [allPlanets, setAllPlanets] = useState<ExplorerPlanet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [distanceLimit, setDistanceLimit] = useState<number>(5000);
    const [activeInfoType, setActiveInfoType] = useState<string | null>(null);


    // Memoized values for Comparator
    const planetA = useMemo(() => EXOPLANET_DB.find(p => p.id === planetAId) || null, [planetAId]);
    const planetB = useMemo(() => EXOPLANET_DB.find(p => p.id === planetBId) || null, [planetBId]);
    const esiA = planetA ? calculateESI(planetA.radius, planetA.insolation) : 0;
    const esiB = planetB ? calculateESI(planetB.radius, planetB.insolation) : 0;

    // Memoized values for Galaxy Map
    const planetTypes = useMemo(() => {
        if (allPlanets.length === 0) return ['Rocky', 'Super-Earth', 'Mini-Neptune', 'Gas Giant'];
        return [...new Set(allPlanets.map(p => p.type))].sort();
    }, [allPlanets]);

    const maxDistance = useMemo(() => {
        if (allPlanets.length === 0) return 5000;
        return Math.ceil(Math.max(...allPlanets.map(p => p.distance)) / 100) * 100;
    }, [allPlanets]);

    const filteredExplorerData = useMemo(() => {
        return allPlanets.filter(p => 
            selectedTypes.includes(p.type) && p.distance <= distanceLimit
        );
    }, [allPlanets, selectedTypes, distanceLimit]);
    
    // Effect for fetching Galaxy Map data
    useEffect(() => {
        const loadPlanets = async () => {
            if (allPlanets.length > 0) {
                setIsLoading(false);
                return;
            };
            setIsLoading(true);
            setError(null);
            const rawPlanets = await fetchKeplerExoplanets();
            if (rawPlanets && rawPlanets.length > 0) {
                const PARSEC_TO_LY = 3.26156;
                const getPlanetType = (radius: number): string => {
                    if (radius < 1.6) return 'Rocky';
                    if (radius < 2) return 'Super-Earth';
                    if (radius < 4) return 'Mini-Neptune';
                    return 'Gas Giant';
                };
                
                const processedPlanets = rawPlanets
                    .map(p => ({
                        name: p.pl_name ? p.pl_name.trim() : '',
                        type: getPlanetType(p.pl_rade),
                        distance: p.st_dist * PARSEC_TO_LY,
                        radius: p.pl_rade,
                        esi: calculateESI(p.pl_rade, p.pl_insol)
                    }))
                    .filter(p => p.esi > 0 && p.distance > 0 && p.name); // Filter out invalid data

                setAllPlanets(processedPlanets);
                setSelectedTypes([...new Set(processedPlanets.map(p => p.type))]);
                setDistanceLimit(Math.ceil(Math.max(...processedPlanets.map(p => p.distance)) / 100) * 100);
            } else {
                setError("Could not fetch exoplanet data from NASA's archives. The service may be temporarily unavailable.");
            }
            setIsLoading(false);
        };

        if (activeTab === 'galaxy-map') {
            loadPlanets();
        }
    }, [activeTab, allPlanets.length]);

    // Effect for generating comparison report
    useEffect(() => {
        const fetchReport = async () => {
            if (planetA && planetB && planetA.id !== planetB.id) {
                setIsGeneratingReport(true);
                setComparisonReport('');
                try {
                    const report = await generateComparisonReport(planetA, planetB, esiA, esiB);
                    setComparisonReport(report);
                } finally {
                    setIsGeneratingReport(false);
                }
            } else if (planetA && planetB && planetA.id === planetB.id) {
                setComparisonReport("Please select two different planets to generate a comparison analysis.");
                setIsGeneratingReport(false);
            }
        };

        if (activeTab === 'comparator') {
            const timer = setTimeout(() => fetchReport(), 500);
            return () => clearTimeout(timer);
        }
    }, [planetA, planetB, esiA, esiB, activeTab]);
    
    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const renderPlanetDetails = (planet: Exoplanet | null, esi: number) => {
        if (!planet) return <p>Select a planet to see details.</p>;
        return (
            <div className="space-y-2">
                <PlanetStat label="Discovery Method" value={planet.discoveryMethod} />
                <PlanetStat label="Radius" value={planet.radius.toFixed(2)} unit="x Earth" />
                <PlanetStat label="Mass" value={planet.mass.toFixed(2)} unit="x Earth" />
                <PlanetStat label="Orbital Period" value={planet.orbitalPeriod.toFixed(1)} unit="days" />
                <PlanetStat label="Star Type" value={planet.starType} />
                <PlanetStat label="Insolation Flux" value={planet.insolation.toFixed(2)} unit="x Earth" />
                <div className="pt-4 text-center">
                    <p className="text-sm text-blue-300">Habitability Score (ESI)</p>
                    <p className="text-4xl font-bold font-orbitron" style={{ color: `hsl(${esi * 120}, 90%, 65%)` }}>{esi.toFixed(3)}</p>
                </div>
            </div>
        );
    };
    
    const renderComparator = () => (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* --- Planet A Column --- */}
            <AnimatedCard className="flex flex-col h-full">
                <select
                    value={planetAId}
                    onChange={(e) => setPlanetAId(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
                >
                    {EXOPLANET_DB.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="flex-grow flex flex-col items-center justify-center my-4">
                    <PlanetVisual planet={planetA} esi={esiA} />
                </div>
                {renderPlanetDetails(planetA, esiA)}
            </AnimatedCard>

            {/* --- AI Analysis Column --- */}
            <AnimatedCard className="xl:h-full flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-center text-blue-300">AI Comparison Analysis</h3>
                <div className="flex-grow flex items-center justify-center min-h-[300px]">
                {isGeneratingReport ? (
                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating AI insights...</span>
                    </div>
                ) : (
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: comparisonReport.replace(/\n/g, '<br />') }} />
                )}
                </div>
            </AnimatedCard>

            {/* --- Planet B Column --- */}
            <AnimatedCard className="flex flex-col h-full">
                 <select
                    value={planetBId}
                    onChange={(e) => setPlanetBId(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 text-white text-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
                >
                    {EXOPLANET_DB.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="flex-grow flex flex-col items-center justify-center my-4">
                    <PlanetVisual planet={planetB} esi={esiB} />
                </div>
                {renderPlanetDetails(planetB, esiB)}
            </AnimatedCard>
        </div>
    );
    
    const renderGalaxyMap = () => (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
                <AnimatedCard>
                    <h3 className="text-lg font-bold mb-4 text-blue-300">Filters</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Planet Type</label>
                            <div className="space-y-2">
                                {planetTypes.map(type => {
                                    const isInfoActive = activeInfoType === type;
                                    return (
                                        <div key={type} className="flex items-center justify-between">
                                            <label className="flex items-center text-sm text-gray-400 hover:text-white cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => handleTypeToggle(type)}
                                                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                                />
                                                <span className="ml-2">{type}</span>
                                            </label>
                                            <button
                                                onClick={() => setActiveInfoType(prev => prev === type ? null : type)}
                                                aria-label={`More info about ${type} planets`}
                                                className={`p-1 rounded-full ${isInfoActive ? 'bg-blue-500/30' : ''}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isInfoActive ? 'text-blue-300' : 'text-gray-500'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                         <div>
                            <label htmlFor="distance-slider" className="block text-sm font-medium text-gray-300 mb-1">Max Distance: <span className="font-bold text-blue-300">{distanceLimit} ly</span></label>
                            <input
                                id="distance-slider"
                                type="range"
                                min="0"
                                max={maxDistance}
                                step="100"
                                value={distanceLimit}
                                onChange={e => setDistanceLimit(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4 min-h-[6rem]">
                        {activeInfoType && (
                            <div className="p-3 bg-black/20 border border-gray-700/50 rounded-lg" style={{animation: 'fadeIn 0.5s ease-out'}}>
                                 <h4 className="text-sm font-bold text-blue-300 mb-1">{activeInfoType}</h4>
                                <p className="text-xs text-gray-400">{PLANET_TYPE_DESCRIPTIONS[activeInfoType]}</p>
                            </div>
                        )}
                    </div>
                </AnimatedCard>
            </div>
            <div className="lg:col-span-3">
                <AnimatedCard>
                    {isLoading ? (
                         <div className="flex items-center justify-center h-96">
                            <div className="flex items-center justify-center space-x-2 text-gray-400">
                                <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading Kepler Field Data from NASA Archives...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 text-yellow-400 h-96 flex items-center justify-center">{error}</div>
                    ) : (
                        <>
                            <p className="text-center text-gray-400 text-sm mb-2">Displaying {filteredExplorerData.length} of {allPlanets.length} Kepler field exoplanets.</p>
                             <ResponsiveContainer width="100%" height={500} className="pulsing-markers">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />
                                    <XAxis type="number" dataKey="distance" name="Distance" unit=" ly" stroke="#9ca3af" fontSize={12} domain={[0, 'dataMax']}>
                                        <Label value="Distance from Earth (light-years)" offset={-15} position="insideBottom" fill="#9ca3af" />
                                    </XAxis>
                                    <YAxis type="number" dataKey="radius" name="Radius" unit="x Earth" stroke="#9ca3af" fontSize={12} scale="log" domain={['auto', 'auto']}>
                                         <Label value="Planet Radius (Earth=1, log scale)" angle={-90} offset={-10} position="insideLeft" fill="#9ca3af" />
                                    </YAxis>
                                    <ZAxis type="number" dataKey="esi" name="ESI" range={[20, 300]} />
                                    <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend content={<CustomScatterLegend />} verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
                                    <Scatter name="Exoplanets" data={filteredExplorerData} fillOpacity={0.7}>
                                      {filteredExplorerData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={`hsl(${entry.esi * 120}, 90%, 65%)`} />
                                      ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </AnimatedCard>
            </div>
        </div>
    );

    return (
        <div style={{ animation: 'fadeIn 1s ease-out' }}>
            <Header title="Exoplanet Data Explorer" subtitle="Analyze and compare planets from our curated database and the NASA archives" />
            
            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('comparator')} className={`${activeTab === 'comparator' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Planet Comparator</button>
                        <button onClick={() => setActiveTab('galaxy-map')} className={`${activeTab === 'galaxy-map' ? 'border-blue-400 text-blue-300' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>Live Galaxy Map</button>
                    </nav>
                </div>
            </div>

            {activeTab === 'comparator' ? renderComparator() : renderGalaxyMap()}
        </div>
    );
}