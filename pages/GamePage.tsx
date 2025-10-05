

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { EXOPLANET_CONCEPTS } from '../constants';
import { GameCard } from '../types';
import AnimatedCard from '../components/AnimatedCard';

interface GamePageProps {
  onBack: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const generateGameBoard = (): GameCard[] => {
  const symbols = [...EXOPLANET_CONCEPTS.map(c => c.symbol), ...EXOPLANET_CONCEPTS.map(c => c.symbol)];
  const shuffledSymbols = shuffleArray(symbols);
  return shuffledSymbols.map((symbol, index) => ({
    id: index,
    type: symbol,
    isFlipped: false,
    isMatched: false,
  }));
};

const InstructionsOverlay: React.FC<{onStart: () => void; onBack: () => void}> = ({ onStart, onBack }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    
    const handleStart = () => {
        if (dontShowAgain) {
            sessionStorage.setItem('hideInstructions_cosmicMemory', 'true');
        }
        onStart();
    };

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <AnimatedCard>
                <div className="text-center p-8 max-w-lg">
                    <h2 className="text-3xl font-bold font-orbitron text-blue-300 mb-4">How to Play: Cosmic Memory</h2>
                    <div className="text-left space-y-3 text-gray-300 mb-6">
                        <p>🚀 The goal is to find all the matching pairs of cosmic symbols.</p>
                        <p>✨ Click a card to flip it over and reveal the symbol.</p>
                        <p>🧠 Try to remember the location of symbols as you flip them.</p>
                        <p>🪐 Click a second card to see if it's a match. If they match, they stay revealed. If not, they'll flip back over.</p>
                        <p>🏆 Clear the entire board to win the game!</p>
                    </div>
                    <button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                        Start Game
                    </button>
                    <div className="mt-4 flex items-center justify-center">
                        <input
                            id="dont-show-again-memory"
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <label htmlFor="dont-show-again-memory" className="ml-2 block text-sm text-gray-400">
                            Don't show again
                        </label>
                    </div>
                    <button onClick={onBack} className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">Back to Hub</button>
                </div>
            </AnimatedCard>
        </div>
    );
};

const GamePage: React.FC<GamePageProps> = ({ onBack }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(() => !sessionStorage.getItem('hideInstructions_cosmicMemory'));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const savedTime = sessionStorage.getItem('bestTime_cosmicMemory');
    return savedTime ? parseInt(savedTime, 10) : null;
  });
  const [fact, setFact] = useState<{name: string, symbol: string, fact: string} | null>(null);

  const resetGame = useCallback(() => {
    setTimerId(currentTimerId => {
      if (currentTimerId) {
        window.clearInterval(currentTimerId);
      }
      return null;
    });
    setCards(generateGameBoard());
    setFlippedCards([]);
    setMoves(0);
    setIsGameWon(false);
    setElapsedTime(0);
    setFact(null);
  }, []);
  
  useEffect(() => {
      resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameWon(true);
      setTimerId(currentTimerId => {
        if (currentTimerId) window.clearInterval(currentTimerId);
        return null;
      });
      if (bestTime === null || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        sessionStorage.setItem('bestTime_cosmicMemory', elapsedTime.toString());
      }
    }
  }, [cards, elapsedTime, bestTime]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.type === secondCard.type) {
        setCards(prev =>
          prev.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        const concept = EXOPLANET_CONCEPTS.find(c => c.symbol === firstCard.type);
        if (concept) {
            setTimeout(() => setFact(concept), 500);
        }
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (fact || showInstructions || flippedCards.length >= 2 || !clickedCard || clickedCard.isFlipped) {
      return;
    }
    
    if (!timerId && !isGameWon) {
        const startTime = Date.now() - elapsedTime * 1000;
        const newTimerId = window.setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        setTimerId(newTimerId);
    }

    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => [...prev, id]);
  };
  
  const handleBack = () => {
    if (moves > 0 && !isGameWon) {
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  if(showInstructions) {
      return <InstructionsOverlay onStart={() => setShowInstructions(false)} onBack={onBack} />;
  }

  return (
    <div className="relative" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Header title="Cosmic Memory" subtitle="Match the pairs and learn about exoplanet exploration" />
      
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-4 font-orbitron text-lg">
            <p>Moves: <span className="text-blue-300">{moves}</span></p>
            <p>Time: <span className="text-blue-300">{elapsedTime}s</span></p>
             <p className="hidden sm:block">Best Time: <span className="text-purple-300">{bestTime !== null ? `${bestTime}s` : 'N/A'}</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Back to Hub</button>
          <button 
            onClick={resetGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors transform hover:scale-105"
          >
            Reset Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ perspective: '1000px' }}>
        {cards.map(card => (
          <div key={card.id} className={`w-full aspect-square cursor-pointer transition-transform duration-500 ease-in-out`} style={{ transformStyle: 'preserve-3d', transform: card.isFlipped ? 'rotateY(180deg)' : 'none' }} onClick={() => handleCardClick(card.id)}>
            <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
              <div className="w-full h-full bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors">
                  <span className="text-3xl text-blue-300">?</span>
              </div>
            </div>
            <div className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl border ${card.isMatched ? 'bg-green-500/30 border-green-400' : 'bg-blue-500/30 border-blue-400'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
              {card.type}
            </div>
          </div>
        ))}
      </div>

       {fact && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={() => setFact(null)} style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <AnimatedCard className="max-w-md text-center cursor-pointer">
                <h3 className="text-2xl font-bold font-orbitron text-blue-300 mb-2">{fact.name}</h3>
                <p className="text-5xl my-4">{fact.symbol}</p>
                <p className="text-gray-300">{fact.fact}</p>
                <button onClick={() => setFact(null)} className="mt-6 text-xs text-gray-400 hover:text-white transition-colors">Click to close</button>
            </AnimatedCard>
        </div>
      )}
      
      {isGameWon && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <AnimatedCard>
                <div className="text-center p-8">
                    <h2 className="text-4xl font-bold font-orbitron text-green-400 mb-4">You Won!</h2>
                    <p className="text-lg text-gray-300">You matched all pairs in {moves} moves and {elapsedTime} seconds.</p>
                    <div className="mt-6 flex space-x-4 justify-center">
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Play Again
                        </button>
                         <button
                            onClick={onBack}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Back to Hub
                        </button>
                    </div>
                </div>
            </AnimatedCard>
        </div>
      )}
    </div>
  );
};

export default GamePage;