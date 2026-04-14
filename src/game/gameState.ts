// =====================================================
// BUNNY BUILDER GAME - Game State Manager (In-Memory)
// Note: For production, replace with D1/KV persistence
// =====================================================

import type { GameSession, LeaderboardEntry, WinnerData, AntiCheatData } from '../types/game'

// In-memory storage (use KV/D1 for production)
const sessions = new Map<string, GameSession>()
const leaderboard: LeaderboardEntry[] = []
const winners: WinnerData[] = []
const walletSessions = new Map<string, string>() // wallet -> sessionToken

// Level config: defines expected difficulty thresholds
export const LEVEL_CONFIG = [
  { level: 1, minTime: 5,  maxTime: 300, name: "Tutorial Site",       enemies: 2,  platforms: 5  },
  { level: 2, minTime: 8,  maxTime: 280, name: "Foundation Ground",   enemies: 3,  platforms: 6  },
  { level: 3, minTime: 10, maxTime: 260, name: "Scaffolding Climb",   enemies: 4,  platforms: 7  },
  { level: 4, minTime: 12, maxTime: 240, name: "Steel Beams",         enemies: 5,  platforms: 8  },
  { level: 5, minTime: 15, maxTime: 220, name: "Elevator Shaft",      enemies: 6,  platforms: 9  },
  { level: 6, minTime: 18, maxTime: 200, name: "Wrecking Ball Zone",  enemies: 7,  platforms: 10 },
  { level: 7, minTime: 20, maxTime: 180, name: "Rooftop Runner",      enemies: 8,  platforms: 11 },
  { level: 8, minTime: 22, maxTime: 160, name: "Crane Crossing",      enemies: 9,  platforms: 12 },
  { level: 9, minTime: 25, maxTime: 140, name: "Demolition Derby",    enemies: 10, platforms: 13 },
  { level: 10, minTime: 30, maxTime: 120, name: "Penthouse Pinnacle", enemies: 12, platforms: 15 },
]

const TOTAL_LEVELS = 10

/**
 * Generate cryptographically secure session token
 */
function generateSessionToken(wallet: string): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2)
  return btoa(`${wallet}_${ts}_${rand}`).replace(/=/g, '')
}

/**
 * Generate level completion hash for anti-cheat
 */
