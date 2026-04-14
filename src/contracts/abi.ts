/**
 * BunnyReward Contract ABI
 * Deployed on Arc Testnet
 */
export const BUNNY_REWARD_ABI = [
  // Constructor
  {
    "inputs": [
      {"internalType": "address", "name": "_admin", "type": "address"},
      {"internalType": "address[]", "name": "_initialTokens", "type": "address[]"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "admin", "type": "address"},
      {"indexed": true, "name": "token", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "round", "type": "uint256"}
    ],
    "name": "RewardDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "winner", "type": "address"},
      {"indexed": false, "name": "round", "type": "uint256"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "WinnerSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "winner", "type": "address"},
      {"indexed": true, "name": "token", "type": "address"},
      {"indexed": false, "name": "amount", "type": "uint256"},
      {"indexed": false, "name": "round", "type": "uint256"}
    ],
    "name": "RewardClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "name": "newRound", "type": "uint256"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "RoundReset",
    "type": "event"
  },
  // Admin functions
  {
    "inputs": [
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "depositReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "force", "type": "bool"}],
    "name": "resetRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Game functions
  {
    "inputs": [{"name": "winner", "type": "address"}],
    "name": "setWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "winner", "type": "address"},
      {"name": "token", "type": "address"}
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // View functions
  {
    "inputs": [{"name": "token", "type": "address"}],
    "name": "getPoolBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGameState",
    "outputs": [
      {"name": "active", "type": "bool"},
      {"name": "round", "type": "uint256"},
      {"name": "winner", "type": "address"},
      {"name": "claimed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "wallet", "type": "address"},
      {"name": "round", "type": "uint256"}
    ],
    "name": "hasWalletWonRound",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "round", "type": "uint256"}],
    "name": "getRoundResult",
    "outputs": [
      {
        "components": [
          {"name": "roundId", "type": "uint256"},
          {"name": "winner", "type": "address"},
          {"name": "token", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "claimed", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "player", "type": "address"}],
    "name": "getPlayerWins",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "token", "type": "address"}],
    "name": "isTokenSupported",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  // State variables (public getters)
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roundActive",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentRound",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentWinner",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardClaimed",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "poolBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "", "type": "address"}],
    "name": "playerWins",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Arc Testnet Configuration
export const ARC_TESTNET = {
  chainId: "0x" + (5042002).toString(16), // Arc Testnet Chain ID: 5042002
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6
  },
  rpcUrls: ["https://rpc.testnet.arc.network"],
  blockExplorerUrls: ["https://testnet.arcscan.app"]
};

// Contract addresses on Arc Testnet — DEPLOYED ✅
export const CONTRACT_ADDRESSES = {
  BUNNY_REWARD: "0x95F5eA4BDcbfC80569521B4b67Da53f14cF6dd91", // Deployed 2026-04-14
  USDC: "0x3600000000000000000000000000000000000000",          // Arc Testnet native USDC
  EURC: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",          // Arc Testnet EURC
};

// Admin wallet address
export const ADMIN_WALLET = "0xBBE4Bf2D53A4A752c0eF21573FA0162BddafCD12"; // Arc Testnet admin wallet
