// =====================================================
// BUNNY BUILDER - 2D Platformer Game Engine
// Arc Testnet Web3 Game
// =====================================================

'use strict';

// ===================== GAME CONFIG =====================
const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 480,
  GRAVITY: 0.55,
  JUMP_FORCE: -13,
  PLAYER_SPEED: 4.5,
  TILE_SIZE: 32,
  MAX_LIVES: 3,
  TOTAL_LEVELS: 10,
};

// ===================== LEVEL DEFINITIONS =====================
// Each level has: platforms, enemies, coins, hazards, exit
const LEVEL_DEFS = [
  // Level 1 - Tutorial Site
  {
    name: "Tutorial Site", bg: "#1a3a5c", ground: "#8B4513",
    platforms: [
      {x:0, y:448, w:800, h:32, type:'ground'},
      {x:100, y:368, w:120, h:16, type:'wood'},
      {x:300, y:320, w:100, h:16, type:'wood'},
      {x:500, y:272, w:120, h:16, type:'steel'},
    ],
    coins: [{x:150,y:340},{x:200,y:340},{x:340,y:292},{x:380,y:292},{x:540,y:244},{x:580,y:244}],
    enemies: [
      {x:200, y:416, type:'worker', speed:1.5, dir:1, range:150},
      {x:550, y:416, type:'worker', speed:1.5, dir:-1, range:100},
    ],
    exit: {x:720, y:416},
    startX: 50, startY: 400,
    hazards: [],
    spawns: [],
    timeLimit: 120
  },
  // Level 2 - Foundation Ground
  {
    name: "Foundation Ground", bg: "#0f2a40", ground: "#5a4a3a",
    platforms: [
      {x:0, y:448, w:240, h:32, type:'ground'},
      {x:290, y:448, w:200, h:32, type:'ground'},
      {x:540, y:448, w:260, h:32, type:'ground'},
      {x:80, y:368, w:100, h:16, type:'wood'},
      {x:240, y:304, w:120, h:16, type:'steel'},
      {x:420, y:336, w:100, h:16, type:'wood'},
      {x:600, y:272, w:120, h:16, type:'steel'},
    ],
    coins: [{x:100,y:340},{x:280,y:276},{x:320,y:276},{x:450,y:308},{x:630,y:244},{x:670,y:244}],
    enemies: [
      {x:100, y:416, type:'worker', speed:2, dir:1, range:120},
      {x:400, y:416, type:'foreman', speed:2.5, dir:-1, range:160},
      {x:620, y:416, type:'worker', speed:2, dir:1, range:100},
    ],
    hazards: [{x:245, y:432, w:50, h:16, type:'spike'}],
    exit: {x:730, y:416},
    startX: 40, startY: 400,
    spawns: [],
    timeLimit: 110
  },
  // Level 3 - Scaffolding Climb
  {
    name: "Scaffolding Climb", bg: "#0a1f30", ground: "#4a3a2a",
    platforms: [
      {x:0, y:448, w:200, h:32, type:'ground'},
      {x:250, y:448, w:350, h:32, type:'ground'},
      {x:650, y:448, w:150, h:32, type:'ground'},
      {x:50, y:380, w:80, h:16, type:'scaffold'},
      {x:200, y:320, w:100, h:16, type:'wood'},
      {x:120, y:256, w:80, h:16, type:'scaffold'},
      {x:280, y:208, w:120, h:16, type:'steel'},
      {x:450, y:336, w:80, h:16, type:'scaffold'},
      {x:580, y:272, w:100, h:16, type:'steel'},
      {x:680, y:208, w:80, h:16, type:'scaffold'},
    ],
    coins: [{x:70,y:352},{x:220,y:292},{x:130,y:228},{x:300,y:180},{x:470,y:308},{x:600,y:244},{x:700,y:180}],
    enemies: [
      {x:300, y:416, type:'worker', speed:2.5, dir:1, range:130},
      {x:500, y:416, type:'foreman', speed:2, dir:-1, range:100},
      {x:240, y:176, type:'worker', speed:2.5, dir:1, range:80},
    ],
    hazards: [
      {x:248, y:432, w:52, h:16, type:'pit'},
      {x:598, y:432, w:52, h:16, type:'pit'},
    ],
    exit: {x:700, y:176},
    startX: 40, startY: 400,
    spawns: [],
    timeLimit: 100
  },
  // Level 4 - Steel Beams
  {
    name: "Steel Beams", bg: "#080c18", ground: "#3a3a3a",
    platforms: [
      {x:0, y:448, w:160, h:32, type:'ground'},
      {x:200, y:448, w:140, h:32, type:'ground'},
      {x:400, y:448, w:150, h:32, type:'ground'},
      {x:620, y:448, w:180, h:32, type:'ground'},
      {x:80, y:384, w:120, h:16, type:'steel'},
      {x:260, y:320, w:100, h:16, type:'steel'},
      {x:420, y:288, w:80, h:16, type:'steel', moving:true, moveRange:80, moveSpeed:1.5},
      {x:560, y:240, w:100, h:16, type:'steel'},
      {x:680, y:192, w:80, h:16, type:'steel', moving:true, moveRange:60, moveSpeed:2},
    ],
    coins: [{x:100,y:356},{x:280,y:292},{x:300,y:292},{x:440,y:260},{x:570,y:212},{x:700,y:164}],
    enemies: [
      {x:220, y:416, type:'foreman', speed:2.5, dir:1, range:120},
      {x:440, y:416, type:'helmet', speed:3, dir:-1, range:100},
      {x:280, y:288, type:'worker', speed:2, dir:1, range:70},
    ],
    hazards: [
      {x:160, y:432, w:40, h:16, type:'pit'},
      {x:340, y:432, w:60, h:16, type:'pit'},
      {x:550, y:432, w:70, h:16, type:'pit'},
    ],
    exit: {x:710, y:160},
    startX: 40, startY: 400,
    spawns: [],
    timeLimit: 90
  },
  // Level 5 - Elevator Shaft
  {
    name: "Elevator Shaft", bg: "#060810", ground: "#2a2a2a",
    platforms: [
      {x:0, y:448, w:160, h:32, type:'ground'},
      {x:300, y:448, w:200, h:32, type:'ground'},
      {x:600, y:448, w:200, h:32, type:'ground'},
      {x:60, y:368, w:80, h:16, type:'steel', moving:true, moveRange:60, moveSpeed:1.5},
      {x:200, y:320, w:100, h:16, type:'scaffold'},
      {x:360, y:256, w:80, h:16, type:'steel', moving:true, moveRange:80, moveSpeed:2},
      {x:500, y:200, w:100, h:16, type:'steel'},
      {x:640, y:160, w:80, h:16, type:'steel', moving:true, moveRange:60, moveSpeed:2.5},
      {x:460, y:320, w:80, h:16, type:'scaffold'},
    ],
    coins: [{x:80,y:340},{x:220,y:292},{x:380,y:228},{x:520,y:172},{x:660,y:132},{x:470,y:292}],
    enemies: [
      {x:100, y:416, type:'helmet', speed:2.5, dir:1, range:100},
      {x:380, y:416, type:'foreman', speed:3, dir:-1, range:150},
      {x:620, y:416, type:'helmet', speed:2.5, dir:1, range:130},
      {x:220, y:288, type:'worker', speed:2, dir:1, range:70},
    ],
    hazards: [
      {x:160, y:432, w:140, h:16, type:'pit'},
      {x:500, y:432, w:100, h:16, type:'pit'},
    ],
    exit: {x:660, y:128},
    startX: 40, startY: 400,
    spawns: [],
    timeLimit: 80
  },
  // Level 6 - Wrecking Ball Zone
  {
    name: "Wrecking Ball Zone", bg: "#050508", ground: "#1a1a1a",
    platforms: [
      {x:0, y:448, w:130, h:32, type:'ground'},
      {x:180, y:448, w:120, h:32, type:'ground'},
      {x:360, y:448, w:130, h:32, type:'ground'},
      {x:550, y:448, w:130, h:32, type:'ground'},
      {x:680, y:448, w:120, h:32, type:'ground'},
      {x:50, y:368, w:90, h:16, type:'steel'},
      {x:200, y:288, w:100, h:16, type:'steel'},
      {x:360, y:224, w:80, h:16, type:'steel', moving:true, moveRange:100, moveSpeed:2.5},
      {x:530, y:168, w:100, h:16, type:'scaffold'},
      {x:680, y:112, w:80, h:16, type:'steel', moving:true, moveRange:70, moveSpeed:3},
    ],
    coins: [{x:65,y:340},{x:220,y:260},{x:260,y:260},{x:380,y:196},{x:550,y:140},{x:690,y:84}],
    enemies: [
      {x:200, y:416, type:'helmet', speed:3, dir:1, range:110},
      {x:400, y:416, type:'boss_worker', speed:2, dir:-1, range:120},
      {x:600, y:416, type:'helmet', speed:3, dir:1, range:100},
      {x:210, y:256, type:'foreman', speed:2.5, dir:1, range:70},
      {x:540, y:136, type:'worker', speed:2, dir:1, range:70},
    ],
    hazards: [
      {x:130, y:432, w:50, h:16, type:'spike'},
      {x:300, y:432, w:60, h:16, type:'pit'},
      {x:490, y:432, w:60, h:16, type:'pit'},
    ],
    wrecking_balls: [{x:380, y:200, radius:20, pendulum_angle:0, pendulum_speed:0.04, pendulum_length:100}],
    exit: {x:690, y:80},
    startX: 40, startY: 400,
    spawns: [],
    timeLimit: 70
  },
  // Level 7 - Rooftop Runner
  {
    name: "Rooftop Runner", bg: "#020306", ground: "#111111",
    platforms: [
      {x:0, y:448, w:100, h:32, type:'ground'},
      {x:150, y:448, w:80, h:32, type:'ground'},
      {x:280, y:448, w:100, h:32, type:'ground'},
      {x:440, y:448, w:80, h:32, type:'ground'},
      {x:580, y:448, w:220, h:32, type:'ground'},
      {x:20, y:352, w:100, h:16, type:'steel', moving:true, moveRange:100, moveSpeed:2},
      {x:200, y:272, w:80, h:16, type:'scaffold'},
      {x:340, y:208, w:100, h:16, type:'steel', moving:true, moveRange:80, moveSpeed:2.5},
      {x:500, y:144, w:80, h:16, type:'steel'},
      {x:640, y:96, w:120, h:16, type:'rooftop'},
      {x:380, y:320, w:70, h:16, type:'scaffold'},
    ],
    coins: [{x:40,y:324},{x:210,y:244},{x:355,y:180},{x:515,y:116},{x:660,y:68},{x:390,y:292}],
    enemies: [
      {x:160, y:416, type:'helmet', speed:3, dir:1, range:80},
      {x:460, y:416, type:'boss_worker', speed:2.5, dir:-1, range:70},
      {x:600, y:416, type:'helmet', speed:3, dir:1, range:150},
      {x:210, y:240, type:'foreman', speed:3, dir:1, range:60},
      {x:500, y:112, type:'helmet', speed:2.5, dir:1, range:60},
    ],
    hazards: [
      {x:100, y:432, w:50, h:16, type:'pit'},
      {x:230, y:432, w:50, h:16, type:'pit'},
      {x:380, y:432, w:60, h:16, type:'pit'},
      {x:520, y:432, w:60, h:16, type:'spike'},
    ],
    exit: {x:680, y:64},
    startX: 30, startY: 400,
    spawns: [],
    timeLimit: 60
  },
  // Level 8 - Crane Crossing
  {
    name: "Crane Crossing", bg: "#010204", ground: "#0a0a0a",
    platforms: [
      {x:0, y:448, w:90, h:32, type:'ground'},
      {x:140, y:448, w:70, h:32, type:'ground'},
      {x:270, y:448, w:80, h:32, type:'ground'},
      {x:410, y:448, w:70, h:32, type:'ground'},
      {x:540, y:448, w:80, h:32, type:'ground'},
      {x:680, y:448, w:120, h:32, type:'ground'},
      {x:30, y:356, w:80, h:16, type:'crane', moving:true, moveRange:120, moveSpeed:2.5},
      {x:200, y:272, w:90, h:16, type:'steel', moving:true, moveRange:70, moveSpeed:3},
      {x:350, y:196, w:80, h:16, type:'crane', moving:true, moveRange:100, moveSpeed:3.5},
      {x:530, y:128, w:80, h:16, type:'steel'},
      {x:660, y:80, w:120, h:16, type:'crane'},
    ],
    coins: [{x:50,y:328},{x:215,y:244},{x:365,y:168},{x:545,y:100},{x:680,y:52}],
    enemies: [
      {x:150, y:416, type:'boss_worker', speed:3, dir:1, range:70},
      {x:430, y:416, type:'helmet', speed:3.5, dir:-1, range:70},
      {x:550, y:416, type:'boss_worker', speed:3, dir:1, range:70},
      {x:210, y:240, type:'helmet', speed:3, dir:1, range:70},
      {x:360, y:164, type:'foreman', speed:3, dir:1, range:60},
    ],
    hazards: [
      {x:90, y:432, w:50, h:16, type:'pit'},
      {x:210, y:432, w:60, h:16, type:'spike'},
      {x:350, y:432, w:60, h:16, type:'pit'},
      {x:480, y:432, w:60, h:16, type:'spike'},
      {x:620, y:432, w:60, h:16, type:'pit'},
    ],
    exit: {x:700, y:48},
    startX: 30, startY: 400,
    spawns: [],
    timeLimit: 50
  },
  // Level 9 - Demolition Derby
  {
    name: "Demolition Derby", bg: "#000103", ground: "#050505",
    platforms: [
      {x:0, y:448, w:80, h:32, type:'ground'},
      {x:130, y:448, w:60, h:32, type:'ground'},
      {x:250, y:448, w:70, h:32, type:'ground'},
      {x:380, y:448, w:60, h:32, type:'ground'},
      {x:500, y:448, w:70, h:32, type:'ground'},
      {x:630, y:448, w:170, h:32, type:'ground'},
      {x:20, y:360, w:80, h:16, type:'scaffold', moving:true, moveRange:80, moveSpeed:3},
      {x:180, y:280, w:80, h:16, type:'steel', moving:true, moveRange:90, moveSpeed:3},
      {x:320, y:200, w:80, h:16, type:'crane', moving:true, moveRange:100, moveSpeed:3.5},
      {x:480, y:136, w:80, h:16, type:'steel', moving:true, moveRange:80, moveSpeed:4},
      {x:640, y:80, w:120, h:16, type:'rooftop'},
      {x:360, y:320, w:60, h:16, type:'scaffold'},
      {x:560, y:256, w:70, h:16, type:'steel'},
    ],
    coins: [{x:30,y:332},{x:190,y:252},{x:330,y:172},{x:490,y:108},{x:660,y:52}],
    enemies: [
      {x:140, y:416, type:'boss_worker', speed:3.5, dir:1, range:60},
      {x:260, y:416, type:'boss_worker', speed:3.5, dir:-1, range:60},
      {x:510, y:416, type:'helmet', speed:4, dir:1, range:60},
      {x:640, y:416, type:'boss_worker', speed:3.5, dir:-1, range:120},
      {x:190, y:248, type:'helmet', speed:3.5, dir:1, range:60},
      {x:480, y:104, type:'boss_worker', speed:3, dir:1, range:60},
    ],
    hazards: [
      {x:80, y:432, w:50, h:16, type:'spike'},
      {x:190, y:432, w:60, h:16, type:'pit'},
      {x:320, y:432, w:60, h:16, type:'spike'},
      {x:440, y:432, w:60, h:16, type:'pit'},
      {x:570, y:432, w:60, h:16, type:'spike'},
    ],
    wrecking_balls: [
      {x:300, y:160, radius:18, pendulum_angle:0, pendulum_speed:0.05, pendulum_length:80},
      {x:560, y:120, radius:18, pendulum_angle:Math.PI/3, pendulum_speed:0.06, pendulum_length:80},
    ],
    exit: {x:680, y:48},
    startX: 30, startY: 400,
    spawns: [],
    timeLimit: 40
  },
  // Level 10 - Penthouse Pinnacle (FINAL BOSS LEVEL)
  {
    name: "Penthouse Pinnacle", bg: "#000000", ground: "#010101",
    platforms: [
      {x:0, y:448, w:70, h:32, type:'ground'},
      {x:120, y:448, w:50, h:32, type:'ground'},
      {x:230, y:448, w:60, h:32, type:'ground'},
      {x:350, y:448, w:50, h:32, type:'ground'},
      {x:460, y:448, w:60, h:32, type:'ground'},
      {x:580, y:448, w:50, h:32, type:'ground'},
      {x:690, y:448, w:110, h:32, type:'ground'},
      {x:10, y:370, w:70, h:16, type:'crane', moving:true, moveRange:90, moveSpeed:3},
      {x:160, y:290, w:80, h:16, type:'steel', moving:true, moveRange:100, moveSpeed:3.5},
      {x:320, y:216, w:80, h:16, type:'crane', moving:true, moveRange:80, moveSpeed:4},
      {x:500, y:148, w:80, h:16, type:'steel', moving:true, moveRange:90, moveSpeed:4.5},
      {x:680, y:96, w:80, h:16, type:'rooftop', moving:true, moveRange:60, moveSpeed:3},
      {x:330, y:336, w:60, h:16, type:'scaffold'},
      {x:530, y:272, w:60, h:16, type:'scaffold'},
    ],
    coins: [{x:25,y:342},{x:170,y:262},{x:335,y:188},{x:510,y:120},{x:690,y:68},{x:340,y:308},{x:540,y:244}],
    enemies: [
      {x:130, y:416, type:'boss_worker', speed:4, dir:1, range:60},
      {x:240, y:416, type:'boss_worker', speed:4, dir:-1, range:60},
      {x:360, y:416, type:'helmet', speed:4, dir:1, range:50},
      {x:470, y:416, type:'boss_worker', speed:4, dir:-1, range:60},
      {x:590, y:416, type:'helmet', speed:4, dir:1, range:50},
      {x:700, y:416, type:'boss_worker', speed:4, dir:-1, range:80},
      {x:170, y:258, type:'helmet', speed:4, dir:1, range:60},
      {x:510, y:116, type:'boss_worker', speed:3.5, dir:1, range:60},
    ],
    hazards: [
      {x:70, y:432, w:50, h:16, type:'spike'},
      {x:170, y:432, w:60, h:16, type:'pit'},
      {x:290, y:432, w:60, h:16, type:'spike'},
      {x:400, y:432, w:60, h:16, type:'pit'},
      {x:520, y:432, w:60, h:16, type:'spike'},
      {x:630, y:432, w:60, h:16, type:'pit'},
    ],
    wrecking_balls: [
      {x:200, y:180, radius:20, pendulum_angle:0, pendulum_speed:0.06, pendulum_length:90},
      {x:420, y:120, radius:20, pendulum_angle:Math.PI/2, pendulum_speed:0.07, pendulum_length:90},
      {x:650, y:80, radius:16, pendulum_angle:Math.PI, pendulum_speed:0.08, pendulum_length:70},
    ],
    exit: {x:700, y:64},
    startX: 20, startY: 400,
    spawns: [],
    timeLimit: 30
  }
];

