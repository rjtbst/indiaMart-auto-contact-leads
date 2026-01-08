let isScanning = false;
let scanInterval = null;
let scanCount = 0;
let sidebar = null;

console.log('IndiaMArt Auto Contact: Content script loaded');

// Initialize sidebar immediately
setTimeout(() => {
  initializeSidebar();
}, 500);

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request.action);
  
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
    return true;
  } else if (request.action === 'start') {
    startScanning();
    sendResponse({ status: 'started' });
    return true;
  } else if (request.action === 'stop') {
    stopScanning();
    sendResponse({ status: 'stopped' });
    return true;
  } else if (request.action === 'toggle-sidebar') {
    toggleSidebar();
    sendResponse({ status: 'toggled' });
    return true;
  }
});

// Check if should auto-resume scanning
chrome.storage.local.get(['isRunning'], (result) => {
  if (result.isRunning) {
    console.log('Auto-resuming scan...');
    setTimeout(() => {
      startScanning();
      updateSidebarStatus();
    }, 2000);
  }
});

// Initialize sidebar UI
function initializeSidebar() {
  // Check if sidebar already exists
  if (document.getElementById('indiamart-auto-sidebar')) {
    console.log('Sidebar already exists');
    return;
  }
  
  console.log('Creating sidebar...');
  
  sidebar = document.createElement('div');
  sidebar.id = 'indiamart-auto-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <button class="sidebar-toggle" id="sidebarToggle">
        <span class="toggle-icon">◀</span>
      </button>
      <div class="sidebar-title">
        <span class="icon">📊</span>
        <span>IndiaMArt Auto Contact</span>
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
      
      <div class="log-section">
        <div class="log-header">
          <span>Recent Activity</span>
          <span class="log-count" id="logCountSidebar">0</span>
        </div>
        <div class="log-list" id="logListSidebar"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(sidebar);
  console.log('Sidebar added to DOM');
  
  addSidebarStyles();
  attachSidebarEvents();
  updateSidebarStatus();
  
  // Update sidebar every 500ms
  setInterval(updateSidebarStatus, 500);
  
  console.log('Sidebar initialized successfully');
}

