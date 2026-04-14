// =====================================================
// BUNNY BUILDER GAME - Main Hono Application
// Arc Testnet Web3 Platformer Game
// =====================================================

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import {
  createSession,
  getSession,
  getSessionByWallet,
  validateLevelCompletion,
  getLeaderboard,
  recordWinnerPayment,
  getWinners,
  isValidWallet,
  LEVEL_CONFIG,
  resetAllSessions
} from './game/gameState'
import type { LevelCompletion } from './types/game'

// Arc Testnet Configuration
const ARC_RPC = 'https://rpc.arctest.io'
const ADMIN_WALLET = '0x0000000000000000000000000000000000000000' // Replace with real admin wallet
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' // Replace after deploy

// Token addresses on Arc Testnet
const TOKEN_ADDRESSES = {
  USDC: '0x0000000000000000000000000000000000000001', // Update with real Arc Testnet USDC
  EURC: '0x0000000000000000000000000000000000000002', // Update with real Arc Testnet EURC
}

type Bindings = {
  ADMIN_WALLET?: string
  CONTRACT_ADDRESS?: string
  ARC_RPC_URL?: string
  USDC_ADDRESS?: string
  EURC_ADDRESS?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ===================== MIDDLEWARE =====================
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Session-Token'],
}))

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/assets/*', serveStatic({ root: './public' }))

// ===================== HELPER FUNCTIONS =====================

/**
 * Call Arc Testnet RPC
 */