// ===================== GAME STATE =====================
let gameState = {
  screen: 'wallet',
  walletAddress: '',
  sessionToken: '',
  currentLevel: 1,
  lives: GAME_CONFIG.MAX_LIVES,
  score: 0,
  totalTime: 0,
  levelTime: 0,
  levelTimerId: null,
  isPaused: false,
  isRunning: false,
  keys: {},
  animFrame: null,
  completedLevels: [],
};

// ===================== PLAYER =====================
let player = {
  x: 50, y: 400, w: 28, h: 36,
  vx: 0, vy: 0,
  onGround: false,
  facing: 1,
  jumpCount: 0,
  maxJumps: 2,
  state: 'idle', // idle, run, jump, fall, hurt
  hurtTimer: 0,
  invincibleTimer: 0,
  animFrame: 0,
  animTimer: 0,
};

// ===================== CANVAS SETUP =====================
let canvas, ctx;
let gameObjects = { platforms: [], enemies: [], coins: [], hazards: [], wrecking_balls: [], exit: null };

function initCanvas() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  if (!canvas) return;
  const container = document.getElementById('game-screen');
  // Use actual dimensions if visible, otherwise use fixed defaults
  const w = (container && container.offsetWidth > 0) ? container.offsetWidth : 800;
  const h = (container && container.offsetHeight > 0) ? container.offsetHeight : 480;
  canvas.width = w;
  canvas.height = h;
  GAME_CONFIG.WIDTH = w;
  GAME_CONFIG.HEIGHT = h;
}

