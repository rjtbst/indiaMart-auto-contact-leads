// =============================================================================
// CONTENT.JS - Main Scanning Logic with Fixed Storage
// =============================================================================

let isScanning = false;
let scanInterval = null;
let scanCount = 0;
let consoleLogs = [];

console.log('IndiaMART Auto Contact Content Script Loaded');

function addConsoleLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  consoleLogs.push({ timestamp, message, type });
  if (consoleLogs.length > 100) consoleLogs.shift();
  
  try {
    chrome.storage.local.set({ consoleLog: consoleLogs }, () => {});
  } catch (error) {}
}

// =============================================================================
// INITIALIZATION
// =============================================================================

setTimeout(() => {
  if (typeof initializeSidebar === 'function') {
    initializeSidebar();
  }
}, 500);

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'start':
      startScanning();
      break;
    case 'stop':
      stopScanning();
      break;
    case 'toggle-sidebar':
      if (typeof toggleSidebar === 'function') toggleSidebar();
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
    
    const mode = result.criteria.testMode !== false ? 'TEST MODE' : 'LIVE MODE';
    console.log('%c╔═══════════════════════════════════════╗', 'color: #667eea; font-weight: bold;');
    console.log('%c║  IndiaMART Auto Contact Started      ║', 'color: #667eea; font-weight: bold;');
    console.log('%c╚═══════════════════════════════════════╝', 'color: #667eea; font-weight: bold;');
    console.log(`%cMode: ${mode}`, 'color: ' + (result.criteria.testMode !== false ? '#f39c12' : '#e74c3c') + '; font-weight: bold;');
    
    addConsoleLog('═══════════════════════════════════', 'info');
    addConsoleLog(`Extension Started - ${mode}`, 'success');
    
    showNotification('✅ Started', `Scanning every ${formatIntervalLog(result.criteria.interval)}`);
    
    scanPage(result.criteria);
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
  addConsoleLog('Scanning stopped', 'warning');
}

function scanPage(criteria) {
  scanCount++;
  const scanTime = new Date().toLocaleTimeString();
  
  console.log(`\n%c=== Scan #${scanCount} at ${scanTime} ===`, 'color: #667eea; font-weight: bold;');
  addConsoleLog(`=== Scan #${scanCount} at ${scanTime} ===`, 'info');
  
  const now = Date.now();
  chrome.storage.local.set({ 
    lastScan: now,
    scanCount: scanCount,
    nextScan: now + criteria.interval
  });
  
  const listings = document.querySelectorAll('.bl_grid.Prd_Enq,[class*="bl_gridIN"][class*="bl_grid"][class*="Prd_Enq"]');
  
  if (listings.length === 0) {
    console.log('%cNo listings found', 'color: #e74c3c;');
    addConsoleLog('No listings found', 'error');
    return;
  }
  
  console.log(`%cFound ${listings.length} listings`, 'color: #2ecc71;');
  addConsoleLog(`Found ${listings.length} listings`, 'success');
  
  processAllListings(listings, criteria);
}

// =============================================================================
// PROCESS ALL LISTINGS
// =============================================================================

async function processAllListings(listings, criteria) {
  // CRITICAL: Get existing productLogs ONCE at the start
  const storageData = await new Promise(resolve => {
    chrome.storage.local.get(['contactedProducts', 'productLogs'], resolve);
  });
  
  const contactedProducts = storageData.contactedProducts || {};
  const productLogs = storageData.productLogs || {};
  
  let processedCount = 0;
  
  for (let index = 0; index < listings.length; index++) {
    const listing = listings[index];
    
    try {
      const result = await processListingSync(listing, criteria, index + 1, contactedProducts);
      
      if (result) {
        // CRITICAL: Add to productLogs object (not array!)
        productLogs[result.productId] = result.logEntry;
        processedCount++;
      }
      
    } catch (error) {
      console.error(`Error processing listing ${index + 1}:`, error);
    }
  }
  
  // CRITICAL: Save ALL products at once after processing
  await new Promise(resolve => {
    chrome.storage.local.set({ productLogs }, () => {
      console.log(`%c✅ Saved ${processedCount} products to storage`, 'color: #2ecc71; font-weight: bold;');
      resolve();
    });
  });
  
  console.log(`%c=== Scan #${scanCount} completed ===`, 'color: #667eea; font-weight: bold;');
  addConsoleLog(`=== Scan completed: ${processedCount} products ===`, 'info');
  
  // Wait before updating sidebar
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (typeof updateSidebarStatus === 'function') {
    updateSidebarStatus();
  }
}

