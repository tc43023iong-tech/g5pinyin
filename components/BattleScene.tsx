import React from 'react';
import { GameConfig } from '../types';

interface BattleSceneProps {
  config: GameConfig;
  playerHP: number; // 0-3
  enemyHP: number; // Current HP
  maxEnemyHP: number; // Max HP
  playerAction: 'idle' | 'attack' | 'damage';
  enemyAction: 'idle' | 'attack' | 'damage';
}

export const BattleScene: React.FC<BattleSceneProps> = ({
  config,
  playerHP,
  enemyHP,
  maxEnemyHP,
  playerAction,
  enemyAction
}) => {
  // Animated sprites from PokeAPI GitHub repository
  const playerSprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/25.gif"; // Pikachu Back
  const enemySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${config.opponentId}.gif`;

  const enemyHealthPercent = (enemyHP / maxEnemyHP) * 100;

  // Function to determine health bar color
  const getHealthColor = (percent: number) => {
    if (percent > 50) return 'bg-poke-hp'; // Green
    if (percent > 20) return 'bg-poke-hpylw'; // Yellow
    return 'bg-poke-hpred'; // Red
  };

  return (
    <div className={`relative w-full aspect-video md:h-80 rounded-t-lg overflow-hidden border-b-4 border-poke-ui bg-gradient-to-b ${config.bgGradient}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* --- ENEMY AREA (Top Right) --- */}
      <div className="absolute top-4 right-4 md:right-12 flex flex-col items-end z-10">
        <div className={`relative w-24 h-24 md:w-32 md:h-32 transition-transform duration-200 
            ${enemyAction === 'damage' ? 'animate-flash opacity-70' : 'animate-float'}
        `}>
          {/* Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/20 rounded-full blur-sm"></div>
          <img src={enemySprite} alt="Enemy" className="w-full h-full object-contain pixelated" />
        </div>
      </div>

      {/* --- ENEMY HUD (Top Left) --- */}
      {/* Moved down to top-16 to avoid overlapping with the EXIT button at top-3 */}
      <div className="absolute top-16 left-4 bg-white/90 border-2 border-poke-ui rounded-lg p-2 pr-6 shadow-md min-w-[160px] z-20">
        <div className="flex justify-between items-baseline mb-1">
           <span className="font-bold font-sans text-sm uppercase text-slate-800">{config.opponentName}</span>
           <span className="text-xs font-mono text-slate-500">Lv.{maxEnemyHP}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full border border-slate-400 overflow-hidden relative">
           <div className="absolute top-0 left-0 h-full w-full bg-slate-300"></div> {/* empty bar */}
           <div 
             className={`h-full transition-all duration-500 ease-out ${getHealthColor(enemyHealthPercent)}`} 
             style={{ width: `${enemyHealthPercent}%` }}
           ></div>
        </div>
      </div>


      {/* --- PLAYER AREA (Bottom Left) --- */}
      <div className="absolute bottom-0 left-4 md:left-12 flex flex-col items-start z-20">
        <div className={`relative w-28 h-28 md:w-40 md:h-40 transition-transform duration-100
             ${playerAction === 'attack' ? 'animate-attack-fwd' : ''}
             ${playerAction === 'damage' ? 'animate-shake opacity-80' : ''}
        `}>
           {/* Shadow */}
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-sm"></div>
           <img src={playerSprite} alt="Player" className="w-full h-full object-contain pixelated" />
        </div>
      </div>

       {/* --- PLAYER HUD (Bottom Right) --- */}
       <div className="absolute bottom-8 right-4 bg-white/90 border-2 border-poke-ui rounded-lg p-3 shadow-md min-w-[160px]">
        <div className="flex justify-between items-baseline mb-1">
           <span className="font-bold font-sans text-sm uppercase text-slate-800">PIKACHU</span>
           <span className="text-xs font-mono text-slate-500">Lv.5</span>
        </div>
        
        {/* Hearts for Player HP */}
        <div className="flex items-center gap-1 justify-end">
            {[1, 2, 3].map((heart) => (
                <div key={heart} className={`w-4 h-4 rounded-full border border-slate-500 ${playerHP >= heart ? 'bg-poke-hpred' : 'bg-slate-300'}`}></div>
            ))}
        </div>
        <div className="text-right text-xs font-mono mt-1 text-slate-600">{playerHP}/3 HP</div>
      </div>

    </div>
  );
};