// ===================== INPUT HANDLING =====================
function initInput() {
  document.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;
    if (e.code === 'Escape') togglePause();
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      handleJump();
    }
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
  });
  
  // Mobile controls
  const setupMobileBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); gameState.keys[key] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); gameState.keys[key] = false; });
    btn.addEventListener('mousedown', () => { gameState.keys[key] = true; });
    btn.addEventListener('mouseup', () => { gameState.keys[key] = false; });
  };
  
  setupMobileBtn('btn-left', 'ArrowLeft');
  setupMobileBtn('btn-right', 'ArrowRight');
  setupMobileBtn('btn-up', 'ArrowUp');
  setupMobileBtn('btn-down', 'ArrowDown');
  
  const jumpBtn = document.getElementById('btn-jump');
  if (jumpBtn) {
    jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleJump(); });
    jumpBtn.addEventListener('mousedown', () => handleJump());
  }
}

function handleJump() {
  if (!gameState.isRunning || gameState.isPaused) return;
  if (player.jumpCount < player.maxJumps) {
    player.vy = GAME_CONFIG.JUMP_FORCE;
    player.jumpCount++;
    player.onGround = false;
    player.state = 'jump';
    playSound('jump');
  }
}

// ===================== LEVEL LOADING =====================
function loadLevel(levelNum) {
  const def = LEVEL_DEFS[levelNum - 1];
  if (!def) return;
  
  // Reset player
  player.x = def.startX;
  player.y = def.startY;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.jumpCount = 0;
  player.state = 'idle';
  player.hurtTimer = 0;
  player.invincibleTimer = 0;
  player.facing = 1;
  player.animFrame = 0;
  
  // Load game objects
  gameObjects.platforms = def.platforms.map(p => ({
    ...p,
    origX: p.x,
    moveDir: 1,
    moveOffset: 0
  }));
  
  gameObjects.enemies = def.enemies.map(e => ({
    ...e,
    origX: e.x,
    alive: true,
    state: 'walk',
    hurtTimer: 0,
    animFrame: 0,
    animTimer: 0
  }));
  
  gameObjects.coins = def.coins.map(c => ({
    ...c,
    collected: false,
    animTimer: Math.random() * Math.PI * 2,
    size: 12
  }));
  
  gameObjects.hazards = def.hazards || [];
  
  gameObjects.wrecking_balls = (def.wrecking_balls || []).map(wb => ({
    ...wb,
    origX: wb.x
  }));
  
  gameObjects.exit = { ...def.exit, pulse: 0, collected: false };
  
  // Update HUD
  updateHUD();
  
  // Show level banner
  showLevelBanner(levelNum, def.name);
  
  // Start timer
  gameState.levelTime = def.timeLimit;
  
  document.getElementById('game-screen').style.background = def.bg;
}