// Add CSS styles for sidebar
function addSidebarStyles() {
  if (document.getElementById('indiamart-auto-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'indiamart-auto-styles';
  style.textContent = `
    #indiamart-auto-sidebar {
      position: fixed !important;
      top: 0 !important;
      right: 0 !important;
      width: 360px !important;
      height: 100vh !important;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      transition: transform 0.3s ease !important;
    }
    
    #indiamart-auto-sidebar.collapsed {
      transform: translateX(320px) !important;
    }
    
    .sidebar-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      padding: 16px 20px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
    }
    
    .sidebar-title {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      color: white !important;
    }
    
    .sidebar-title .icon {
      font-size: 24px !important;
    }
    
    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.2) !important;
      border: none !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.3s !important;
      color: white !important;
      font-size: 18px !important;
    }
    
    .sidebar-toggle:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.1) !important;
    }
    
    #indiamart-auto-sidebar.collapsed .toggle-icon {
      transform: rotate(180deg) !important;
    }
    
    .sidebar-content {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 20px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 16px !important;
    }
    
    .sidebar-content::-webkit-scrollbar {
      width: 6px !important;
    }
    
    .sidebar-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1) !important;
    }
    
    .sidebar-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3) !important;
      border-radius: 3px !important;
    }
    
    .status-section {
      background: rgba(255, 255, 255, 0.05) !important;
      padding: 16px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .status-indicator {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      color: white !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      margin-bottom: 10px !important;
    }
    
    .status-dot {
      width: 10px !important;
      height: 10px !important;
      border-radius: 50% !important;
      background: #e74c3c !important;
      animation: pulse 2s infinite !important;
    }
    
    .status-indicator.running .status-dot {
      background: #2ecc71 !important;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .mode-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 6px 12px !important;
      border-radius: 20px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
    
    .mode-badge.test-mode {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%) !important;
      color: white !important;
    }
    
    .mode-badge.live-mode {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
      color: white !important;
      animation: blink 1s infinite !important;
    }
    
    @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.6; }
    }
    
    .controls-section {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 12px !important;
    }
    
    .control-btn {
      padding: 14px !important;
      border: none !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      transition: all 0.3s !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
    
    .start-btn {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3) !important;
    }
    
    .start-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4) !important;
    }
    
    .stop-btn {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3) !important;
    }
    
    .stop-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4) !important;
    }
    
    .stats-section {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 12px !important;
    }
    
    .stat-item {
      background: rgba(255, 255, 255, 0.05) !important;
      padding: 14px !important;
      border-radius: 10px !important;
      text-align: center !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .stat-label {
      display: block !important;
      font-size: 11px !important;
      color: rgba(255, 255, 255, 0.6) !important;
      margin-bottom: 6px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }
    
    .stat-value {
      display: block !important;
      font-size: 24px !important;
      font-weight: 700 !important;
      color: white !important;
    }
    
    .log-section {
      flex: 1 !important;
      background: rgba(255, 255, 255, 0.05) !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      min-height: 200px !important;
    }
    
    .log-header {
      padding: 12px 16px !important;
      background: rgba(255, 255, 255, 0.05) !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      color: white !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .log-count {
      background: rgba(255, 255, 255, 0.2) !important;
      padding: 4px 10px !important;
      border-radius: 12px !important;
      font-size: 10px !important;
    }
    
    .log-list {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 12px !important;
    }
    
    .log-list::-webkit-scrollbar {
      width: 4px !important;
    }
    
    .log-list::-webkit-scrollbar-track {
      background: transparent !important;
    }
    
    .log-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2) !important;
      border-radius: 2px !important;
    }
    
    .log-item-sidebar {
      background: rgba(255, 255, 255, 0.05) !important;
      padding: 12px !important;
      border-radius: 8px !important;
      margin-bottom: 10px !important;
      border-left: 3px solid #667eea !important;
      transition: all 0.3s !important;
    }
    
    .log-item-sidebar:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      transform: translateX(-4px) !important;
    }
    
    .log-item-sidebar.matched {
      border-left-color: #2ecc71 !important;
    }
    
    .log-item-sidebar.not-matched {
      border-left-color: #e74c3c !important;
    }
    
    .log-time-sidebar {
      font-size: 10px !important;
      color: rgba(255, 255, 255, 0.5) !important;
      margin-bottom: 6px !important;
    }
    
    .log-title-sidebar {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: white !important;
      margin-bottom: 8px !important;
      line-height: 1.3 !important;
    }
    
    .log-badges {
      display: flex !important;
      gap: 6px !important;
      flex-wrap: wrap !important;
    }
    
    .log-badge {
      font-size: 10px !important;
      padding: 3px 8px !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
    }
    
    .badge-match {
      background: #2ecc71 !important;
      color: white !important;
    }
    
    .badge-no-match {
      background: #e74c3c !important;
      color: white !important;
    }
    
    .badge-test {
      background: #f39c12 !important;
      color: white !important;
    }
    
    .badge-contacted {
      background: #9b59b6 !important;
      color: white !important;
    }
    
    .empty-log {
      text-align: center !important;
      padding: 40px 20px !important;
      color: rgba(255, 255, 255, 0.4) !important;
      font-size: 13px !important;
    }
    
    .notification-toast {
      position: fixed !important;
      top: 20px !important;
      right: 380px !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      padding: 16px 20px !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
      z-index: 2147483646 !important;
      animation: slideIn 0.3s ease !important;
      max-width: 300px !important;
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
      font-weight: 700 !important;
      font-size: 14px !important;
      margin-bottom: 4px !important;
    }
    
    .notification-message {
      font-size: 12px !important;
      opacity: 0.9 !important;
    }
  `;
  
  document.head.appendChild(style);
  console.log('Sidebar styles added');
}

// Attach event listeners to sidebar
function attachSidebarEvents() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const startBtn = document.getElementById('startBtnSidebar');
  const stopBtn = document.getElementById('stopBtnSidebar');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }
  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      chrome.storage.local.set({ isRunning: true }, () => {
        startScanning();
      });
    });
  }
  
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      chrome.storage.local.set({ isRunning: false }, () => {
        stopScanning();
      });
    });
  }
  
  console.log('Sidebar events attached');
}

// Toggle sidebar visibility
function toggleSidebar() {
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
}

