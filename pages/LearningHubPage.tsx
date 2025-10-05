import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import QuizPage from './QuizPage';
import GamePage from './GamePage';
import TransitDetectivePage from './TransitDetectivePage';
import HyperparameterExplorerPage from './HyperparameterExplorerPage';
import { BASICS_QUIZ_QUESTIONS, MISSION_QUIZ_QUESTIONS, AI_QUIZ_QUESTIONS } from '../constants';
import { JWSTVisual } from './JWSTVisual';

type View = 'hub' | 'quiz-basics' | 'quiz-missions' | 'quiz-ai' | 'game-memory' | 'game-transit' | 'game-hyperparameter';

const missions = [
  { view: 'quiz-basics', title: 'Exoplanet Basics', level: 'Novice', icon: '🌏', image: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=800&auto=format&fit=crop' },
  { view: 'quiz-missions', title: 'Mission Briefing', level: 'Intermediate', icon: '🛰️', image: 'https://images.unsplash.com/photo-1614726353900-95e46c8b5bab?q=80&w=800&auto=format&fit=crop' },
  { view: 'game-transit', title: 'Transit Detective', level: 'Intermediate', icon: '📊', image: 'https://images.unsplash.com/photo-1582092238363-913697abe55b?q=80&w=800&auto=format&fit=crop' },
  { view: 'quiz-ai', title: 'AI/ML Uncovered', level: 'Expert', icon: '🧠', image: 'https://images.unsplash.com/photo-1550751827-4138d04d405b?q=80&w=800&auto=format&fit=crop' },
  { view: 'game-memory', title: 'Cosmic Memory', level: 'All', icon: '✨', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop' },
  { view: 'game-hyperparameter', title: 'Hyperparameter Explorer', level: 'Expert', icon: '🔧', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
];

export default function LearningHubPage() {
  const [view, setView] = useState<View>('hub');
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const missionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (view !== 'hub') return;

    const missionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          missionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const currentMissionRefs = missionRefs.current.filter(ref => ref !== null);
    currentMissionRefs.forEach(ref => missionObserver.observe(ref!));

    const pathObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          pathRef.current?.classList.add('drawing');
          pathObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (journeyRef.current) {
      pathObserver.observe(journeyRef.current);
    }

    return () => {
      currentMissionRefs.forEach(ref => {
        if (ref) missionObserver.unobserve(ref);
      });
      if (journeyRef.current) {
        pathObserver.unobserve(journeyRef.current);
      }
    };
  }, [view]);

  const handleStartJourney = () => {
    journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const SECONDS_PER_QUESTION = 15;

  if (view === 'quiz-basics') return <div><QuizPage onBack={() => setView('hub')} questions={BASICS_QUIZ_QUESTIONS} title="Exoplanet Basics Quiz" subtitle="Test your fundamental knowledge" timeLimitInSeconds={BASICS_QUIZ_QUESTIONS.length * SECONDS_PER_QUESTION} /></div>;
  if (view === 'quiz-missions') return <div><QuizPage onBack={() => setView('hub')} questions={MISSION_QUIZ_QUESTIONS} title="Mission Briefing Quiz" subtitle="Learn about the telescopes searching for exoplanets" timeLimitInSeconds={MISSION_QUIZ_QUESTIONS.length * SECONDS_PER_QUESTION} /></div>;
  if (view === 'quiz-ai') return <div><QuizPage onBack={() => setView('hub')} questions={AI_QUIZ_QUESTIONS} title="AI/ML Uncovered Quiz" subtitle="Explore how AI is revolutionizing astronomy" timeLimitInSeconds={AI_QUIZ_QUESTIONS.length * SECONDS_PER_QUESTION} /></div>;
  if (view === 'game-memory') return <div><GamePage onBack={() => setView('hub')} /></div>;
  if (view === 'game-transit') return <div><TransitDetectivePage onBack={() => setView('hub')} /></div>;
  if (view === 'game-hyperparameter') return <div><HyperparameterExplorerPage onBack={() => setView('hub')} /></div>;

  return (
    <div style={{ animation: 'fade-in-up 0.8s ease-out' }}>
      <Header title="Learning Hub" subtitle="Chart Your Course Through the Cosmos" />

      {/* Intro Section */}
      <div className="relative text-center pt-4 pb-12 px-4 flex flex-col items-center overflow-hidden">
        <JWSTVisual />
        <div className="relative z-10 mt-8">
          <h3 className="text-3xl font-bold font-orbitron">Your Cosmic Journey Begins</h3>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto">Complete interactive missions to expand your knowledge of exoplanets and the technology used to find them.</p>
          <button
            onClick={handleStartJourney}
            style={{ animation: 'button-pulse-glow 3s ease-in-out infinite' }}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Begin Your Journey
          </button>
        </div>
      </div>

      {/* Journey Section */}
      <div ref={journeyRef} className="parallax-starfield w-full mx-auto py-12 overflow-hidden">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          <div className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 800 2400" preserveAspectRatio="none" className="w-auto h-full mx-auto">
              <path ref={pathRef} id="journey-path" d="M 400 50 C 200 250, 600 450, 400 650 S 200 850, 400 1050 S 600 1250, 400 1450 S 200 1650, 400 1850 S 600 2050, 400 2250" fill="none" stroke="rgba(96, 165, 250, 0.4)" strokeWidth="4" />
            </svg>
          </div>

          {missions.map((mission, index) => {
            return (
              <div
                key={mission.view}
                ref={el => { if (el) missionRefs.current[index] = el; }}
                className="mission-point relative my-32 flex items-center justify-center"
              >
                <div
                  onClick={() => setView(mission.view as View)}
                  className="planet-mission group"
                >
                  <div className="planet-icon">{mission.icon}</div>
                  <div className="planet-info">
                    <h3 className="font-bold text-white text-base font-orbitron">{mission.title}</h3>
                    <p className="text-xs text-purple-300 font-semibold">Level: {mission.level}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};