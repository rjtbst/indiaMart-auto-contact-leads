// =============================================================================
// CONTENT.JS - FIXED DOM LOADING + NOTIFICATIONS
// =============================================================================

let isScanning = false;
let scanCount = 0;
let totalContacted = 0;
let lastRefreshTime = 0;
let domRetryCount = 0;
const MAX_DOM_RETRIES = 10; // Try 10 times before giving up

console.log("IndiaMART ULTRA-FAST - Fixed DOM + Notifications");

// =============================================================================
// INITIALIZATION
// =============================================================================

chrome.storage.local.get(["isRunning", "scanCount", "totalContacted"], (result) => {
  if (result.scanCount) {
    scanCount = result.scanCount;
  }
  
  if (result.totalContacted) {
    totalContacted = result.totalContacted;
  }
  
  if (result.isRunning) {
    setTimeout(startScanning, 500);
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "start") startScanning();
  else if (request.action === "stop") stopScanning();
  else if (request.action === "ping") return true;
});

// =============================================================================
// NOTIFICATION SYSTEM
// =============================================================================

function showNotification(title, message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'match' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                 type === 'contacted' ? 'linear-gradient(135deg, #9b59b6, #8e44ad)' : 
                 'linear-gradient(135deg, #3498db, #2980b9)'};
    color: white;
    padding: 16px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.innerHTML = `
    <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">
      ${type === 'match' ? '✅' : type === 'contacted' ? '🔔' : 'ℹ️'} ${title}
    </div>
    <div style="font-size: 12px; opacity: 0.95;">
      ${message}
    </div>
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
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
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// =============================================================================
// MAIN SCANNING LOOP WITH DOM WAIT
// =============================================================================

function startScanning() {
  if (isScanning) return;

  chrome.storage.local.get(["criteria"], (result) => {
    if (!result.criteria) {
      console.error("❌ No criteria set");
      return;
    }

    isScanning = true;
    domRetryCount = 0;
    const mode = result.criteria.testMode !== false ? "TEST" : "LIVE";
    const refreshInterval = result.criteria.interval !== undefined ? result.criteria.interval : 0;
    
    console.log(`%c⚡ ULTRA-FAST MODE - ${mode}`, "color: #e74c3c; font-weight: bold; font-size: 16px;");
    console.log(`%c⚙️ Refresh Interval: ${refreshInterval}ms`, "color: #3498db; font-weight: bold;");

    // Wait for listing to appear
    waitForListingThenScan(result.criteria);
  });
}

function stopScanning() {
  isScanning = false;
  chrome.storage.local.set({ isRunning: false });
  console.log("⏸️ Stopped");
}

// =============================================================================
// WAIT FOR DOM LISTING - RETRY LOGIC
// =============================================================================

function waitForListingThenScan(criteria) {
  if (!isScanning) return;

  const listing = document.querySelector('.bl_listing > [id*="list1"], .bl_grid.Prd_Enq, [class*="bl_grid"][class*="Prd_Enq"]');

  if (listing) {
    // DOM ready - listing found!
    console.log(`%c✅ DOM Ready - Listing found!`, "color: #2ecc71; font-weight: bold;");
    domRetryCount = 0;
    scanPageNow(criteria, listing);
  } else {
    // No listing yet - retry
    domRetryCount++;
    
    if (domRetryCount > MAX_DOM_RETRIES) {
      console.log(`%c⚠️ DOM not ready after ${MAX_DOM_RETRIES} retries - Force refresh`, "color: #f39c12; font-weight: bold;");
      
      // Save failed scan to history
      saveToHistory({
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
        scanNumber: ++scanCount,
        title: "DOM Load Failed",
        strength: "N/A",
        country: "N/A",
        buyer: "N/A",
        buys: "N/A",
        ageMonths: 0,
        verifiedEmail: "",
        verifiedPhone: "",
        matched: false,
        matchedMedicine: false,
        matchedMedicineName: "N/A",
        matchedAge: false,
        matchedCountry: false,
        countryName: "N/A",
        matchedEmail: false,
        matchedPhone: false,
        contacted: false,
        alreadyContacted: false,
        productId: "dom_failed"
      });
      
      // Force refresh
      domRetryCount = 0;
      refreshNow(criteria.interval || 0);
      return;
    }
    
    console.log(`%c🔄 Waiting for DOM... Retry ${domRetryCount}/${MAX_DOM_RETRIES}`, "color: #3498db;");
    
    // Retry after 200ms
    setTimeout(() => {
      waitForListingThenScan(criteria);
    }, 200);
  }
}

function scanPageNow(criteria, listing) {
  scanCount++;
  const now = Date.now();
  
  // Calculate refresh time
  let refreshTime = 0;
  if (lastRefreshTime > 0) {
    refreshTime = now - lastRefreshTime;
  }

  console.log(`%c⚡ Scan #${scanCount} - Refresh: ${refreshTime}ms`, "color: #e74c3c; font-weight: bold;");

  // Update scan count immediately in storage (NON-BLOCKING)
  chrome.storage.local.set({
    lastScan: now,
    scanCount: scanCount,
    refreshTime: refreshTime,
    totalContacted: totalContacted,
  });

  // Process lead
  processLeadFast(listing, criteria);
}

