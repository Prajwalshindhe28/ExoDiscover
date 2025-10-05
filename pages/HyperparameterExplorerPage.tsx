

import React, { useState, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import AnimatedCard from '../components/AnimatedCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const MAX_RUNS = 10;
const OPTIMAL_ESTIMATORS = 280;
const OPTIMAL_DEPTH = 16;
const OPTIMAL_LR = 0.05;

const InstructionsOverlay: React.FC<{onStart: () => void; onBack: () => void;}> = ({ onStart, onBack }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleStart = () => {
        if (dontShowAgain) {
            sessionStorage.setItem('hideInstructions_hyperparameterExplorer', 'true');
        }
        onStart();
    };

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <AnimatedCard>
                <div className="text-center p-8 max-w-lg">
                    <h2 className="text-3xl font-bold font-orbitron text-blue-300 mb-4">How to Play: Hyperparameter Explorer</h2>
                    <div className="text-left space-y-3 text-gray-300 mb-6">
                        <p>🔧 Your goal is to tune the AI model's hyperparameters to get the highest possible accuracy.</p>
                        <p>🎚️ Adjust the sliders for N_Estimators, Max_Depth, and Learning Rate.</p>
                        <p>🤖 Each combination affects the model's performance. There's a "sweet spot" for each one!</p>
                        <p>📈 Click "Train Model" to run a simulation. You have a limited number of runs, so make each one count!</p>
                        <p>🏆 The chart will track your accuracy over time. Try to find the optimal settings and achieve the highest score!</p>
                    </div>
                    <button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        Start Tuning
                    </button>
                    <div className="mt-4 flex items-center justify-center">
                        <input
                            id="dont-show-again-hyper"
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="dont-show-again-hyper" className="ml-2 block text-sm text-gray-400">
                            Don't show again
                        </label>
                    </div>
                    <button onClick={onBack} className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">Back to Hub</button>
                </div>
            </AnimatedCard>
        </div>
    );
};

const HyperparameterExplorerPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'instructions' | 'playing' | 'finished'>(() => 
        sessionStorage.getItem('hideInstructions_hyperparameterExplorer') ? 'playing' : 'instructions'
    );
    const [estimators, setEstimators] = useState(100);
    const [depth, setDepth] = useState(5);
    const [learningRate, setLearningRate] = useState(0.1);
    const [history, setHistory] = useState<{run: number, accuracy: number}[]>([]);
    const [bestScore, setBestScore] = useState(0);
    const [feedback, setFeedback] = useState({ message: '', color: '' });

    const calculateAccuracy = useCallback(() => {
        const estDist = Math.abs(estimators - OPTIMAL_ESTIMATORS) / (500 - 10);
        const depthDist = Math.abs(depth - OPTIMAL_DEPTH) / (30 - 2);
        const lrDist = Math.abs(learningRate - OPTIMAL_LR) / (0.3 - 0.01);

        const estScore = Math.max(0, 1 - estDist * 2) * 6;
        const depthScore = Math.max(0, 1 - depthDist * 2) * 5;
        const lrScore = Math.max(0, 1 - lrDist * 2) * 4;

        const baseAccuracy = 82;
        const randomFactor = (Math.random() - 0.5) * 1.5;
        const totalAccuracy = baseAccuracy + estScore + depthScore + lrScore + randomFactor;

        return parseFloat(Math.min(99.8, totalAccuracy).toFixed(2));
    }, [estimators, depth, learningRate]);

    const handleTrain = () => {
        if (history.length >= MAX_RUNS) return;

        const newAccuracy = calculateAccuracy();
        const newRun = history.length + 1;
        const prevAccuracy = history.length > 0 ? history[history.length - 1].accuracy : 0;
        
        if (newAccuracy > prevAccuracy + 2) {
            setFeedback({ message: 'Excellent improvement!', color: 'text-green-400' });
        } else if (newAccuracy > prevAccuracy) {
            setFeedback({ message: 'Slight improvement, getting warmer!', color: 'text-green-500' });
        } else if (newAccuracy < prevAccuracy - 2) {
            setFeedback({ message: 'Big drop, getting colder...', color: 'text-red-400' });
        } else if (newAccuracy < prevAccuracy) {
            setFeedback({ message: 'Slight drop in accuracy.', color: 'text-yellow-500' });
        } else {
            setFeedback({ message: 'No change, try different values.', color: 'text-gray-400' });
        }
        
        setHistory(prev => [...prev, { run: newRun, accuracy: newAccuracy }]);
        
        if (newAccuracy > bestScore) {
            setBestScore(newAccuracy);
        }

        if (newRun === MAX_RUNS) {
            setGameState('finished');
        }
    };
    
    const resetGame = () => {
        setGameState('playing');
        setHistory([]);
        setBestScore(0);
        setEstimators(100);
        setDepth(5);
        setLearningRate(0.1);
        setFeedback({ message: '', color: '' });
    }
    
    const startGame = () => {
        resetGame();
    };
    
    const handleBack = () => {
        if (history.length > 0 && gameState === 'playing') {
            if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                onBack();
            }
        } else {
            onBack();
        }
    };

    const runsLeft = MAX_RUNS - history.length;
    const currentAccuracy = history.length > 0 ? history[history.length - 1].accuracy : 0;

    if (gameState === 'instructions') {
        return <InstructionsOverlay onStart={startGame} onBack={onBack} />;
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <Header title="Hyperparameter Explorer" subtitle="Tune the AI model to maximize its accuracy" />

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                {/* Controls */}
                <AnimatedCard className="lg:col-span-1 flex flex-col">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">N_Estimators: <span className="font-bold text-blue-300">{estimators}</span></label>
                            <input type="range" min="10" max="500" step="10" value={estimators} onChange={e => setEstimators(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Max_Depth: <span className="font-bold text-blue-300">{depth}</span></label>
                            <input type="range" min="2" max="30" value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Learning_Rate: <span className="font-bold text-blue-300">{learningRate.toFixed(2)}</span></label>
                            <input type="range" min="0.01" max="0.3" step="0.01" value={learningRate} onChange={e => setLearningRate(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                    </div>
                    <div className="mt-auto pt-6 space-y-2">
                        <button onClick={handleTrain} disabled={runsLeft <= 0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                            Train Model ({runsLeft} {runsLeft === 1 ? 'Run' : 'Runs'} Left)
                        </button>
                        <button onClick={handleBack} className="w-full text-center mt-2 text-sm text-gray-400 hover:text-white transition-colors">
                            &larr; Back to Hub
                        </button>
                    </div>
                </AnimatedCard>
                
                {/* Chart and Stats */}
                <AnimatedCard className="lg:col-span-2">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                             <p className="text-2xl font-bold font-orbitron text-white">{currentAccuracy.toFixed(2)}%</p>
                             <h3 className="text-xs font-semibold text-gray-400 uppercase">Last Accuracy</h3>
                        </div>
                         <div>
                             <p className="text-2xl font-bold font-orbitron text-green-400">{bestScore.toFixed(2)}%</p>
                             <h3 className="text-xs font-semibold text-gray-400 uppercase">Best Accuracy</h3>
                        </div>
                         <div>
                             <p className="text-2xl font-bold font-orbitron text-blue-300">{runsLeft}</p>
                             <h3 className="text-xs font-semibold text-gray-400 uppercase">Runs Left</h3>
                        </div>
                    </div>
                     <p className={`text-center text-sm font-semibold h-5 my-2 transition-opacity duration-300 ${feedback.message ? 'opacity-100' : 'opacity-0'} ${feedback.color}`}>
                        {feedback.message || '\u00A0' }
                     </p>
                     <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="run" stroke="#9ca3af" fontSize={12} label={{ value: 'Run #', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                            <YAxis stroke="#9ca3af" fontSize={12} domain={[75, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563' }} />
                            <Line type="monotone" dataKey="accuracy" stroke="#34d399" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </AnimatedCard>

                {gameState === 'finished' && (
                     <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm rounded-xl">
                        <AnimatedCard>
                            <div className="text-center p-8">
                                <h2 className="text-3xl font-bold font-orbitron text-green-400 mb-4">Training Complete!</h2>
                                <p className="text-lg text-gray-300 mb-2">You achieved a best accuracy of:</p>
                                <p className="text-6xl font-bold text-white mb-6">{bestScore.toFixed(2)}%</p>
                                <div className="flex space-x-4 justify-center">
                                    <button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                        Play Again
                                    </button>
                                    <button onClick={onBack} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                        Back to Hub
                                    </button>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HyperparameterExplorerPage;