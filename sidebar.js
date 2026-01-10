// =============================================================================
// SIDEBAR.JS - UI with Colored Cell Backgrounds
// =============================================================================

let sidebar = null;

function initializeSidebar() {
  if (document.getElementById('indiamart-auto-sidebar')) return;
  
  sidebar = document.createElement('div');
  sidebar.id = 'indiamart-auto-sidebar';
  sidebar.innerHTML = getSidebarHTML();
  
  document.body.appendChild(sidebar);
  addSidebarStyles();
  attachSidebarEvents();
  updateSidebarStatus();
  
  const updateInterval = setInterval(() => {
    try {
      if (!chrome.runtime?.id) {
        clearInterval(updateInterval);
        return;
      }
      updateSidebarStatus();
    } catch (error) {
      clearInterval(updateInterval);
    }
  }, 1000);
}

function getSidebarHTML() {
  return `
    <div class="sidebar-header">
      <button class="sidebar-toggle" id="sidebarToggle">
        <span class="toggle-icon">◀</span>
      </button>
      <div class="sidebar-title">
        <span class="icon">📊</span>
        <span>IndiaMART Auto</span>
      </div>
    </div>
    
    <div class="sidebar-content">
      <div class="status-section">
        <div class="status-indicator" id="statusIndicator">
          <span class="status-dot"></span>
          <span id="statusText">Stopped</span>
        </div>
        <div class="mode-badge" id="modeBadge"></div>
      </div>
      
      <div class="controls-section">
        <button class="control-btn start-btn" id="startBtnSidebar">▶ Start</button>
        <button class="control-btn stop-btn" id="stopBtnSidebar">⏸ Stop</button>
      </div>
      
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">Scans</span>
          <span class="stat-value" id="scanCountValue">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Products</span>
          <span class="stat-value" id="totalProductsValue">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Matched</span>
          <span class="stat-value green-text" id="matchedCountValue">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Contacted</span>
          <span class="stat-value purple-text" id="contactedCountValue">0</span>
        </div>
      </div>
      
      <div class="tabs-section">
        <div class="tabs-header">
          <button class="tab-btn active" id="tabAll" data-tab="all">📦 All Products</button>
          <button class="tab-btn" id="tabMatched" data-tab="matched">🎯 Matched Only</button>
        </div>
        
        <div class="tabs-content">
          <div class="tab-pane active" id="paneAll">
            <div class="table-header">
              <span>All Scanned Products</span>
              <span class="table-count" id="tableCountAll">0</span>
            </div>
            <div class="table-container" id="tableContainerAll">
              <div class="empty-table">No products scanned yet</div>
            </div>
          </div>
          
          <div class="tab-pane" id="paneMatched">
            <div class="table-header">
              <span>Matched Products Only</span>
              <span class="table-count" id="tableCountMatched">0</span>
            </div>
            <div class="table-container" id="tableContainerMatched">
              <div class="empty-table">No matched products yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addSidebarStyles() {
  if (document.getElementById('indiamart-auto-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'indiamart-auto-styles';
  style.textContent = `
    #indiamart-auto-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 580px;
      height: 100vh;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: transform 0.3s ease;
    }
    
    #indiamart-auto-sidebar.collapsed {
      transform: translateX(540px);
    }
    
    .sidebar-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .sidebar-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: white;
    }
    
    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: white;
      font-size: 18px;
    }
    
    #indiamart-auto-sidebar.collapsed .toggle-icon {
      transform: rotate(180deg);
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .status-section {
      background: rgba(255, 255, 255, 0.05);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #e74c3c;
      animation: pulse 2s infinite;
    }
    
    .status-indicator.running .status-dot {
      background: #2ecc71;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .mode-badge {
      display: inline-flex;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .mode-badge.test-mode {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
    }
    
    .mode-badge.live-mode {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
    }
    
    .controls-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    .control-btn {
      padding: 14px;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
    }
    
    .start-btn {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
    }
    
    .stop-btn {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
    }
    
    .stats-section {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .stat-item {
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-label {
      display: block;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    
    .stat-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: white;
    }
    
    .green-text {
      color: #2ecc71 !important;
    }
    
    .purple-text {
      color: #9b59b6 !important;
    }
    
    .tabs-section {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 400px;
    }
    
    .tabs-header {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }
    
    .tab-btn {
      flex: 1;
      padding: 14px 20px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
    }
    
    .tab-btn.active {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
      border-bottom-color: #667eea;
    }
    
    .tabs-content {
      flex: 1;
      overflow: hidden;
    }
    
    .tab-pane {
      display: none;
      height: 100%;
      overflow-y: auto;
    }
    
    .tab-pane.active {
      display: flex;
      flex-direction: column;
    }
    
    .table-header {
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .table-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
    }
    
    .table-container {
      flex: 1;
      overflow-y: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    
    .data-table th {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      padding: 8px 5px;
      text-align: center;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    .data-table td {
      padding: 6px 4px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 9px;
      text-align: center;
    }
    
    .data-table tr.contacted-row {
      background: rgba(155, 89, 182, 0.3) !important;
      border-left: 4px solid #9b59b6;
    }
    
    .data-table tr.matched-row {
      background: rgba(46, 204, 113, 0.15) !important;
    }
    
    /* CRITICAL: Green background for matched cells */
    .cell-green {
      background: rgba(46, 204, 113, 0.3) !important;
      color: #2ecc71 !important;
      font-weight: 700;
    }
    
    /* CRITICAL: Red background for non-matched cells */
    .cell-red {
      background: rgba(231, 76, 60, 0.3) !important;
      color: #e74c3c !important;
      font-weight: 700;
    }
    
    .badge {
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
    }
    
    .badge-match {
      background: #2ecc71;
      color: white;
    }
    
    .badge-no-match {
      background: #e74c3c;
      color: white;
    }
    
    .badge-contacted {
      background: #9b59b6;
      color: white;
    }
    
    .badge-available {
      background: #3498db;
      color: white;
    }
    
    .empty-table {
      text-align: center;
      padding: 40px 20px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 13px;
    }
    
    .truncate {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  `;
  
  document.head.appendChild(style);
}

function attachSidebarEvents() {
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  
  document.getElementById('startBtnSidebar').addEventListener('click', () => {
    chrome.storage.local.set({ isRunning: true }, () => {
      if (typeof startScanning === 'function') startScanning();
    });
  });
  
  document.getElementById('stopBtnSidebar').addEventListener('click', () => {
    chrome.storage.local.set({ isRunning: false }, () => {
      if (typeof stopScanning === 'function') stopScanning();
    });
  });
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchTab(e.currentTarget.dataset.tab);
    });
  });
}

function toggleSidebar() {
  if (sidebar) sidebar.classList.toggle('collapsed');
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(tabName === 'all' ? 'paneAll' : 'paneMatched').classList.add('active');
}

function updateSidebarStatus() {
  chrome.storage.local.get(['isRunning', 'criteria', 'scanCount', 'productLogs'], (result) => {
    if (chrome.runtime.lastError) return;
    
    updateStatusIndicator(result.isRunning);
    updateModeBadge(result.criteria);
    updateStats(result.scanCount, result.productLogs);
    updateAllProductsTable(result.productLogs || {});
    updateMatchedProductsTable(result.productLogs || {});
  });
}

function updateStatusIndicator(isRunning) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  if (!statusIndicator || !statusText) return;
  
  if (isRunning) {
    statusIndicator.classList.add('running');
    statusText.textContent = 'Running';
  } else {
    statusIndicator.classList.remove('running');
    statusText.textContent = 'Stopped';
  }
}

function updateModeBadge(criteria) {
  const modeBadge = document.getElementById('modeBadge');
  if (!modeBadge || !criteria) return;
  
  const isTestMode = criteria.testMode !== false;
  modeBadge.className = 'mode-badge ' + (isTestMode ? 'test-mode' : 'live-mode');
  modeBadge.textContent = isTestMode ? '🧪 Test Mode' : '🔴 Live Mode';
}

function updateStats(scanCount, productLogs) {
  document.getElementById('scanCountValue').textContent = scanCount || 0;
  
  const productsArray = Object.values(productLogs || {});
  document.getElementById('totalProductsValue').textContent = productsArray.length;
  document.getElementById('contactedCountValue').textContent = productsArray.filter(p => p.contacted === true).length;
  document.getElementById('matchedCountValue').textContent = productsArray.filter(p => p.matched === true).length;
}

function updateAllProductsTable(productLogs) {
  const container = document.getElementById('tableContainerAll');
  const count = document.getElementById('tableCountAll');
  if (!container) return;
  
  const products = Object.values(productLogs);
  count.textContent = products.length;
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-table">No products scanned yet</div>';
    return;
  }
  
  products.sort((a, b) => b.timestamp - a.timestamp);
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Title</th>
          <th>Match?</th>
          <th>Prod</th>
          <th>Age</th>
          <th>Age✓</th>
          <th>Ctry</th>
          <th>Ctry✓</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => createTableRow(p, false)).join('')}
      </tbody>
    </table>
  `;
}

function updateMatchedProductsTable(productLogs) {
  const container = document.getElementById('tableContainerMatched');
  const count = document.getElementById('tableCountMatched');
  if (!container) return;
  
  const products = Object.values(productLogs).filter(p => p.matched === true);
  count.textContent = products.length;
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-table">No matched products yet</div>';
    return;
  }
  
  products.sort((a, b) => b.timestamp - a.timestamp);
  
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Title</th>
          <th>Prod</th>
          <th>Age</th>
          <th>Age✓</th>
          <th>Ctry</th>
          <th>Ctry✓</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => createTableRow(p, true)).join('')}
      </tbody>
    </table>
  `;
}

function createTableRow(p, hideMatch) {
  const rowClass = p.contacted ? 'contacted-row' : (p.matched ? 'matched-row' : '');
  
  // CRITICAL: Cell classes based on match status
  const titleClass = p.matchedMedicine ? 'cell-green' : 'cell-red';
  const ageCheckClass = p.matchedAge ? 'cell-green' : 'cell-red';
  const countryCheckClass = p.matchedCountry ? 'cell-green' : 'cell-red';
  const emailClass = p.matchedEmail ? 'cell-green' : 'cell-red';
  const phoneClass = p.matchedPhone ? 'cell-green' : 'cell-red';
  
  const matchBadge = p.matched ? '<span class="badge badge-match">✓ MATCH</span>' : '<span class="badge badge-no-match">✗ NO</span>';
  const statusBadge = p.contacted ? '<span class="badge badge-contacted">CONTACTED</span>' : '<span class="badge badge-available">AVAILABLE</span>';
  
  const ageDisplay = p.ageMonths || p.userMonthsOld || '-';
  
  if (hideMatch) {
    return `
      <tr class="${rowClass}">
        <td>${p.time}</td>
        <td class="${titleClass}"><div class="truncate" title="${esc(p.title)}">${esc(p.title)}</div></td>
        <td class="${titleClass}">✓</td>
        <td>${ageDisplay}</td>
        <td class="${ageCheckClass}">${p.matchedAge ? '✓' : '✗'}</td>
        <td><div class="truncate" title="${esc(p.country)}">${esc(p.country)}</div></td>
        <td class="${countryCheckClass}">${p.matchedCountry ? '✓' : '✗'}</td>
        <td class="${emailClass}">${p.matchedEmail ? '✓' : '✗'}</td>
        <td class="${phoneClass}">${p.matchedPhone ? '✓' : '✗'}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }
  
  return `
    <tr class="${rowClass}">
      <td>${p.time}</td>
      <td class="${titleClass}"><div class="truncate" title="${esc(p.title)}">${esc(p.title)}</div></td>
      <td>${matchBadge}</td>
      <td class="${titleClass}">${p.matchedMedicine ? '✓' : '✗'}</td>
      <td>${ageDisplay}</td>
      <td class="${ageCheckClass}">${p.matchedAge ? '✓' : '✗'}</td>
      <td><div class="truncate" title="${esc(p.country)}">${esc(p.country)}</div></td>
      <td class="${countryCheckClass}">${p.matchedCountry ? '✓' : '✗'}</td>
      <td class="${emailClass}">${p.matchedEmail ? '✓' : '✗'}</td>
      <td class="${phoneClass}">${p.matchedPhone ? '✓' : '✗'}</td>
      <td>${statusBadge}</td>
    </tr>
  `;
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

window.showSidebarNotification = function(title, message) {
  // Simple console log for now
  console.log(`%c${title}: ${message}`, 'color: #667eea;');
};