import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { LIGHT_CURVE_DEFINITIONS } from '../constants';
import { LightCurveData, LightCurvePoint } from '../types';

type Difficulty = 'easy' | 'medium' | 'hard';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const generateLightCurve = (type: string, difficulty: Difficulty): LightCurvePoint[] => {
    const points = 100;
    const data: LightCurvePoint[] = [];
    
    const noiseLevels: Record<Difficulty, number> = { easy: 0.0008, medium: 0.0015, hard: 0.0025 };
    const noiseLevel = noiseLevels[difficulty];
    
    const transitDepth = 0.01 + Math.random() * 0.005;
    const transitDuration = 8 + Math.floor(Math.random() * 5);
    const transitStart = 40 + Math.floor(Math.random() * 10);
    const transitEnd = transitStart + transitDuration;

    const starspotDepth = 0.008 + Math.random() * 0.004;
    const starspotDuration = 10 + Math.floor(Math.random() * 5);
    const starspotStart = 45 + Math.floor(Math.random() * 10);

    for (let i = 0; i < points; i++) {
        let flux = 1.0;
        const noise = (Math.random() - 0.5) * noiseLevel;
        let signal = 0;

        switch (type) {
            case 'transit':
            case 'transit-noisy':
                if (i >= transitStart && i <= transitEnd) {
                    const progress = (i - transitStart) / transitDuration;
                    signal = -Math.sin(progress * Math.PI) * transitDepth;
                }
                break;
            case 'transit-small':
                 if (i >= transitStart && i <= transitEnd) {
                    const progress = (i - transitStart) / transitDuration;
                    signal = -Math.sin(progress * Math.PI) * (transitDepth * 0.4);
                }
                break;
            case 'starspot':
                 if (i >= starspotStart && i < starspotStart + starspotDuration) {
                    const progress = (i - starspotStart) / starspotDuration;
                    signal = -(1-Math.abs(0.5-progress)*2) * starspotDepth;
                }
                break;
            case 'eclipsing-binary':
                 if (i >= starspotStart && i < starspotStart + starspotDuration) {
                    const progress = (i - starspotStart) / starspotDuration;
                    signal = -(1-Math.abs(0.5-progress)*2) * (starspotDepth*5);
                }
                break;
            case 'variable-star':
                 signal = Math.sin(i / 15) * 0.005;
                 break;
            case 'instrument-error':
                 if (i > 50 && i < 53) signal = -0.01;
                 break;
        }
        data.push({ time: i, flux: flux + signal + noise });
    }
    return data;
};


const InstructionsOverlay: React.FC<{onStart: (difficulty: Difficulty) => void; onBack: () => void}> = ({ onStart, onBack }) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleStart = () => {
        if (dontShowAgain) {
            sessionStorage.setItem('hideInstructions_transitDetective', 'true');
        }
        onStart(difficulty);
    };
    
    return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <AnimatedCard>
            <div className="text-center p-8 max-w-lg">
                <h2 className="text-3xl font-bold font-orbitron text-blue-300 mb-4">How to Play: Transit Detective</h2>
                <div className="text-left space-y-3 text-gray-300 mb-6">
                    <p>📊 Your mission is to identify which light curves show the signature of a transiting exoplanet.</p>
                    <p>✅ A real transit looks like a distinct, U-shaped dip in the star's brightness.</p>
                    <p>❌ Beware of false positives! Starspots, eclipsing binaries, and instrument noise can mimic transits.</p>
                    <p>🖱️ Click on all the graphs you believe show a real transit. Selected graphs will be highlighted.</p>
                    <p>🚀 Click "Check Answers" when you've made your selections to see your score!</p>
                </div>
                 <div className="my-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Select Difficulty</h3>
                    <div className="flex justify-center space-x-2">
                        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                            <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors capitalize ${difficulty === d ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                                {d}
                            </button>
                        ))}
                    </div>
                 </div>
                <button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Start Game
                </button>
                <div className="mt-4 flex items-center justify-center">
                    <input
                        id="dont-show-again-transit"
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="dont-show-again-transit" className="ml-2 block text-sm text-gray-400">
                        Don't show again
                    </label>
                </div>
                <button onClick={onBack} className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">Back to Hub</button>
            </div>
        </AnimatedCard>
    </div>
);
}

