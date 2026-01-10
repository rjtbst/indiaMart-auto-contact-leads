// =============================================================================
// SIDEBAR.JS - UI Components with Tabs (Logs & Table)
// =============================================================================

let sidebar = null;

// =============================================================================
// SIDEBAR INITIALIZATION
// =============================================================================

function initializeSidebar() {
  if (document.getElementById('indiamart-auto-sidebar')) return;
  
  sidebar = document.createElement('div');
  sidebar.id = 'indiamart-auto-sidebar';
  sidebar.innerHTML = getSidebarHTML();
  
  document.body.appendChild(sidebar);
  addSidebarStyles();
  attachSidebarEvents();
  updateSidebarStatus();
  
  // Update sidebar every 500ms with error handling
  const updateInterval = setInterval(() => {
    try {
      if (!chrome.runtime?.id) {
        // Extension was reloaded/disabled, stop updates
        clearInterval(updateInterval);
        return;
      }
      updateSidebarStatus();
    } catch (error) {
      // Extension context invalidated, stop updates
      clearInterval(updateInterval);
    }
  }, 500);
}

function getSidebarHTML() {
  return `
    <div class="sidebar-header">
      <button class="sidebar-toggle" id="sidebarToggle">
        <span class="toggle-icon">◀</span>
      </button>
      <div class="sidebar-title">
        <span class="icon">📊</span>
        <span>IndiaMArt Auto</span>
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
        <button class="control-btn start-btn" id="startBtnSidebar">
          <span>▶</span> Start
        </button>
        <button class="control-btn stop-btn" id="stopBtnSidebar">
          <span>⏸</span> Stop
        </button>
      </div>
      
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-label">Scans</span>
          <span class="stat-value" id="scanCountValue">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Matches</span>
          <span class="stat-value" id="matchCountValue">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Contacted</span>
          <span class="stat-value" id="contactedCountValue">0</span>
        </div>
      </div>
      
      <div class="tabs-section">
        <div class="tabs-header">
          <button class="tab-btn active" id="tabLogs" data-tab="logs">
            📋 Console Logs
          </button>
          <button class="tab-btn" id="tabTable" data-tab="table">
            📊 Data Table
          </button>
        </div>
        
        <div class="tabs-content">
          <!-- Logs Tab -->
          <div class="tab-pane active" id="paneLog">
            <div class="logs-container" id="logsContainer">
              <div class="log-empty">No logs yet. Start scanning to see console logs here.</div>
            </div>
          </div>
          
          <!-- Table Tab -->
          <div class="tab-pane" id="paneTable">
            <div class="table-header">
              <span>Product Details</span>
              <span class="table-count" id="tableCountSidebar">0</span>
            </div>
            <div class="table-container" id="tableContainerSidebar">
              <div class="empty-table">No products scanned yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =============================================================================
// SIDEBAR STYLES
// =============================================================================

function addSidebarStyles() {
  if (document.getElementById('indiamart-auto-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'indiamart-auto-styles';
  style.textContent = `
    #indiamart-auto-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      width: 450px;
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
      transform: translateX(410px);
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
    
    .sidebar-title .icon {
      font-size: 24px;
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
    
    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
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
    
    .sidebar-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .sidebar-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .sidebar-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
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
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .mode-badge.test-mode {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
    }
    
    .mode-badge.live-mode {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.6; }
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
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .start-btn {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
    }
    
    .start-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
    }
    
    .stop-btn {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    }
    
    .stop-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    }
    
    .stats-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    
    .stat-item {
      background: rgba(255, 255, 255, 0.05);
      padding: 14px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-label {
      display: block;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: white;
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
    
    .tab-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
    }
    
    .tab-btn.active {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
      border-bottom-color: #667eea;
    }
    
    .tabs-content {
      flex: 1;
      overflow: hidden;
      position: relative;
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
    
    /* Logs Tab Styles */
    .logs-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.6;
      color: #e0e0e0;
    }
    
    .logs-container::-webkit-scrollbar {
      width: 4px;
    }
    
    .logs-container::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .logs-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
    
    .log-entry {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }
    
    .log-entry.success {
      border-left-color: #2ecc71;
    }
    
    .log-entry.error {
      border-left-color: #e74c3c;
    }
    
    .log-entry.warning {
      border-left-color: #f39c12;
    }
    
    .log-timestamp {
      color: #95a5a6;
      font-size: 10px;
    }
    
    .log-message {
      color: #ecf0f1;
      margin-top: 4px;
      word-wrap: break-word;
    }
    
    .log-empty {
      text-align: center;
      padding: 40px 20px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    /* Table Tab Styles */
    .table-header {
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
    
    .table-container::-webkit-scrollbar {
      width: 4px;
    }
    
    .table-container::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .table-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    
    .data-table th {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      padding: 10px 6px;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    .data-table td {
      padding: 10px 6px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
    }
    
    .data-table tr.matched {
      background: rgba(46, 204, 113, 0.15);
    }
    
    .data-table tr.matched td {
      color: #2ecc71;
      font-weight: 600;
    }
    
    .data-table tr.not-matched {
      background: rgba(231, 76, 60, 0.15);
    }
    
    .data-table tr.not-matched td {
      color: #e74c3c;
    }
    
    .data-table tr.contacted {
      background: rgba(155, 89, 182, 0.25);
    }
    
    .data-table tr.contacted td {
      color: #9b59b6;
      font-weight: 700;
    }
    
    .status-badge {
      display: inline-block;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
    }
    
    .status-contacted {
      background: #9b59b6;
      color: white;
    }
    
    .status-available {
      background: #95a5a6;
      color: white;
    }
    
    .empty-table {
      text-align: center;
      padding: 40px 20px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 13px;
    }
    
    .notification-toast {
      position: fixed;
      top: 20px;
      right: 470px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .notification-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .notification-message {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .truncate {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  
  document.head.appendChild(style);
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

function attachSidebarEvents() {
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  
  document.getElementById('startBtnSidebar').addEventListener('click', () => {
    try {
      chrome.storage.local.set({ isRunning: true }, () => {
        if (chrome.runtime.lastError) {
          console.log('Extension context invalidated');
          return;
        }
        if (typeof startScanning === 'function') {
          startScanning();
        }
      });
    } catch (error) {
      console.log('Cannot start scanning - extension reloaded');
    }
  });
  
  document.getElementById('stopBtnSidebar').addEventListener('click', () => {
    try {
      chrome.storage.local.set({ isRunning: false }, () => {
        if (chrome.runtime.lastError) {
          console.log('Extension context invalidated');
          return;
        }
        if (typeof stopScanning === 'function') {
          stopScanning();
        }
      });
    } catch (error) {
      console.log('Cannot stop scanning - extension reloaded');
    }
  });
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.currentTarget.dataset.tab;
      switchTab(tabName);
    });
  });
}

function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
}

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  
  if (tabName === 'logs') {
    document.getElementById('paneLog').classList.add('active');
  } else if (tabName === 'table') {
    document.getElementById('paneTable').classList.add('active');
  }
}

// =============================================================================
// SIDEBAR UPDATE
// =============================================================================

function updateSidebarStatus() {
  try {
    chrome.storage.local.get(['isRunning', 'criteria', 'scanCount', 'logs', 'consoleLog'], (result) => {
      if (chrome.runtime.lastError) {
        // Extension context invalidated - stop trying to update
        console.log('Extension reloaded, stopping sidebar updates');
        return;
      }
      updateStatusIndicator(result.isRunning);
      updateModeBadge(result.criteria);
      updateStats(result.scanCount, result.logs);
      updateDataTable(result.logs || []);
      updateConsoleLogs(result.consoleLog || []);
    });
  } catch (error) {
    // Extension context invalidated - silently fail
    console.log('Extension context invalidated, stopping updates');
  }
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

function updateStats(scanCount, logs) {
  const scanCountValue = document.getElementById('scanCountValue');
  const tableCountSidebar = document.getElementById('tableCountSidebar');
  const matchCountValue = document.getElementById('matchCountValue');
  const contactedCountValue = document.getElementById('contactedCountValue');
  
  if (scanCountValue) scanCountValue.textContent = scanCount || 0;
  
  const logsArray = logs || [];
  if (tableCountSidebar) tableCountSidebar.textContent = logsArray.length;
  
  const matchCount = logsArray.filter(log => log.matched).length;
  if (matchCountValue) matchCountValue.textContent = matchCount;
  
  const contactedCount = logsArray.filter(log => log.engaged === 'Just contacted').length;
  if (contactedCountValue) contactedCountValue.textContent = contactedCount;
}

function updateConsoleLogs(logs) {
  const logsContainer = document.getElementById('logsContainer');
  if (!logsContainer) return;
  
  if (logs.length === 0) {
    logsContainer.innerHTML = '<div class="log-empty">No logs yet. Start scanning to see console logs here.</div>';
    return;
  }
  
  // Show last 100 logs
  const recentLogs = logs.slice(-100);
  
  const logsHTML = recentLogs.map(log => {
    const typeClass = log.type || 'info';
    return `
      <div class="log-entry ${typeClass}">
        <div class="log-timestamp">[${log.timestamp}]</div>
        <div class="log-message">${escapeHTML(log.message)}</div>
      </div>
    `;
  }).join('');
  
  logsContainer.innerHTML = logsHTML;
  
  // Auto-scroll to bottom
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

function updateDataTable(logs) {
  const tableContainer = document.getElementById('tableContainerSidebar');
  if (!tableContainer) return;
  
  if (logs.length === 0) {
    tableContainer.innerHTML = '<div class="empty-table">No products scanned yet<br>Start scanning to see results</div>';
    return;
  }
  
  // Show last 50 logs in reverse order (newest first)
  const recentLogs = logs.slice(-50).reverse();
  
  const tableHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Product</th>
          <th>Email</th>
          <th>Phone</th>
          <th>WhatsApp</th>
          <th>Country</th>
          <th>Age</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${recentLogs.map(log => createTableRow(log)).join('')}
      </tbody>
    </table>
  `;
  
  tableContainer.innerHTML = tableHTML;
}

function createTableRow(log) {
  const isContacted = log.engaged === 'Just contacted';
  const isMatched = log.matched;
  
  let rowClass = '';
  let statusBadge = '';
  
  if (isContacted) {
    rowClass = 'contacted';
    statusBadge = '<span class="status-badge status-contacted">Contacted</span>';
  } else if (isMatched) {
    rowClass = 'matched';
    statusBadge = '<span class="status-badge status-available">Available</span>';
  } else {
    rowClass = 'not-matched';
    statusBadge = '<span class="status-badge status-available">-</span>';
  }
  
  return `
    <tr class="${rowClass}">
      <td>${log.time}</td>
      <td><div class="truncate" title="${escapeHTML(log.title)}">${escapeHTML(log.title)}</div></td>
      <td><div class="truncate" title="${escapeHTML(log.verifiedEmail || 'N/A')}">${escapeHTML(log.verifiedEmail || '-')}</div></td>
      <td><div class="truncate" title="${escapeHTML(log.verifiedPhone || 'N/A')}">${escapeHTML(log.verifiedPhone || '-')}</div></td>
      <td><div class="truncate" title="${escapeHTML(log.verifiedWhatsapp || 'N/A')}">${escapeHTML(log.verifiedWhatsapp || '-')}</div></td>
      <td>${escapeHTML(log.country || 'N/A')}</td>
      <td>${log.userMonthsOld !== undefined && log.userMonthsOld !== 0 ? log.userMonthsOld + 'mo' : '-'}</td>
      <td>${statusBadge}</td>
    </tr>
  `;
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

function showNotification(title, message) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <div class="notification-title">${escapeHTML(title)}</div>
    <div class="notification-message">${escapeHTML(message)}</div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make notification accessible globally
window.showSidebarNotification = showNotification;

// =============================================================================
// UTILITY
// =============================================================================

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}