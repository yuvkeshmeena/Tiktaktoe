/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AIDifficulty,
  BoardDimension,
  CellValue,
  GameMode,
  MatchHistoryEntry,
  MoveRecord,
  Player,
  ScoreState,
  SymbolSkin,
  TargetWins,
  WinInfo,
} from './types/game';
import { SKINS } from './utils/skins';
import { sound } from './utils/audio';
import { fireConfetti } from './utils/confetti';
import { checkWinner, getAIMove, getBestHint, isBoardFull } from './utils/gameLogic';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { StatusBanner } from './components/StatusBanner';
import { GameControls } from './components/GameControls';
import { SkinsModal } from './components/SkinsModal';
import { RulesModal } from './components/RulesModal';
import { StatsModal } from './components/StatsModal';

export default function App() {
  // Config & Preferences
  const [gameMode, setGameMode] = useState<GameMode>('vs_ai');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [boardSize, setBoardSize] = useState<BoardDimension>(3);
  const [targetWins, setTargetWins] = useState<TargetWins>(3);
  const [selectedSkin, setSelectedSkin] = useState<SymbolSkin>(SKINS[0]);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Game Board State
  const [board, setBoard] = useState<CellValue[]>(() => Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winInfo, setWinInfo] = useState<WinInfo | null>(null);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [hintIndex, setHintIndex] = useState<number | null>(null);

  // Series Championship State
  const [isSeriesWon, setIsSeriesWon] = useState<boolean>(false);
  const [seriesWinner, setSeriesWinner] = useState<Player | null>(null);

  // Persistent Score State
  const [score, setScore] = useState<ScoreState>(() => {
    const saved = localStorage.getItem('ttt_pro_score_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      xWins: 0,
      oWins: 0,
      draws: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalMatches: 0,
      seriesScore: { x: 0, o: 0 },
    };
  });

  // Persistent Match History
  const [matchHistory, setMatchHistory] = useState<MatchHistoryEntry[]>(() => {
    const saved = localStorage.getItem('ttt_pro_history_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Modal Dialogs
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // AI delay timer ref
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ttt_pro_score_v3', JSON.stringify(score));
  }, [score]);

  useEffect(() => {
    localStorage.setItem('ttt_pro_history_v3', JSON.stringify(matchHistory));
  }, [matchHistory]);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  // Start a new round
  const startNewGame = useCallback((nextBoardSize: BoardDimension = boardSize) => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }

    setIsAiThinking(false);
    setBoard(Array(nextBoardSize * nextBoardSize).fill(null));
    setWinInfo(null);
    setWinner(null);
    setMoveHistory([]);
    setHintIndex(null);
    setCurrentTurn('X');
    sound.playReset();
  }, [boardSize]);

  // Reset Series Championship
  const handleResetSeries = useCallback(() => {
    setIsSeriesWon(false);
    setSeriesWinner(null);
    setScore((prev) => ({
      ...prev,
      seriesScore: { x: 0, o: 0 },
    }));
    startNewGame(boardSize);
    sound.playReset();
  }, [boardSize, startNewGame]);

  // Switch Board Size
  const handleSelectBoardSize = (newSize: BoardDimension) => {
    if (newSize === boardSize) return;
    setBoardSize(newSize);
    handleResetSeries();
    sound.playClick();
  };

  // Switch Game Mode
  const handleSelectGameMode = (newMode: GameMode) => {
    if (newMode === gameMode) return;
    setGameMode(newMode);
    handleResetSeries();
    sound.playClick();
  };

  // Switch AI Difficulty
  const handleSelectDifficulty = (newDiff: AIDifficulty) => {
    setDifficulty(newDiff);
    sound.playClick();
  };

  // Switch Target Series Wins
  const handleSelectTargetWins = (target: TargetWins) => {
    setTargetWins(target);
    handleResetSeries();
    sound.playClick();
  };

  // Reset Career Records
  const handleResetStats = () => {
    const freshScore: ScoreState = {
      xWins: 0,
      oWins: 0,
      draws: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalMatches: 0,
      seriesScore: { x: 0, o: 0 },
    };
    setScore(freshScore);
    setMatchHistory([]);
    localStorage.removeItem('ttt_pro_score_v3');
    localStorage.removeItem('ttt_pro_history_v3');
    setIsSeriesWon(false);
    setSeriesWinner(null);
    startNewGame(boardSize);
    sound.playClick();
  };

  // Round / Match Over Handling
  const handleMatchEnd = useCallback(
    (win: WinInfo | null, isDraw: boolean, totalMoves: number) => {
      const matchWinner: Player | 'DRAW' = win ? win.winner : 'DRAW';

      // Record to history
      const newEntry: MatchHistoryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        winner: matchWinner,
        boardSize,
        mode: gameMode,
        difficulty: gameMode === 'vs_ai' ? difficulty : undefined,
        timestamp: Date.now(),
        totalMoves,
      };

      setMatchHistory((prev) => [newEntry, ...prev.slice(0, 49)]);

      if (win) {
        setWinInfo(win);
        setWinner(win.winner);
        sound.playWin();
        fireConfetti(2200);

        setScore((prev) => {
          const isX = win.winner === 'X';
          const newX = isX ? prev.xWins + 1 : prev.xWins;
          const newO = !isX ? prev.oWins + 1 : prev.oWins;

          // Series scores
          const newSeriesX = isX ? prev.seriesScore.x + 1 : prev.seriesScore.x;
          const newSeriesO = !isX ? prev.seriesScore.o + 1 : prev.seriesScore.o;

          // Check Series Champion
          if (newSeriesX >= targetWins) {
            setIsSeriesWon(true);
            setSeriesWinner('X');
            fireConfetti(3500);
          } else if (newSeriesO >= targetWins) {
            setIsSeriesWon(true);
            setSeriesWinner('O');
            fireConfetti(3500);
          }

          let streak = prev.currentStreak;
          let best = prev.bestStreak;

          if (gameMode === 'vs_ai') {
            if (win.winner === 'X') {
              streak += 1;
              best = Math.max(best, streak);
            } else {
              streak = 0;
            }
          } else {
            streak += 1;
            best = Math.max(best, streak);
          }

          return {
            ...prev,
            xWins: newX,
            oWins: newO,
            currentStreak: streak,
            bestStreak: best,
            totalMatches: prev.totalMatches + 1,
            seriesScore: {
              x: newSeriesX,
              o: newSeriesO,
            },
          };
        });
      } else if (isDraw) {
        setWinner('DRAW');
        sound.playDraw();
        setScore((prev) => ({
          ...prev,
          draws: prev.draws + 1,
          totalMatches: prev.totalMatches + 1,
        }));
      }
    },
    [boardSize, difficulty, gameMode, targetWins]
  );

  // Trigger AI move
  const triggerAIMove = useCallback(
    (currentBoard: CellValue[], currentMovesCount: number) => {
      setIsAiThinking(true);

      aiTimeoutRef.current = setTimeout(() => {
        const aiMoveIdx = getAIMove(currentBoard, boardSize, difficulty, 'O');
        if (aiMoveIdx === -1) {
          setIsAiThinking(false);
          return;
        }

        const nextBoard = [...currentBoard];
        nextBoard[aiMoveIdx] = 'O';
        setBoard(nextBoard);
        sound.playMove('O');

        const movesNow = currentMovesCount + 1;
        setMoveHistory((prev) => [
          ...prev,
          { index: aiMoveIdx, player: 'O', boardState: nextBoard },
        ]);

        const win = checkWinner(nextBoard, boardSize);
        if (win) {
          handleMatchEnd(win, false, movesNow);
        } else if (isBoardFull(nextBoard)) {
          handleMatchEnd(null, true, movesNow);
        } else {
          setCurrentTurn('X');
        }

        setIsAiThinking(false);
      }, 420);
    },
    [boardSize, difficulty, handleMatchEnd]
  );

  // Cell Click Handler
  const handleCellClick = useCallback(
    (index: number) => {
      if (
        board[index] !== null ||
        winner !== null ||
        isAiThinking ||
        isSeriesWon
      ) {
        return;
      }

      setHintIndex(null);
      const player = currentTurn;
      const nextBoard = [...board];
      nextBoard[index] = player;
      setBoard(nextBoard);
      sound.playMove(player);

      const movesCount = moveHistory.length + 1;
      const newHistory = [
        ...moveHistory,
        { index, player, boardState: nextBoard },
      ];
      setMoveHistory(newHistory);

      const win = checkWinner(nextBoard, boardSize);
      if (win) {
        handleMatchEnd(win, false, movesCount);
        return;
      }

      if (isBoardFull(nextBoard)) {
        handleMatchEnd(null, true, movesCount);
        return;
      }

      const nextPlayer: Player = player === 'X' ? 'O' : 'X';
      setCurrentTurn(nextPlayer);

      if (gameMode === 'vs_ai' && nextPlayer === 'O') {
        triggerAIMove(nextBoard, movesCount);
      }
    },
    [
      board,
      boardSize,
      currentTurn,
      gameMode,
      handleMatchEnd,
      isAiThinking,
      isSeriesWon,
      moveHistory,
      triggerAIMove,
      winner,
    ]
  );

  // Hint handler
  const handleHint = () => {
    if (winner !== null || isAiThinking || isSeriesWon) return;

    const bestMove = getBestHint(board, boardSize, currentTurn);
    if (bestMove !== -1) {
      setHintIndex(bestMove);
      sound.playHint();

      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setHintIndex(null);
      }, 1900);
    }
  };

  // Undo Handler
  const handleUndo = () => {
    if (isAiThinking || moveHistory.length === 0) return;

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
      setIsAiThinking(false);
    }

    sound.playClick();
    setWinInfo(null);
    setWinner(null);
    setHintIndex(null);

    if (gameMode === 'vs_ai') {
      if (moveHistory.length >= 2) {
        const targetHistory = moveHistory.slice(0, -2);
        const restoredBoard =
          targetHistory.length > 0
            ? [...targetHistory[targetHistory.length - 1].boardState]
            : Array(boardSize * boardSize).fill(null);

        setMoveHistory(targetHistory);
        setBoard(restoredBoard);
        setCurrentTurn('X');
      } else if (moveHistory.length === 1) {
        setMoveHistory([]);
        setBoard(Array(boardSize * boardSize).fill(null));
        setCurrentTurn('X');
      }
    } else {
      const targetHistory = moveHistory.slice(0, -1);
      const restoredBoard =
        targetHistory.length > 0
          ? [...targetHistory[targetHistory.length - 1].boardState]
          : Array(boardSize * boardSize).fill(null);

      const previousPlayer: Player = currentTurn === 'X' ? 'O' : 'X';
      setMoveHistory(targetHistory);
      setBoard(restoredBoard);
      setCurrentTurn(previousPlayer);
    }
  };

  // Keyboard shortcut listener (Numpad, 1-9, U for undo, H for hint, N for new game)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when modal is open
      if (isRulesOpen || isSkinsOpen || isStatsOpen) return;

      // Hotkey: U -> Undo
      if (e.key === 'u' || e.key === 'U') {
        if (moveHistory.length > 0 && !isAiThinking) {
          handleUndo();
        }
        return;
      }

      // Hotkey: H -> Hint
      if (e.key === 'h' || e.key === 'H') {
        handleHint();
        return;
      }

      // Hotkey: N -> New Game
      if (e.key === 'n' || e.key === 'N') {
        startNewGame(boardSize);
        return;
      }

      // 3x3 Grid Number mappings
      if (boardSize === 3) {
        // Numpad classic layout:
        // 7 8 9
        // 4 5 6
        // 1 2 3
        const numpadMap: Record<string, number> = {
          '7': 0, '8': 1, '9': 2,
          '4': 3, '5': 4, '6': 5,
          '1': 6, '2': 7, '3': 8,
        };

        if (numpadMap[e.key] !== undefined) {
          handleCellClick(numpadMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    boardSize,
    handleCellClick,
    isAiThinking,
    isRulesOpen,
    isSkinsOpen,
    isStatsOpen,
    moveHistory.length,
    startNewGame,
  ]);

  const canUndo = moveHistory.length > 0 && !isAiThinking && !isSeriesWon;
  const canHint = !winner && !isAiThinking && !isSeriesWon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <Header
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSkins={() => setIsSkinsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onNewGame={() => (isSeriesWon ? handleResetSeries() : startNewGame(boardSize))}
      />

      {/* Main Game Stage */}
      <main className="w-full max-w-4xl mx-auto px-4 py-2 sm:py-4 flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Score & Player Pods */}
        <ScoreBoard
          score={score}
          currentTurn={currentTurn}
          gameMode={gameMode}
          difficulty={difficulty}
          skin={selectedSkin}
          winner={winner}
          isAiThinking={isAiThinking}
          targetWins={targetWins}
        />

        {/* Turn & Victory Status Banner */}
        <StatusBanner
          winner={winner}
          currentTurn={currentTurn}
          gameMode={gameMode}
          isAiThinking={isAiThinking}
          onPlayAgain={() => (isSeriesWon ? handleResetSeries() : startNewGame(boardSize))}
          isSeriesWon={isSeriesWon}
          seriesWinner={seriesWinner}
          targetWins={targetWins}
        />

        {/* The Grid */}
        <GameBoard
          board={board}
          size={boardSize}
          onCellClick={handleCellClick}
          winInfo={winInfo}
          disabled={isAiThinking || isSeriesWon}
          currentTurn={currentTurn}
          skin={selectedSkin}
          hintIndex={hintIndex}
          showKeyHints={true}
        />

        {/* Control Dock */}
        <GameControls
          gameMode={gameMode}
          onSelectGameMode={handleSelectGameMode}
          difficulty={difficulty}
          onSelectDifficulty={handleSelectDifficulty}
          boardSize={boardSize}
          onSelectBoardSize={handleSelectBoardSize}
          targetWins={targetWins}
          onSelectTargetWins={handleSelectTargetWins}
          onUndo={handleUndo}
          canUndo={canUndo}
          onHint={handleHint}
          canHint={canHint}
          onResetSeries={handleResetSeries}
        />
      </main>

      {/* Sleek App Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 border-t border-slate-900/80 text-center text-xs text-slate-500 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Tic Tac Toe Pro · Professional Grid Gaming Console</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">7-9</kbd> Numpad</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">H</kbd> Hint</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">U</kbd> Undo</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SkinsModal
        isOpen={isSkinsOpen}
        onClose={() => setIsSkinsOpen(false)}
        selectedSkinId={selectedSkin.id}
        onSelectSkin={(skin) => setSelectedSkin(skin)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        score={score}
        history={matchHistory}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