function showLevelBanner(num, name) {
  const banner = document.getElementById('level-banner');
  document.getElementById('level-banner-num').textContent = `LEVEL ${num}`;
  document.getElementById('level-banner-name').textContent = name;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 2500);
}

// ===================== CAMERA =====================
let camera = { x: 0, y: 0 };

function updateCamera() {
  const targetX = player.x - GAME_CONFIG.WIDTH / 2;
  camera.x = Math.max(0, targetX);
}

// ===================== PHYSICS =====================
function updatePhysics() {
  if (!gameState.isRunning || gameState.isPaused) return;
  
  // Move moving platforms
  gameObjects.platforms.forEach(p => {
    if (!p.moving) return;
    p.moveOffset += p.moveSpeed * p.moveDir;
    if (Math.abs(p.moveOffset) >= p.moveRange) p.moveDir *= -1;
    p.x = p.origX + p.moveOffset;
  });
  
  // Player input
  if (!player.hurtTimer) {
    if (gameState.keys['ArrowLeft']) {
      player.vx = -GAME_CONFIG.PLAYER_SPEED;
      player.facing = -1;
      if (player.onGround) player.state = 'run';
    } else if (gameState.keys['ArrowRight']) {
      player.vx = GAME_CONFIG.PLAYER_SPEED;
      player.facing = 1;
      if (player.onGround) player.state = 'run';
    } else {
      player.vx *= 0.8;
      if (player.onGround) player.state = 'idle';
    }
  } else {
    player.vx *= 0.7;
    player.hurtTimer--;
  }
  
  // Gravity
  player.vy += GAME_CONFIG.GRAVITY;
  if (player.vy > 20) player.vy = 20;
  
  // Update state
  if (!player.onGround) {
    player.state = player.vy < 0 ? 'jump' : 'fall';
  }
  
  // Apply velocity
  player.x += player.vx;
  player.y += player.vy;
  
  // Ground collision
  player.onGround = false;
  
  gameObjects.platforms.forEach(p => {
    if (collideRect(player, p)) {
      resolveCollision(player, p);
    }
  });
  
  // Hazard collision
  if (!player.invincibleTimer) {
    gameObjects.hazards.forEach(h => {
      if (h.type === 'pit' && player.y > GAME_CONFIG.HEIGHT - 32) {
        // Pit = fall death
      }
      if (h.type === 'spike' && collideRect(player, h)) {
        playerHurt();
      }
    });
  }
  
  // Wrecking ball collision
  gameObjects.wrecking_balls.forEach(wb => {
    wb.pendulum_angle += wb.pendulum_speed;
    wb.x = wb.origX + Math.sin(wb.pendulum_angle) * wb.pendulum_length;
    
    if (!player.invincibleTimer) {
      const dx = player.x + player.w/2 - wb.x;
      const dy = player.y + player.h/2 - wb.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < wb.radius + 14) {
        playerHurt();
      }
    }
  });
  
  // Enemy collision and AI
  gameObjects.enemies.forEach(e => {
    if (!e.alive) return;
    
    // Enemy AI
    e.x += e.speed * e.dir;
    if (e.x <= e.origX - e.range || e.x >= e.origX + e.range) {
      e.dir *= -1;
    }
    
    // Enemy animation
    e.animTimer++;
    if (e.animTimer >= 8) { e.animTimer = 0; e.animFrame = (e.animFrame + 1) % 4; }
    
    if (!player.invincibleTimer) {
      if (collideRect(player, {x: e.x, y: e.y - 32, w: 28, h: 32})) {
        // Check if player is jumping on enemy
        if (player.vy > 0 && player.y + player.h < e.y - 10) {
          // Stomp!
          e.alive = false;
          player.vy = GAME_CONFIG.JUMP_FORCE * 0.7;
          gameState.score += 100;
          updateHUD();
          playSound('stomp');
        } else {
          playerHurt();
        }
      }
    }
  });
  
  // Coin collection
  gameObjects.coins.forEach(c => {
    if (c.collected) return;
    c.animTimer += 0.08;
    
    if (collideRect(player, {x: c.x - c.size/2, y: c.y - c.size/2, w: c.size, h: c.size})) {
      c.collected = true;
      gameState.score += 50;
      updateHUD();
      playSound('coin');
    }
  });
  
  // Exit collision
  if (gameObjects.exit && !gameObjects.exit.collected) {
    gameObjects.exit.pulse += 0.05;
    if (collideRect(player, {x: gameObjects.exit.x - 20, y: gameObjects.exit.y - 40, w: 40, h: 40})) {
      gameObjects.exit.collected = true;
      onLevelComplete();
    }
  }
  
  // Fall out of level
  if (player.y > GAME_CONFIG.HEIGHT + 50) {
    playerHurt();
  }
  
  // Boundary
  if (player.x < 0) player.x = 0;
  
  // Invincibility timer
  if (player.invincibleTimer > 0) player.invincibleTimer--;
  
  // Player animation
  player.animTimer++;
  if (player.state === 'run' && player.animTimer >= 5) {
    player.animTimer = 0;
    player.animFrame = (player.animFrame + 1) % 4;
  } else if (player.state === 'idle') {
    if (player.animTimer >= 20) { player.animTimer = 0; player.animFrame = (player.animFrame + 1) % 2; }
  }
  
  updateCamera();
}