async function rpcCall(rpcUrl: string, method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    })
  })
  
  if (!response.ok) {
    throw new Error(`RPC call failed: ${response.statusText}`)
  }
  
  const data = await response.json() as { result?: unknown; error?: { message: string } }
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`)
  }
  
  return data.result
}

/**
 * Encode function call data (minimal ABI encoder)
 */
function encodeFunctionCall(functionSig: string, params: string[] = []): string {
  // Keccak256 first 4 bytes of function signature
  // This is a simplified version - use ethers.js for production
  const sig = functionSig.split('(')[0]
  let selector = '0x'
  
  // Simple encoding for demonstration
  // In production, use proper ABI encoding
  const encoded = params.map(p => {
    if (p.startsWith('0x')) {
      // Address: pad to 32 bytes
      return p.slice(2).toLowerCase().padStart(64, '0')
    }
    // Number: pad to 32 bytes
    return parseInt(p).toString(16).padStart(64, '0')
  }).join('')
  
  return selector + encoded
}

/**
 * Read contract state via eth_call
 */
async function readContract(
  rpcUrl: string,
  contractAddress: string,
  data: string
): Promise<string> {
  const result = await rpcCall(rpcUrl, 'eth_call', [
    { to: contractAddress, data },
    'latest'
  ])
  return result as string
}

/**
 * Get effective config values
 */
function getConfig(env: Bindings) {
  return {
    adminWallet: (env.ADMIN_WALLET || ADMIN_WALLET).toLowerCase(),
    contractAddress: env.CONTRACT_ADDRESS || CONTRACT_ADDRESS,
    rpcUrl: env.ARC_RPC_URL || ARC_RPC,
    usdcAddress: env.USDC_ADDRESS || TOKEN_ADDRESSES.USDC,
    eurcAddress: env.EURC_ADDRESS || TOKEN_ADDRESSES.EURC,
  }
}

// ===================== ROUTES =====================

// Home - Serve the game
app.get('/', async (c) => {
  const html = await generateGameHTML()
  return c.html(html)
})

// Admin Panel (hidden route)
app.get('/admin-bunny-builder-panel-x7k9', async (c) => {
  const html = generateAdminHTML()
  return c.html(html)
})

// ===================== GAME API =====================

/**
 * POST /api/game/session
 * Create/resume game session with wallet address
 */
app.post('/api/game/session', async (c) => {
  try {
    const body = await c.req.json()
    const { walletAddress } = body
    
    if (!walletAddress || !isValidWallet(walletAddress)) {
      return c.json({ error: 'Invalid wallet address' }, 400)
    }
    
    const session = createSession(walletAddress)
    
    return c.json({
      success: true,
      sessionToken: session.sessionToken,
      currentLevel: session.currentLevel,
      completedLevels: session.completedLevels,
      score: session.score,
      totalTime: session.totalTime,
      isWinner: session.isWinner,
      walletAddress: session.walletAddress,
      levelInfo: LEVEL_CONFIG[session.currentLevel - 1]
    })
  } catch (err) {
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

/**
 * GET /api/game/session/:token
 * Get current session state
 */
app.get('/api/game/session/:token', async (c) => {
  const token = c.req.param('token')
  const session = getSession(token)
  
  if (!session) {
    return c.json({ error: 'Session not found' }, 404)
  }
  
  return c.json({
    success: true,
    currentLevel: session.currentLevel,
    completedLevels: session.completedLevels,
    score: session.score,
    totalTime: session.totalTime,
    isWinner: session.isWinner,
    rewardClaimed: session.rewardClaimed,
    walletAddress: session.walletAddress,
    levelInfo: LEVEL_CONFIG[session.currentLevel - 1]
  })
})

/**
 * POST /api/game/complete-level
 * Validate and record level completion
 */
app.post('/api/game/complete-level', async (c) => {
  try {
    const body = await c.req.json() as LevelCompletion
    const { sessionToken, level, timeSpent, score, completionHash } = body
    
    if (!sessionToken || !level || !timeSpent) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const result = validateLevelCompletion(sessionToken, level, timeSpent, score || 0)
    
    if (!result.valid) {
      return c.json({ 
        error: result.reason || 'Level completion failed',
        valid: false 
      }, 400)
    }
    
    const session = getSession(sessionToken)
    
    // Check if Level 10 completed = WINNER
    if (level === 10 && session?.isWinner) {
      return c.json({
        success: true,
        valid: true,
        hash: result.hash,
        isWinner: true,
        message: '🏆 CONGRATULATIONS! You completed Level 10!',
        nextLevel: null,
        totalScore: session.score,
        totalTime: session.totalTime,
        walletAddress: session.walletAddress
      })
    }
    
    const nextLevel = level + 1
    
    return c.json({
      success: true,
      valid: true,
      hash: result.hash,
      isWinner: false,
      nextLevel,
      levelInfo: LEVEL_CONFIG[nextLevel - 1],
      score: session?.score || 0,
      totalTime: session?.totalTime || 0,
      message: `Level ${level} completed! Advancing to Level ${nextLevel}`
    })
  } catch (err) {
    return c.json({ error: 'Failed to validate level completion' }, 500)
  }
})

/**
 * POST /api/game/trigger-reward
 * Trigger reward for winner (called by backend after validation)
 */
app.post('/api/game/trigger-reward', async (c) => {
  try {
    const body = await c.req.json()
    const { sessionToken, walletAddress, preferredToken } = body
    
    if (!sessionToken || !walletAddress) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    const session = getSession(sessionToken)
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    if (!session.isWinner) {
      return c.json({ error: 'Player has not won yet' }, 400)
    }
    
    if (session.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return c.json({ error: 'Wallet address mismatch' }, 403)
    }
    
    if (session.rewardClaimed) {
      return c.json({ error: 'Reward already claimed' }, 400)
    }
    
    const cfg = getConfig(c.env)
    
    // Try to get pool balance from contract
    let poolBalance = '0'
    let rewardToken = preferredToken === 'EURC' ? cfg.eurcAddress : cfg.usdcAddress
    let tokenSymbol = preferredToken === 'EURC' ? 'EURC' : 'USDC'
    
    // In real deployment: call contract to verify and execute reward
    // For demo: record the win and return reward info
    const winData = {
      wallet: walletAddress.toLowerCase(),
      round: 1,
      token: tokenSymbol,
      amount: poolBalance,
      txHash: '0x' + Math.random().toString(16).slice(2).padStart(64, '0'), // Placeholder
      timestamp: Date.now()
    }
    
    recordWinnerPayment(winData)
    
    return c.json({
      success: true,
      message: '🎉 Reward triggered!',
      winner: walletAddress,
      token: tokenSymbol,
      txHash: winData.txHash,
      contractAddress: cfg.contractAddress,
      note: 'Contract reward execution requires deployed contract on Arc Testnet'
    })
  } catch (err) {
    return c.json({ error: 'Failed to trigger reward' }, 500)
  }
})

// ===================== CONTRACT API =====================

/**
 * GET /api/contract/state
 * Get current contract/game state from Arc Testnet
 */
app.get('/api/contract/state', async (c) => {
  const cfg = getConfig(c.env)
  
  try {
    // Attempt to read from Arc Testnet
    const response = await fetch(cfg.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1
      }),
      signal: AbortSignal.timeout(5000)
    })
    
    const chainData = await response.json() as { result?: string }
    
    return c.json({
      success: true,
      network: 'Arc Testnet',
      chainId: chainData.result || 'unknown',
      contractAddress: cfg.contractAddress,
      rpcUrl: cfg.rpcUrl,
      tokens: {
        USDC: cfg.usdcAddress,
        EURC: cfg.eurcAddress
      },
      status: 'connected'
    })
  } catch (err) {
    return c.json({
      success: false,
      network: 'Arc Testnet',
      contractAddress: cfg.contractAddress,
      status: 'disconnected',
      note: 'Deploy contract and update addresses to enable full functionality'
    })
  }
})

/**
 * GET /api/contract/pool-balance
 * Get reward pool balance
 */
app.get('/api/contract/pool-balance', async (c) => {
  const cfg = getConfig(c.env)
  
  return c.json({
    success: true,
    USDC: {
      address: cfg.usdcAddress,
      balance: '0',
      symbol: 'USDC',
      decimals: 6
    },
    EURC: {
      address: cfg.eurcAddress,
      balance: '0',
      symbol: 'EURC',
      decimals: 6
    },
    contractAddress: cfg.contractAddress,
    note: 'Update contract address in environment to see real balances'
  })
})

// ===================== LEADERBOARD API =====================

/**
 * GET /api/leaderboard
 * Get top players
 */
app.get('/api/leaderboard', async (c) => {
  const limit = parseInt(c.req.query('limit') || '10')
  const entries = getLeaderboard(Math.min(limit, 50))
  
  return c.json({
    success: true,
    entries,
    total: entries.length
  })
})

/**
 * GET /api/winners
 * Get list of past winners
 */
app.get('/api/winners', async (c) => {
  const winners = getWinners()
  
  return c.json({
    success: true,
    winners: winners.map(w => ({
      wallet: w.wallet,
      round: w.round,
      token: w.token,
      amount: w.amount,
      timestamp: w.timestamp
    }))
  })
})

// ===================== ADMIN API =====================

/**
 * Middleware to verify admin wallet
 */
async function verifyAdmin(walletAddress: string, adminWallet: string): Promise<boolean> {
  return walletAddress.toLowerCase() === adminWallet.toLowerCase()
}

/**
 * POST /api/admin/verify
 * Verify if a wallet is admin
 */
app.post('/api/admin/verify', async (c) => {
  try {
    const body = await c.req.json()
    const { walletAddress } = body
    const cfg = getConfig(c.env)
    
    if (!walletAddress || !isValidWallet(walletAddress)) {
      return c.json({ isAdmin: false, error: 'Invalid wallet address' }, 400)
    }
    
    const isAdmin = await verifyAdmin(walletAddress, cfg.adminWallet)
    
    return c.json({
      isAdmin,
      wallet: walletAddress.toLowerCase()
    })
  } catch (err) {
    return c.json({ isAdmin: false, error: 'Verification failed' }, 500)
  }
})

/**
 * POST /api/admin/deposit
 * Admin deposits reward tokens (returns contract call data)
 */
app.post('/api/admin/deposit', async (c) => {
  try {
    const body = await c.req.json()
    const { adminWallet, token, amount } = body
    const cfg = getConfig(c.env)
    
    if (!adminWallet || !isValidWallet(adminWallet)) {
      return c.json({ error: 'Invalid admin wallet' }, 400)
    }
    
    const isAdmin = await verifyAdmin(adminWallet, cfg.adminWallet)
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized: not admin wallet' }, 403)
    }
    
    const tokenAddress = token === 'EURC' ? cfg.eurcAddress : cfg.usdcAddress
    
    // Return the contract call parameters for frontend to execute
    return c.json({
      success: true,
      contractAddress: cfg.contractAddress,
      tokenAddress,
      amount,
      token,
      instructions: [
        { step: 1, action: 'approve', description: `Approve ${amount} ${token} to contract` },
        { step: 2, action: 'deposit', description: `Call depositReward(${tokenAddress}, ${amount})` }
      ],
      note: 'Execute these transactions with your admin wallet on Arc Testnet'
    })
  } catch (err) {
    return c.json({ error: 'Failed to process deposit request' }, 500)
  }
})

/**
 * POST /api/admin/reset-game
 * Admin resets the game round
 */
app.post('/api/admin/reset-game', async (c) => {
  try {
    const body = await c.req.json()
    const { adminWallet } = body
    const cfg = getConfig(c.env)
    
    if (!adminWallet || !isValidWallet(adminWallet)) {
      return c.json({ error: 'Invalid admin wallet' }, 400)
    }
    
    const isAdmin = await verifyAdmin(adminWallet, cfg.adminWallet)
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized: not admin wallet' }, 403)
    }
    
    resetAllSessions()
    
    return c.json({
      success: true,
      message: 'Game sessions reset. Contract round reset requires on-chain transaction.',
      contractCall: `resetRound(false) on ${cfg.contractAddress}`
    })
  } catch (err) {
    return c.json({ error: 'Failed to reset game' }, 500)
  }
})

/**
 * GET /api/admin/stats
 * Get admin dashboard stats
 */
app.get('/api/admin/stats', async (c) => {
  const adminWallet = c.req.query('wallet') || ''
  const cfg = getConfig(c.env)
  
  const isAdmin = await verifyAdmin(adminWallet, cfg.adminWallet)
  if (!isAdmin) {
    return c.json({ error: 'Unauthorized' }, 403)
  }
  
  const leaderboardData = getLeaderboard(100)
  const winnersData = getWinners()
  
  return c.json({
    success: true,
    stats: {
      totalPlayers: leaderboardData.length,
      totalWinners: winnersData.length,
      currentRound: 1,
      poolBalance: { USDC: '0', EURC: '0' },
      contractAddress: cfg.contractAddress,
      network: 'Arc Testnet'
    }
  })
})

// ===================== HTML GENERATORS =====================

/**
 * Generate main game HTML
 */
async function generateGameHTML(): Promise<string> {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🐰 Bunny Builder - Arc Testnet Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/game.css">
</head>
<body>
  <div id="app">
    <!-- Wallet Connect Screen -->
    <div id="wallet-screen" class="screen active">
      <div class="game-title-container">
        <div class="pixel-logo">🐰</div>
        <h1 class="game-title">BUNNY<br>BUILDER</h1>
        <p class="game-subtitle">ARC TESTNET CHALLENGE</p>
        <div class="title-decoration">
          <span>⚒️</span><span>🏗️</span><span>⚒️</span>
        </div>
      </div>
      
      <div class="wallet-connect-box">
        <h2>ENTER YOUR WALLET</h2>
        <p class="wallet-hint">No MetaMask needed! Just paste your address:</p>
        <div class="input-group">
          <input 
            type="text" 
            id="wallet-input" 
            placeholder="0x..." 
            class="wallet-input"
            autocomplete="off"
            spellcheck="false"
          >
          <div class="input-icon">👛</div>
        </div>
        <div id="wallet-error" class="error-msg hidden">Invalid wallet address</div>
        <button id="start-btn" class="btn-primary">
          <span>START GAME</span>
          <span class="btn-icon">▶</span>
        </button>
        
        <div class="prize-pool-info">
          <div class="prize-label">🏆 PRIZE POOL</div>
          <div class="prize-amounts">
            <span id="usdc-prize">Loading...</span>
            <span class="separator">|</span>
            <span id="eurc-prize">...</span>
          </div>
          <div class="prize-token">USDC / EURC on Arc Testnet</div>
        </div>
      </div>
      
      <div class="game-info-cards">
        <div class="info-card">
          <span class="info-icon">🎮</span>
          <span>10 LEVELS</span>
        </div>
        <div class="info-card">
          <span class="info-icon">🏆</span>
          <span>WIN CRYPTO</span>
        </div>
        <div class="info-card">
          <span class="info-icon">⛓️</span>
          <span>ARC TESTNET</span>
        </div>
      </div>
      
      <div class="leaderboard-preview" id="leaderboard-preview">
        <h3>🏅 TOP PLAYERS</h3>
        <div id="leaderboard-list">Loading...</div>
      </div>
    </div>
    
    <!-- Game Screen -->
    <div id="game-screen" class="screen">
      <!-- HUD -->
      <div id="hud">
        <div class="hud-left">
          <div class="hud-item">
            <span class="hud-label">LEVEL</span>
            <span id="hud-level" class="hud-value">1/10</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">SCORE</span>
            <span id="hud-score" class="hud-value">0</span>
          </div>
        </div>
        <div class="hud-center">
          <div class="hud-item">
            <span class="hud-label">⏱ TIME</span>
            <span id="hud-timer" class="hud-value">0:00</span>
          </div>
        </div>
        <div class="hud-right">
          <div class="hud-item">
            <span class="hud-label">LIVES</span>
            <span id="hud-lives" class="hud-value">❤️❤️❤️</span>
          </div>
          <div class="hud-item wallet-hud">
            <span class="hud-label">WALLET</span>
            <span id="hud-wallet" class="hud-value wallet-addr">-</span>
          </div>
        </div>
      </div>
      
      <!-- Level Banner -->
      <div id="level-banner" class="hidden">
        <div class="level-banner-inner">
          <span id="level-banner-num">LEVEL 1</span>
          <span id="level-banner-name">Tutorial Site</span>
        </div>
      </div>
      
      <!-- Canvas -->
      <canvas id="game-canvas"></canvas>
      
      <!-- Mobile Controls -->
      <div id="mobile-controls">
        <div class="mobile-row">
          <button class="mobile-btn" id="btn-up">▲</button>
        </div>
        <div class="mobile-row">
          <button class="mobile-btn" id="btn-left">◀</button>
          <button class="mobile-btn" id="btn-down">▼</button>
          <button class="mobile-btn" id="btn-right">▶</button>
        </div>
        <div class="mobile-jump">
          <button class="mobile-btn jump-btn" id="btn-jump">JUMP</button>
        </div>
      </div>
      
      <!-- Pause Menu -->
      <div id="pause-menu" class="hidden">
        <div class="pause-content">
          <h2>⏸ PAUSED</h2>
          <button onclick="resumeGame()" class="btn-secondary">RESUME</button>
          <button onclick="showWalletScreen()" class="btn-secondary">QUIT</button>
        </div>
      </div>
    </div>
    
    <!-- Level Complete Screen -->
    <div id="level-complete-screen" class="screen">
      <div class="level-complete-content">
        <div class="complete-icon">⭐</div>
        <h2>LEVEL COMPLETE!</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Level</span>
            <span class="stat-value" id="complete-level">-</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Time</span>
            <span class="stat-value" id="complete-time">-</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Score</span>
            <span class="stat-value" id="complete-score">-</span>
          </div>
        </div>
        <div id="complete-stars">⭐⭐⭐</div>
        <button id="next-level-btn" class="btn-primary">NEXT LEVEL ▶</button>
      </div>
    </div>
    
    <!-- Victory Screen -->
    <div id="victory-screen" class="screen">
      <div class="victory-fireworks" id="fireworks"></div>
      <div class="victory-content">
        <div class="trophy-anim">🏆</div>
        <h1 class="victory-title">YOU WON!</h1>
        <div class="victory-subtitle">LEVEL 10 COMPLETED!</div>
        
        <div class="winner-card">
          <div class="winner-row">
            <span class="winner-label">🐰 WINNER</span>
            <span class="winner-wallet" id="victory-wallet">-</span>
          </div>
          <div class="winner-row">
            <span class="winner-label">🎮 SCORE</span>
            <span class="winner-score" id="victory-score">-</span>
          </div>
          <div class="winner-row">
            <span class="winner-label">⏱ TIME</span>
            <span class="winner-time" id="victory-time">-</span>
          </div>
          <div class="winner-row reward-row">
            <span class="winner-label">💰 REWARD</span>
            <span class="winner-reward" id="victory-reward">CLAIMING...</span>
          </div>
        </div>
        
        <button id="claim-btn" class="btn-reward hidden">
          <span>💰 CLAIM REWARD</span>
        </button>
        
        <div id="tx-info" class="tx-info hidden">
          <div class="tx-label">📋 TX HASH:</div>
          <div class="tx-hash" id="tx-hash-display">-</div>
          <a id="tx-explorer-link" href="#" target="_blank" class="explorer-link">View on Arc Explorer →</a>
        </div>
        
        <div id="reward-status" class="reward-status">
          <div class="pulse-dot"></div>
          <span id="reward-status-text">Preparing reward...</span>
        </div>
        
        <div class="network-badge">
          <span>⛓️ ARC TESTNET</span>
        </div>
        
        <button onclick="restartGame()" class="btn-secondary">PLAY AGAIN</button>
      </div>
    </div>
    
    <!-- Game Over Screen -->
    <div id="gameover-screen" class="screen">
      <div class="gameover-content">
        <div class="gameover-icon">💀</div>
        <h2>GAME OVER</h2>
        <p id="gameover-msg">Try again!</p>
        <div class="go-stats">
          <span>Level: <strong id="go-level">-</strong></span>
          <span>Score: <strong id="go-score">-</strong></span>
        </div>
        <button id="retry-btn" class="btn-primary">TRY AGAIN</button>
        <button onclick="showWalletScreen()" class="btn-secondary">CHANGE WALLET</button>
      </div>
    </div>
  </div>
  
  <script src="/static/game.js"></script>
</body>
</html>`
}