// =============================================================================
// PROCESS LEAD - EXTRACT → MATCH → SAVE → CLICK → REFRESH
// =============================================================================

async function processLeadFast(listing, criteria) {
  try {
    // STEP 1: EXTRACT DATA
    const title = extractTitle(listing);
    const buys = extractBuys(listing);
    const strength = extractFromTable(listing, "strength");
    const memberSince = extractMemberSince(listing);
    const country = extractCountry(listing);
    const verifications = extractVerifications(listing);
    const contactBtn = listing.querySelector('.btnCBN, .btnCBN1, [class*="btnCBN"], div[onclick*="contactbuyernow"]');

    const data = {
      title: title,
      strength: strength,
      monthsOld: memberSince,
      monthsOldNumber: convertMemberAgeToMonths(memberSince),
      country: country,
      buys: buys,
      buyer: buys,
      verifiedEmail: verifications.email ? "Email Verified" : "",
      verifiedPhone: verifications.phone ? "Phone Verified" : "",
    };

    console.log(`%c📦 ${title.substring(0, 40)}`, "color: #3498db;");

    // STEP 2: CHECK MATCHING CRITERIA
    const matchResults = checkMatch(data, criteria);
    const matched = matchResults.medicine && matchResults.monthsOld && matchResults.country && matchResults.verification.passed;

    console.log(matched ? `%c✅ MATCH` : `%c❌ NO MATCH`, `color: ${matched ? "#2ecc71" : "#e74c3c"}; font-weight: bold;`);

    // STEP 3: CHECK IF ALREADY CONTACTED
    const productId = createProductId(data.title, data.buyer, data.monthsOld);
    
    const storageData = await new Promise((resolve) => {
      chrome.storage.local.get(["contactedProducts"], resolve);
    });
    
    const alreadyContacted = storageData.contactedProducts && storageData.contactedProducts[productId];
    const buttonEngaged = contactBtn && (contactBtn.disabled || contactBtn.textContent.toLowerCase().includes("contacted"));

    // STEP 4: CREATE PRODUCT DATA
    const productData = {
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      scanNumber: scanCount,
      title: data.title || "N/A",
      strength: data.strength || "N/A",
      country: data.country || "N/A",
      buyer: data.buyer || "N/A",
      buys: data.buys || "N/A",
      ageMonths: data.monthsOldNumber,
      verifiedEmail: data.verifiedEmail || "",
      verifiedPhone: data.verifiedPhone || "",
      matched: matched,
      matchedMedicine: matchResults.medicine,
      matchedMedicineName: matchResults.matchedMedicine || "N/A",
      matchedAge: matchResults.monthsOld,
      matchedCountry: matchResults.country,
      countryName: data.country || "N/A",
      matchedEmail: matchResults.verification.details.email !== undefined ? matchResults.verification.details.email : true,
      matchedPhone: matchResults.verification.details.mobile !== undefined ? matchResults.verification.details.mobile : true,
      contacted: false,
      alreadyContacted: alreadyContacted || buttonEngaged,
      productId: productId,
    };

    // STEP 5: SAVE TO HISTORY
    await saveToHistory(productData);
    console.log("%c💾 Saved to History", "color: #3498db;");

    // STEP 6: SHOW NOTIFICATION IF MATCHED
    if (matched && !alreadyContacted && !buttonEngaged) {
      const matchedMed = matchResults.matchedMedicine || "Product";
      showNotification(
        '✅ MATCH FOUND!',
        `${matchedMed} - ${data.country}\n${data.buyer}`,
        'match'
      );
    }

    // STEP 7: CLICK IF MATCHED (LIVE MODE ONLY)
    let clicked = false;
    if (matched && !alreadyContacted && !buttonEngaged && contactBtn) {
      const isTestMode = criteria.testMode !== false;
      
      if (isTestMode) {
        console.log("%c🧪 TEST MODE - NOT CLICKING", "background: #f39c12; color: white; padding: 2px 6px;");
      } else {
        console.log("%c🔴 LIVE MODE - CLICKING!", "background: #e74c3c; color: white; padding: 2px 6px; font-weight: bold;");
        
        try {
          contactBtn.click();
          console.log("%c✅ CLICKED!", "color: #2ecc71; font-weight: bold;");
          
          // Increment total contacted
          totalContacted++;
          
          // Mark as contacted
          await markContactedNow(productId, productData);
          clicked = true;
          
          // Show contacted notification
          showNotification(
            '🔔 CONTACTED!',
            `${data.title.substring(0, 40)}\nTotal: ${totalContacted}`,
            'contacted'
          );
        } catch (error) {
          console.error("❌ Click error:", error);
        }
      }
    } else {
      if (alreadyContacted || buttonEngaged) {
        console.log("%c⭐️ Already contacted", "color: #95a5a6;");
      }
      if (!contactBtn) {
        console.log("%c⚠️ No button", "color: #f39c12;");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }

  // STEP 8: REFRESH WITH INTERVAL
  refreshNow(criteria.interval || 0);
}

// =============================================================================
// SAVE FUNCTIONS - HISTORY TRACKING
// =============================================================================

function saveToHistory(productData) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['productHistory'], (result) => {
      const productHistory = result.productHistory || [];
      
      productHistory.push(productData);
      
      if (productHistory.length > 100) {
        productHistory.shift();
      }
      
      chrome.storage.local.set({ 
        productHistory: productHistory,
        currentProduct: productData
      }, () => {
        console.log(`%c📊 History size: ${productHistory.length}`, "color: #9b59b6;");
        resolve();
      });
    });
  });
}

