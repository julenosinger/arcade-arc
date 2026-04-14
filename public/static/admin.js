// =====================================================
// BUNNY BUILDER - Admin Panel JavaScript
// =====================================================

'use strict';

let adminWallet = '';
let adminData = {};

// ===================== LOGIN =====================
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('admin-login-btn');
  const walletInput = document.getElementById('admin-wallet-input');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', adminLogin);
  }
  
  if (walletInput) {
    walletInput.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') adminLogin();
    });
  }
  
  // Deposit button
  const depositBtn = document.getElementById('deposit-btn');
  if (depositBtn) depositBtn.addEventListener('click', handleDeposit);
  
  // Reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', handleReset);
});

async function adminLogin() {
  const input = document.getElementById('admin-wallet-input');
  const errorEl = document.getElementById('admin-error');
  const loginBtn = document.getElementById('admin-login-btn');
  
  if (!input || !input.value.trim()) {
    if (errorEl) { errorEl.textContent = 'Please enter wallet address'; errorEl.classList.remove('hidden'); }
    return;
  }
  
  const wallet = input.value.trim();
  
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    if (errorEl) { errorEl.textContent = 'Invalid wallet address format'; errorEl.classList.remove('hidden'); }
    return;
  }
  
  loginBtn.textContent = 'VERIFYING...';
  loginBtn.disabled = true;
  
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: wallet })
    });
    
    const data = await res.json();
    
    if (data.isAdmin) {
      adminWallet = wallet;
      showAdminDashboard();
    } else {
      if (errorEl) {
        errorEl.textContent = '🔐 Not authorized admin wallet';
        errorEl.classList.remove('hidden');
      }
    }
  } catch (err) {
    if (errorEl) {
      errorEl.textContent = 'Connection error. Try again.';
      errorEl.classList.remove('hidden');
    }
  } finally {
    loginBtn.textContent = 'ACCESS PANEL';
    loginBtn.disabled = false;
  }
}

function showAdminDashboard() {
  document.getElementById('admin-login').classList.remove('active');
  document.getElementById('admin-login').classList.add('hidden');
  
  const dash = document.getElementById('admin-dashboard');
  dash.classList.remove('hidden');
  dash.classList.add('active');
  
  const badge = document.getElementById('admin-wallet-badge');
  if (badge) badge.textContent = `${adminWallet.slice(0,8)}...${adminWallet.slice(-6)}`;
  
  // Load all dashboard data
  adminLoadPool();
  adminLoadStats();
  loadWinnersTable();
  loadLeaderboardTable();
}

function adminLogout() {
  adminWallet = '';
  document.getElementById('admin-dashboard').classList.remove('active');
  document.getElementById('admin-dashboard').classList.add('hidden');
  
  const login = document.getElementById('admin-login');
  login.classList.remove('hidden');
  login.classList.add('active');
  
  const input = document.getElementById('admin-wallet-input');
  if (input) input.value = '';
}

// ===================== POOL DATA =====================
async function adminRefreshPool() {
  await adminLoadPool();
}

async function adminLoadPool() {
  try {
    const res = await fetch('/api/contract/pool-balance');
    const data = await res.json();
    
    const usdcEl = document.getElementById('admin-usdc-bal');
    const eurcEl = document.getElementById('admin-eurc-bal');
    const contractEl = document.getElementById('admin-contract');
    
    if (usdcEl) usdcEl.textContent = `${formatBalance(data.USDC?.balance || '0')} USDC`;
    if (eurcEl) eurcEl.textContent = `${formatBalance(data.EURC?.balance || '0')} EURC`;
    if (contractEl) contractEl.textContent = truncateAddr(data.contractAddress);
  } catch (err) {
    setElementText('admin-usdc-bal', 'Error');
    setElementText('admin-eurc-bal', 'Error');
  }
}

// ===================== STATS =====================
async function adminLoadStats() {
  try {
    const res = await fetch(`/api/admin/stats?wallet=${adminWallet}`);
    const data = await res.json();
    
    if (!data.success) return;
    
    const s = data.stats;
    setElementText('admin-players', s.totalPlayers?.toString() || '0');
    setElementText('admin-winners', s.totalWinners?.toString() || '0');
    setElementText('admin-round', `Round ${s.currentRound || 1}`);
    setElementText('admin-status', 'ACTIVE');
    
    const statusEl = document.getElementById('admin-status');
    if (statusEl) {
      statusEl.className = 'pool-value status-active';
    }
  } catch (err) {
    setElementText('admin-players', '-');
    setElementText('admin-winners', '-');
    setElementText('admin-round', '-');
    setElementText('admin-status', 'UNKNOWN');
  }
}