// Update sidebar status and stats
function updateSidebarStatus() {
  chrome.storage.local.get(['isRunning', 'criteria', 'scanCount', 'logs'], (result) => {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const modeBadge = document.getElementById('modeBadge');
    const scanCountValue = document.getElementById('scanCountValue');
    const logCountSidebar = document.getElementById('logCountSidebar');
    const matchCountValue = document.getElementById('matchCountValue');
    const contactedCountValue = document.getElementById('contactedCountValue');
    
    if (!statusIndicator) return;
    
    // Update status
    if (result.isRunning) {
      statusIndicator.classList.add('running');
      statusText.textContent = 'Running';
    } else {
      statusIndicator.classList.remove('running');
      statusText.textContent = 'Stopped';
    }
    
    // Update mode badge
    if (result.criteria && modeBadge) {
      const isTestMode = result.criteria.testMode !== false;
      modeBadge.className = 'mode-badge ' + (isTestMode ? 'test-mode' : 'live-mode');
      modeBadge.textContent = isTestMode ? '🧪 Test Mode' : '🔴 Live Mode';
    }
    
    // Update stats
    if (scanCountValue) scanCountValue.textContent = result.scanCount || 0;
    
    const logs = result.logs || [];
    if (logCountSidebar) logCountSidebar.textContent = logs.length;
    
    const matchCount = logs.filter(log => log.matched).length;
    if (matchCountValue) matchCountValue.textContent = matchCount;
    
    const contactedCount = logs.filter(log => log.engaged === 'Just contacted').length;
    if (contactedCountValue) contactedCountValue.textContent = contactedCount;
    
    // Update log list
    updateLogList(logs);
  });
}

// Update log list in sidebar
function updateLogList(logs) {
  const logList = document.getElementById('logListSidebar');
  if (!logList) return;
  
  if (logs.length === 0) {
    logList.innerHTML = '<div class="empty-log">No activity yet<br>Start scanning to see results</div>';
    return;
  }
  
  // Show only last 10 logs
  const recentLogs = logs.slice(-10).reverse();
  
  logList.innerHTML = recentLogs.map(log => {
    const matchClass = log.matched ? 'matched' : 'not-matched';
    const matchBadge = log.matched 
      ? '<span class="log-badge badge-match">✓ Match</span>' 
      : '<span class="log-badge badge-no-match">✗ No Match</span>';
    
    let engagementBadge = '';
    if (log.engaged === 'Just contacted') {
      engagementBadge = '<span class="log-badge badge-contacted">Contacted</span>';
    } else if (log.engaged === 'Would contact in live mode') {
      engagementBadge = '<span class="log-badge badge-test">Would Contact</span>';
    }
    
    return `
      <div class="log-item-sidebar ${matchClass}">
        <div class="log-time-sidebar">${log.time}</div>
        <div class="log-title-sidebar">${log.title}</div>
        <div class="log-badges">
          ${matchBadge}
          ${engagementBadge}
        </div>
      </div>
    `;
  }).join('');
}

// Show notification toast
function showNotification(title, message) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <div class="notification-title">${title}</div>
    <div class="notification-message">${message}</div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Start scanning function
function startScanning() {
  if (isScanning) {
    console.log('Already scanning');
    return;
  }
  
  chrome.storage.local.get(['criteria'], (result) => {
    if (!result.criteria || !result.criteria.medicines || result.criteria.medicines.length === 0) {
      showNotification('⚠️ No Criteria Set', 'Please configure criteria in the extension popup first');
      console.error('No criteria set');
      return;
    }
    
    isScanning = true;
    scanCount = 0;
    
    const mode = result.criteria.testMode !== false ? 'TEST MODE (Logging Only)' : 'LIVE MODE (Auto-Clicking)';
    console.log('%c╔═══════════════════════════════════════════════════════════╗', 'color: #667eea; font-weight: bold;');
    console.log('%c║  IndiaMArt Auto Contact Extension Started                ║', 'color: #667eea; font-weight: bold;');
    console.log('%c╚═══════════════════════════════════════════════════════════╝', 'color: #667eea; font-weight: bold;');
    console.log(`%cMode: ${mode}`, 'color: ' + (result.criteria.testMode !== false ? '#f39c12' : '#e74c3c') + '; font-weight: bold; font-size: 14px;');
    console.log('Criteria:', result.criteria);
    console.log('Scan interval:', formatIntervalLog(result.criteria.interval));
    console.log('');
    
    showNotification('✅ Started', `Scanning every ${formatIntervalLog(result.criteria.interval)}`);
    
    // Run initial scan
    scanPage(result.criteria);
    
    // Set up interval for repeated scans
    scanInterval = setInterval(() => {
      scanPage(result.criteria);
    }, result.criteria.interval);
  });
}

// Stop scanning
function stopScanning() {
  isScanning = false;
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  showNotification('⏸️ Stopped', 'Scanning paused');
  console.log('Scanning stopped');
}

// Format interval for console log
function formatIntervalLog(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    return `${(ms / 60000).toFixed(2)}m`;
  }
}

