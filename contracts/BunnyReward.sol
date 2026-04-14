// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BunnyReward
 * @dev Smart Contract for Bunny Builder Game Reward System
 * @notice Deployed on Arc Testnet
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract BunnyReward {
    // ===================== STATE VARIABLES =====================

    address public admin;
    bool public roundActive;
    uint256 public currentRound;
    
    // Supported tokens: USDC and EURC on Arc Testnet
    mapping(address => uint256) public poolBalance;
    mapping(address => bool) public supportedTokens;
    
    // Winner tracking
    address public currentWinner;
    bool public rewardClaimed;
    
    // Round history
    struct RoundResult {
        uint256 roundId;
        address winner;
        address token;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }
    
    mapping(uint256 => RoundResult) public roundHistory;
    mapping(address => uint256) public playerWins;
    
    // Per-round winner tracking (wallet => roundId => hasWon)
    mapping(address => mapping(uint256 => bool)) public hasWonRound;
    
    // ===================== EVENTS =====================
    
    event RewardDeposited(address indexed admin, address indexed token, uint256 amount, uint256 round);
    event WinnerSet(address indexed winner, uint256 round, uint256 timestamp);
    event RewardClaimed(address indexed winner, address indexed token, uint256 amount, uint256 round);
    event RoundReset(uint256 newRound, uint256 timestamp);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    
    // ===================== MODIFIERS =====================
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "BunnyReward: caller is not admin");
        _;
    }
    
    modifier roundIsActive() {
        require(roundActive, "BunnyReward: no active round");
        _;
    }
    
    modifier noActiveWinner() {
        require(currentWinner == address(0), "BunnyReward: winner already set for this round");
        _;
    }
    
    // ===================== CONSTRUCTOR =====================
    
    constructor(address _admin, address[] memory _initialTokens) {
        require(_admin != address(0), "BunnyReward: invalid admin address");
        admin = _admin;
        roundActive = true;
        currentRound = 1;
        
        for (uint256 i = 0; i < _initialTokens.length; i++) {
            if (_initialTokens[i] != address(0)) {
                supportedTokens[_initialTokens[i]] = true;
                emit TokenAdded(_initialTokens[i]);
            }
        }
    }
    
    // ===================== ADMIN FUNCTIONS =====================
    
    /**
     * @dev Deposit reward tokens into the pool
     * @param token ERC20 token address (USDC or EURC)
     * @param amount Amount to deposit (in token's smallest unit)
     */
    function depositReward(address token, uint256 amount) external onlyAdmin {
        require(supportedTokens[token], "BunnyReward: token not supported");
        require(amount > 0, "BunnyReward: amount must be greater than 0");
        
        IERC20 tokenContract = IERC20(token);
        require(
            tokenContract.allowance(msg.sender, address(this)) >= amount,
            "BunnyReward: insufficient allowance"
        );
        
        bool success = tokenContract.transferFrom(msg.sender, address(this), amount);
        require(success, "BunnyReward: transfer failed");
        
        poolBalance[token] += amount;
        
        emit RewardDeposited(msg.sender, token, amount, currentRound);
    }
    
    /**
     * @dev Add a supported token
     * @param token Token address to add
     */
    function addSupportedToken(address token) external onlyAdmin {
        require(token != address(0), "BunnyReward: invalid token address");
        require(!supportedTokens[token], "BunnyReward: token already supported");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }
    
    /**
     * @dev Remove a supported token
     * @param token Token address to remove
     */
    function removeSupportedToken(address token) external onlyAdmin {
        require(supportedTokens[token], "BunnyReward: token not supported");
        require(poolBalance[token] == 0, "BunnyReward: pool not empty");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @dev Reset game round (admin only)
     * Can only reset after winner claimed or explicitly forced
     */
    function resetRound(bool force) external onlyAdmin {
        if (!force) {
            require(rewardClaimed || currentWinner == address(0), 
                "BunnyReward: winner has not claimed reward yet");
        }
        
        currentWinner = address(0);
        rewardClaimed = false;
        roundActive = true;
        currentRound += 1;
        
        emit RoundReset(currentRound, block.timestamp);
    }
    
    /**
     * @dev Emergency withdrawal by admin
     * @param token Token address to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyAdmin {
        require(poolBalance[token] >= amount, "BunnyReward: insufficient pool balance");
        poolBalance[token] -= amount;
        
        bool success = IERC20(token).transfer(admin, amount);
        require(success, "BunnyReward: transfer failed");
    }
    
    // ===================== GAME FUNCTIONS =====================
    
    /**
     * @dev Set the winner after completing Level 10
     * Called by admin/backend after validation
     * @param winner Address of the winning player
     */
    function setWinner(address winner) external onlyAdmin roundIsActive noActiveWinner {
        require(winner != address(0), "BunnyReward: invalid winner address");
        require(!hasWonRound[winner][currentRound], "BunnyReward: wallet already won this round");
        
        currentWinner = winner;
        hasWonRound[winner][currentRound] = true;
        playerWins[winner] += 1;
        
        emit WinnerSet(winner, currentRound, block.timestamp);
    }
    
    /**
     * @dev Execute reward payment to winner
     * @param winner Winner's address (must match currentWinner)
     * @param token Token to pay reward in (USDC or EURC)
     */
    function claimReward(address winner, address token) external roundIsActive {
        require(winner == currentWinner, "BunnyReward: address is not the current winner");
        require(!rewardClaimed, "BunnyReward: reward already claimed");
        require(supportedTokens[token], "BunnyReward: token not supported");
        require(poolBalance[token] > 0, "BunnyReward: pool is empty for this token");
        
        // Only winner or admin can trigger claim
        require(
            msg.sender == winner || msg.sender == admin,
            "BunnyReward: unauthorized caller"
        );
        
        uint256 rewardAmount = poolBalance[token];
        poolBalance[token] = 0;
        rewardClaimed = true;
        roundActive = false;
        
        // Record round result
        roundHistory[currentRound] = RoundResult({
            roundId: currentRound,
            winner: winner,
            token: token,
            amount: rewardAmount,
            timestamp: block.timestamp,
            claimed: true
        });
        
        bool success = IERC20(token).transfer(winner, rewardAmount);
        require(success, "BunnyReward: reward transfer failed");
        
        emit RewardClaimed(winner, token, rewardAmount, currentRound);
    }
    
    // ===================== VIEW FUNCTIONS =====================
    
    /**
     * @dev Get pool balance for a specific token
     * @param token Token address
     * @return balance Current pool balance
     */
    function getPoolBalance(address token) external view returns (uint256) {
        return poolBalance[token];
    }
    
    /**
     * @dev Get current game state
     */
    function getGameState() external view returns (
        bool active,
        uint256 round,
        address winner,
        bool claimed
    ) {
        return (roundActive, currentRound, currentWinner, rewardClaimed);
    }
    
    /**
     * @dev Check if a wallet has won in a specific round
     */
    function hasWalletWonRound(address wallet, uint256 round) external view returns (bool) {
        return hasWonRound[wallet][round];
    }
    
    /**
     * @dev Get round history
     */
    function getRoundResult(uint256 round) external view returns (RoundResult memory) {
        return roundHistory[round];
    }
    
    /**
     * @dev Get total wins for a player
     */
    function getPlayerWins(address player) external view returns (uint256) {
        return playerWins[player];
    }
    
    /**
     * @dev Check if a token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
}