function markContactedNow(productId, productData) {
  return new Promise((resolve) => {
    chrome.storage.local.get(["contactedProducts", "productHistory"], (result) => {
      const contactedProducts = result.contactedProducts || {};
      const productHistory = result.productHistory || [];

      contactedProducts[productId] = {
        timestamp: Date.now(),
        date: new Date().toISOString(),
      };

      const updatedHistory = productHistory.map(p => 
        p.productId === productId ? { ...p, contacted: true } : p
      );

      productData.contacted = true;

      chrome.storage.local.set({ 
        contactedProducts, 
        productHistory: updatedHistory,
        currentProduct: productData,
        totalContacted: totalContacted
      }, resolve);
    });
  });
}

// =============================================================================
// REFRESH - RESPECTS INTERVAL
// =============================================================================

function refreshNow(intervalMs) {
  if (!isScanning) return;

  lastRefreshTime = Date.now();

  if (intervalMs === 0) {
    console.log("%c🔄 INSTANT REFRESH!", "color: #e74c3c; font-weight: bold;");
    location.reload();
  } else {
    console.log(`%c🔄 Refresh in ${intervalMs}ms`, "color: #3498db;");
    setTimeout(() => {
      location.reload();
    }, intervalMs);
  }
}

// =============================================================================
// EXTRACTION FUNCTIONS
// =============================================================================

