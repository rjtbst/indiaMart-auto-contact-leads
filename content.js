// =============================================================================
// CONTENT.JS - Main Scanning Logic with Simple User Age Scraping
// =============================================================================

// Global state
let isScanning = false;
let scanInterval = null;
let scanCount = 0;
let consoleLogs = [];

console.log('IndiaMArt Auto Contact Content Script Loaded');

// Add console log interceptor to capture logs for sidebar
function addConsoleLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  consoleLogs.push({ timestamp, message, type });
  
  // Keep only last 100 logs
  if (consoleLogs.length > 100) {
    consoleLogs.shift();
  }
  
  // Save to storage for sidebar with error handling
  try {
    chrome.storage.local.set({ consoleLog: consoleLogs }, () => {
      if (chrome.runtime.lastError) {
        // Extension reloaded, ignore error
      }
    });
  } catch (error) {
    // Extension context invalidated, ignore
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize sidebar on page load
setTimeout(() => {
  if (typeof initializeSidebar === 'function') {
    initializeSidebar();
  }
}, 500);

// Check if should auto-resume scanning
chrome.storage.local.get(['isRunning'], (result) => {
  if (result.isRunning) {
    setTimeout(() => {
      startScanning();
      if (typeof updateSidebarStatus === 'function') {
        updateSidebarStatus();
      }
    }, 1000);
  }
});

// =============================================================================
// MESSAGE LISTENERS
// =============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'start':
      startScanning();
      break;
    case 'stop':
      stopScanning();
      break;
    case 'toggle-sidebar':
      if (typeof toggleSidebar === 'function') {
        toggleSidebar();
      }
      break;
  }
});

// =============================================================================
// SCANNING FUNCTIONS
// =============================================================================

