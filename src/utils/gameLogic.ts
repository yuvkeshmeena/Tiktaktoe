import { AIDifficulty, BoardDimension, CellValue, Player, WinInfo } from '../types/game';

/**
 * Returns all winning lines for a given board dimension
 */
export function getWinningLines(size: BoardDimension): { line: number[]; direction: 'row' | 'col' | 'diag-main' | 'diag-anti'; index: number }[] {
  const lines: { line: number[]; direction: 'row' | 'col' | 'diag-main' | 'diag-anti'; index: number }[] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    const line: number[] = [];
    for (let c = 0; c < size; c++) {
      line.push(r * size + c);
    }
    lines.push({ line, direction: 'row', index: r });
  }

  // Columns
  for (let c = 0; c < size; c++) {
    const line: number[] = [];
    for (let r = 0; r < size; r++) {
      line.push(r * size + c);
    }
    lines.push({ line, direction: 'col', index: c });
  }

  // Diagonal main (\)
  const diagMain: number[] = [];
  for (let i = 0; i < size; i++) {
    diagMain.push(i * size + i);
  }
  lines.push({ line: diagMain, direction: 'diag-main', index: 0 });

  // Diagonal anti (/)
  const diagAnti: number[] = [];
  for (let i = 0; i < size; i++) {
    diagAnti.push(i * size + (size - 1 - i));
  }
  lines.push({ line: diagAnti, direction: 'diag-anti', index: 0 });

  return lines;
}

/**
 * Check if there is a winner on the board
 */
export function checkWinner(board: CellValue[], size: BoardDimension): WinInfo | null {
  const winningLines = getWinningLines(size);

  for (const { line, direction, index } of winningLines) {
    const first = board[line[0]];
    if (!first) continue;

    let isWin = true;
    for (let i = 1; i < line.length; i++) {
      if (board[line[i]] !== first) {
        isWin = false;
        break;
      }
    }

    if (isWin) {
      return {
        winner: first,
        line,
        direction,
        index,
      };
    }
  }

  return null;
}

/**
 * Check if the board is full (Draw)
 */
export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Minimax algorithm for unbeatable 3x3 play
 */
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: number } {
  const win = checkWinner(board, 3);
  if (win) {
    if (win.winner === aiPlayer) {
      return { score: 10 - depth };
    }
    return { score: depth - 10 };
  }

  if (isBoardFull(board)) {
    return { score: 0 };
  }

  const emptyIndices: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) emptyIndices.push(idx);
  });

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = aiPlayer;
      const result = minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[idx] = null;

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = idx;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = humanPlayer;
      const result = minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[idx] = null;

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = idx;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Depth-limited minimax with positional heuristics for 4x4
 */
function evaluate4x4Heuristic(board: CellValue[], aiPlayer: Player, humanPlayer: Player): number {
  const lines = getWinningLines(4);
  let score = 0;

  for (const { line } of lines) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of line) {
      if (board[idx] === aiPlayer) aiCount++;
      if (board[idx] === humanPlayer) humanCount++;
    }

    if (aiCount > 0 && humanCount > 0) continue; // blocked line
    if (aiCount === 4) return 1000;
    if (humanCount === 4) return -1000;

    if (aiCount === 3) score += 50;
    else if (aiCount === 2) score += 10;
    else if (aiCount === 1) score += 2;

    if (humanCount === 3) score -= 60;
    else if (humanCount === 2) score -= 12;
    else if (humanCount === 1) score -= 2;
  }
  return score;
}

function minimax4x4(
  board: CellValue[],
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: number } {
  const win = checkWinner(board, 4);
  if (win) {
    return { score: win.winner === aiPlayer ? 1000 - depth : depth - 1000 };
  }

  if (isBoardFull(board) || depth >= maxDepth) {
    return { score: evaluate4x4Heuristic(board, aiPlayer, humanPlayer) };
  }

  const emptyIndices: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) emptyIndices.push(idx);
  });

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = aiPlayer;
      const res = minimax4x4(board, depth + 1, maxDepth, false, aiPlayer, humanPlayer, alpha, beta);
      board[idx] = null;

      if (res.score > maxScore) {
        maxScore = res.score;
        bestMove = idx;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = humanPlayer;
      const res = minimax4x4(board, depth + 1, maxDepth, true, aiPlayer, humanPlayer, alpha, beta);
      board[idx] = null;

      if (res.score < minScore) {
        minScore = res.score;
        bestMove = idx;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Determine AI's move based on difficulty
 */
export function getAIMove(
  board: CellValue[],
  size: BoardDimension,
  difficulty: AIDifficulty,
  aiPlayer: Player
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const emptyIndices: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) emptyIndices.push(idx);
  });

  if (emptyIndices.length === 0) return -1;

  // 1. Easy: Mostly random (75% random, 25% simple block)
  if (difficulty === 'easy') {
    if (Math.random() < 0.75) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  }

  // Check immediate winning move for AI
  for (const idx of emptyIndices) {
    board[idx] = aiPlayer;
    if (checkWinner(board, size)?.winner === aiPlayer) {
      board[idx] = null;
      return idx;
    }
    board[idx] = null;
  }

  // Check immediate blocking move against human
  for (const idx of emptyIndices) {
    board[idx] = humanPlayer;
    if (checkWinner(board, size)?.winner === humanPlayer) {
      board[idx] = null;
      return idx;
    }
    board[idx] = null;
  }

  // 2. Medium: If not already won or blocked, 50% random / 50% strategic center/corners
  if (difficulty === 'medium') {
    if (Math.random() < 0.45) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    // Prefer center in 3x3
    if (size === 3 && board[4] === null) {
      return 4;
    }
  }

  // 3. Invincible: Minimax
  if (size === 3) {
    const result = minimax(board, 0, true, aiPlayer, humanPlayer);
    if (result.move !== undefined) return result.move;
  } else {
    // 4x4
    const result = minimax4x4(board, 0, 3, true, aiPlayer, humanPlayer);
    if (result.move !== undefined) return result.move;
  }

  // Fallback
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

/**
 * Returns the best suggested move for the current player (Hint system)
 */
export function getBestHint(board: CellValue[], size: BoardDimension, player: Player): number {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const emptyIndices: number[] = [];
  board.forEach((val, idx) => {
    if (val === null) emptyIndices.push(idx);
  });

  if (emptyIndices.length === 0) return -1;

  // 1. Can we win in 1 move?
  for (const idx of emptyIndices) {
    board[idx] = player;
    if (checkWinner(board, size)?.winner === player) {
      board[idx] = null;
      return idx;
    }
    board[idx] = null;
  }

  // 2. Can opponent win in 1 move? Must block!
  for (const idx of emptyIndices) {
    board[idx] = opponent;
    if (checkWinner(board, size)?.winner === opponent) {
      board[idx] = null;
      return idx;
    }
    board[idx] = null;
  }

  // 3. Minimax recommendation
  if (size === 3) {
    const result = minimax(board, 0, true, player, opponent);
    if (result.move !== undefined) return result.move;
  } else {
    const result = minimax4x4(board, 0, 3, true, player, opponent);
    if (result.move !== undefined) return result.move;
  }

  // Strategic preference: Center
  if (size === 3 && board[4] === null) return 4;

  return emptyIndices[0];
}
