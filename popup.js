// Load saved criteria on popup open
document.addEventListener('DOMContentLoaded', () => {
  loadCriteria();
});

// Save criteria
document.getElementById('saveCriteria').addEventListener('click', () => {
  const intervalValue = parseInt(document.getElementById('intervalValue').value);
  const intervalUnit = document.getElementById('intervalUnit').value;
  
  // Convert to milliseconds
  let intervalMs = intervalValue;
  if (intervalUnit === 's') {
    intervalMs = intervalValue * 1000;
  } else if (intervalUnit === 'm') {
    intervalMs = intervalValue * 60 * 1000;
  }
  
  const criteria = {
    medicines: document.getElementById('medicines').value.split(',').map(m => m.trim().toLowerCase()).filter(m => m),
    minQuantity: parseInt(document.getElementById('minQuantity').value),
    verifyEmail: document.getElementById('verifyEmail').checked,
    verifyMobile: document.getElementById('verifyMobile').checked,
    verifyWhatsapp: document.getElementById('verifyWhatsapp').checked,
    interval: intervalMs,
    intervalDisplay: {
      value: intervalValue,
      unit: intervalUnit
    },
    testMode: document.getElementById('testMode').checked
  };
  
  const displayTime = formatInterval(intervalMs);
  const modeText = criteria.testMode ? '🧪 TEST MODE (No clicking)' : '🔴 LIVE MODE (Will click buttons!)';
  
  chrome.storage.local.set({ criteria }, () => {
    showAlert(`✅ Criteria saved!\n\nInterval: ${displayTime}\nMode: ${modeText}\n\nGo to any IndiaMArt page and use the sidebar to start scanning.`);
  });
});

// Load criteria
function loadCriteria() {
  chrome.storage.local.get(['criteria'], (result) => {
    if (result.criteria) {
      document.getElementById('medicines').value = result.criteria.medicines.join(', ');
      document.getElementById('minQuantity').value = result.criteria.minQuantity;
      document.getElementById('verifyEmail').checked = result.criteria.verifyEmail;
      document.getElementById('verifyMobile').checked = result.criteria.verifyMobile;
      document.getElementById('verifyWhatsapp').checked = result.criteria.verifyWhatsapp;
      document.getElementById('testMode').checked = result.criteria.testMode !== false;
      
      if (result.criteria.intervalDisplay) {
        document.getElementById('intervalValue').value = result.criteria.intervalDisplay.value;
        document.getElementById('intervalUnit').value = result.criteria.intervalDisplay.unit;
      } else {
        document.getElementById('intervalValue').value = result.criteria.interval || 5000;
        document.getElementById('intervalUnit').value = 's';
      }
    }
  });
}

// Export CSV
document.getElementById('exportCsv').addEventListener('click', () => {
  chrome.storage.local.get(['logs'], (result) => {
    if (!result.logs || result.logs.length === 0) {
      showAlert('❌ No logs to export!');
      return;
    }
    
    const csv = convertToCSV(result.logs);
    downloadCSV(csv, 'indiamart_logs.csv');
    showAlert(`✅ Exported ${result.logs.length} logs to CSV!`);
  });
});

// Clear logs
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all logs?')) {
    chrome.storage.local.set({ logs: [] }, () => {
      showAlert('🗑️ Logs cleared!');
    });
  }
});

// Helper functions
function formatInterval(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    return `${(ms / 60000).toFixed(1)}m`;
  }
}

function convertToCSV(logs) {
  const headers = ['Time', 'Title', 'Country', 'Quantity', 'Buyer', 'Available', 'Engaged', 'Matched'];
  const rows = logs.map(log => [
    log.time,
    log.title,
    log.country,
    log.quantity,
    log.buyer,
    log.available,
    log.engaged || '',
    log.matched ? 'YES' : 'NO'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showAlert(message) {
  alert(message);
}

function showAlert(message) {
  alert(message);
}