import React from 'react';
import { Volume2, VolumeX, BookOpen, Sparkles, BarChart2 } from 'lucide-react';

interface HeaderProps {
  onOpenRules: () => void;
  onOpenSkins: () => void;
  onOpenStats: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  onOpenSkins,
  onOpenStats,
  isMuted,
  onToggleSound,
  onNewGame,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6 border-b border-slate-800/80">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 text-sm tracking-tighter">
          ✕◯
        </div>
        <div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap block font-display">
            TIC TAC TOE PRO
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:block tracking-wide uppercase">
            Competitive Grid Battle
          </span>
        </div>
      </div>

      {/* Zone 2: Nav Links & Modals */}
      <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-slate-300">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          title="Match Statistics"
        >
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        <button
          onClick={onOpenSkins}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          title="Custom Skins & Markers"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Themes</span>
        </button>

        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          title="Rules & How to Play"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="shrink-0">
        <button
          onClick={onNewGame}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap cursor-pointer"
        >
          New Match
        </button>
      </div>
    </header>
  );
};