// Main scanning function
function scanPage(criteria) {
  scanCount++;
  const scanTime = new Date().toLocaleTimeString();
  console.log(`\n%c=== Scan #${scanCount} at ${scanTime} ===`, 'color: #667eea; font-weight: bold;');
  console.log('Interval:', formatIntervalLog(criteria.interval));
  
  // Update scan info in storage
  const now = Date.now();
  const nextScan = now + criteria.interval;
  chrome.storage.local.set({ 
    lastScan: now,
    scanCount: scanCount,
    nextScan: nextScan
  });
  
  // Find all product listings - adjust selectors based on IndiaMArt's structure
  const listings = document.querySelectorAll('[class*="listing"], [class*="product"], [data-type="listing"], .prd, .bl_item, [class*="card"]');
  
  if (listings.length === 0) {
    console.log('%cNo listings found on this page', 'color: #e74c3c;');
    return;
  }
  
  console.log(`%cFound ${listings.length} listings to process`, 'color: #2ecc71;');
  
  listings.forEach((listing, index) => {
    processListing(listing, criteria, index + 1);
  });
  
  console.log(`%c=== Scan #${scanCount} completed ===\n`, 'color: #667eea; font-weight: bold;');
}

// Process individual listing
function processListing(listing, criteria, listingNumber) {
  try {
    // Extract information from listing
    const title = extractText(listing, '[class*="title"], h2, h3, .prd-name, [class*="name"], [class*="product-name"]');
    const country = extractText(listing, '[class*="country"], [class*="location"], [class*="place"]');
    const quantity = extractText(listing, '[class*="quantity"], [class*="qty"], [class*="amount"]');
    const buyer = extractText(listing, '[class*="buyer"], [class*="company"], [class*="seller"]');
    const available = extractText(listing, '[class*="available"], [class*="verification"], [class*="verified"]');
    
    console.log(`\n%c━━━ Listing #${listingNumber} ━━━`, 'color: #9b59b6; font-weight: bold;');
    console.log('%c📋 Scraped Data:', 'color: #667eea; font-weight: bold;');
    console.log(`  Title: "${title}"`);
    console.log(`  Country: "${country}"`);
    console.log(`  Quantity: "${quantity}"`);
    console.log(`  Buyer: "${buyer}"`);
    console.log(`  Available: "${available}"`);
    
    // Check if already engaged
    const contactBtn = listing.querySelector('[class*="contact"], button[class*="btn"], [class*="enquiry"], button, a[class*="contact"]');
    console.log(`  Contact Button: ${contactBtn ? '✓ Found' : '✗ Not Found'}`);
    
    const engaged = contactBtn && (contactBtn.disabled || contactBtn.textContent.toLowerCase().includes('contacted'));
    
    // Skip if already contacted
    if (engaged) {
      console.log(`%c  ⏭ SKIPPED - Already contacted`, 'color: #95a5a6;');
      return;
    }
    
    console.log('%c🔍 Matching Criteria:', 'color: #667eea; font-weight: bold;');
    
    // Check medicine match
    const titleLower = title.toLowerCase();
    const medicineMatch = criteria.medicines.some(med => titleLower.includes(med));
    const matchedMedicine = criteria.medicines.find(med => titleLower.includes(med));
    console.log(`  Medicine: ${medicineMatch ? '✓' : '✗'} ${medicineMatch ? `(matched: "${matchedMedicine}")` : `(checking: ${criteria.medicines.join(', ')})`}`);
    
    // Check quantity (extract number from text)
    const quantityNum = parseQuantity(quantity);
    const quantityMatch = quantityNum > criteria.minQuantity;
    console.log(`  Quantity: ${quantityMatch ? '✓' : '✗'} (${quantityNum} ${quantityMatch ? '>' : '≤'} ${criteria.minQuantity})`);
    
    // Check verification requirements
    const verificationMatch = checkVerification(available, criteria);
    const verDetails = Object.entries(verificationMatch.details).map(([k, v]) => `${k}:${v?'✓':'✗'}`).join(', ');
    console.log(`  Verification: ${verificationMatch.passed ? '✓' : '✗'} (${verDetails || 'none required'})`);
    
    // Overall match
    const matched = medicineMatch && quantityMatch && verificationMatch.passed;
    
    console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #9b59b6;');
    
    if (matched) {
      console.log(`%c  🎯 FULL MATCH!`, 'background: #2ecc71; color: white; font-weight: bold; padding: 4px 8px;');
    } else {
      console.log(`%c  ❌ NO MATCH`, 'background: #e74c3c; color: white; font-weight: bold; padding: 4px 8px;');
    }
    
    // Test mode vs live mode behavior
    const isTestMode = criteria.testMode !== false;
    
    // Log the result with scrape details
    const logEntry = {
      time: new Date().toLocaleTimeString(),
      title: title || 'N/A',
      country: country || 'N/A',
      quantity: quantity || 'N/A',
      buyer: buyer || 'N/A',
      available: available || 'N/A',
      engaged: engaged ? 'Already contacted' : (matched && isTestMode ? 'Would contact in live mode' : 'Available'),
      matched: matched,
      verification: verificationMatch.details,
      scrapeDetails: {
        title: title,
        country: country,
        quantity: quantity,
        buyer: buyer,
        available: available,
        buttonFound: !!contactBtn
      }
    };
    
    saveLog(logEntry);
    
    // If matched, click the contact button (only in live mode)
    if (matched && contactBtn && !engaged) {
      if (isTestMode) {
        console.log(`%c  🧪 TEST MODE: Would click contact button (not clicking)`, 'background: #f39c12; color: white; font-weight: bold; padding: 4px 8px;');
        highlightElement(listing, true);
        showNotification('🧪 Match Found (Test)', title.substring(0, 30) + '...');
      } else {
        console.log(`%c  🔴 LIVE MODE: Clicking contact button...`, 'background: #e74c3c; color: white; font-weight: bold; padding: 4px 8px;');
        highlightElement(listing, true);
        showNotification('🎯 Contacting!', title.substring(0, 30) + '...');
        
        // Click after a small delay to appear natural
        setTimeout(() => {
          contactBtn.click();
          logEntry.engaged = 'Just contacted';
          updateLog(logEntry);
          console.log(`%c  ✅ Contact button clicked successfully`, 'color: #2ecc71; font-weight: bold;');
        }, 500);
      }
    } else {
      if (!matched) {
        console.log(`%c  ⛔ Not clicking - criteria not met`, 'color: #95a5a6;');
      }
      highlightElement(listing, false);
    }
    
  } catch (error) {
    console.error(`%c❌ Error processing listing #${listingNumber}:`, 'color: #e74c3c; font-weight: bold;', error);
  }
}

