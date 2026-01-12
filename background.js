// =============================================================================
// BACKGROUND.JS 
// =============================================================================

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('IndiaMART Ultra-Fast Extension installed');
  
  chrome.storage.local.get(['criteria', 'scanCount', 'productHistory', 'totalContacted'], (result) => {
    const updates = {};
    
    // Initialize criteria if not exists
    if (!result.criteria) {
      updates.criteria = {
        medicines: [],
        minQuantity: 2,
        monthsBefore: 2,
        countries: [],
        verifyEmail: true,
        verifyMobile: true,
        interval: 0, // Default to instant (0ms)
        productsToScan: 1, // Default to first product only
        testMode: true
      };
    }
    
    // Initialize scan count if not exists
    if (result.scanCount === undefined) {
      updates.scanCount = 0;
    }
    
    // Initialize total contacted if not exists
    if (result.totalContacted === undefined) {
      updates.totalContacted = 0;
    }
    
    // Initialize product history if not exists
    if (!result.productHistory) {
      updates.productHistory = [];
    }
    
    // Set defaults
    if (!result.isRunning) {
      updates.isRunning = false;
    }
    
    if (!result.refreshTime) {
      updates.refreshTime = 0;
    }
    
    if (!result.contactedProducts) {
      updates.contactedProducts = {};
    }
    
    // Apply all updates
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
  }
  return true;
});

// Monitor tab updates - resume scanning on navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      tab.url && 
      tab.url.includes('indiamart.com')) {
    
    chrome.storage.local.get(['isRunning'], (result) => {
      if (result.isRunning) {
        // Resume scanning after navigation
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: 'start' }).catch(() => {
            // Content script not ready yet
          });
        }, 1000);
      }
    });
  }
});

// Handle tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  // Keep isRunning state - will resume when user opens another IndiaMART tab
  console.log(`Tab ${tabId} closed - scanning will resume on next IndiaMART tab`);
});

// Periodic keep-alive for open IndiaMART tabs
setInterval(() => {
  chrome.storage.local.get(['isRunning'], (result) => {
    if (result.isRunning) {
      chrome.tabs.query({ url: '*://*.indiamart.com/*' }, (tabs) => {
        if (tabs.length > 0) {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }).catch(() => {
              // Tab doesn't have content script
            });
          });
        }
      });
    }
  });
}, 30000); // Every 30 seconds

// Clean up old contacted products (older than 30 days)
setInterval(() => {
  chrome.storage.local.get(['contactedProducts'], (result) => {
    if (result.contactedProducts) {
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const cleaned = {};
      
      Object.entries(result.contactedProducts).forEach(([id, data]) => {
        if (now - data.timestamp < thirtyDays) {
          cleaned[id] = data;
        }
      });
      
      chrome.storage.local.set({ contactedProducts: cleaned });
      console.log('Cleaned old contacted products');
    }
  });
}, 24 * 60 * 60 * 1000); // Every 24 hours

// Clean up old product history (keep last 100 only)
setInterval(() => {
  chrome.storage.local.get(['productHistory'], (result) => {
    if (result.productHistory && result.productHistory.length > 100) {
      // Keep only last 100
      const cleaned = result.productHistory.slice(-100);
      chrome.storage.local.set({ productHistory: cleaned });
      console.log(`Trimmed product history to 100 entries`);
    }
  });
}, 60 * 60 * 1000); // Every hour