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
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6 border-b border-[#333333] bg-[#212121]/90 backdrop-blur-md sticky top-0 z-20">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 text-sm tracking-tighter shrink-0 border border-cyan-400/30">
          ✕◯
        </div>
        <div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap block font-display">
            TIC TAC TOE PRO
          </span>
          <span className="text-[11px] text-neutral-400 font-medium hidden sm:block tracking-wide uppercase">
            Competitive Grid Battle
          </span>
        </div>
      </div>

      {/* Zone 2: Nav Links & Modals */}
      <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium text-neutral-300">
        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2c2c2c] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-neutral-300"
          title="Match Statistics"
        >
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Analytics</span>
        </button>

        <button
          onClick={onOpenSkins}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2c2c2c] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-neutral-300"
          title="Custom Skins & Markers"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Themes</span>
        </button>

        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2c2c2c] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-neutral-300"
          title="Rules & How to Play"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2c2c2c] hover:text-white transition-colors cursor-pointer whitespace-nowrap text-neutral-300"
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
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-lg transition-all shadow-md shadow-blue-600/25 whitespace-nowrap cursor-pointer border border-blue-400/30"
        >
          New Match
        </button>
      </div>
    </header>
  );
};
