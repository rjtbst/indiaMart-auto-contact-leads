// Background service worker for the extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('IndiaMArt Auto Contact Extension installed');
  
  // Initialize storage with defaults
  chrome.storage.local.get(['criteria'], (result) => {
    if (!result.criteria) {
      chrome.storage.local.set({
        isRunning: false,
        logs: [],
        scanCount: 0,
        criteria: {
          medicines: [],
          minQuantity: 2,
          verifyEmail: true,
          verifyMobile: true,
          verifyWhatsapp: false,
          interval: 5000,
          intervalDisplay: { value: 5, unit: 's' },
          testMode: true
        }
      });
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

// Monitor tab updates to maintain scanning on navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('indiamart.com')) {
    // Check if scanning should be running
    chrome.storage.local.get(['isRunning'], (result) => {
      if (result.isRunning) {
        // Inject content script if needed and resume scanning
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: 'start' }).catch(() => {
            // Content script not injected yet, that's okay
          });
        }, 1500);
      }
    });
  }
});

// Handle tab close - don't stop scanning, just update active tab
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(['isRunning'], (result) => {
    // Keep isRunning true, just remove the specific tab reference
    // Scanning will resume when user opens another IndiaMArt tab
    console.log(`Tab ${tabId} closed, scanning will resume on next IndiaMArt tab`);
  });
});

// Periodically check and maintain state
setInterval(() => {
  chrome.storage.local.get(['isRunning'], (result) => {
    if (result.isRunning) {
      // Find any open IndiaMArt tabs
      chrome.tabs.query({ url: '*://*.indiamart.com/*' }, (tabs) => {
        if (tabs.length > 0) {
          // Send keep-alive to all IndiaMArt tabs
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'ping' }).catch(() => {
              // Tab doesn't have content script, that's okay
            });
          });
        }
      });
    }
  });
}, 30000); // Every 30 seconds