// =============================================================================
// PROCESS SINGLE LISTING
// =============================================================================

function processListingSync(listing, criteria, listingNumber, contactedProducts) {
  return new Promise((resolve) => {
    const title = extractTitle(listing);
    const strength = extractFromTable(listing, 'Strength');
    const memberSince = extractMemberSince(listing);
    const country = extractCountry(listing);
    const buys = extractBuys(listing);
    const verifications = extractAvailableVerifications(listing);
    
    const scrapedData = {
      title: title,
      strength: strength,
      monthsOld: memberSince,
      monthsOldNumber: convertMemberAgeToMonths(memberSince),
      country: country,
      buys: buys,
      buyer: buys,
      verifiedEmail: verifications.email ? 'Email ID Available/Verified' : '',
      verifiedPhone: verifications.phone ? 'Mobile Number Available' : '',
      isRetail: listing.querySelector('.retailmsg') !== null
    };
    
    const productId = createProductId(scrapedData.title, scrapedData.buyer, scrapedData.monthsOld);
    
    console.log(`\n%c━━━ Listing #${listingNumber}: ${scrapedData.title.substring(0, 40)}...`, 'color: #9b59b6;');
    
    const alreadyContacted = contactedProducts[productId] || false;
    
    const contactBtn = listing.querySelector('.btnCBN, .btnCBN1, [class*="btnCBN"], div[onclick*="contactbuyernow"]');
    
    const engaged = contactBtn && (
      contactBtn.disabled || 
      contactBtn.textContent.toLowerCase().includes('contacted') ||
      contactBtn.textContent.toLowerCase().includes('sent')
    );
    
    // Check matching criteria
    const matchResults = checkMatchingCriteria(scrapedData, criteria);
    const matched = matchResults.medicine && matchResults.monthsOld && 
                    matchResults.country && matchResults.verification.passed;
    
    console.log(matched ? `%c  🎯 MATCH` : `%c  ❌ NO MATCH`, `background: ${matched ? '#2ecc71' : '#e74c3c'}; color: white; padding: 2px 6px;`);
    
    // CRITICAL: Create complete log entry with ALL fields
    const logEntry = {
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      
      // Basic info
      title: scrapedData.title || 'N/A',
      strength: scrapedData.strength || 'N/A',
      country: scrapedData.country || 'N/A',
      buyer: scrapedData.buyer || 'N/A',
      buys: scrapedData.buys || 'N/A',
      
      // Age info
      userMonthsOld: scrapedData.monthsOldNumber,
      ageMonths: scrapedData.monthsOldNumber,
      
      // Verification info
      verifiedEmail: scrapedData.verifiedEmail || '',
      verifiedPhone: scrapedData.verifiedPhone || '',
      
      // Match info
      matched: matched,
      
      // CRITICAL: Individual match flags for table coloring
      matchedMedicine: matchResults.medicine,
      matchedMedicineName: matchResults.matchedMedicine || 'N/A',
      matchedAge: matchResults.monthsOld,
      matchedCountry: matchResults.country,
      countryName: scrapedData.country || 'N/A',
      matchedEmail: matchResults.verification.details.email !== undefined ? matchResults.verification.details.email : true,
      matchedPhone: matchResults.verification.details.mobile !== undefined ? matchResults.verification.details.mobile : true,
      
      // Status
      engaged: alreadyContacted ? 'Already contacted' : (engaged ? 'Already contacted' : 'Available'),
      alreadyContacted: alreadyContacted || engaged,
      contacted: alreadyContacted || engaged,
      
      // Meta
      productId: productId,
      matchResults: matchResults
    };
    
    // Handle click logic
    handleMatchResult(listing, contactBtn, scrapedData, matched, matchResults, criteria, engaged, productId);
    
    resolve({ productId, logEntry });
  });
}