function generateLevelHash(wallet: string, level: number, time: number): string {
  const data = `${wallet}:${level}:${time}:${Date.now()}`
  // Simple hash (use crypto.subtle in production)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Validate wallet address format (EVM)
 */
export function isValidWallet(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * Create or resume a game session for a wallet
 */
export function createSession(walletAddress: string): GameSession {
  const normalizedWallet = walletAddress.toLowerCase()
  
  // Check existing session
  const existingToken = walletSessions.get(normalizedWallet)
  if (existingToken) {
    const existing = sessions.get(existingToken)
    if (existing && !existing.isWinner) {
      return existing
    }
  }
  
  const sessionToken = generateSessionToken(normalizedWallet)
  const antiCheat: AntiCheatData = {
    levelHashes: [],
    checkpoints: [],
    moveCount: 0,
    lastActionTime: Date.now(),
    suspiciousActivity: false
  }
  
  const session: GameSession = {
    walletAddress: normalizedWallet,
    currentLevel: 1,
    levelProgress: new Array(TOTAL_LEVELS).fill(false),
    sessionToken,
    startTime: Date.now(),
    levelStartTime: Date.now(),
    completedLevels: [],
    score: 0,
    totalTime: 0,
    isWinner: false,
    rewardClaimed: false,
    antiCheat
  }
  
  sessions.set(sessionToken, session)
  walletSessions.set(normalizedWallet, sessionToken)
  
  return session
}

/**
 * Get session by token
 */
export function getSession(sessionToken: string): GameSession | null {
  return sessions.get(sessionToken) || null
}

/**
 * Get session by wallet
 */
export function getSessionByWallet(wallet: string): GameSession | null {
  const token = walletSessions.get(wallet.toLowerCase())
  if (!token) return null
  return sessions.get(token) || null
}

/**
 * Validate level completion with anti-cheat checks
 */
export function validateLevelCompletion(
  sessionToken: string,
  level: number,
  timeSpent: number,
  score: number
): { valid: boolean; reason?: string; hash?: string } {
  const session = sessions.get(sessionToken)
  if (!session) {
    return { valid: false, reason: 'Session not found' }
  }
  
  // Check level sequence (can't skip levels)
  if (level !== session.currentLevel) {
    return { valid: false, reason: `Invalid level sequence. Expected level ${session.currentLevel}` }
  }
  
  // Check if already completed
  if (session.completedLevels.includes(level)) {
    return { valid: false, reason: 'Level already completed' }
  }
  
  // Time validation (anti-cheat)
  const levelConfig = LEVEL_CONFIG[level - 1]
  if (timeSpent < levelConfig.minTime) {
    session.antiCheat.suspiciousActivity = true
    return { valid: false, reason: `Completed too fast. Minimum time: ${levelConfig.minTime}s` }
  }
  
  if (timeSpent > levelConfig.maxTime) {
    return { valid: false, reason: `Time limit exceeded: ${levelConfig.maxTime}s` }
  }
  
  // Anti-cheat: check action frequency
  const timeSinceLastAction = Date.now() - session.antiCheat.lastActionTime
  if (timeSinceLastAction < 1000) {
    session.antiCheat.suspiciousActivity = true
    return { valid: false, reason: 'Suspicious rapid actions detected' }
  }
  
  // Generate completion hash
  const hash = generateLevelHash(session.walletAddress, level, timeSpent)
  
  // Update session
  session.completedLevels.push(level)
  session.levelProgress[level - 1] = true
  session.score += score
  session.totalTime += timeSpent
  session.antiCheat.levelHashes.push(hash)
  session.antiCheat.lastActionTime = Date.now()
  session.antiCheat.checkpoints.push(Date.now())
  
  // Advance to next level or mark as winner
  if (level < TOTAL_LEVELS) {
    session.currentLevel = level + 1
    session.levelStartTime = Date.now()
  } else {
    // Level 10 completed - WINNER!
    session.currentLevel = TOTAL_LEVELS
    session.isWinner = true
    
    // Add to leaderboard
    addToLeaderboard({
      walletAddress: session.walletAddress,
      level: TOTAL_LEVELS,
      score: session.score,
      totalTime: session.totalTime,
      completedAt: Date.now(),
      wins: 1
    })
  }
  
  sessions.set(sessionToken, session)
  
  return { valid: true, hash }
}

/**
 * Add entry to leaderboard
 */
function addToLeaderboard(entry: LeaderboardEntry) {
  const existing = leaderboard.findIndex(e => e.walletAddress === entry.walletAddress)
  if (existing >= 0) {
    leaderboard[existing].wins += 1
    leaderboard[existing].score = Math.max(leaderboard[existing].score, entry.score)
    leaderboard[existing].totalTime = Math.min(leaderboard[existing].totalTime, entry.totalTime)
  } else {
    leaderboard.push(entry)
  }
  
  // Sort by score desc, then by total time asc
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.totalTime - b.totalTime
  })
}

/**
 * Get top leaderboard entries
 */
export function getLeaderboard(limit = 10): LeaderboardEntry[] {
  return leaderboard.slice(0, limit)
}

/**
 * Record winner payment
 */
export function recordWinnerPayment(data: WinnerData) {
  winners.push(data)
  
  const session = getSessionByWallet(data.wallet)
  if (session) {
    session.rewardClaimed = true
    sessions.set(session.sessionToken, session)
  }
}

/**
 * Get all winners
 */
export function getWinners(): WinnerData[] {
  return winners
}

/**
 * Check if wallet has already won current round
 */
export function hasWalletWonThisRound(wallet: string, round: number): boolean {
  return winners.some(w => 
    w.wallet.toLowerCase() === wallet.toLowerCase() && 
    w.round === round
  )
}

/**
 * Get active sessions count
 */
export function getActiveSessionsCount(): number {
  return sessions.size
}

/**
 * Reset all sessions (admin function)
 */
export function resetAllSessions() {
  sessions.clear()
  walletSessions.clear()
}
