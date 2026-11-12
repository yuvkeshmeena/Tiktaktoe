import React from 'react';
import { X, Trophy, Flame, Target, Hash, BarChart3, Clock } from 'lucide-react';
import { MatchHistoryEntry, ScoreState } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: ScoreState;
  history: MatchHistoryEntry[];
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  score,
  history,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const total = score.xWins + score.oWins + score.draws;
  const xWinRate = total > 0 ? Math.round((score.xWins / total) * 100) : 0;
  const oWinRate = total > 0 ? Math.round((score.oWins / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Player Analytics & Records
              </h3>
              <p className="text-xs text-slate-400">Career stats and recent match log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Hash className="w-3 h-3 text-indigo-400" /> Matches
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums mt-1">
                {total}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
                <Target className="w-3 h-3" /> Win Rate
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums mt-1">
                {xWinRate}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <Flame className="w-3 h-3" /> Streak
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums mt-1">
                {score.currentStreak}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] text-yellow-400 flex items-center gap-1 font-medium">
                <Trophy className="w-3 h-3" /> Best Streak
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-yellow-300 tabular-nums mt-1">
                {score.bestStreak}
              </span>
            </div>
          </div>

          {/* Win Rate Ratio Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-cyan-400">Player X ({score.xWins})</span>
              <span className="text-slate-400">{score.draws} Draws</span>
              <span className="text-rose-400">Player O ({score.oWins})</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${total > 0 ? (score.xWins / total) * 100 : 33.3}%` }}
              />
              <div
                className="bg-slate-600 h-full transition-all duration-300"
                style={{ width: `${total > 0 ? (score.draws / total) * 100 : 33.3}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${total > 0 ? (score.oWins / total) * 100 : 33.3}%` }}
              />
            </div>
          </div>

          {/* Recent Match Log */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recent Match History
            </h4>

            {history.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No completed matches recorded yet. Finish a round to track history!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {history.slice(0, 12).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.winner === 'X'
                            ? 'bg-cyan-400'
                            : item.winner === 'O'
                            ? 'bg-rose-400'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="font-semibold text-white">
                        {item.winner === 'DRAW'
                          ? 'Draw Game'
                          : `Winner: Player ${item.winner}`}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        · {item.boardSize}×{item.boardSize}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <span>{item.totalMoves} moves</span>
                      <span>·</span>
                      <span>{item.mode === 'vs_ai' ? 'vs AI' : 'Pass & Play'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetStats}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
          >
            Reset All Stats
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