const MemoizedLightCurve: React.FC<{ data: LightCurvePoint[] }> = React.memo(({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin - 0.002', 'dataMax + 0.002']} hide />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: '1px solid #4b5563' }}
                    labelStyle={{ color: '#d1d5db' }}
                    itemStyle={{ color: '#60a5fa' }}
                />
                <Line type="monotone" dataKey="flux" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
});


const TransitDetectivePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [lightCurves, setLightCurves] = useState<LightCurveData[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'instructions' | 'selecting' | 'results'>(() => 
        sessionStorage.getItem('hideInstructions_transitDetective') ? 'selecting' : 'instructions'
    );
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const shuffleArray = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

    const setupGame = useCallback((selectedDifficulty: Difficulty) => {
        setDifficulty(selectedDifficulty);
        const filteredDefinitions = LIGHT_CURVE_DEFINITIONS.filter(def => def.difficulty.includes(selectedDifficulty));
        const shuffledDefinitions = shuffleArray(filteredDefinitions).slice(0, 6);
        
        const generatedData = shuffledDefinitions.map(def => ({
            ...def,
            data: generateLightCurve(def.type, selectedDifficulty),
        }));

        setLightCurves(generatedData);
        setSelectedIds([]);
        setGameState('selecting');
        setScore(0);
    }, []);
    
    useEffect(() => {
        if (gameState === 'selecting' && lightCurves.length === 0) {
            setupGame(difficulty);
        }
    }, [gameState, lightCurves.length, setupGame, difficulty]);

    const handleCardClick = (id: number) => {
        if (gameState !== 'selecting') return;
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const checkAnswers = () => {
        let currentScore = 0;
        lightCurves.forEach(lc => {
            const wasSelected = selectedIds.includes(lc.id);
            const isCorrect = (wasSelected && lc.isTransit) || (!wasSelected && !lc.isTransit);
            if (isCorrect) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setGameState('results');
    };

    const handleBack = () => {
        if (gameState === 'selecting' && selectedIds.length > 0) {
             if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                onBack();
            }
        } else {
            onBack();
        }
    };

    const getCardStyle = (curve: LightCurveData) => {
        const isSelected = selectedIds.includes(curve.id);
        if (gameState === 'results') {
            const isCorrect = (isSelected && curve.isTransit) || (!isSelected && !curve.isTransit);
            return isCorrect ? 'border-green-500 shadow-green-500/30' : 'border-red-500 shadow-red-500/30';
        }
        if (isSelected) return 'border-blue-500 scale-105 shadow-blue-500/30';
        return 'border-gray-700/50';
    }
    
    if (gameState === 'instructions') {
        return <InstructionsOverlay onStart={(diff) => setupGame(diff)} onBack={onBack} />;
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <Header title="Transit Detective" subtitle="Analyze light curves to find potential exoplanets" />
            
             <div className="flex items-center justify-between mb-6">
                <p className="font-orbitron text-lg">
                    {gameState === 'selecting' ? 'Select all graphs showing a real transit.' : `Your score: ${score}/${lightCurves.length}`}
                </p>
                <div className="flex items-center space-x-4">
                    <button onClick={handleBack} className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Back to Hub</button>
                    {gameState === 'selecting' 
                        ? <button onClick={checkAnswers} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Check Answers</button>
                        : <button onClick={() => setupGame(difficulty)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Play Again</button>
                    }
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lightCurves.map(curve => {
                    const isSelected = selectedIds.includes(curve.id);
                    const isCorrect = (isSelected && curve.isTransit) || (!isSelected && !curve.isTransit);
                    
                    return (
                        <AnimatedCard key={curve.id} onClick={() => handleCardClick(curve.id)} className={`cursor-pointer transition-all duration-300 relative ${getCardStyle(curve)}`}>
                            {gameState === 'results' && (
                                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                                    {isCorrect ? <CheckIcon className="w-4 h-4 text-white" /> : <CrossIcon className="w-4 h-4 text-white" />}
                                </div>
                            )}
                            <h4 className="text-sm font-bold text-center text-blue-300 mb-2">Candidate Signal {curve.id}</h4>
                            <MemoizedLightCurve data={curve.data} />
                            {gameState === 'results' && (
                                 <p className={`mt-2 text-xs text-center font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{curve.explanation}</p>
                            )}
                        </AnimatedCard>
                    );
                })}
            </div>
        </div>
    );
};

export default TransitDetectivePage;