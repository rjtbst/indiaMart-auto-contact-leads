// =============================================================================
// POPUP.JS - Updated (No DOM Wait Setting)
// =============================================================================

let updateInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  updateUI();
  startRealtimeUpdates();
});

// =============================================================================
// REAL-TIME UPDATES
// =============================================================================

function startRealtimeUpdates() {
  if (updateInterval) clearInterval(updateInterval);
  
  updateInterval = setInterval(() => {
    updateUI();
  }, 300);
}

function updateUI() {
  chrome.storage.local.get(['isRunning', 'scanCount', 'productHistory', 'totalContacted'], (result) => {
    // Status
    const statusText = document.getElementById('statusText');
    if (result.isRunning) {
      statusText.textContent = '🟢 Running';
      statusText.style.color = '#2ecc71';
    } else {
      statusText.textContent = '🔴 Stopped';
      statusText.style.color = '#e74c3c';
    }
    
    // Scan count
    document.getElementById('scanCount').textContent = result.scanCount || 0;
    
    // Total contacted
    document.getElementById('totalContacted').textContent = result.totalContacted || 0;
    
    // Update table
    buildTable(result.productHistory || []);
  });
}

function buildTable(productHistory) {
  const container = document.getElementById('tableContainer');
  const countEl = document.getElementById('tableCount');
  
  if (!productHistory || productHistory.length === 0) {
    container.innerHTML = '<div class="empty-state">No leads scanned yet. Click Start to begin.</div>';
    countEl.textContent = '0';
    return;
  }
  
  countEl.textContent = productHistory.length;
  
  // Build table rows - newest first
  const rows = [...productHistory].reverse().map(p => {
    const rowClass = p.contacted ? 'contacted-row' : '';
    const matchClass = p.matched ? 'match-yes' : 'match-no';
    const prodClass = p.matchedMedicine ? 'match-yes' : 'match-no';
    const ageCheckClass = p.matchedAge ? 'match-yes' : 'match-no';
    const countryCheckClass = p.matchedCountry ? 'match-yes' : 'match-no';
    const emailClass = p.matchedEmail ? 'match-yes' : 'match-no';
    const phoneClass = p.matchedPhone ? 'match-yes' : 'match-no';
    
    const status = p.contacted 
      ? '<span class="badge badge-contacted">CONTACTED</span>'
      : p.alreadyContacted
      ? '<span class="badge badge-contacted">PREV CONTACTED</span>'
      : '<span class="badge badge-available">AVAILABLE</span>';
    
    const titleFull = p.title || 'N/A';
    const countryFull = p.country || 'N/A';
    
    return `
      <tr class="${rowClass}">
        <td><strong>#${p.scanNumber || 0}</strong></td>
        <td>${p.time}</td>
        <td title="${esc(titleFull)}" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(titleFull)}</td>
        <td class="${matchClass}"><strong>${p.matched ? '✓' : '✗'}</strong></td>
        <td class="${prodClass}">${p.matchedMedicine ? '✓' : '✗'}</td>
        <td>${p.ageMonths || '-'}</td>
        <td class="${ageCheckClass}">${p.matchedAge ? '✓' : '✗'}</td>
        <td title="${esc(countryFull)}">${esc(countryFull)}</td>
        <td class="${countryCheckClass}">${p.matchedCountry ? '✓' : '✗'}</td>
        <td class="${emailClass}">${p.matchedEmail ? '✓' : '✗'}</td>
        <td class="${phoneClass}">${p.matchedPhone ? '✓' : '✗'}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
  
  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Scan#</th>
          <th>Time</th>
          <th>Title</th>
          <th>Match</th>
          <th>Prod</th>
          <th>Age</th>
          <th>Age✓</th>
          <th>Country</th>
          <th>Ctry✓</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// =============================================================================
// CONTROLS
// =============================================================================

document.getElementById('startBtn').addEventListener('click', () => {
  chrome.storage.local.get(['criteria'], (result) => {
    if (!result.criteria) {
      alert('⚠️ Save settings first!');
      return;
    }
    
    // Request notification permission first
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          startScanning(result.criteria);
        } else {
          alert('⚠️ Notification permission denied. You won\'t see match alerts.\n\nYou can still use the extension, but notifications will be disabled.');
          startScanning(result.criteria);
        }
      });
    } else {
      startScanning(result.criteria);
    }
  });
});

function startScanning(criteria) {
  chrome.storage.local.set({ isRunning: true }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('indiamart.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'start' });
        const productsText = criteria.productsToScan === 2 ? '2 products' : '1 product';
        alert(`✅ Started!\n\n🔔 Browser notifications enabled\n📦 Scanning ${productsText} per refresh\n\nTable will show all scanned products in real-time.`);
      } else {
        alert('⚠️ Open IndiaMART page first!\n\nhttps://seller.indiamart.com/bltxn/?pref=');
      }
    });
  });
}

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.storage.local.set({ isRunning: false }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }).catch(() => {});
      }
    });
    alert('⏸️ Stopped!');
  });
});

// =============================================================================
// SETTINGS
// =============================================================================

document.getElementById('saveBtn').addEventListener('click', () => {
  const testMode = document.getElementById('testMode').checked;
  
  if (!testMode) {
    if (!confirm('⚠️ LIVE MODE - Will click buttons!\n\nContinue?')) {
      document.getElementById('testMode').checked = true;
      return;
    }
  }
  
  const intervalValue = parseInt(document.getElementById('intervalValue').value);
  const intervalUnit = document.getElementById('intervalUnit').value;
  
  // Calculate interval in milliseconds
  let intervalMs = 0;
  if (!isNaN(intervalValue) && intervalValue >= 0) {
    if (intervalUnit === 's') {
      intervalMs = intervalValue * 1000;
    } else {
      intervalMs = intervalValue;
    }
  }
  
  const medicines = document.getElementById('medicines').value
    .split(',')
    .map(m => m.trim().toLowerCase())
    .filter(m => m);
  
  if (medicines.length === 0) {
    if (!confirm('⚠️ No products specified - will scan ALL products.\n\nContinue?')) {
      return;
    }
  }
  
  const criteria = {
    medicines: medicines,
    monthsBefore: parseInt(document.getElementById('monthsBefore').value) || 0,
    countries: document.getElementById('countries').value
      .split(',')
      .map(c => c.trim().toLowerCase())
      .filter(c => c),
    verifyEmail: document.getElementById('verifyEmail').checked,
    verifyMobile: document.getElementById('verifyMobile').checked,
    interval: intervalMs,
    productsToScan: parseInt(document.getElementById('productsToScan').value) || 1,
    testMode: testMode
  };
  
  chrome.storage.local.set({ criteria }, () => {
    const mode = testMode ? '🧪 TEST' : '🔴 LIVE';
    const speed = intervalMs === 0 ? 'INSTANT (0ms)' : intervalMs < 1000 ? `${intervalMs}ms` : `${intervalMs/1000}s`;
    const prods = medicines.length > 0 ? medicines.join(', ') : 'ALL PRODUCTS';
    const scanCount = criteria.productsToScan === 2 ? '2 products' : '1 product';
    alert(`✅ Saved!\n\nMode: ${mode}\nRefresh Interval: ${speed}\nProducts: ${prods}\nScan Count: ${scanCount} per refresh\n\n🔔 Notifications: Enabled\n⚡ Smart DOM Loading: Auto-waits for listings`);
  });
});

function loadSettings() {
  chrome.storage.local.get(['criteria'], (result) => {
    if (result.criteria) {
      const c = result.criteria;
      document.getElementById('medicines').value = (c.medicines || []).join(', ');
      document.getElementById('monthsBefore').value = c.monthsBefore || 2;
      document.getElementById('countries').value = (c.countries || []).join(', ');
      document.getElementById('verifyEmail').checked = c.verifyEmail !== false;
      document.getElementById('verifyMobile').checked = c.verifyMobile !== false;
      document.getElementById('testMode').checked = c.testMode !== false;
      document.getElementById('productsToScan').value = c.productsToScan || 1;
      
      const intervalMs = c.interval || 0;
      if (intervalMs < 1000) {
        document.getElementById('intervalValue').value = intervalMs;
        document.getElementById('intervalUnit').value = 'ms';
      } else {
        document.getElementById('intervalValue').value = intervalMs / 1000;
        document.getElementById('intervalUnit').value = 's';
      }
    }
  });
}

// =============================================================================
// EXPORT & CLEAR
// =============================================================================

document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.storage.local.get(['productHistory'], (result) => {
    if (!result.productHistory || result.productHistory.length === 0) {
      alert('⚠️ No data! History is empty.');
      return;
    }
    
    const products = result.productHistory;
    const headers = ['Scan#', 'Time', 'Title', 'Strength', 'Age', 'Country', 'Buyer', 'Email', 'Phone', 'Matched', 'Contacted', 'Product ID'];
    const rows = products.map(p => [
      p.scanNumber || 0, 
      p.time, 
      p.title, 
      p.strength || '',
      p.ageMonths || 0, 
      p.country || '', 
      p.buyer || '',
      p.verifiedEmail || '', 
      p.verifiedPhone || '',
      p.matched ? 'YES' : 'NO', 
      p.contacted ? 'YES' : 'NO',
      p.productId || ''
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indiamart_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`✅ Exported ${products.length} products from history!`);
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('⚠️ Clear all data?\n\nThis will clear:\n- Product history (all scanned products)\n- Contacted products list\n- Scan count\n- Total contacted count\n\nContinue?')) {
    chrome.storage.local.set({
      currentProduct: null,
      productHistory: [],
      contactedProducts: {},
      scanCount: 0,
      refreshTime: 0,
      totalContacted: 0
    }, () => {
      updateUI();
      alert('🗑️ Cleared all data!');
    });
  }
});