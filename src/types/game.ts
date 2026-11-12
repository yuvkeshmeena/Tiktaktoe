export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type GameMode = 'vs_ai' | 'pass_and_play';

export type AIDifficulty = 'easy' | 'medium' | 'invincible';

export type BoardDimension = 3 | 4;

export type TargetWins = 1 | 3 | 5;

export interface SymbolSkin {
  id: string;
  name: string;
  xDisplay: string;
  oDisplay: string;
  description: string;
  xColor: string;
  oColor: string;
  xBgGlow: string;
  oBgGlow: string;
}

export interface WinInfo {
  winner: Player;
  line: number[];
  direction: 'row' | 'col' | 'diag-main' | 'diag-anti';
  index: number;
}

export interface MatchHistoryEntry {
  id: string;
  winner: Player | 'DRAW';
  boardSize: BoardDimension;
  mode: GameMode;
  difficulty?: AIDifficulty;
  timestamp: number;
  totalMoves: number;
}

export interface ScoreState {
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  totalMatches: number;
  seriesScore: {
    x: number;
    o: number;
  };
}

export interface MoveRecord {
  index: number;
  player: Player;
  boardState: CellValue[];
}
