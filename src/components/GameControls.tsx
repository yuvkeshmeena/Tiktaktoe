import React from 'react';
import { Undo2, RefreshCw, Cpu, Users, Lightbulb, Trophy } from 'lucide-react';
import { AIDifficulty, BoardDimension, GameMode, TargetWins } from '../types/game';

interface GameControlsProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  difficulty: AIDifficulty;
  onSelectDifficulty: (diff: AIDifficulty) => void;
  boardSize: BoardDimension;
  onSelectBoardSize: (size: BoardDimension) => void;
  targetWins: TargetWins;
  onSelectTargetWins: (target: TargetWins) => void;
  onUndo: () => void;
  canUndo: boolean;
  onHint: () => void;
  canHint: boolean;
  onResetSeries: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onSelectGameMode,
  difficulty,
  onSelectDifficulty,
  boardSize,
  onSelectBoardSize,
  targetWins,
  onSelectTargetWins,
  onUndo,
  canUndo,
  onHint,
  canHint,
  onResetSeries,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-2 px-2 flex flex-col gap-2.5">
      {/* Top Row: Game Mode, Grid Size & Series Target */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Game Mode Segmented Switch */}
        <div className="flex items-center p-1 bg-[#282828] rounded-xl border border-[#383838]">
          <button
            onClick={() => onSelectGameMode('vs_ai')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'vs_ai'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-400/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>vs AI Bot</span>
          </button>
          <button
            onClick={() => onSelectGameMode('pass_and_play')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              gameMode === 'pass_and_play'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-400/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2-Player</span>
          </button>
        </div>

        {/* Grid Size Switcher */}
        <div className="flex items-center p-1 bg-[#282828] rounded-xl border border-[#383838]">
          <button
            onClick={() => onSelectBoardSize(3)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              boardSize === 3
                ? 'bg-[#363636] text-cyan-400 shadow-sm border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            3×3 Grid
          </button>
          <button
            onClick={() => onSelectBoardSize(4)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              boardSize === 4
                ? 'bg-[#363636] text-cyan-400 shadow-sm border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            4×4 Tactical
          </button>
        </div>

        {/* Target Series Match Switcher */}
        <div className="flex items-center p-1 bg-[#282828] rounded-xl border border-[#383838]">
          <span className="text-[11px] text-neutral-400 px-1.5 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <button
            onClick={() => onSelectTargetWins(1)}
            title="Single round match"
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              targetWins === 1
                ? 'bg-[#363636] text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            1 Win
          </button>
          <button
            onClick={() => onSelectTargetWins(3)}
            title="First to 3 wins"
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              targetWins === 3
                ? 'bg-[#363636] text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            First to 3
          </button>
          <button
            onClick={() => onSelectTargetWins(5)}
            title="First to 5 wins"
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              targetWins === 5
                ? 'bg-[#363636] text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            First to 5
          </button>
        </div>
      </div>

      {/* AI Difficulty Bar (Only when vs AI) */}
      {gameMode === 'vs_ai' && (
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#282828] border border-[#383838]">
          <span className="text-xs font-medium text-neutral-400 pl-1">
            AI Algorithm:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectDifficulty('easy')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#333333]'
              }`}
            >
              Novice
            </button>
            <button
              onClick={() => onSelectDifficulty('medium')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#333333]'
              }`}
            >
              Tactician
            </button>
            <button
              onClick={() => onSelectDifficulty('invincible')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                difficulty === 'invincible'
                  ? 'bg-rose-600 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#333333]'
              }`}
            >
              Grandmaster (Unbeatable)
            </button>
          </div>
        </div>
      )}

      {/* Tactile In-Game Action Bar: Hint, Undo, Reset Series */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Hint Button */}
          <button
            onClick={onHint}
            disabled={!canHint}
            title="Get AI suggested move"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              canHint
                ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/40 shadow-sm'
                : 'bg-[#262626] text-neutral-600 border border-[#333333] cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint</span>
          </button>

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last move"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              canUndo
                ? 'bg-[#2e2e2e] text-neutral-200 hover:bg-[#383838] border border-[#3d3d3d] shadow-sm'
                : 'bg-[#262626] text-neutral-600 border border-[#333333] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>

        {/* Reset Series Score */}
        <button
          onClick={onResetSeries}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-rose-400 rounded-xl hover:bg-[#2c2c2c] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Series</span>
        </button>
      </div>
    </div>
  );
};