// =============================================================================
// EXTRACTION FUNCTIONS
// =============================================================================

function extractTitle(listing) {
  const selectors = ['.lstNwLftCnt h2', '.lstNwLftCnt h3', '.lstNwLft h2', 'h2'];
  for (const selector of selectors) {
    const element = listing.querySelector(selector);
    if (element && element.textContent.trim().length > 0) {
      return element.textContent.trim();
    }
  }
  return '';
}

function extractFromTable(listing, label) {
  const rows = listing.querySelectorAll('.lstNwLftBtmCnt table tbody tr, table tbody tr');
  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 2) {
      const labelCell = cells[0].textContent.trim().toLowerCase();
      if (labelCell.includes(label.toLowerCase())) {
        const valueCell = cells[1];
        const boldValue = valueCell.querySelector('b');
        return boldValue ? boldValue.textContent.trim() : valueCell.textContent.replace(':', '').trim();
      }
    }
  }
  return '';
}

function extractMemberSince(listing) {
  const selectors = ['.lstNwRgtBD .SLC_f13', '.SLC_f13', '[class*="lstNwRgtBD"] [class*="SLC_f13"]'];
  for (const selector of selectors) {
    const element = listing.querySelector(selector);
    if (element) {
      const text = element.textContent.trim();
      if (text.toLowerCase().includes('member since')) {
        return text.replace(/-/g, '').trim();
      }
    }
  }
  return '';
}

function extractAvailableVerifications(listing) {
  const verifications = { email: false, phone: false };
  const tooltips = listing.querySelectorAll('.lstNwRgtBD .tooltip_vfr, .tooltip_vfr, [class*="tooltip"]');
  
  tooltips.forEach(tooltip => {
    const text = tooltip.textContent.toLowerCase();
    if (text.includes('email')) verifications.email = true;
    if (text.includes('mobile') || text.includes('phone')) verifications.phone = true;
  });
  
  return verifications;
}

function extractCountry(listing) {
  const selectors = ['.coutry_click', '.country_click', '[class*="coutry"]', '[onclick*="BLCARD_COUNTRY_SELECT"]'];
  for (const selector of selectors) {
    const element = listing.querySelector(selector);
    if (element && element.textContent.trim().length > 0) {
      return element.textContent.trim().split('Click here')[0].trim();
    }
  }
  return '';
}

function extractBuys(listing) {
  const buysDivs = listing.querySelectorAll('.lstNwRgtBD .lstNwDflx');
  for (const div of buysDivs) {
    const alignmentP = div.querySelector('.alignment');
    if (alignmentP && alignmentP.textContent.trim().toLowerCase() === 'buys') {
      const boldElement = div.querySelector('b');
      if (boldElement) return boldElement.textContent.trim();
    }
  }
  return '';
}

function convertMemberAgeToMonths(memberText) {
  const text = memberText.toLowerCase();
  const numberMatch = text.match(/(\d+)\+?/);
  if (!numberMatch) return 0;
  
  const value = parseInt(numberMatch[1]);
  if (text.includes('year')) return value * 12;
  if (text.includes('month')) return value;
  return 0;
}

// =============================================================================
// MATCHING LOGIC
// =============================================================================

