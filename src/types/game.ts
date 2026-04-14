// =====================================================
// BUNNY BUILDER GAME - Game Types & Interfaces
// =====================================================

export interface GameSession {
  walletAddress: string;
  currentLevel: number;
  levelProgress: boolean[];
  sessionToken: string;
  startTime: number;
  levelStartTime: number;
  completedLevels: number[];
  score: number;
  totalTime: number;
  isWinner: boolean;
  rewardClaimed: boolean;
  antiCheat: AntiCheatData;
}

export interface AntiCheatData {
  levelHashes: string[];
  checkpoints: number[];
  moveCount: number;
  lastActionTime: number;
  suspiciousActivity: boolean;
}

export interface LevelCompletion {
  walletAddress: string;
  sessionToken: string;
  level: number;
  completionHash: string;
  timeSpent: number;
  score: number;
}

export interface LeaderboardEntry {
  walletAddress: string;
  level: number;
  score: number;
  totalTime: number;
  completedAt: number;
  wins: number;
}

export interface PoolInfo {
  usdcBalance: string;
  eurcBalance: string;
  roundActive: boolean;
  currentRound: number;
  currentWinner: string | null;
  rewardClaimed: boolean;
}

export interface WinnerData {
  wallet: string;
  round: number;
  token: string;
  amount: string;
  txHash: string;
  timestamp: number;
}

export interface AdminAction {
  action: 'deposit' | 'reset' | 'view';
  adminWallet: string;
  adminSignature?: string;
}