function collideRect(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function resolveCollision(p, platform) {
  const overlapX = Math.min(p.x + p.w - platform.x, platform.x + platform.w - p.x);
  const overlapY = Math.min(p.y + p.h - platform.y, platform.y + platform.h - p.y);
  
  if (overlapX < overlapY) {
    if (p.x + p.w/2 < platform.x + platform.w/2) {
      p.x = platform.x - p.w;
    } else {
      p.x = platform.x + platform.w;
    }
    p.vx = 0;
  } else {
    if (p.y + p.h/2 < platform.y + platform.h/2) {
      p.y = platform.y - p.h;
      p.vy = 0;
      p.onGround = true;
      p.jumpCount = 0;
    } else {
      p.y = platform.y + platform.h;
      p.vy = 0;
    }
  }
}

function playerHurt() {
  if (player.invincibleTimer > 0 || player.hurtTimer > 0) return;
  
  gameState.lives--;
  player.hurtTimer = 20;
  player.invincibleTimer = 120;
  player.vy = GAME_CONFIG.JUMP_FORCE * 0.6;
  player.state = 'hurt';
  playSound('hurt');
  updateHUD();
  
  if (gameState.lives <= 0) {
    gameOver();
  }
}

// ===================== RENDERER =====================
function render() {
  if (!ctx) return;
  // Guard against zero-size canvas
  if (canvas.width <= 0 || canvas.height <= 0) {
    resizeCanvas();
    return;
  }
  const W = GAME_CONFIG.WIDTH;
  const H = GAME_CONFIG.HEIGHT;
  const def = LEVEL_DEFS[gameState.currentLevel - 1];
  
  ctx.clearRect(0, 0, W, H);
  
  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  const bgColor = def ? def.bg : '#0a0a1a';
  bgGrad.addColorStop(0, bgColor);
  bgGrad.addColorStop(1, lightenColor(bgColor, 20));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);
  
  // Stars (background decoration)
  drawStars(W, H);
  
  ctx.save();
  ctx.translate(-camera.x, 0);
  
  // Draw platforms
  gameObjects.platforms.forEach(p => drawPlatform(p));
  
  // Draw hazards
  gameObjects.hazards.forEach(h => drawHazard(h));
  
  // Draw wrecking balls
  gameObjects.wrecking_balls.forEach(wb => drawWreckingBall(wb));
  
  // Draw coins
  gameObjects.coins.forEach(c => { if (!c.collected) drawCoin(c); });
  
  // Draw exit
  if (gameObjects.exit && !gameObjects.exit.collected) drawExit(gameObjects.exit);
  
  // Draw enemies
  gameObjects.enemies.forEach(e => { if (e.alive) drawEnemy(e); });
  
  // Draw player
  drawPlayer();
  
  ctx.restore();
}

function drawStars(W, H) {
  // Simple static stars based on seed
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (let i = 0; i < 30; i++) {
    const sx = (i * 1237 + 113) % (W + 400);
    const sy = (i * 587 + 41) % (H * 0.6);
    const sr = 0.5 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlatform(p) {
  const colors = {
    ground: { top: '#8B6543', body: '#6B4523' },
    wood: { top: '#D4882A', body: '#A0662A' },
    steel: { top: '#9999BB', body: '#666688' },
    scaffold: { top: '#FFAA44', body: '#CC7722' },
    crane: { top: '#AABBFF', body: '#7788CC' },
    rooftop: { top: '#CCBBAA', body: '#998877' },
  };
  const c = colors[p.type] || colors.steel;
  
  // Body
  ctx.fillStyle = c.body;
  ctx.fillRect(p.x, p.y + 4, p.w, p.h - 4);
  
  // Top
  ctx.fillStyle = c.top;
  ctx.fillRect(p.x, p.y, p.w, 6);
  
  // Pattern
  if (p.type === 'scaffold' || p.type === 'steel') {
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = p.x + 16; i < p.x + p.w; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, p.y);
      ctx.lineTo(i, p.y + p.h);
      ctx.stroke();
    }
  }
}

