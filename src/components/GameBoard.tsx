import React, { useState } from 'react';
import { BoardDimension, CellValue, Player, SymbolSkin, WinInfo } from '../types/game';

interface GameBoardProps {
  board: CellValue[];
  size: BoardDimension;
  onCellClick: (index: number) => void;
  winInfo: WinInfo | null;
  disabled: boolean;
  currentTurn: Player;
  skin: SymbolSkin;
  hintIndex: number | null;
  showKeyHints?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  size,
  onCellClick,
  winInfo,
  disabled,
  currentTurn,
  skin,
  hintIndex,
  showKeyHints = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const winningIndices = new Set(winInfo ? winInfo.line : []);

  // Compute SVG strike line coordinates
  const getStrikeCoordinates = () => {
    if (!winInfo || winInfo.line.length === 0) return null;

    const firstIdx = winInfo.line[0];
    const lastIdx = winInfo.line[winInfo.line.length - 1];

    const r1 = Math.floor(firstIdx / size);
    const c1 = firstIdx % size;
    const r2 = Math.floor(lastIdx / size);
    const c2 = lastIdx % size;

    const x1 = ((c1 + 0.5) / size) * 100;
    const y1 = ((r1 + 0.5) / size) * 100;
    const x2 = ((c2 + 0.5) / size) * 100;
    const y2 = ((r2 + 0.5) / size) * 100;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const extend = 4;

    const ex1 = x1 - (dx / len) * extend;
    const ey1 = y1 - (dy / len) * extend;
    const ex2 = x2 + (dx / len) * extend;
    const ey2 = y2 + (dy / len) * extend;

    return { x1: ex1, y1: ey1, x2: ex2, y2: ey2 };
  };

  const strikeCoords = getStrikeCoordinates();

  // Numpad key mapping for 3x3:
  // 7 8 9
  // 4 5 6
  // 1 2 3
  const numpadKeyMap3x3 = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-square p-2 select-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/5 to-rose-500/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Glass card container */}
      <div className="relative w-full h-full bg-slate-900/90 rounded-3xl p-3 sm:p-3.5 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col justify-center">
        {/* Grid Cells */}
        <div
          className="grid w-full h-full gap-2 sm:gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {board.map((cell, index) => {
            const isWinningCell = winningIndices.has(index);
            const isHovered = hoveredIndex === index && !cell && !disabled && !winInfo;
            const isHint = hintIndex === index && !cell;

            return (
              <button
                key={index}
                onClick={() => onCellClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                disabled={disabled || cell !== null || winInfo !== null}
                aria-label={`Cell ${index + 1}, ${cell ? `Marked ${cell}` : 'Empty'}`}
                className={`relative flex items-center justify-center rounded-2xl font-black transition-all duration-150 cursor-pointer overflow-hidden group focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                  isWinningCell
                    ? winInfo?.winner === 'X'
                      ? 'bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                      : 'bg-rose-950/90 border-2 border-rose-400 text-rose-200 shadow-lg shadow-rose-500/30 scale-[1.02]'
                    : isHint
                    ? 'bg-amber-950/40 border-2 border-amber-400/80 shadow-md shadow-amber-500/20 animate-pulse'
                    : cell
                    ? 'bg-slate-800/80 border border-slate-700/70 text-slate-100 hover:bg-slate-800'
                    : 'bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/90 hover:border-slate-600 active:scale-95'
                }`}
                style={{
                  fontSize: size === 3 ? 'clamp(2.5rem, 8vw, 3.8rem)' : 'clamp(1.75rem, 6vw, 2.6rem)',
                }}
              >
                {/* Cell content */}
                {cell ? (
                  <span
                    className={`animate-pop-in ${
                      cell === 'X'
                        ? `${skin.xColor} drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]`
                        : `${skin.oColor} drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]`
                    }`}
                  >
                    {cell === 'X' ? skin.xDisplay : skin.oDisplay}
                  </span>
                ) : isHovered ? (
                  <span
                    className={`opacity-30 transition-opacity ${
                      currentTurn === 'X' ? skin.xColor : skin.oColor
                    }`}
                  >
                    {currentTurn === 'X' ? skin.xDisplay : skin.oDisplay}
                  </span>
                ) : null}

                {/* Subtle Numpad Key Hint for Desktop */}
                {showKeyHints && size === 3 && !cell && !winInfo && (
                  <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-slate-600 opacity-40 group-hover:opacity-75 transition-opacity pointer-events-none hidden sm:inline">
                    {numpadKeyMap3x3[index]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Strike Line */}
        {strikeCoords && winInfo && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none p-3 sm:p-3.5 z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              x1={`${strikeCoords.x1}%`}
              y1={`${strikeCoords.y1}%`}
              x2={`${strikeCoords.x2}%`}
              y2={`${strikeCoords.y2}%`}
              stroke={winInfo.winner === 'X' ? '#22d3ee' : '#f43f5e'}
              strokeWidth="4.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_currentColor]"
              style={{
                strokeDasharray: 150,
                strokeDashoffset: 0,
                animation: 'strikeDraw 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />
          </svg>
        )}
      </div>
    </div>
  );
};
