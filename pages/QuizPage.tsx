import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import { QuizQuestion } from '../types';
import AnimatedCard from '../components/AnimatedCard';

interface QuizPageProps {
  onBack: () => void;
  questions: QuizQuestion[];
  title: string;
  subtitle: string;
  timeLimitInSeconds: number;
}

const QuizIntro: React.FC<{
  title: string;
  questionCount: number;
  timeLimitInSeconds: number;
  onStart: () => void;
  onBack: () => void;
}> = ({ title, questionCount, timeLimitInSeconds, onStart, onBack }) => (
    <div className="text-center flex flex-col items-center p-4">
        <h3 className="text-2xl font-bold font-orbitron text-blue-300 mb-4">Prepare for: {title}</h3>
        <div className="my-6 space-y-3 text-gray-300 max-w-md">
            <p>This quiz will test your knowledge on the subject. Please read each question carefully before answering.</p>
            <p>You will face <span className="font-bold text-white">{questionCount}</span> questions.</p>
            <p>The total time limit is <span className="font-bold text-white">{Math.floor(timeLimitInSeconds / 60)} minutes and {timeLimitInSeconds % 60} seconds</span>.</p>
        </div>
        <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
        >
            Begin Quiz
        </button>
        <button onClick={onBack} className="mt-4 block w-full text-sm text-gray-400 hover:text-white transition-colors">Back to Hub</button>
    </div>
);


const QuizResults: React.FC<{ 
  questions: QuizQuestion[]; 
  userAnswers: Record<number, string>;
  score: number;
  wasTimeout: boolean;
  onRestart: () => void;
  onBack: () => void;
}> = ({ questions, userAnswers, score, wasTimeout, onRestart, onBack }) => {
  return (
    <div className="text-center">
      {wasTimeout ? (
        <h3 className="text-3xl font-bold text-red-400">Time's Up!</h3>
      ) : (
        <h3 className="text-3xl font-bold text-blue-300">Quiz Complete!</h3>
      )}
      <p className="text-6xl my-4">{score > questions.length / 2 ? '🎉' : '🔭'}</p>
      <p className="text-xl text-gray-300">You scored</p>
      <p className="text-5xl font-bold my-2 text-white">{score} <span className="text-3xl text-gray-400">/ {questions.length}</span></p>
      
      <div className="my-8 text-left space-y-4 max-h-[40vh] overflow-y-auto pr-2 sm:pr-4">
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="font-semibold text-white">{index + 1}. {q.question}</p>
              <p className={`mt-2 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                Your answer: {userAnswer || "Not answered"} {isCorrect ? '✔' : '✖'}
              </p>
              {!isCorrect && (
                <p className="mt-1 text-sm text-gray-400">Correct answer: <span className="text-green-400 font-semibold">{q.correctAnswer}</span></p>
              )}
              <p className="mt-2 text-xs text-gray-400 italic bg-black/20 p-2 rounded">{q.explanation}</p>
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={onRestart} 
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
      >
        Play Again
      </button>
      <button onClick={onBack} className="mt-4 block w-full text-sm text-gray-400 hover:text-white transition-colors">Back to Hub</button>
    </div>
  );
};


const QuizPage: React.FC<QuizPageProps> = ({ onBack, questions, title, subtitle, timeLimitInSeconds }) => {
  const [quizState, setQuizState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitInSeconds);
  const [wasTimeout, setWasTimeout] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (quizState !== 'playing') return;

    if (timeLeft <= 0) {
      setWasTimeout(true);
      setQuizState('results');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, quizState]);

  const handleAnswer = useCallback((answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  }, [currentQuestionIndex, isAnswered, questions]);

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  };
  
  const handleBack = () => {
    const hasProgress = Object.keys(userAnswers).length > 0;
    if (quizState === 'playing' && hasProgress) {
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const restartQuiz = () => {
    setQuizState('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(timeLimitInSeconds);
    setWasTimeout(false);
    setUserAnswers({});
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-gray-700/50 hover:bg-blue-500/30';
    }
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect && option === selectedAnswer) {
      return 'correct-answer'; // Green flash for the selected correct answer
    }
    if (isCorrect) {
      return 'bg-green-500/50'; // Just green for the non-selected correct answer
    }
    if (option === selectedAnswer && !isCorrect) {
      return 'wrong-answer'; // Red shake for the selected wrong answer
    }
    return 'disabled-answer'; // Grayed out for other options
  };
  
  const timePercentage = (timeLeft / timeLimitInSeconds) * 100;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
       <Header title={title} subtitle={subtitle} />
      <AnimatedCard className="bg-black/30 backdrop-blur-md border-transparent shadow-none">
        {quizState === 'intro' && (
          <QuizIntro 
            title={title}
            questionCount={questions.length}
            timeLimitInSeconds={timeLimitInSeconds}
            onStart={() => setQuizState('playing')}
            onBack={onBack}
          />
        )}
        {quizState === 'playing' && (
          <div key={currentQuestionIndex} style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h3 className="text-2xl font-semibold mt-1 text-white">{questions[currentQuestionIndex].question}</h3>
                </div>
                <div className="text-right">
                     <button onClick={handleBack} className="text-sm text-gray-400 hover:text-white transition-colors mb-2">&larr; Back to Hub</button>
                     <div className="font-orbitron text-lg">Time: <span className="text-blue-300">{timeLeft}s</span></div>
                </div>
            </div>
             <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${timePercentage}%` }}></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg text-left transition-all duration-300 ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {isAnswered && (
              <div className="mt-6 text-center" style={{ animation: 'fadeIn 0.5s' }}>
                 <p className="mt-2 text-sm text-gray-300 italic bg-black/20 p-3 rounded-md mb-4">{questions[currentQuestionIndex].explanation}</p>
                 <button 
                  onClick={handleNext} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Results'}
                </button>
              </div>
            )}
          </div>
        )}
        {quizState === 'results' && (
          <QuizResults 
            questions={questions}
            userAnswers={userAnswers}
            score={score}
            wasTimeout={wasTimeout}
            onRestart={restartQuiz}
            onBack={onBack}
          />
        )}
      </AnimatedCard>
    </div>
  );
};

export default QuizPage;