function startScanning() {
  if (isScanning) return;
  
  chrome.storage.local.get(['criteria'], (result) => {
    if (!result.criteria) {
      showNotification('⚠️ No Criteria Set', 'Please set criteria in the extension popup first');
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
    
    addConsoleLog('╔═══════════════════════════════════════════════════════════╗', 'info');
    addConsoleLog('║  IndiaMArt Auto Contact Extension Started                ║', 'info');
    addConsoleLog('╚═══════════════════════════════════════════════════════════╝', 'info');
    addConsoleLog(`Mode: ${mode}`, result.criteria.testMode !== false ? 'warning' : 'error');
    addConsoleLog(`Scan interval: ${formatIntervalLog(result.criteria.interval)}`, 'info');
    
    showNotification('✅ Started', `Scanning every ${formatIntervalLog(result.criteria.interval)}`);
    
    // Run initial scan
    scanPage(result.criteria);
    
    // Set up interval for repeated scans
    scanInterval = setInterval(() => {
      scanPage(result.criteria);
    }, result.criteria.interval);
  });
}

function stopScanning() {
  isScanning = false;
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  showNotification('⏸️ Stopped', 'Scanning paused');
  console.log('Scanning stopped');
}

function scanPage(criteria) {
  scanCount++;
  const scanTime = new Date().toLocaleTimeString();
  
  console.log(`\n%c=== Scan #${scanCount} at ${scanTime} ===`, 'color: #667eea; font-weight: bold;');
  console.log('Interval:', formatIntervalLog(criteria.interval));
  
  addConsoleLog(`\n=== Scan #${scanCount} at ${scanTime} ===`, 'info');
  addConsoleLog(`Interval: ${formatIntervalLog(criteria.interval)}`, 'info');
  
  // Update scan info in storage
  const now = Date.now();
  const nextScan = now + criteria.interval;
  chrome.storage.local.set({ 
    lastScan: now,
    scanCount: scanCount,
    nextScan: nextScan
  });
  
  // Find all product listings
  const listings = document.querySelectorAll(
    '[class*="listing"], [class*="product"], [data-type="listing"], .prd, .bl_item'
  );
  
  if (listings.length === 0) {
    console.log('%cNo listings found on this page', 'color: #e74c3c;');
    addConsoleLog('No listings found on this page', 'error');
    return;
  }
  
  console.log(`%cFound ${listings.length} listings to process`, 'color: #2ecc71;');
  addConsoleLog(`Found ${listings.length} listings to process`, 'success');
  
  listings.forEach((listing, index) => {
    processListing(listing, criteria, index + 1);
  });
  
  console.log(`%c=== Scan #${scanCount} completed ===\n`, 'color: #667eea; font-weight: bold;');
  addConsoleLog(`=== Scan #${scanCount} completed ===`, 'info');
}

function processListing(listing, criteria, listingNumber) {
  try {
    // Extract information from listing - ONLY what we need
    const scrapedData = {
      title: extractText(listing, '[class*="title"], h2, h3, .prd-name, [class*="name"]'),
      quantity: extractText(listing, '[class*="quantity"], [class*="qty"], [class*="amount"]'),
      monthsOld: extractText(listing, '[class*="month"], [class*="age"], [class*="old"], [class*="member"]'),
      country: extractText(listing, '[class*="country"], [class*="location"], [class*="place"]'),
      buyer: extractText(listing, '[class*="buyer"], [class*="company"], [class*="seller"]'),
      verifiedEmail: extractText(listing, '[class*="email"], [class*="mail"]'),
      verifiedPhone: extractText(listing, '[class*="phone"], [class*="mobile"]'),
      verifiedWhatsapp: extractText(listing, '[class*="whatsapp"], [class*="wa"]')
    };
    
    // Create unique product ID
    const productId = createProductId(scrapedData.title, scrapedData.buyer);
    
    // Log scraped data
    console.log(`\n%c━━━ Listing #${listingNumber} ━━━`, 'color: #9b59b6; font-weight: bold;');
    console.log('%c📋 Scraped Data:', 'color: #667eea; font-weight: bold;');
    console.log(`  Title: "${scrapedData.title}"`);
    console.log(`  Quantity: "${scrapedData.quantity}"`);
    console.log(`  Months Old: "${scrapedData.monthsOld}"`);
    console.log(`  Country: "${scrapedData.country}"`);
    console.log(`  Buyer: "${scrapedData.buyer}"`);
    console.log(`  Verified Email: "${scrapedData.verifiedEmail}"`);
    console.log(`  Verified Phone: "${scrapedData.verifiedPhone}"`);
    console.log(`  Verified WhatsApp: "${scrapedData.verifiedWhatsapp}"`);
    console.log(`  Product ID: "${productId}"`);
    
    addConsoleLog(`━━━ Listing #${listingNumber} ━━━`, 'info');
    addConsoleLog(`📋 Title: "${scrapedData.title}"`, 'info');
    addConsoleLog(`   Quantity: "${scrapedData.quantity}" | Months: "${scrapedData.monthsOld}" | Country: "${scrapedData.country}"`, 'info');    
    // Check if already contacted (using stored history)
    chrome.storage.local.get(['contactedProducts'], (result) => {
      const contactedProducts = result.contactedProducts || {};
      const alreadyContacted = contactedProducts[productId] || false;
      
      if (alreadyContacted) {
        console.log(`%c  ⏭ SKIPPED - Already contacted this product before`, 'color: #95a5a6; font-weight: bold;');
        addConsoleLog(`⏭ SKIPPED - Already contacted: "${scrapedData.title}"`, 'warning');
        return;
      }
      
      // Check if already engaged (button state)
      const contactBtn = listing.querySelector(
        '[class*="contact"], button[class*="btn"], [class*="enquiry"], button'
      );
      console.log(`  Contact Button: ${contactBtn ? '✓ Found' : '✗ Not Found'}`);
      
      const engaged = contactBtn && (
        contactBtn.disabled || 
        contactBtn.textContent.toLowerCase().includes('contacted')
      );
      
      if (engaged) {
        console.log(`%c  ⏭ SKIPPED - Already contacted (button disabled)`, 'color: #95a5a6;');
        addConsoleLog(`⏭ SKIPPED - Button disabled: "${scrapedData.title}"`, 'warning');
        // Mark as contacted in our tracking
        markAsContacted(productId);
        return;
      }
      
      // Check matching criteria
      const matchResults = checkMatchingCriteria(scrapedData, criteria);
      logMatchResults(matchResults);
      
      const matched = matchResults.medicine && matchResults.quantity && 
                      matchResults.country && matchResults.monthsOld && 
                      matchResults.verification.passed;
      
      console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #9b59b6;');
      console.log(
        matched 
          ? `%c  🎯 FULL MATCH!` 
          : `%c  ❌ NO MATCH`,
        `background: ${matched ? '#2ecc71' : '#e74c3c'}; color: white; font-weight: bold; padding: 4px 8px;`
      );
      
      addConsoleLog(
        matched 
          ? `🎯 FULL MATCH! "${scrapedData.title}"` 
          : `❌ NO MATCH: "${scrapedData.title}"`,
        matched ? 'success' : 'error'
      );
      
      // Handle matching result
      handleMatchResult(listing, contactBtn, scrapedData, matched, matchResults, criteria, engaged, productId);
    });
    
  } catch (error) {
    console.error(`%c❌ Error processing listing #${listingNumber}:`, 'color: #e74c3c; font-weight: bold;', error);
    addConsoleLog(`❌ Error processing listing #${listingNumber}: ${error.message}`, 'error');
  }
}

// =============================================================================
// MATCHING LOGIC
// =============================================================================

function checkMatchingCriteria(data, criteria) {
  const titleLower = data.title.toLowerCase();
  
  // 1. Check product match
  const productMatch = criteria.medicines.length === 0 || criteria.medicines.some(med => titleLower.includes(med));
  const matchedProduct = criteria.medicines.find(med => titleLower.includes(med)) || 'all';
  
  // 2. Check quantity (extract number and compare)
  const quantityNum = parseNumber(data.quantity);
  const quantityMatch = quantityNum > criteria.minQuantity;
  
  // 3. Check months old (extract number and compare)
  const monthsNum = parseNumber(data.monthsOld);
  let monthsOldMatch = true;
  
  if (criteria.monthsBefore > 0) {
    // User must be AT LEAST this many months old (≥)
    monthsOldMatch = monthsNum >= criteria.monthsBefore;
  }
  // If criteria.monthsBefore === 0, accept any age
  
  // 4. Check country
  let countryMatch = true; // Default to true if no countries specified
  let matchedCountry = null;
  
  if (criteria.countries && criteria.countries.length > 0) {
    const countryLower = data.country.toLowerCase();
    countryMatch = criteria.countries.some(country => countryLower.includes(country));
    matchedCountry = criteria.countries.find(country => countryLower.includes(country));
  }
  
  // 5. Check verification (email, phone, whatsapp)
  const verificationMatch = checkVerification(data, criteria);
  
  return {
    medicine: productMatch,
    matchedMedicine: matchedProduct,
    quantity: quantityMatch,
    quantityNum: quantityNum,
    monthsOld: monthsOldMatch,
    monthsNum: monthsNum,
    country: countryMatch,
    matchedCountry: matchedCountry,
    verification: verificationMatch
  };
}

function checkVerification(data, criteria) {
  const details = {};
  let passed = true;
  
  // Check email verification
  if (criteria.verifyEmail) {
    const hasEmail = data.verifiedEmail && data.verifiedEmail.trim().length > 0;
    details.email = hasEmail;
    if (!hasEmail) passed = false;
  }
  
  // Check phone/mobile verification
  if (criteria.verifyMobile) {
    const hasPhone = data.verifiedPhone && data.verifiedPhone.trim().length > 0;
    details.mobile = hasPhone;
    if (!hasPhone) passed = false;
  }
  
  // Check WhatsApp verification
  if (criteria.verifyWhatsapp) {
    const hasWhatsapp = data.verifiedWhatsapp && data.verifiedWhatsapp.trim().length > 0;
    details.whatsapp = hasWhatsapp;
    if (!hasWhatsapp) passed = false;
  }
  
  return { passed, details };
}

function logMatchResults(results) {
  console.log('%c🔍 Matching Criteria:', 'color: #667eea; font-weight: bold;');
  
  console.log(
    `  Product: ${results.medicine ? '✓' : '✗'} ${
      results.medicine 
        ? `(matched: "${results.matchedMedicine}")` 
        : `(not found in title)`
    }`
  );
  
  console.log(
    `  Quantity: ${results.quantity ? '✓' : '✗'} (${results.quantityNum} ${
      results.quantity ? '>' : '≤'
    } ${results.quantityNum})`
  );
  
  console.log(
    `  Months Old: ${results.monthsOld ? '✓' : '✗'} (${results.monthsNum} months ${
      results.monthsOld ? '≥ required' : '< required'
    })`
  );
  
  console.log(
    `  Country: ${results.country ? '✓' : '✗'} ${
      results.matchedCountry 
        ? `(matched: "${results.matchedCountry}")` 
        : '(all countries or not matched)'
    }`
  );
  
  const verDetails = Object.entries(results.verification.details)
    .map(([k, v]) => `${k}:${v ? '✓' : '✗'}`)
    .join(', ');
  console.log(
    `  Verification: ${results.verification.passed ? '✓' : '✗'} (${verDetails || 'none required'})`
  );
}

function handleMatchResult(listing, contactBtn, data, matched, matchResults, criteria, engaged, productId) {
  const isTestMode = criteria.testMode !== false;
  
  // Create log entry
  const logEntry = {
    time: new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    title: data.title || 'N/A',
    quantity: data.quantity || 'N/A',
    userMonthsOld: matchResults.monthsNum,
    country: data.country || 'N/A',
    buyer: data.buyer || 'N/A',
    verifiedEmail: data.verifiedEmail || 'N/A',
    verifiedPhone: data.verifiedPhone || 'N/A',
    verifiedWhatsapp: data.verifiedWhatsapp || 'N/A',
    engaged: engaged 
      ? 'Already contacted' 
      : (matched && isTestMode ? 'Would contact in live mode' : 'Available'),
    matched: matched,
    verification: matchResults.verification.details,
    productId: productId,
    scrapeDetails: {
      ...data,
      buttonFound: !!contactBtn
    }
  };
  
  saveLog(logEntry);
  
  // Handle contact button click
  if (matched && contactBtn && !engaged) {
    if (isTestMode) {
      console.log(
        `%c  🧪 TEST MODE: Would click contact button (not clicking)`,
        'background: #f39c12; color: white; font-weight: bold; padding: 4px 8px;'
      );
      addConsoleLog(`🧪 TEST MODE: Would contact "${data.title}"`, 'warning');
      highlightElement(listing, true);
      showNotification('🧪 Match Found (Test)', data.title.substring(0, 30) + '...');
    } else {
      console.log(
        `%c  🔴 LIVE MODE: Clicking contact button...`,
        'background: #e74c3c; color: white; font-weight: bold; padding: 4px 8px;'
      );
      addConsoleLog(`🔴 LIVE MODE: Contacting "${data.title}"`, 'error');
      highlightElement(listing, true);
      showNotification('🎯 Contacting!', data.title.substring(0, 30) + '...');
      
      setTimeout(() => {
        contactBtn.click();
        logEntry.engaged = 'Just contacted';
        updateLog(logEntry);
        markAsContacted(productId);
        console.log(`%c  ✅ Contact button clicked successfully`, 'color: #2ecc71; font-weight: bold;');
        addConsoleLog(`✅ Successfully contacted "${data.title}"`, 'success');
      }, 500);
    }
  } else {
    if (!matched) {
      console.log(`%c  ⛔ Not clicking - criteria not met`, 'color: #95a5a6;');
    }
    highlightElement(listing, false);
  }
}

// =============================================================================
// PRODUCT TRACKING (Prevent Duplicates)
// =============================================================================

function createProductId(title, buyer) {
  // Create a unique ID from title and buyer to track contacted products
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanBuyer = buyer.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}_${cleanBuyer}`.substring(0, 100);
}

function markAsContacted(productId) {
  try {
    chrome.storage.local.get(['contactedProducts'], (result) => {
      if (chrome.runtime.lastError) {
        console.log('Cannot mark as contacted - extension reloaded');
        return;
      }
      
      const contactedProducts = result.contactedProducts || {};
      contactedProducts[productId] = {
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
      chrome.storage.local.set({ contactedProducts }, () => {
        if (chrome.runtime.lastError) {
          // Extension reloaded, ignore
        }
      });
    });
  } catch (error) {
    // Extension context invalidated, ignore
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function extractText(parent, selectors) {
  const selectorArray = selectors.split(',').map(s => s.trim());
  
  for (const selector of selectorArray) {
    const element = parent.querySelector(selector);
    if (element) {
      return element.textContent.trim();
    }
  }
  
  return '';
}

function parseNumber(text) {
  // Extract first number from text
  // "2 months old" -> 2
  // "500 units" -> 500
  // "2" -> 2
  const match = text.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function formatIntervalLog(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

function highlightElement(element, isMatch) {
  if (isMatch) {
    element.style.border = '3px solid #2ecc71';
    element.style.backgroundColor = '#d5f4e6';
    element.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.5)';
  } else {
    element.style.border = '1px solid #e74c3c';
    element.style.backgroundColor = '#fadbd8';
  }
  
  setTimeout(() => {
    element.style.border = '';
    element.style.backgroundColor = '';
    element.style.boxShadow = '';
  }, 3000);
}

// =============================================================================
// STORAGE FUNCTIONS
// =============================================================================

function saveLog(entry) {
  try {
    chrome.storage.local.get(['logs'], (result) => {
      if (chrome.runtime.lastError) {
        console.log('Cannot save log - extension reloaded');
        return;
      }
      
      const logs = result.logs || [];
      logs.push(entry);
      
      // Keep only last 500 entries
      if (logs.length > 500) {
        logs.shift();
      }
      
      chrome.storage.local.set({ logs }, () => {
        if (chrome.runtime.lastError) {
          // Extension reloaded, ignore
        }
      });
    });
  } catch (error) {
    // Extension context invalidated, ignore
  }
}

function updateLog(entry) {
  chrome.storage.local.get(['logs'], (result) => {
    const logs = result.logs || [];
    const index = logs.findIndex(log => 
      log.productId === entry.productId
    );
    
    if (index !== -1) {
      logs[index] = entry;
      chrome.storage.local.set({ logs });
    }
  });
}

// =============================================================================
// NOTIFICATION (Fallback if sidebar not loaded)
// =============================================================================

function showNotification(title, message) {
  // Try to use sidebar notification if available
  if (typeof window.showSidebarNotification === 'function') {
    window.showSidebarNotification(title, message);
  } else {
    // Fallback to console
    console.log(`%c${title}: ${message}`, 'color: #667eea; font-weight: bold;');
  }
}