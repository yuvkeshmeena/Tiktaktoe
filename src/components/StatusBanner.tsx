import React from 'react';
import { RotateCcw, Trophy, HelpCircle, Loader2 } from 'lucide-react';
import { GameMode, Player, TargetWins } from '../types/game';

interface StatusBannerProps {
  winner: Player | 'DRAW' | null;
  currentTurn: Player;
  gameMode: GameMode;
  isAiThinking: boolean;
  onPlayAgain: () => void;
  isSeriesWon: boolean;
  seriesWinner: Player | null;
  targetWins: TargetWins;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  winner,
  currentTurn,
  gameMode,
  isAiThinking,
  onPlayAgain,
  isSeriesWon,
  seriesWinner,
  targetWins,
}) => {
  if (isSeriesWon && seriesWinner) {
    const isHumanSeries = gameMode === 'vs_ai' && seriesWinner === 'X';

    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto my-2 px-4 py-3 rounded-2xl bg-[#2a271f] border border-amber-500/50 shadow-xl flex items-center justify-between gap-3 animate-pop-in">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
            <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
          </div>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
              {isHumanSeries
                ? '🏆 Championship Victory!'
                : `🏆 Player ${seriesWinner} Won the Series!`}
            </h3>
            <p className="text-xs text-amber-300/80 truncate">
              First to reach {targetWins} wins!
            </p>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Series</span>
        </button>
      </div>
    );
  }

  if (winner) {
    const isHumanWinVsAi = gameMode === 'vs_ai' && winner === 'X';
    const isAiWin = gameMode === 'vs_ai' && winner === 'O';

    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto my-2 px-4 py-3 rounded-2xl bg-[#2a2a2a] border border-[#444444] shadow-xl flex items-center justify-between gap-3 animate-pop-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            {winner === 'DRAW' ? (
              <HelpCircle className="w-5 h-5 text-amber-400" />
            ) : (
              <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
            )}
          </div>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {winner === 'DRAW'
                ? "It's a Stalemate (Draw)!"
                : isHumanWinVsAi
                ? 'Victory! You defeated the AI'
                : isAiWin
                ? 'Defeat! The AI took this round'
                : `Player ${winner} Wins This Round!`}
            </h3>
            <p className="text-xs text-neutral-400 truncate">
              {winner === 'DRAW' ? 'Both sides matched evenly.' : 'Match completed with clean alignment.'}
            </p>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl transition-all shadow-md shadow-blue-600/30 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 border border-blue-400/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Next Round</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto my-1.5 px-3 py-1 flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-300">
      {isAiThinking ? (
        <div className="flex items-center gap-2 text-rose-400 font-semibold tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
          <span>AI is computing optimal countermove...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 font-medium text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              currentTurn === 'X' ? 'bg-cyan-400 animate-ping' : 'bg-rose-400 animate-ping'
            }`}
          />
          <span className="text-neutral-400">
            {gameMode === 'vs_ai' && currentTurn === 'X'
              ? 'Your Turn · Choose any open square'
              : gameMode === 'vs_ai'
              ? 'AI Bot Turn'
              : `Player ${currentTurn}'s Turn`}
          </span>
        </div>
      )}
    </div>
  );
};