/**
 * Generate admin panel HTML
 */
function generateAdminHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔐 Bunny Builder - Admin Panel</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/admin.css">
</head>
<body>
  <div id="admin-app">
    <!-- Admin Login -->
    <div id="admin-login" class="admin-screen active">
      <div class="admin-header">
        <div class="admin-logo">🔐</div>
        <h1>ADMIN PANEL</h1>
        <p>Bunny Builder · Arc Testnet</p>
      </div>
      
      <div class="admin-login-box">
        <label>Admin Wallet Address</label>
        <input type="text" id="admin-wallet-input" placeholder="0x..." class="admin-input">
        <div id="admin-error" class="admin-error hidden">Not authorized</div>
        <button id="admin-login-btn" class="admin-btn">ACCESS PANEL</button>
      </div>
    </div>
    
    <!-- Admin Dashboard -->
    <div id="admin-dashboard" class="admin-screen hidden">
      <div class="admin-topbar">
        <div class="admin-logo-small">🔐</div>
        <h2>BUNNY BUILDER ADMIN</h2>
        <div class="admin-wallet-badge" id="admin-wallet-badge">-</div>
        <button onclick="adminLogout()" class="admin-logout">LOGOUT</button>
      </div>
      
      <div class="admin-grid">
        <!-- Pool Status Card -->
        <div class="admin-card">
          <h3>💰 REWARD POOL</h3>
          <div class="pool-stats">
            <div class="pool-item">
              <span class="pool-label">USDC Balance</span>
              <span class="pool-value" id="admin-usdc-bal">Loading...</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">EURC Balance</span>
              <span class="pool-value" id="admin-eurc-bal">Loading...</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">Contract Address</span>
              <span class="pool-value contract-addr" id="admin-contract">-</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">Network</span>
              <span class="pool-value network-badge-small">⛓️ Arc Testnet</span>
            </div>
          </div>
          <button onclick="adminRefreshPool()" class="admin-btn-sm">🔄 REFRESH</button>
        </div>
        
        <!-- Deposit Card -->
        <div class="admin-card">
          <h3>📥 DEPOSIT REWARD</h3>
          <div class="form-group">
            <label>Token</label>
            <select id="deposit-token" class="admin-select">
              <option value="USDC">USDC</option>
              <option value="EURC">EURC</option>
            </select>
          </div>
          <div class="form-group">
            <label>Amount (in token units)</label>
            <input type="number" id="deposit-amount" placeholder="100.00" class="admin-input" step="0.01">
          </div>
          <button id="deposit-btn" class="admin-btn">DEPOSIT TOKENS</button>
          <div id="deposit-result" class="admin-result hidden"></div>
          
          <div class="deposit-instructions hidden" id="deposit-instructions">
            <h4>📋 Steps to Deposit:</h4>
            <ol id="deposit-steps"></ol>
          </div>
        </div>
        
        <!-- Game State Card -->
        <div class="admin-card">
          <h3>🎮 GAME STATE</h3>
          <div class="pool-stats">
            <div class="pool-item">
              <span class="pool-label">Total Players</span>
              <span class="pool-value" id="admin-players">-</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">Total Winners</span>
              <span class="pool-value" id="admin-winners">-</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">Current Round</span>
              <span class="pool-value" id="admin-round">-</span>
            </div>
            <div class="pool-item">
              <span class="pool-label">Round Status</span>
              <span class="pool-value status-active" id="admin-status">-</span>
            </div>
          </div>
          <button onclick="adminLoadStats()" class="admin-btn-sm">🔄 REFRESH STATS</button>
        </div>
        
        <!-- Reset Card -->
        <div class="admin-card danger-card">
          <h3>⚠️ RESET GAME</h3>
          <p class="danger-text">This will reset all player sessions and start a new round.</p>
          <div class="form-group">
            <label>Confirm by typing: <strong>RESET</strong></label>
            <input type="text" id="reset-confirm" placeholder="RESET" class="admin-input">
          </div>
          <button id="reset-btn" class="admin-btn danger-btn">🔄 RESET GAME</button>
          <div id="reset-result" class="admin-result hidden"></div>
        </div>
        
        <!-- Winners List -->
        <div class="admin-card wide-card">
          <h3>🏆 WINNERS HISTORY</h3>
          <div id="winners-table-container">
            <table class="admin-table" id="winners-table">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Wallet</th>
                  <th>Token</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="winners-tbody">
                <tr><td colspan="5" class="empty-row">No winners yet</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Leaderboard -->
        <div class="admin-card wide-card">
          <h3>📊 LEADERBOARD</h3>
          <div id="admin-leaderboard-container">
            <table class="admin-table" id="admin-leaderboard">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Wallet</th>
                  <th>Level</th>
                  <th>Score</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody id="admin-leaderboard-tbody">
                <tr><td colspan="5" class="empty-row">No data yet</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <script src="/static/admin.js"></script>
</body>
</html>`
}

export default app