// ===================== DEPOSIT =====================
async function handleDeposit() {
  const tokenSel = document.getElementById('deposit-token');
  const amountInput = document.getElementById('deposit-amount');
  const resultEl = document.getElementById('deposit-result');
  const instructionsEl = document.getElementById('deposit-instructions');
  const stepsEl = document.getElementById('deposit-steps');
  const depositBtn = document.getElementById('deposit-btn');
  
  const token = tokenSel?.value || 'USDC';
  const amount = parseFloat(amountInput?.value || '0');
  
  if (isNaN(amount) || amount <= 0) {
    showResult(resultEl, 'Please enter a valid amount', 'error');
    return;
  }
  
  depositBtn.textContent = 'PROCESSING...';
  depositBtn.disabled = true;
  
  try {
    const res = await fetch('/api/admin/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminWallet, token, amount })
    });
    
    const data = await res.json();
    
    if (data.success) {
      showResult(resultEl, `✅ Deposit request prepared for ${amount} ${token}`, 'success');
      
      // Show instructions
      if (instructionsEl && data.instructions) {
        instructionsEl.classList.remove('hidden');
        stepsEl.innerHTML = data.instructions.map(step => `
          <li><strong>Step ${step.step}:</strong> ${step.action.toUpperCase()} - ${step.description}</li>
        `).join('');
      }
    } else {
      showResult(resultEl, `❌ ${data.error || 'Deposit failed'}`, 'error');
    }
  } catch (err) {
    showResult(resultEl, '❌ Network error. Check connection.', 'error');
  } finally {
    depositBtn.textContent = 'DEPOSIT TOKENS';
    depositBtn.disabled = false;
  }
}

// ===================== RESET =====================
async function handleReset() {
  const confirmInput = document.getElementById('reset-confirm');
  const resultEl = document.getElementById('reset-result');
  const resetBtn = document.getElementById('reset-btn');
  
  if (!confirmInput || confirmInput.value.trim() !== 'RESET') {
    showResult(resultEl, '❌ Please type RESET to confirm', 'error');
    return;
  }
  
  resetBtn.textContent = 'RESETTING...';
  resetBtn.disabled = true;
  
  try {
    const res = await fetch('/api/admin/reset-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminWallet })
    });
    
    const data = await res.json();
    
    if (data.success) {
      showResult(resultEl, `✅ ${data.message}`, 'success');
      confirmInput.value = '';
      
      // Refresh data
      await adminLoadStats();
      await loadWinnersTable();
      await loadLeaderboardTable();
    } else {
      showResult(resultEl, `❌ ${data.error || 'Reset failed'}`, 'error');
    }
  } catch (err) {
    showResult(resultEl, '❌ Network error', 'error');
  } finally {
    resetBtn.textContent = '🔄 RESET GAME';
    resetBtn.disabled = false;
  }
}

// ===================== WINNERS TABLE =====================
async function loadWinnersTable() {
  const tbody = document.getElementById('winners-tbody');
  if (!tbody) return;
  
  try {
    const res = await fetch('/api/winners');
    const data = await res.json();
    
    if (!data.winners || data.winners.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No winners yet</td></tr>';
      return;
    }
    
    tbody.innerHTML = data.winners.map(w => `
      <tr>
        <td>${w.round}</td>
        <td style="color:#4488FF">${truncateAddr(w.wallet)}</td>
        <td style="color:#FFD700">${w.token}</td>
        <td style="color:#00FFAA">${formatBalance(w.amount)}</td>
        <td style="color:#888">${formatDate(w.timestamp)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Error loading winners</td></tr>';
  }
}

// ===================== LEADERBOARD TABLE =====================
async function loadLeaderboardTable() {
  const tbody = document.getElementById('admin-leaderboard-tbody');
  if (!tbody) return;
  
  try {
    const res = await fetch('/api/leaderboard?limit=20');
    const data = await res.json();
    
    if (!data.entries || data.entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No players yet</td></tr>';
      return;
    }
    
    tbody.innerHTML = data.entries.map((e, i) => `
      <tr>
        <td style="color:${i < 3 ? '#FFD700' : '#888'}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
        <td style="color:#4488FF;font-family:monospace">${truncateAddr(e.walletAddress)}</td>
        <td style="color:#00FFAA">${e.level}/10</td>
        <td style="color:#FFD700">${e.score?.toLocaleString() || 0}</td>
        <td style="color:#888">${formatTime(e.totalTime)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Error loading leaderboard</td></tr>';
  }
}

// ===================== HELPERS =====================
function showResult(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `admin-result ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 8000);
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function truncateAddr(addr) {
  if (!addr) return '-';
  return `${addr.slice(0,8)}...${addr.slice(-6)}`;
}

function formatBalance(val) {
  const num = parseFloat(val || '0');
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

function formatDate(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}

function formatTime(secs) {
  if (!secs) return '-';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
