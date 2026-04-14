# 🐰 Bunny Builder — Web3 2D Platformer on Arc Testnet

## Project Overview
- **Name**: Bunny Builder
- **Type**: Web3 2D Platformer Game
- **Network**: Arc Testnet
- **Stack**: Hono + TypeScript + Canvas2D + Solidity
- **Goal**: Complete 10 progressive levels to win a USDC/EURC crypto reward

---

## 🎮 How to Play
1. Enter your EVM wallet address (no MetaMask needed!)
2. Click **START GAME**
3. Navigate through **10 progressive levels** as a rabbit construction worker
4. Reach the 🏁 exit flag at the end of each level
5. Complete **Level 10** to win the reward pool!

### Controls
| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move Left | ← Arrow | ◀ Button |
| Move Right | → Arrow | ▶ Button |
| Jump | Space / ↑ Arrow | JUMP Button |
| Double Jump | Space × 2 | JUMP × 2 |
| Pause | Escape | — |

---

## 🌐 Live URLs
| Endpoint | Description |
|----------|-------------|
| `/` | Main game |
| `/admin-bunny-builder-panel-x7k9` | Admin panel (hidden) |
| `/api/game/session` | Create/resume game session |
| `/api/game/complete-level` | Submit level completion |
| `/api/game/trigger-reward` | Trigger winner reward |
| `/api/contract/state` | Arc Testnet contract state |
| `/api/contract/pool-balance` | USDC/EURC pool balance |
| `/api/leaderboard` | Top players |
| `/api/winners` | Past winners |
| `/api/admin/verify` | Verify admin wallet |
| `/api/admin/deposit` | Admin deposit info |
| `/api/admin/reset-game` | Reset game round |
| `/api/admin/stats` | Dashboard stats |

---

## ⛓️ Smart Contract (Arc Testnet)

**File**: `contracts/BunnyReward.sol`

### Functions
```solidity
depositReward(address token, uint256 amount)  // Admin: deposit USDC/EURC
setWinner(address winner)                     // Admin: register level 10 winner
claimReward(address winner, address token)    // Execute on-chain payment
getPoolBalance(address token)                 // View pool balance
getGameState()                                // Get round/winner state
resetRound(bool force)                        // Admin: start new round
emergencyWithdraw(address token, uint256)     // Admin emergency withdrawal
```

### Deployment Steps (Arc Testnet)
```bash
# 1. Compile contract
# Use Remix IDE or Hardhat with Arc Testnet config

# 2. Network Config
# RPC: https://rpc.arctest.io
# Chain ID: [See Arc Testnet docs]

# 3. Deploy BunnyReward.sol with:
#    - admin wallet address
#    - [USDC_ADDRESS, EURC_ADDRESS] on Arc Testnet

# 4. Update wrangler.jsonc:
#    - CONTRACT_ADDRESS: deployed contract address
#    - ADMIN_WALLET: your admin wallet
#    - USDC_ADDRESS: Arc Testnet USDC token address
#    - EURC_ADDRESS: Arc Testnet EURC token address
```

---

## 🔐 Web3 Integration (Ultra Simple)
- **No MetaMask popups** — just paste your `0x...` wallet address
- Wallet is validated client-side and bound to a server session
- All blockchain interactions happen via server → Arc Testnet RPC
- Winner reward triggered automatically on Level 10 completion

---

## 👑 Admin Panel
**URL**: `/admin-bunny-builder-panel-x7k9` (hidden route)

**Access**: Enter the admin wallet address (set in `wrangler.jsonc`)

### Features
- 💰 View USDC/EURC pool balance
- 📥 Deposit reward tokens (step-by-step instructions)
- 🎮 Monitor game stats (players, winners, rounds)
- 🔄 Reset game round
- 🏆 View winners history
- 📊 Full leaderboard

---

## 🎯 Game Levels

| Level | Name | Enemies | Time Limit |
|-------|------|---------|------------|
| 1 | Tutorial Site | 2 | 120s |
| 2 | Foundation Ground | 3 | 110s |
| 3 | Scaffolding Climb | 4 | 100s |
| 4 | Steel Beams | 5 | 90s |
| 5 | Elevator Shaft | 6 | 80s |
| 6 | Wrecking Ball Zone | 7 | 70s |
| 7 | Rooftop Runner | 8 | 60s |
| 8 | Crane Crossing | 9 | 50s |
| 9 | Demolition Derby | 10 | 40s |
| 10 | **Penthouse Pinnacle** | 12 | 30s |

---

## 🛡️ Security & Anti-Cheat
- Server-side level sequence validation (can't skip levels)
- Minimum/maximum time validation per level
- Rapid action detection (1s cooldown between submissions)
- Session token binding (wallet → session → level progress)
- One reward per wallet per round
- Only deployed contract can move funds (on-chain security)

---

## 📁 Project Structure
```
webapp/
├── contracts/
│   └── BunnyReward.sol          # Smart contract (Solidity)
├── src/
│   ├── index.tsx                # Hono app + all API routes + HTML
│   ├── game/
│   │   └── gameState.ts         # Game session management + anti-cheat
│   ├── types/
│   │   └── game.ts              # TypeScript interfaces
│   └── contracts/
│       └── abi.ts               # Contract ABI + Arc Testnet config
├── public/static/
│   ├── game.css                 # Main game stylesheet
│   ├── game.js                  # 2D platformer engine (Canvas2D)
│   ├── admin.css                # Admin panel styles
│   └── admin.js                 # Admin panel logic
├── ecosystem.config.cjs         # PM2 config
├── wrangler.jsonc               # Cloudflare + env vars
└── package.json
```

---

## ⚙️ Configuration (wrangler.jsonc)

```jsonc
{
  "vars": {
    "ADMIN_WALLET": "0xYOUR_ADMIN_WALLET",      // Admin wallet
    "CONTRACT_ADDRESS": "0xDEPLOYED_CONTRACT",  // BunnyReward contract
    "ARC_RPC_URL": "https://rpc.arctest.io",    // Arc Testnet RPC
    "USDC_ADDRESS": "0xUSDC_ON_ARC",            // USDC token on Arc
    "EURC_ADDRESS": "0xEURC_ON_ARC"             // EURC token on Arc
  }
}
```

---

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod

# Set production secrets
npx wrangler pages secret put ADMIN_WALLET --project-name bunny-builder-game
npx wrangler pages secret put CONTRACT_ADDRESS --project-name bunny-builder-game
```

---

## 🎨 Features
- ✅ Pixel art rabbit construction worker character
- ✅ 10 progressive difficulty levels
- ✅ Moving platforms, wrecking balls, spikes, pits
- ✅ Enemy workers, foremen, helmet guards, boss workers
- ✅ Coin collection system
- ✅ Lives system (3 lives + bonus per level)
- ✅ Level timer + global speedrun timer
- ✅ Double jump mechanic
- ✅ Pixel-art HUD (level, score, lives, timer, wallet)
- ✅ Leaderboard (ranked by score + time)
- ✅ Fireworks victory animation
- ✅ Sound effects (Web Audio API)
- ✅ Mobile touchscreen controls
- ✅ Anti-bot protection

---

**Platform**: Cloudflare Pages  
**Status**: ✅ Active  
**Last Updated**: April 2026