function extractTitle(listing) {
  const h2 = listing.querySelector(".lstNwLftCnt h2, .lstNwLft h2, h2");
  return h2 ? h2.textContent.trim() : "";
}

function extractFromTable(listing, label) {
  const rows = listing.querySelectorAll("table tbody tr");
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 2 && cells[0].textContent.toLowerCase().includes(label.toLowerCase())) {
      const boldValue = cells[1].querySelector("b");
      return boldValue ? boldValue.textContent.trim() : cells[1].textContent.replace(":", "").trim();
    }
  }
  return "";
}

function extractMemberSince(listing) {
  const element = listing.querySelector(".lstNwRgtBD .SLC_f13, .SLC_f13");
  if (element) {
    const text = element.textContent.trim();
    if (text.toLowerCase().includes("member since")) return text.replace(/-/g, "").trim();
  }
  return "";
}

function extractVerifications(listing) {
  const verifications = { email: false, phone: false };
  const tooltips = listing.querySelectorAll('.lstNwRgtBD .tooltip_vfr, .tooltip_vfr, [class*="tooltip"]');
  
  for (const tooltip of tooltips) {
    const text = tooltip.textContent.toLowerCase();
    if (text.includes("email")) verifications.email = true;
    if (text.includes("mobile") || text.includes("phone")) verifications.phone = true;
  }
  
  return verifications;
}

function extractCountry(listing) {
  const element = listing.querySelector('.coutry_click, .country_click, [class*="coutry"]');
  return element ? element.textContent.trim().split("Click here")[0].trim() : "";
}

function extractBuys(listing) {
  const buysDivs = listing.querySelectorAll(".lstNwRgtBD .lstNwDflx");
  for (const div of buysDivs) {
    const alignmentP = div.querySelector(".alignment");
    if (alignmentP && alignmentP.textContent.trim().toLowerCase() === "buys") {
      const boldElement = div.querySelector("b");
      if (boldElement) return boldElement.textContent.trim();
    }
  }
  return "";
}

function convertMemberAgeToMonths(memberText) {
  const text = memberText.toLowerCase();
  const numberMatch = text.match(/(\d+)\+?/);
  if (!numberMatch) return 0;
  const value = parseInt(numberMatch[1]);
  if (text.includes("year")) return value * 12;
  if (text.includes("month")) return value;
  return 0;
}

// =============================================================================
// MATCHING CRITERIA
// =============================================================================

function checkMatch(data, criteria) {
  const titleLower = data.title.toLowerCase();
  const buysLower = data.buys.toLowerCase();

  let productMatch = true;
  let matchedProduct = "all";
  if (criteria.medicines && criteria.medicines.length > 0) {
    productMatch = criteria.medicines.some((med) => {
      const medLower = med.toLowerCase();
      return titleLower.includes(medLower) || buysLower.includes(medLower);
    });
    matchedProduct = criteria.medicines.find((med) => {
      const medLower = med.toLowerCase();
      return titleLower.includes(medLower) || buysLower.includes(medLower);
    }) || "none";
  }

  let ageMatch = criteria.monthsBefore > 0 ? data.monthsOldNumber >= criteria.monthsBefore : true;

  let countryMatch = true;
  let matchedCountry = null;
  if (criteria.countries && criteria.countries.length > 0) {
    const countryLower = data.country.toLowerCase();
    countryMatch = criteria.countries.some((country) => countryLower.includes(country.toLowerCase()));
    matchedCountry = criteria.countries.find((country) => countryLower.includes(country.toLowerCase()));
  }

  const verificationMatch = checkVerification(data, criteria);

  return {
    medicine: productMatch,
    matchedMedicine: matchedProduct,
    monthsOld: ageMatch,
    country: countryMatch,
    matchedCountry: matchedCountry,
    verification: verificationMatch,
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

// =============================================================================
// UTILITY
// =============================================================================

function createProductId(title, buyer, memberSince) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanBuyer = buyer.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanMember = memberSince.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanTitle}_${cleanBuyer}_${cleanMember}`.substring(0, 100);
}