function drawHazard(h) {
  if (h.type === 'spike') {
    ctx.fillStyle = '#FF4444';
    const count = Math.floor(h.w / 16);
    for (let i = 0; i < count; i++) {
      const sx = h.x + i * 16 + 8;
      ctx.beginPath();
      ctx.moveTo(sx - 6, h.y + 16);
      ctx.lineTo(sx, h.y);
      ctx.lineTo(sx + 6, h.y + 16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#AA0000';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  } else if (h.type === 'pit') {
    // Dark void
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(h.x, h.y, h.w, h.h);
    ctx.strokeStyle = 'rgba(255,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(h.x, h.y, h.w, h.h);
  }
}

function drawWreckingBall(wb) {
  // Chain
  const pivotX = wb.origX;
  const pivotY = wb.y - wb.pendulum_length;
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(wb.x, wb.y);
  ctx.stroke();
  
  // Ball
  const grd = ctx.createRadialGradient(wb.x - 4, wb.y - 4, 2, wb.x, wb.y, wb.radius);
  grd.addColorStop(0, '#AAAAAA');
  grd.addColorStop(1, '#444444');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(wb.x, wb.y, wb.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawCoin(c) {
  const floatY = c.y + Math.sin(c.animTimer) * 3;
  
  // Glow
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#FFD700';
  
  // Coin
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(c.x, floatY, c.size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#FFA500';
  ctx.font = `bold ${c.size - 2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', c.x, floatY);
  
  ctx.shadowBlur = 0;
}

function drawExit(exit) {
  const pulse = Math.sin(exit.pulse) * 4;
  
  // Glow
  ctx.shadowBlur = 20 + pulse;
  ctx.shadowColor = '#00FFAA';
  
  // Exit portal
  ctx.strokeStyle = `rgba(0, 255, 170, ${0.8 + Math.sin(exit.pulse) * 0.2})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(exit.x, exit.y - 20, 20 + pulse/2, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.fillStyle = `rgba(0, 255, 170, 0.15)`;
  ctx.beginPath();
  ctx.arc(exit.x, exit.y - 20, 18 + pulse/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Trophy icon
  ctx.fillStyle = '#FFD700';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏁', exit.x, exit.y - 20);
  
  // Label
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#00FFAA';
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.fillText('EXIT', exit.x, exit.y - 42 - pulse/2);
}

function drawEnemy(e) {
  const yBase = e.y - 32;
  const facing = e.dir;
  
  ctx.save();
  ctx.translate(e.x + 14, yBase + 16);
  if (facing === -1) ctx.scale(-1, 1);
  
  const colors = {
    worker: { body: '#4a6fa8', hard: '#F5A623', face: '#FFDAB9' },
    foreman: { body: '#8B0000', hard: '#FF6B35', face: '#FFDAB9' },
    helmet: { body: '#2d5a2d', hard: '#FFD700', face: '#FFDAB9' },
    boss_worker: { body: '#4B0082', hard: '#FF1493', face: '#FFDAB9' },
  };
  
  const c = colors[e.type] || colors.worker;
  const bob = Math.sin(e.animFrame * Math.PI / 2) * 2;
  
  // Body
  ctx.fillStyle = c.body;
  ctx.fillRect(-10, -8 + bob, 20, 22);
  
  // Head
  ctx.fillStyle = c.face;
  ctx.beginPath();
  ctx.arc(0, -14 + bob, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Hard hat
  ctx.fillStyle = c.hard;
  ctx.fillRect(-11, -22 + bob, 22, 8);
  ctx.fillRect(-9, -24 + bob, 18, 4);
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(3, -16 + bob, 4, 4);
  ctx.fillRect(-7, -16 + bob, 4, 4);
  
  // Arms
  ctx.fillStyle = c.body;
  const armSwing = Math.sin(e.animFrame * Math.PI / 2) * 6;
  ctx.fillRect(-14, -4 + armSwing, 5, 12);
  ctx.fillRect(9, -4 - armSwing, 5, 12);
  
  // Legs
  const legSwing = Math.sin(e.animFrame * Math.PI / 2) * 4;
  ctx.fillStyle = '#333';
  ctx.fillRect(-9, 14, 8, 10 + legSwing);
  ctx.fillRect(1, 14, 8, 10 - legSwing);
  
  ctx.restore();
}

function drawPlayer() {
  const p = player;
  
  // Blinking during invincibility
  if (p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 5) % 2 === 0) return;
  
  ctx.save();
  ctx.translate(p.x + p.w/2, p.y + p.h/2);
  if (p.facing === -1) ctx.scale(-1, 1);
  
  const bob = (p.state === 'run') ? Math.sin(p.animFrame * Math.PI / 2) * 2 : 0;
  const W = p.w;
  const H = p.h;
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, H/2 + 2, W/2 - 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // === BUNNY RABBIT CONSTRUCTION WORKER ===
  
  // Body (construction vest - orange)
  ctx.fillStyle = '#FF6B35';
  ctx.fillRect(-10, -4 + bob, 20, 18);
  
  // Shirt under vest (blue)
  ctx.fillStyle = '#4a6fa8';
  ctx.fillRect(-7, -2 + bob, 14, 12);
  
  // Construction stripe on vest
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-10, 2 + bob, 20, 3);
  
  // Belt
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-10, 12 + bob, 20, 3);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-2, 12 + bob, 4, 3);
  
  // Rabbit head (white/cream)
  ctx.fillStyle = '#F5F5DC';
  ctx.beginPath();
  ctx.ellipse(0, -12 + bob, 11, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Ears (rabbit ears!)
  ctx.fillStyle = '#F5F5DC';
  ctx.beginPath();
  ctx.ellipse(-5, -26 + bob, 4, 12, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, -26 + bob, 4, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner ears (pink)
  ctx.fillStyle = '#FFB6C1';
  ctx.beginPath();
  ctx.ellipse(-5, -26 + bob, 2, 8, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, -26 + bob, 2, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Hard hat (yellow construction helmet)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(0, -20 + bob, 12, 6, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillRect(-12, -22 + bob, 24, 4);
  ctx.beginPath();
  ctx.ellipse(0, -22 + bob, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Hat brim
  ctx.fillStyle = '#FFA500';
  ctx.fillRect(-13, -20 + bob, 26, 3);
  
  // Eyes
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(-4, -13 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -13 + bob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye shine
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(-3, -14 + bob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, -14 + bob, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.arc(0, -9 + bob, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Mouth
  ctx.strokeStyle = '#AA7777';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, -7 + bob);
  ctx.quadraticCurveTo(0, -5 + bob, 3, -7 + bob);
  ctx.stroke();
  
  // Arms
  const armSwing = (p.state === 'run') ? Math.sin(p.animFrame * Math.PI / 2) * 12 : 0;
  ctx.fillStyle = '#FF6B35';
  ctx.save();
  ctx.translate(-12, -2 + bob);
  ctx.rotate((armSwing * Math.PI / 180) + 0.3);
  ctx.fillRect(-2, 0, 5, 14);
  ctx.restore();
  
  ctx.save();
  ctx.translate(12, -2 + bob);
  ctx.rotate((-armSwing * Math.PI / 180) - 0.3);
  ctx.fillRect(-3, 0, 5, 14);
  ctx.restore();
  
  // Tool in right hand (wrench)
  if (p.state === 'idle' || p.state === 'run') {
    ctx.fillStyle = '#888888';
    ctx.fillRect(13, 2 + bob, 4, 10);
    ctx.fillRect(11, 2 + bob, 8, 3);
    ctx.fillRect(11, 9 + bob, 8, 3);
  }
  
  // Legs
  const legSwing = (p.state === 'run') ? Math.sin(p.animFrame * Math.PI / 2) * 8 : 0;
  ctx.fillStyle = '#333';
  
  if (p.state === 'jump' || p.state === 'fall') {
    // Jump pose - legs tucked
    ctx.fillRect(-9, 14 + bob, 8, 8);
    ctx.fillRect(1, 14 + bob, 8, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-10, 20 + bob, 10, 4);
    ctx.fillRect(0, 20 + bob, 10, 4);
  } else {
    ctx.fillRect(-9, 14 + bob, 8, 12 + legSwing);
    ctx.fillRect(1, 14 + bob, 8, 12 - legSwing);
    ctx.fillStyle = '#FFD700'; // boots
    ctx.fillRect(-10, 24 + bob + legSwing, 10, 5);
    ctx.fillRect(0, 24 + bob - legSwing, 10, 5);
  }
  
  // Hurt flash
  if (p.hurtTimer > 0) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.fillRect(-W/2, -H/2, W, H);
  }
  
  ctx.restore();
}

// ===================== GAME TIMER =====================
let timerInterval = null;

function startLevelTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameState.isRunning || gameState.isPaused) return;
    gameState.levelTime--;
    gameState.totalTime++;
    updateTimerHUD();
    
    if (gameState.levelTime <= 0) {
      playerHurt();
      const def = LEVEL_DEFS[gameState.currentLevel - 1];
      gameState.levelTime = def ? def.timeLimit : 60;
    }
  }, 1000);
}

function stopLevelTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ===================== HUD UPDATES =====================
function updateHUD() {
  const levelEl = document.getElementById('hud-level');
  const scoreEl = document.getElementById('hud-score');
  const livesEl = document.getElementById('hud-lives');
  const walletEl = document.getElementById('hud-wallet');
  
  if (levelEl) levelEl.textContent = `${gameState.currentLevel}/10`;
  if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();
  if (livesEl) {
    const hearts = ['❤️','❤️','❤️'].map((h, i) => i < gameState.lives ? h : '🖤').join('');
    livesEl.textContent = hearts;
  }
  if (walletEl && gameState.walletAddress) {
    const w = gameState.walletAddress;
    walletEl.textContent = `${w.slice(0,6)}...${w.slice(-4)}`;
  }
}

function updateTimerHUD() {
  const timerEl = document.getElementById('hud-timer');
  if (timerEl) {
    const t = gameState.levelTime;
    const m = Math.floor(t / 60);
    const s = t % 60;
    timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    timerEl.style.color = t <= 10 ? '#FF4444' : '#FFD700';
  }
}

// ===================== LEVEL COMPLETE =====================
async function onLevelComplete() {
  gameState.isRunning = false;
  stopLevelTimer();
  playSound('levelComplete');
  
  const level = gameState.currentLevel;
  const timeSpent = (LEVEL_DEFS[level - 1].timeLimit - gameState.levelTime);
  const levelScore = gameState.score;
  
  // Send to backend
  try {
    const response = await fetch('/api/game/complete-level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken: gameState.sessionToken,
        level,
        timeSpent: Math.max(timeSpent, 1),
        score: levelScore,
        completionHash: btoa(`${gameState.walletAddress}:${level}:${Date.now()}`)
      })
    });
    
    const data = await response.json();
    
    if (data.isWinner) {
      // Level 10 completed - WINNER!
      showVictoryScreen(data);
      return;
    }
    
    if (data.valid || data.success) {
      // Show level complete screen
      showLevelCompleteScreen(level, timeSpent, levelScore);
    } else {
      console.warn('Level completion rejected:', data.error);
      showLevelCompleteScreen(level, timeSpent, levelScore);
    }
  } catch (err) {
    console.error('Failed to submit level:', err);
    showLevelCompleteScreen(level, timeSpent, levelScore);
  }
}

function showLevelCompleteScreen(level, time, score) {
  const completeLevelEl = document.getElementById('complete-level');
  const completeTimeEl = document.getElementById('complete-time');
  const completeScoreEl = document.getElementById('complete-score');
  const completeStarsEl = document.getElementById('complete-stars');
  const nextBtn = document.getElementById('next-level-btn');
  
  if (completeLevelEl) completeLevelEl.textContent = `${level}/10`;
  if (completeTimeEl) completeTimeEl.textContent = `${time}s`;
  if (completeScoreEl) completeScoreEl.textContent = score.toLocaleString();
  
  // Stars based on time
  const def = LEVEL_DEFS[level - 1];
  const stars = time <= def.timeLimit * 0.4 ? '⭐⭐⭐' : time <= def.timeLimit * 0.7 ? '⭐⭐' : '⭐';
  if (completeStarsEl) completeStarsEl.textContent = stars;
  
  if (nextBtn) {
    if (level >= GAME_CONFIG.TOTAL_LEVELS) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.textContent = `LEVEL ${level + 1} ▶`;
      nextBtn.onclick = () => startNextLevel(level + 1);
    }
  }
  
  showScreen('level-complete-screen');
}

function startNextLevel(level) {
  gameState.currentLevel = level;
  gameState.lives = Math.min(gameState.lives + 1, GAME_CONFIG.MAX_LIVES); // Bonus life
  showScreen('game-screen');
  setTimeout(() => {
    resizeCanvas();
    loadLevel(level);
    gameState.isRunning = true;
    startLevelTimer();
  }, 50);
}

// ===================== VICTORY SCREEN =====================
async function showVictoryScreen(data) {
  const walletEl = document.getElementById('victory-wallet');
  const scoreEl = document.getElementById('victory-score');
  const timeEl = document.getElementById('victory-time');
  const rewardEl = document.getElementById('victory-reward');
  const statusEl = document.getElementById('reward-status-text');
  const claimBtn = document.getElementById('claim-btn');
  const txInfo = document.getElementById('tx-info');
  
  if (walletEl) walletEl.textContent = gameState.walletAddress;
  if (scoreEl) scoreEl.textContent = (data.totalScore || gameState.score).toLocaleString();
  if (timeEl) {
    const totalSecs = data.totalTime || gameState.totalTime;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }
  
  showScreen('victory-screen');
  createFireworks();
  playSound('victory');
  
  if (statusEl) statusEl.textContent = 'Connecting to Arc Testnet...';
  if (rewardEl) rewardEl.textContent = 'LOADING...';
  
  // Fetch pool balance
  try {
    const poolRes = await fetch('/api/contract/pool-balance');
    const poolData = await poolRes.json();
    
    const usdcBal = poolData.USDC?.balance || '0';
    const eurcBal = poolData.EURC?.balance || '0';
    const hasReward = parseFloat(usdcBal) > 0 || parseFloat(eurcBal) > 0;
    
    if (rewardEl) {
      if (hasReward) {
        const amt = parseFloat(usdcBal) > 0 ? `${usdcBal} USDC` : `${eurcBal} EURC`;
        rewardEl.textContent = amt;
      } else {
        rewardEl.textContent = 'CLAIM PENDING';
        rewardEl.style.color = '#FFD700';
      }
    }
    
    if (statusEl) statusEl.textContent = 'Triggering reward system...';
    
    // Trigger reward
    const rewardRes = await fetch('/api/game/trigger-reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionToken: gameState.sessionToken,
        walletAddress: gameState.walletAddress,
        preferredToken: parseFloat(usdcBal) > 0 ? 'USDC' : 'EURC'
      })
    });
    
    const rewardData = await rewardRes.json();
    
    if (rewardData.success) {
      if (statusEl) statusEl.textContent = '✅ Reward triggered on Arc Testnet!';
      
      if (txInfo) txInfo.classList.remove('hidden');
      
      const txHashEl = document.getElementById('tx-hash-display');
      if (txHashEl) txHashEl.textContent = rewardData.txHash || 'Pending...';
      
      const explorerLink = document.getElementById('tx-explorer-link');
      if (explorerLink && rewardData.txHash) {
        explorerLink.href = `https://testnet.arcscan.app/tx/${rewardData.txHash}`;
      }
      
      if (claimBtn) {
        claimBtn.classList.remove('hidden');
        claimBtn.onclick = () => openClaimOnExplorer(rewardData.txHash);
      }
    } else {
      if (statusEl) statusEl.textContent = '⚠️ ' + (rewardData.error || 'Deploy contract to enable rewards');
    }
  } catch (err) {
    console.error('Reward error:', err);
    if (statusEl) statusEl.textContent = '⚠️ Network error - contact admin';
    if (rewardEl) rewardEl.textContent = 'CONTACT ADMIN';
  }
}