// Extract text from element using multiple selectors
function extractText(parent, selectors) {
  const selectorArray = selectors.split(',').map(s => s.trim());
  
  for (const selector of selectorArray) {
    try {
      const element = parent.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    } catch (e) {
      // Invalid selector, continue
    }
  }
  
  return '';
}

// Parse quantity from text
function parseQuantity(text) {
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Check verification requirements
function checkVerification(availableText, criteria) {
  const text = availableText.toLowerCase();
  
  const details = {};
  let passed = true;
  
  if (criteria.verifyEmail) {
    const emailVerified = text.includes('email') || text.includes('mail');
    details.email = emailVerified;
    if (!emailVerified) passed = false;
  }
  
  if (criteria.verifyMobile) {
    const mobileVerified = text.includes('mobile') || text.includes('phone');
    details.mobile = mobileVerified;
    if (!mobileVerified) passed = false;
  }
  
  if (criteria.verifyWhatsapp) {
    const whatsappVerified = text.includes('whatsapp') || text.includes('wa');
    details.whatsapp = whatsappVerified;
    if (!whatsappVerified) passed = false;
  }
  
  return { passed, details };
}

// Highlight element based on match
function highlightElement(element, isMatch) {
  if (isMatch) {
    element.style.border = '3px solid #2ecc71';
    element.style.backgroundColor = '#d5f4e6';
    element.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.5)';
  } else {
    element.style.border = '1px solid #e74c3c';
    element.style.backgroundColor = '#fadbd8';
  }
  
  // Remove highlight after 3 seconds
  setTimeout(() => {
    element.style.border = '';
    element.style.backgroundColor = '';
    element.style.boxShadow = '';
  }, 3000);
}

// Save log entry
function saveLog(entry) {
  chrome.storage.local.get(['logs'], (result) => {
    const logs = result.logs || [];
    logs.push(entry);
    
    // Keep only last 500 entries to save space
    if (logs.length > 500) {
      logs.shift();
    }
    
    chrome.storage.local.set({ logs });
  });
}

// Update existing log entry
function updateLog(entry) {
  chrome.storage.local.get(['logs'], (result) => {
    const logs = result.logs || [];
    const index = logs.findIndex(log => 
      log.time === entry.time && log.title === entry.title
    );
    
    if (index !== -1) {
      logs[index] = entry;
      chrome.storage.local.set({ logs });
    }
  });
}