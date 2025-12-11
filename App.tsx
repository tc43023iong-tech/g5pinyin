import React, { useState, useEffect, useRef } from 'react';
import { GAME_MODES, TOTAL_QUESTIONS, STATIC_QUESTIONS } from './constants';
import { QuizItem, GameState, GameConfig } from './types';
import { Button } from './components/Button';
import { Mascot } from './components/Mascot';
import { CircleCheck, CircleX, RefreshCcw, Home, Trophy, Star, Sparkles } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedConfig, setSelectedConfig] = useState<GameConfig | null>(null);
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Clear timer on unmount or game state change to prevent memory leaks/errors
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startGame = (config: GameConfig) => {
    setSelectedConfig(config);
    setScore(0);
    setCurrentQuestionIndex(0);
    setFeedback(null);
    setHasAnswered(false);

    // Instant start, no loading delay
    const allQuestions = STATIC_QUESTIONS[config.id];
    // Shuffle the questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setGameState(GameState.PLAYING);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setHasAnswered(false);
    } else {
      setGameState(GameState.RESULT);
    }
  };

  const handleAnswer = (option: string) => {
    if (hasAnswered) return;

    const currentQ = questions[currentQuestionIndex];
    const isCorrect = option === currentQ.correctFinal;
    
    setHasAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after 1.5 seconds
    timerRef.current = window.setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  // -- RENDER HELPERS --

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto relative z-10">
      <Mascot mood="happy" />
      <h1 className="text-4xl md:text-5xl font-chinese text-slate-700 mb-2 text-center drop-shadow-sm">
        拼音泡泡 Pinyin Pop!
      </h1>
      <p className="text-slate-500 mb-8 font-sans text-center">Select a challenge!</p>
      
      <div className="grid gap-4 w-full">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => startGame(mode)}
            className={`${mode.color} p-6 rounded-3xl shadow-md transform transition hover:scale-105 hover:shadow-lg flex flex-col items-center text-center group border-2 border-white/50 backdrop-blur-sm`}
          >
            <span className="font-chinese text-2xl text-slate-800 mb-1">{mode.name}</span>
            <span className="text-slate-700 opacity-75 text-sm font-sans">{mode.description}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    // Adjust grid based on number of options. 
    // If > 2 options, use a denser grid.
    const isMultiOption = question.options.length > 2;
    const gridClass = isMultiOption 
      ? "grid-cols-2 md:grid-cols-4" 
      : "grid-cols-2";
    
    // Adjust button size based on option count
    const buttonPadding = isMultiOption ? "py-4 md:py-5" : "py-6";
    const buttonText = isMultiOption ? "text-xl md:text-2xl" : "text-3xl";

    return (
      <div className="flex flex-col min-h-screen max-w-2xl mx-auto p-4 md:p-6 relative z-10">
        {/* Header with Progress Bar */}
        <div className="flex flex-col mb-6">
           <div className="flex justify-between items-center mb-2">
             <Button size="sm" variant="secondary" onClick={() => setGameState(GameState.MENU)} className="!px-3 !py-2">
               <Home size={18} />
             </Button>
             <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm font-chinese text-slate-600">
               {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
             </div>
           </div>
           
           {/* Progress Bar Container */}
           <div className="w-full bg-white/50 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
             <div 
               className="bg-candy-green h-full rounded-full transition-all duration-500 ease-out" 
               style={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
             ></div>
           </div>
        </div>

        {/* Card */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md w-full rounded-[3rem] p-6 md:p-8 shadow-xl border-4 border-white relative overflow-hidden">
            
            {/* Character Display */}
            <div className="text-center mb-6 mt-4">
              <div className="text-8xl md:text-9xl font-chinese text-slate-800 mb-4 animate-pop">
                {question.character}
              </div>
              <div className="text-2xl text-slate-400 font-sans mb-4">
                {question.definition}
              </div>
              
              {/* Pinyin Hint */}
              <div className="inline-flex items-center justify-center gap-2 bg-slate-100 px-8 py-4 rounded-2xl border-2 border-slate-200">
                 <span className="text-4xl font-mono text-slate-600 font-bold tracking-wider">
                   {question.initial}<span className="text-slate-300">___</span>
                 </span>
              </div>
            </div>

            {/* Options */}
            <div className={`grid gap-3 md:gap-4 mt-6 w-full ${gridClass}`}>
              {question.options.map((opt) => {
                let btnStyle = "bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-slate-200";
                
                if (hasAnswered) {
                  if (opt === question.correctFinal) {
                    btnStyle = "bg-candy-green text-green-800 border-green-300 ring-2 ring-green-200";
                  } else if (opt !== question.correctFinal && feedback === 'wrong') {
                     // For 8 options, maybe just dim the unselected ones more aggressively or hide wrong answer feedback on the button itself to avoid clutter? 
                     // Sticking to current logic: dim all wrong ones.
                     btnStyle = "opacity-40 bg-slate-50 text-slate-400 border-slate-100";
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={`
                      ${btnStyle} 
                      ${buttonPadding} ${buttonText}
                      font-bold rounded-2xl transition-all duration-200
                      ${!hasAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''}
                    `}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Feedback Area (No Button) */}
        <div className="h-24 flex items-center justify-center mt-6">
          {hasAnswered && (
            <div className={`
              w-full p-4 rounded-2xl flex items-center justify-center animate-pop shadow-md
              ${feedback === 'correct' ? 'bg-green-100 text-green-800 border-2 border-green-200' : 'bg-rose-100 text-rose-800 border-2 border-rose-200'}
            `}>
              <div className="flex items-center gap-3">
                 {feedback === 'correct' ? <CircleCheck size={32} /> : <CircleX size={32} />}
                 <div className="flex flex-col text-left">
                    <span className="font-bold text-lg font-chinese">
                      {feedback === 'correct' ? 'Awesome!' : 'Oops!'}
                    </span>
                    <span className="text-sm opacity-80 font-mono">
                      {question.pinyin}
                    </span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    let message = "Good try!";
    if (percentage === 100) message = "Perfect! Amazing!";
    else if (percentage >= 80) message = "Great Job!";
    else if (percentage >= 60) message = "Not bad!";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto text-center relative z-10">
        <Mascot mood="excited" />
        
        <div className="bg-white/95 backdrop-blur-md w-full p-8 rounded-[3rem] shadow-xl border-4 border-candy-yellow flex flex-col items-center">
          <div className="relative mb-6">
             <Trophy size={64} className="text-amber-400 drop-shadow-sm" />
             <div className="absolute -top-2 -right-2">
                <Sparkles size={32} className="text-yellow-300 animate-pulse" />
             </div>
          </div>

          <h2 className="text-3xl font-chinese text-slate-800 mb-2">{message}</h2>
          
          <div className="text-6xl font-black text-slate-700 mb-2 font-mono">
            {score}/{TOTAL_QUESTIONS}
          </div>
          
          <div className="flex flex-wrap justify-center gap-1 mb-8 max-w-[200px]">
            {[...Array(5)].map((_, i) => ( // Show 5 stars representing 20% each
               <Star 
                 key={i} 
                 size={32} 
                 className={(i + 1) * 20 <= percentage ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
               />
            ))}
          </div>

          <div className="grid gap-3 w-full">
            <Button onClick={() => startGame(selectedConfig!)} variant="primary">
               <RefreshCcw className="inline mr-2" size={20} /> Play Again
            </Button>
            <Button onClick={() => setGameState(GameState.MENU)} variant="secondary">
               <Home className="inline mr-2" size={20} /> Main Menu
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
       <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-red-100">
         <h2 className="text-2xl font-chinese text-rose-500 mb-4">Oh no!</h2>
         <p className="text-slate-600 mb-6">Something went wrong.</p>
         <Button onClick={() => setGameState(GameState.MENU)}>Go Back</Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-pink-200">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.RESULT && renderResult()}
      {gameState === GameState.ERROR && renderError()}
    </div>
  );
}