function openClaimOnExplorer(txHash) {
  window.open(`https://testnet.arcscan.app/tx/${txHash}`, '_blank');
}

function createFireworks() {
  const container = document.getElementById('fireworks');
  if (!container) return;
  
  const colors = ['#FFD700', '#FF6B00', '#00FFAA', '#4488FF', '#FF44AA', '#FFFF00'];
  
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const fw = document.createElement('div');
      fw.className = 'firework';
      const sx = Math.random() * 100;
      const sy = Math.random() * 60 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dx = (Math.random() - 0.5) * 200 + 'px';
      const dy = (Math.random() - 0.5) * 200 + 'px';
      
      fw.style.cssText = `
        left: ${sx}%;
        top: ${sy}%;
        background: ${color};
        --dx: ${dx};
        --dy: ${dy};
        width: ${4 + Math.random() * 4}px;
        height: ${4 + Math.random() * 4}px;
      `;
      container.appendChild(fw);
      setTimeout(() => fw.remove(), 1200);
    }, i * 80);
  }
}

// ===================== GAME OVER =====================
function gameOver() {
  gameState.isRunning = false;
  stopLevelTimer();
  playSound('gameOver');
  
  const levelEl = document.getElementById('go-level');
  const scoreEl = document.getElementById('go-score');
  const msgEl = document.getElementById('gameover-msg');
  const retryBtn = document.getElementById('retry-btn');
  
  if (levelEl) levelEl.textContent = gameState.currentLevel;
  if (scoreEl) scoreEl.textContent = gameState.score.toLocaleString();
  if (msgEl) msgEl.textContent = `Reached Level ${gameState.currentLevel}. Try harder!`;
  
  if (retryBtn) {
    retryBtn.onclick = () => retryLevel();
  }
  
  showScreen('gameover-screen');
}

function retryLevel() {
  gameState.lives = GAME_CONFIG.MAX_LIVES;
  gameState.score = 0;
  showScreen('game-screen');
  setTimeout(() => {
    resizeCanvas();
    loadLevel(gameState.currentLevel);
    gameState.isRunning = true;
    startLevelTimer();
  }, 50);
}

