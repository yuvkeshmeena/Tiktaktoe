import React from 'react';
import { Bot, User, Flame, Zap } from 'lucide-react';
import { AIDifficulty, GameMode, Player, ScoreState, SymbolSkin, TargetWins } from '../types/game';

interface ScoreBoardProps {
  score: ScoreState;
  currentTurn: Player;
  gameMode: GameMode;
  difficulty: AIDifficulty;
  skin: SymbolSkin;
  winner: Player | 'DRAW' | null;
  isAiThinking: boolean;
  targetWins: TargetWins;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  currentTurn,
  gameMode,
  difficulty,
  skin,
  winner,
  isAiThinking,
  targetWins,
}) => {
  const isXTurn = !winner && currentTurn === 'X';
  const isOTurn = !winner && currentTurn === 'O';

  const diffLabel =
    difficulty === 'easy'
      ? 'Novice'
      : difficulty === 'medium'
      ? 'Tactician'
      : 'Grandmaster';

  return (
    <div className="w-full max-w-xl mx-auto my-2 px-2">
      <div className="grid grid-cols-7 gap-2.5 items-center">
        {/* Player X Pod (3 cols) */}
        <div
          className={`col-span-3 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 border relative overflow-hidden ${
            isXTurn
              ? 'bg-[#242c30] border-cyan-500/70 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-500/40'
              : 'bg-[#2a2a2a] border-[#383838]'
          }`}
        >
          {isXTurn && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isXTurn
                    ? 'bg-cyan-500 text-neutral-950 font-bold'
                    : 'bg-[#333333] text-cyan-400'
                }`}
              >
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  {gameMode === 'vs_ai' ? 'You' : 'Player X'}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">P1</span>
              </div>
            </div>

            <span className={`text-xl font-black ${skin.xColor} drop-shadow-sm`}>
              {skin.xDisplay}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#383838]">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {score.seriesScore.x}
              </span>
              {targetWins > 1 && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  / {targetWins}
                </span>
              )}
            </div>

            {isXTurn ? (
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3" /> Turn
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">
                {score.xWins} total
              </span>
            )}
          </div>
        </div>

        {/* Center Series & Match Info (1 col) */}
        <div className="col-span-1 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#383838] flex items-center justify-center text-[10px] font-black text-neutral-400 tracking-wider shadow-inner">
            VS
          </div>
          <div className="mt-1 text-[10px] font-mono text-neutral-400">
            {score.draws} ties
          </div>
          {score.currentStreak > 0 && (
            <div className="mt-1 flex items-center gap-0.5 text-[10px] font-semibold text-amber-400">
              <Flame className="w-3 h-3" />
              <span>{score.currentStreak}</span>
            </div>
          )}
        </div>

        {/* Player O / AI Pod (3 cols) */}
        <div
          className={`col-span-3 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 border relative overflow-hidden ${
            isOTurn
              ? 'bg-[#302528] border-rose-500/70 shadow-lg shadow-rose-500/15 ring-1 ring-rose-500/40'
              : 'bg-[#2a2a2a] border-[#383838]'
          }`}
        >
          {isOTurn && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isOTurn
                    ? 'bg-rose-500 text-neutral-950 font-bold'
                    : 'bg-[#333333] text-rose-400'
                }`}
              >
                {gameMode === 'vs_ai' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">
                  {gameMode === 'vs_ai' ? 'AI Bot' : 'Player O'}
                </span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {gameMode === 'vs_ai' ? diffLabel : 'P2'}
                </span>
              </div>
            </div>

            <span className={`text-xl font-black ${skin.oColor} drop-shadow-sm`}>
              {skin.oDisplay}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#383838]">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {score.seriesScore.o}
              </span>
              {targetWins > 1 && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  / {targetWins}
                </span>
              )}
            </div>

            {isOTurn ? (
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1 animate-pulse">
                {isAiThinking ? 'Thinking...' : 'Turn'}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">
                {score.oWins} total
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
