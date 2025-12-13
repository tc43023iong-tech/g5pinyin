import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import confetti from 'canvas-confetti';
import { GAME_MODES, TOTAL_QUESTIONS, STATIC_QUESTIONS } from './constants';
import { QuizItem, GameState, GameConfig } from './types';
import { Button } from './components/Button';
import { BattleScene } from './components/BattleScene';
import { CircleCheck, CircleX, RefreshCcw, Home, Skull, Trophy, LogOut } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedConfig, setSelectedConfig] = useState<GameConfig | null>(null);
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Battle State
  const [enemyHP, setEnemyHP] = useState(0);
  const [playerHP, setPlayerHP] = useState(3);
  const [playerAction, setPlayerAction] = useState<'idle' | 'attack' | 'damage'>('idle');
  const [enemyAction, setEnemyAction] = useState<'idle' | 'attack' | 'damage'>('idle');

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerVictoryConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const triggerAttackConfetti = () => {
    // Quick burst for correct answer
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFE18D', '#FF3B30', '#E7F6E4'] // Pokemon type colors-ish
    });
  };

  const startGame = (config: GameConfig) => {
    setSelectedConfig(config);
    // Reset Battle Stats
    setPlayerHP(3);
    setFeedback(null);
    setHasAnswered(false);
    setCurrentQuestionIndex(0);
    setPlayerAction('idle');
    setEnemyAction('idle');

    // Setup Questions
    const allQuestions = STATIC_QUESTIONS[config.id];
    // Limit questions to TOTAL_QUESTIONS or array length
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled);
    setEnemyHP(shuffled.length); // Enemy HP = Number of questions
    
    setGameState(GameState.PLAYING);
  };

  const nextQuestion = () => {
    // If player died, game over already handled
    if (playerHP <= 0) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setHasAnswered(false);
      setPlayerAction('idle');
      setEnemyAction('idle');
    } else {
      // Victory
      setGameState(GameState.RESULT);
      setTimeout(triggerVictoryConfetti, 500);
    }
  };

  const handleAnswer = (option: string) => {
    if (hasAnswered || gameState !== GameState.PLAYING) return;

    const currentQ = questions[currentQuestionIndex];
    const isCorrect = option === currentQ.correctFinal;
    
    setHasAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      // Attack Logic
      setPlayerAction('attack');
      setEnemyAction('damage');
      triggerAttackConfetti(); // FIREWORKS!
      
      // Delay HP reduction slightly to match animation
      setTimeout(() => {
        setEnemyHP(prev => Math.max(0, prev - 1));
      }, 200);

      // Next turn
      timerRef.current = window.setTimeout(() => {
         nextQuestion();
      }, 1500);

    } else {
      // Damage Logic
      setEnemyAction('attack'); // Enemy attacks (visual imagination)
      setPlayerAction('damage');
      
      const newHP = playerHP - 1;
      setTimeout(() => {
        setPlayerHP(newHP);
      }, 200);

      if (newHP <= 0) {
        // Game Over
        timerRef.current = window.setTimeout(() => {
           setGameState(GameState.GAME_OVER);
        }, 1500);
      } else {
         // Continue but retry or move on? 
         // For this quiz, we move on but they lost HP
         timerRef.current = window.setTimeout(() => {
            nextQuestion();
         }, 1500);
      }
    }
  };

  // -- RENDER HELPERS --

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto relative z-10 bg-slate-100">
      
      {/* Title Card */}
      <div className="bg-white border-4 border-poke-ui rounded-xl p-6 mb-6 text-center shadow-pixel w-full relative">
         <div className="flex justify-center mb-4">
             <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" className="w-16 h-16 animate-spin-slow" />
         </div>
        <h1 className="text-4xl font-chinese text-slate-800 mt-2 tracking-widest">
          Pinyin Battle
        </h1>
        <p className="font-sans text-slate-500 mt-2">Choose your opponent!</p>
      </div>
      
      <div className="grid gap-4 w-full">
        {GAME_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => startGame(mode)}
            className={`
              relative overflow-hidden
              bg-white hover:bg-slate-50
              border-2 border-poke-ui rounded-xl
              p-3 shadow-pixel hover:translate-y-[2px] hover:shadow-none
              transition-all duration-100
              flex items-center gap-4 text-left group
            `}
          >
            {/* Sprite Icon */}
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:bg-slate-200">
               <img 
                 src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mode.opponentId}.png`} 
                 alt={mode.opponentName}
                 className="w-14 h-14 object-contain" 
                />
            </div>
            
            <div className="flex-1">
              <span className="font-chinese text-xl text-slate-800 block">{mode.name}</span>
              <span className="text-slate-500 text-xs font-sans">{mode.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    const question = questions[currentQuestionIndex];
    if (!question || !selectedConfig) return null;

    const isMultiOption = question.options.length > 2;

    return (
      <div className="flex flex-col min-h-screen max-w-2xl mx-auto md:p-4 bg-poke-ui md:bg-transparent">
        
        {/* Battle Screen Area */}
        <div className="bg-slate-800 rounded-none md:rounded-t-xl overflow-hidden shadow-2xl relative">
           {/* Home / Exit Button */}
           <button 
             onClick={() => setGameState(GameState.MENU)}
             className="absolute top-3 left-3 z-30 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-lg border-2 border-slate-300 shadow-sm transition-transform active:scale-95 flex items-center gap-1 font-bold text-xs"
             title="Return to Menu"
           >
             <LogOut size={16} />
             <span>EXIT</span>
           </button>

           <BattleScene 
              config={selectedConfig}
              playerHP={playerHP}
              enemyHP={enemyHP}
              maxEnemyHP={TOTAL_QUESTIONS}
              playerAction={playerAction}
              enemyAction={enemyAction}
           />
        </div>

        {/* Text Box / Dialog Area */}
        <div className="bg-slate-800 border-t-4 border-slate-600 p-4 md:rounded-b-xl shadow-2xl flex-1 flex flex-col">
           
           {/* Question Box */}
           <div className="bg-white/95 border-4 border-slate-400 rounded-lg p-4 mb-4 min-h-[120px] relative">
               {/* Question Content */}
               <div className="flex flex-col items-center">
                  <h2 className="text-6xl font-chinese text-slate-800 mb-2">{question.character}</h2>
                  <div className="bg-yellow-100 px-3 py-1 rounded text-sm text-yellow-800 font-bold mb-2">
                     Definition: {question.definition}
                  </div>
                  <div className="text-2xl font-mono text-slate-600">
                     {question.initial}<span className="underline decoration-4 decoration-slate-300 mx-1">???</span>
                  </div>
               </div>

               {/* Feedback Overlay */}
               {feedback && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg backdrop-blur-[1px]">
                    <div className={`px-6 py-2 rounded-full font-bold text-white shadow-lg animate-pop
                        ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}
                    `}>
                        {feedback === 'correct' ? 'It\'s super effective!' : 'But it failed...'}
                    </div>
                 </div>
               )}
           </div>

           {/* Move Selection (Options) */}
           <div className={`grid gap-3 ${isMultiOption ? 'grid-cols-2' : 'grid-cols-2'}`}>
              {question.options.map((opt) => (
                  <button
                    key={opt}
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={`
                       py-4 rounded-lg font-mono text-xl font-bold tracking-wider border-b-4 active:border-b-0 active:translate-y-1 transition-all
                       ${hasAnswered 
                          ? (opt === question.correctFinal ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-slate-600 border-slate-700 text-slate-400')
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                       }
                    `}
                  >
                    {opt}
                  </button>
              ))}
           </div>

           <div className="mt-4 flex justify-end items-center text-slate-400 text-xs font-mono">
               <span>ROUND {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}</span>
           </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-yellow-50 relative">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl border-4 border-poke-ui text-center">
          <div className="flex justify-center -mt-16 mb-4">
             <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${selectedConfig?.opponentId}.gif`} className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-3xl font-chinese text-slate-800 mb-2">Victory!</h2>
          <p className="text-slate-500 mb-6 font-mono">You defeated the wild {selectedConfig?.opponentName}!</p>
          
          <div className="flex justify-center gap-2 mb-8">
             <Trophy size={48} className="text-yellow-500" />
          </div>

          <div className="space-y-3">
            <Button onClick={() => startGame(selectedConfig!)} className="w-full justify-center !bg-blue-500 !text-white !border-blue-700">
               Battle Again
            </Button>
            <Button onClick={() => setGameState(GameState.MENU)} variant="secondary" className="w-full justify-center">
               Return to Town
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderGameOver = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white">
       <div className="max-w-md w-full text-center">
         <Skull size={64} className="mx-auto mb-4 text-slate-700" />
         <h2 className="text-3xl font-mono mb-4 text-slate-300">Pikachu fainted!</h2>
         <p className="text-slate-500 mb-8 font-mono text-sm">You have no more Pokemon that can fight...</p>
         <div className="bg-white/10 p-6 rounded-lg mb-8">
             <p className="text-xl font-chinese text-slate-300">眼前一片漆黑...</p>
         </div>
         <Button onClick={() => setGameState(GameState.MENU)} className="!bg-slate-700 !text-white !border-slate-500 w-full justify-center">
            Run to Center
         </Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.RESULT && renderResult()}
      {gameState === GameState.GAME_OVER && renderGameOver()}
    </div>
  );
}