// ===================== SCREEN MANAGEMENT =====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  const screen = document.getElementById(id);
  if (screen) {
    screen.style.display = id === 'game-screen' ? 'block' : 'flex';
    screen.classList.add('active');
    // Resize canvas after DOM paint if showing game screen
    if (id === 'game-screen') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resizeCanvas());
      });
    }
  }
}

function showWalletScreen() {
  gameState.isRunning = false;
  stopLevelTimer();
  showScreen('wallet-screen');
  loadLeaderboardPreview();
}

function restartGame() {
  gameState.currentLevel = 1;
  gameState.lives = GAME_CONFIG.MAX_LIVES;
  gameState.score = 0;
  gameState.totalTime = 0;
  showWalletScreen();
}

function togglePause() {
  if (!gameState.isRunning && !gameState.isPaused) return;
  gameState.isPaused = !gameState.isPaused;
  document.getElementById('pause-menu').classList.toggle('hidden', !gameState.isPaused);
}

function resumeGame() {
  gameState.isPaused = false;
  document.getElementById('pause-menu').classList.add('hidden');
}

// ===================== SOUND (Simple Web Audio) =====================
let audioCtx = null;

function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) { /* no audio */ }
}

function playSound(type) {
  if (!audioCtx) return;
  
  const oscTypes = {
    jump: { freq: [400, 600], dur: 0.1, wave: 'square' },
    coin: { freq: [800, 1200], dur: 0.1, wave: 'sine' },
    hurt: { freq: [200, 100], dur: 0.2, wave: 'sawtooth' },
    stomp: { freq: [300, 200, 100], dur: 0.15, wave: 'square' },
    levelComplete: { freq: [400, 600, 800, 1000], dur: 0.15, wave: 'sine' },
    gameOver: { freq: [400, 300, 200], dur: 0.3, wave: 'sawtooth' },
    victory: { freq: [400, 500, 600, 800, 1000], dur: 0.2, wave: 'sine' },
  };
  
  const cfg = oscTypes[type];
  if (!cfg || !cfg.freq) return;
  
  const freqs = Array.isArray(cfg.freq) ? cfg.freq : [cfg.freq];
  freqs.forEach((f, i) => {
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = cfg.wave || 'sine';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + cfg.dur);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + cfg.dur);
      } catch(e) {}
    }, i * cfg.dur * 1000);
  });
}

// ===================== LEADERBOARD =====================
async function loadLeaderboardPreview() {
  try {
    const res = await fetch('/api/leaderboard?limit=5');
    const data = await res.json();
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    
    if (!data.entries || data.entries.length === 0) {
      list.innerHTML = '<div class="lb-entry"><span style="color:#666;font-family:Orbitron,sans-serif;font-size:10px">No players yet. Be first!</span></div>';
      return;
    }
    
    list.innerHTML = data.entries.slice(0, 5).map((e, i) => `
      <div class="lb-entry">
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-wallet">${e.walletAddress.slice(0,8)}...${e.walletAddress.slice(-4)}</span>
        <span class="lb-score">${e.score.toLocaleString()}</span>
      </div>
    `).join('');
  } catch (err) {
    const list = document.getElementById('leaderboard-list');
    if (list) list.innerHTML = '<div style="color:#666;font-size:9px;font-family:Orbitron,sans-serif">Connection error</div>';
  }
}

async function loadPoolBalance() {
  try {
    const res = await fetch('/api/contract/pool-balance');
    const data = await res.json();
    
    const usdcEl = document.getElementById('usdc-prize');
    const eurcEl = document.getElementById('eurc-prize');
    
    if (usdcEl) usdcEl.textContent = `${data.USDC?.balance || '0'} USDC`;
    if (eurcEl) eurcEl.textContent = `${data.EURC?.balance || '0'} EURC`;
  } catch (err) {
    const usdcEl = document.getElementById('usdc-prize');
    if (usdcEl) usdcEl.textContent = 'N/A';
  }
}

// ===================== MAIN GAME LOOP =====================
function gameLoop() {
  if (gameState.isRunning) {
    // Auto-resize if canvas has zero dimensions (e.g., after screen switch)
    if (canvas && (canvas.width === 0 || canvas.height === 0)) {
      resizeCanvas();
    }
    updatePhysics();
    render();
  }
  requestAnimationFrame(gameLoop);
}

// ===================== INIT =====================
function init() {
  initCanvas();
  initInput();
  initAudio();
  
  // Load wallet screen data
  loadLeaderboardPreview();
  loadPoolBalance();
  
  // Refresh pool balance every 30s
  setInterval(loadPoolBalance, 30000);
  
  // Wallet input validation
  const walletInput = document.getElementById('wallet-input');
  const startBtn = document.getElementById('start-btn');
  const walletError = document.getElementById('wallet-error');
  
  if (walletInput) {
    walletInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const valid = /^0x[0-9a-fA-F]{40}$/.test(val);
      walletInput.className = 'wallet-input ' + (val.length === 0 ? '' : valid ? 'valid' : 'invalid');
      if (walletError) walletError.classList.toggle('hidden', val.length === 0 || valid);
    });
    
    walletInput.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        if (startBtn) startBtn.click();
      }
    });
  }
  
  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      const wallet = walletInput ? walletInput.value.trim() : '';
      
      if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
        if (walletError) walletError.classList.remove('hidden');
        if (walletInput) walletInput.classList.add('invalid');
        return;
      }
      
      // Activate audio context
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      startBtn.textContent = 'CONNECTING...';
      startBtn.disabled = true;
      
      try {
        // Create session
        const res = await fetch('/api/game/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: wallet })
        });
        
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to create session');
        }
        
        // Set game state
        gameState.walletAddress = data.walletAddress;
        gameState.sessionToken = data.sessionToken;
        gameState.currentLevel = data.currentLevel || 1;
        gameState.score = data.score || 0;
        gameState.totalTime = data.totalTime || 0;
        gameState.lives = GAME_CONFIG.MAX_LIVES;
        gameState.completedLevels = data.completedLevels || [];
        
        // If already a winner
        if (data.isWinner) {
          showVictoryScreen({ totalScore: data.score, totalTime: data.totalTime });
          return;
        }
        
        // Start game
        showScreen('game-screen');
        // Wait for layout to paint before resizing canvas
        setTimeout(() => {
          resizeCanvas();
          loadLevel(gameState.currentLevel);
          gameState.isRunning = true;
          startLevelTimer();
          playSound('levelComplete');
        }, 50);
        
      } catch (err) {
        console.error('Session error:', err);
        // Allow offline play for demo
        gameState.walletAddress = wallet;
        gameState.sessionToken = 'offline_' + Date.now();
        gameState.currentLevel = 1;
        gameState.score = 0;
        gameState.totalTime = 0;
        gameState.lives = GAME_CONFIG.MAX_LIVES;
        
        showScreen('game-screen');
        setTimeout(() => {
          resizeCanvas();
          loadLevel(1);
          gameState.isRunning = true;
          startLevelTimer();
        }, 50);
      } finally {
        startBtn.textContent = 'START GAME';
        startBtn.disabled = false;
      }
    });
  }
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

// ===================== UTILITY =====================
function lightenColor(hex, amount) {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
    const b = Math.min(255, (num & 0xFF) + amount);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  } catch (e) {
    return hex;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
