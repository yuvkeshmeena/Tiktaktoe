import React from 'react';
import { X, Trophy, CheckCircle2, Award, Keyboard } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-lg bg-[#252525] border border-[#383838] rounded-3xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#383838]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Official Rules & Tactics
              </h3>
              <p className="text-xs text-neutral-400">
                Tournament guidelines, tactics, and hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="my-4 space-y-3.5 text-xs sm:text-sm text-neutral-300">
          <p className="leading-relaxed text-neutral-300">
            Form an unbroken linear alignment of markers before your opponent does.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Players alternate turns placing their designated symbol into any open square.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>3×3 Classic:</strong> Align 3 symbols in a row, column, or diagonal to claim victory.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>4×4 Tactical:</strong> Align 4 consecutive markers along rows, columns, or diagonal vectors.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>If all slots fill with no line complete, the round results in a Stalemate (Draw).</span>
            </div>
          </div>

          {/* Keyboard Controls Tip for Gamers */}
          <div className="p-3.5 rounded-2xl bg-[#2b2b2b] border border-[#3d3d3d]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-400 mb-1.5">
              <Keyboard className="w-4 h-4" />
              <span>Rapid Keyboard Input:</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Use your keyboard or Numpad keys (7, 8, 9 for top row; 4, 5, 6 for center; 1, 2, 3 for bottom) for lightning-fast competitive moves without touching the mouse!
            </p>
          </div>

          {/* Strategic Pro Tip */}
          <div className="p-3.5 rounded-2xl bg-[#282828] border border-[#383838]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400 mb-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Grandmaster Tip:</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              In 3×3, claiming the central vertex creates 4 distinct win threats. If opponent takes center, control opposite corners to maintain tactical parity!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer border border-blue-400/20"
          >
            Ready to Play
          </button>
        </div>
      </div>
    </div>
  );
};
