import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import confetti from 'canvas-confetti';
import { GAME_MODES, TOTAL_QUESTIONS, STATIC_QUESTIONS, PREMIUM_POKEMON_IDS } from './constants';
import { QuizItem, GameState, GameConfig } from './types';
import { Button } from './components/Button';
import { BattleScene } from './components/BattleScene';
import { CircleCheck, CircleX, RefreshCcw, Home, Skull, Trophy, LogOut, Disc } from 'lucide-react';

// --- Simple Sound Effect Helper using Web Audio API (No files needed) ---
const playSound = (type: 'correct' | 'wrong' | 'win') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  if (type === 'correct') {
    // High pitched "Ding!"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'wrong') {
    // Low pitched "Buzz/Thud"
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === 'win') {
    // Simple Arpeggio
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.3);
    });
  }
};

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
  
  // Collection State
  const [collection, setCollection] = useState<number[]>([]);
  const [rewardOptions, setRewardOptions] = useState<number[]>([]);
  const [capturedPokemon, setCapturedPokemon] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  // Load collection from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pinyin-battle-collection');
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load collection", e);
      }
    }
  }, []);

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

  const generateRewards = () => {
    // Generate 3 random IDs from our PREMIUM list
    const options = new Set<number>();
    
    // Safety check just in case collection is full (unlikely with this list, but good practice)
    const availablePool = PREMIUM_POKEMON_IDS;

    while (options.size < 3) {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      const id = availablePool[randomIndex];
      
      // Try to give new ones if possible, but allow dupes if we just need to fill slots
      options.add(id);
    }
    setRewardOptions(Array.from(options));
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
    setCapturedPokemon(null);

    // Setup Questions
    const allQuestions = STATIC_QUESTIONS[config.id];
    const questionLimit = TOTAL_QUESTIONS;
    
    // Shuffle and slice
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, questionLimit);
    setQuestions(shuffled);
    setEnemyHP(shuffled.length); // Enemy HP = Number of questions
    
    setGameState(GameState.PLAYING);
  };

  const nextQuestion = () => {
    if (playerHP <= 0) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
      setHasAnswered(false);
      setPlayerAction('idle');
      setEnemyAction('idle');
    } else {
      // Victory -> Capture Phase
      playSound('win');
      generateRewards();
      setGameState(GameState.CAPTURE);
    }
  };

  const handleCapture = (pokemonId: number) => {
    playSound('win');
    setCapturedPokemon(pokemonId);
    
    // Add to collection if not already owned
    if (!collection.includes(pokemonId)) {
      const newCollection = [...collection, pokemonId];
      setCollection(newCollection);
      localStorage.setItem('pinyin-battle-collection', JSON.stringify(newCollection));
    }

    triggerVictoryConfetti();
    setGameState(GameState.RESULT);
  };

  const handleAnswer = (option: string) => {
    if (hasAnswered || gameState !== GameState.PLAYING) return;

    const currentQ = questions[currentQuestionIndex];
    const isCorrect = option === currentQ.correctFinal;
    
    setHasAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      // Play Sound
      playSound('correct');

      // Attack Logic
      setPlayerAction('attack');
      setEnemyAction('damage');
      triggerAttackConfetti(); 
      
      setTimeout(() => {
        setEnemyHP(prev => Math.max(0, prev - 1));
      }, 200);

      timerRef.current = window.setTimeout(() => {
         nextQuestion();
      }, 1500);

    } else {
      // Play Sound
      playSound('wrong');

      // Damage Logic
      setEnemyAction('attack'); 
      setPlayerAction('damage');
      
      const newHP = playerHP - 1;
      setTimeout(() => {
        setPlayerHP(newHP);
      }, 200);

      if (newHP <= 0) {
        timerRef.current = window.setTimeout(() => {
           setGameState(GameState.GAME_OVER);
        }, 1500);
      } else {
         timerRef.current = window.setTimeout(() => {
            nextQuestion();
         }, 1500);
      }
    }
  };

  // -- RENDER HELPERS --

  const renderMenu = () => (
    <div className="flex flex-col min-h-screen bg-slate-100 pb-8">
      <div className="flex flex-col items-center p-4 max-w-md mx-auto relative z-10 w-full">
        
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
        
        {/* Game Modes */}
        <div className="grid gap-4 w-full mb-8">
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

        {/* Collection Section */}
        <div className="w-full bg-white border-4 border-slate-300 rounded-xl p-4 shadow-sm">
           <h3 className="text-xl font-chinese text-slate-700 mb-3 flex items-center gap-2">
             <Disc size={24} className="text-red-500" />
             My Pokedex ({collection.length})
           </h3>
           
           {collection.length === 0 ? (
             <div className="text-center py-6 text-slate-400 font-mono text-sm">
               Finish a game to catch your first Pokemon!
             </div>
           ) : (
             <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
               {collection.map(id => (
                 <div key={id} className="aspect-square bg-slate-50 rounded border border-slate-200 flex items-center justify-center hover:bg-yellow-50 transition-colors">
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} 
                      className="w-full h-full object-contain"
                      loading="lazy"
                      alt={`Pokemon ${id}`}
                    />
                 </div>
               ))}
             </div>
           )}
        </div>

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
           <button 
             onClick={() => setGameState(GameState.MENU)}
             className="absolute top-3 left-3 z-30 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-lg border-2 border-slate-300 shadow-sm transition-transform active:scale-95 flex items-center gap-1 font-bold text-xs"
           >
             <LogOut size={16} />
             <span>EXIT</span>
           </button>

           <BattleScene 
              config={selectedConfig}
              playerHP={playerHP}
              enemyHP={enemyHP}
              maxEnemyHP={questions.length}
              playerAction={playerAction}
              enemyAction={enemyAction}
           />
        </div>

        {/* Text Box / Dialog Area */}
        <div className="bg-slate-800 border-t-4 border-slate-600 p-4 md:rounded-b-xl shadow-2xl flex-1 flex flex-col">
           
           <div className="bg-white/95 border-4 border-slate-400 rounded-lg p-4 mb-4 min-h-[120px] relative">
               <div className="flex flex-col items-center text-center">
                  <h2 className="font-chinese text-slate-800 mb-2 text-6xl">
                    {question.character}
                  </h2>
                  <div className="bg-yellow-100 px-3 py-1 rounded text-sm text-yellow-800 font-bold mb-2">
                     {question.definition}
                  </div>
                  <div className="text-2xl font-mono text-slate-600">
                     {question.initial}<span className="underline decoration-4 decoration-slate-300 mx-1">???</span>
                  </div>
               </div>

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
               <span>ROUND {currentQuestionIndex + 1}/{questions.length}</span>
           </div>
        </div>
      </div>
    );
  };

  const renderCapture = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 relative text-white">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-chinese text-yellow-400 mb-2 animate-bounce">A Wild Pokemon Appeared!</h2>
            <p className="font-mono text-slate-300">Choose one to catch!</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {rewardOptions.map((id, index) => (
              <button
                key={id}
                onClick={() => handleCapture(id)}
                className="group relative bg-slate-800 border-4 border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-700 hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                 <div className="absolute -top-4 -right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-sm border-2 border-white">
                    I Choose You!
                 </div>
                 <div className="w-32 h-32 relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-yellow-400/20 transition-colors"></div>
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`} 
                      className="w-full h-full object-contain relative z-10 drop-shadow-lg"
                      alt="Pokemon"
                    />
                 </div>
                 <div className="mt-4 w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-green-500"></div>
                 </div>
              </button>
            ))}
         </div>
      </div>
    );
  }

  const renderResult = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-yellow-50 relative">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl border-4 border-poke-ui text-center animate-in zoom-in duration-300">
          
          <div className="flex justify-center -mt-16 mb-4 relative">
             <div className="absolute inset-0 animate-ping opacity-20 bg-yellow-400 rounded-full"></div>
             <img 
               src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${capturedPokemon}.png`} 
               className="w-40 h-40 object-contain drop-shadow-2xl z-10" 
             />
          </div>

          <h2 className="text-4xl font-chinese text-slate-800 mb-2">Gotcha!</h2>
          <p className="text-slate-500 mb-6 font-mono font-bold">New Pokemon was caught!</p>
          
          <div className="flex flex-col gap-3">
             <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600 font-mono mb-2">
                This Pokemon has been added to your Pokedex. Collect them all!
             </div>

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
      {gameState === GameState.CAPTURE && renderCapture()}
      {gameState === GameState.RESULT && renderResult()}
      {gameState === GameState.GAME_OVER && renderGameOver()}
    </div>
  );
}