function checkMatchingCriteria(data, criteria) {
  const titleLower = data.title.toLowerCase();
  const buysLower = data.buys.toLowerCase();
  
  let productMatch = true;
  let matchedProduct = 'all';
  
  if (criteria.medicines && criteria.medicines.length > 0) {
    productMatch = criteria.medicines.some(med => {
      const medLower = med.toLowerCase();
      return titleLower.includes(medLower) || buysLower.includes(medLower);
    });
    matchedProduct = criteria.medicines.find(med => {
      const medLower = med.toLowerCase();
      return titleLower.includes(medLower) || buysLower.includes(medLower);
    }) || 'none';
  }
  
  let monthsOldMatch = true;
  if (criteria.monthsBefore > 0) {
    monthsOldMatch = data.monthsOldNumber >= criteria.monthsBefore;
  }
  
  let countryMatch = true;
  let matchedCountry = null;
  
  if (criteria.countries && criteria.countries.length > 0) {
    const countryLower = data.country.toLowerCase();
    countryMatch = criteria.countries.some(country => countryLower.includes(country.toLowerCase()));
    matchedCountry = criteria.countries.find(country => countryLower.includes(country.toLowerCase()));
  }
  
  const verificationMatch = checkVerification(data, criteria);
  
  return {
    medicine: productMatch,
    matchedMedicine: matchedProduct,
    monthsOld: monthsOldMatch,
    monthsNum: data.monthsOldNumber,
    country: countryMatch,
    matchedCountry: matchedCountry,
    verification: verificationMatch
  };
}

function checkVerification(data, criteria) {
  const details = {};
  let passed = true;
  
  if (criteria.verifyEmail) {
    const hasEmail = data.verifiedEmail && data.verifiedEmail.trim().length > 0;
    details.email = hasEmail;
    if (!hasEmail) passed = false;
  }
  
  if (criteria.verifyMobile) {
    const hasPhone = data.verifiedPhone && data.verifiedPhone.trim().length > 0;
    details.mobile = hasPhone;
    if (!hasPhone) passed = false;
  }
  
  return { passed, details };
}

function handleMatchResult(listing, contactBtn, data, matched, matchResults, criteria, engaged, productId) {
  const isTestMode = criteria.testMode !== false;
  
  if (matched && contactBtn && !engaged) {
    if (isTestMode) {
      console.log(`%c  🧪 TEST: Would contact`, 'background: #f39c12; color: white; padding: 2px;');
      highlightElement(listing, true);
      showNotification('🧪 Match (Test)', data.title.substring(0, 30) + '...');
    } else {
      console.log(`%c  🔴 LIVE: Contacting...`, 'background: #e74c3c; color: white; padding: 2px;');
      highlightElement(listing, true);
      showNotification('🎯 Contacting!', data.title.substring(0, 30) + '...');
      
      setTimeout(() => {
        contactBtn.click();
        markAsContacted(productId);
        console.log(`%c  ✅ Contacted`, 'color: #2ecc71;');
      }, 500);
    }
  } else {
    highlightElement(listing, false);
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function createProductId(title, buyer, memberSince) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanBuyer = buyer.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanMember = memberSince.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}_${cleanBuyer}_${cleanMember}`.substring(0, 100);
}

function markAsContacted(productId) {
  try {
    chrome.storage.local.get(['contactedProducts', 'productLogs'], (result) => {
      if (chrome.runtime.lastError) return;
      
      const contactedProducts = result.contactedProducts || {};
      const productLogs = result.productLogs || {};
      
      contactedProducts[productId] = {
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
      
      if (productLogs[productId]) {
        productLogs[productId].engaged = 'Just contacted';
        productLogs[productId].alreadyContacted = true;
        productLogs[productId].contacted = true;
      }
      
      chrome.storage.local.set({ contactedProducts, productLogs });
    });
  } catch (error) {}
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

function showNotification(title, message) {
  if (typeof window.showSidebarNotification === 'function') {
    window.showSidebarNotification(title, message);
  } else {
    console.log(`%c${title}: ${message}`, 'color: #667eea; font-weight: bold;');
  }
}