# 📊 IndiaMArt Auto Contact Extension

A powerful Chrome extension for IndiaMArt sellers to automatically scan, filter, and contact potential buyers based on customizable criteria - **runs continuously in the background** even when you're browsing other tabs.

---

## 🎯 Key Features

- ✅ **Smart Filtering**: Filter products by medicine names, quantity, country, and posting date
- 🔄 **Background Scanning**: Runs continuously in background tab - browse YouTube while it works!
- 🧪 **Test Mode**: Verify filtering logic before enabling auto-contact
- 📊 **Real-time Dashboard**: Live sidebar showing scanned products and statistics
- 🚫 **Duplicate Prevention**: Tracks contacted products to prevent re-contacting (30-day memory)
- 📥 **CSV Export**: Export all scanning logs for analysis
- ⚡ **Customizable Intervals**: Scan every few seconds, minutes, or longer
- 💾 **Persistent Memory**: Remembers everything - criteria, logs, contacted products
- 🔄 **Auto-Resume**: Automatically resumes scanning after Chrome restart

---

## 📦 Installation

### Method 1: Load Unpacked (Development)

1. **Download/Clone** this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle switch in top right corner)
4. Click **"Load unpacked"** button
5. Select the extension folder containing all files
6. The extension icon (📊) should appear in your Chrome toolbar

### Method 2: Chrome Web Store (When Published)

*Coming soon - will be available for one-click installation*

### ✅ Verify Installation

After installation, you should see:
- Extension icon in toolbar
- No errors in `chrome://extensions/`
- Click the icon to see the popup interface

---

## 🚀 Quick Start Guide

### Step 1: Configure Your Criteria

1. **Click the extension icon** (📊) in your Chrome toolbar
2. **Fill in your filtering criteria**:

   **🎯 Filters Section:**
   - **Medicines**: Enter comma-separated medicine names
     - Example: `Ivermectin, Azithromycin, Pregabalin, Doxycycline`
     - Case insensitive (will match "ivermectin" or "IVERMECTIN")
   
   - **Minimum Quantity**: Set threshold (default: 2)
     - Only contacts products with quantity > this number
     - Example: Set to `5` to only contact bulk orders
   
   - **Posted Within**: Select timeframe (default: Last 3 months)
     - Options: 1, 2, 3, 6, 12, 24 months, or "Any time"
     - Filters out old/stale listings
   
   - **Country Filter**: Optional - specify countries
     - Leave empty to contact from all countries
     - Example: `India, USA, UK, Canada`
     - Comma-separated, case insensitive

   **✅ Verification Section:**
   - ☑️ **Email**: Require email verification (default: checked)
   - ☑️ **Mobile**: Require mobile verification (default: checked)
   - ☐ **WhatsApp**: Require WhatsApp verification (default: unchecked)

   **⏱️ Timing Section:**
   - **Scan Interval**: How often to rescan the page
     - Fast: 1-5 seconds (high activity)
     - Moderate: 10-30 seconds (balanced)
     - Slow: 1-5 minutes (background monitoring)
   
   **🧪 Test Mode:**
   - ☑️ **Keep this CHECKED for first run** (default: checked)
   - Logs everything but doesn't click buttons
   - Uncheck only after verifying it works correctly

3. **Click "💾 Save Criteria"**
4. You'll see a confirmation with your settings

### Step 2: Navigate to IndiaMArt

1. **Open a new tab** and go to IndiaMArt
2. Navigate to **any page with product listings** (buy leads, search results, etc.)
3. **A sidebar will automatically appear** on the right side of the page

### Step 3: Start Scanning

1. In the **sidebar**, click the **"▶ Start"** button
2. **You'll see**:
   - Status changes to "Running" (green dot)
   - Mode badge shows "🧪 Test Mode" or "🔴 Live Mode"
   - Statistics start updating (Scans, Matches, Contacted)
   - Product table fills with scanned items

### Step 4: Monitor Results

**Option A - Sidebar View (Visual):**
- Watch the **Product Details table** in the sidebar
- Color-coded rows:
  - 🟢 **Green**: Matched all criteria
  - 🔴 **Red**: Did not match criteria
  - 🟣 **Purple**: Successfully contacted
  - 🟡 **Orange**: Would contact (test mode only)

**Option B - Console Logs (Detailed):**
1. Press `F12` or `Ctrl+Shift+I` to open DevTools
2. Go to the **Console** tab
3. You'll see detailed logs for each product:
   ```
   ━━━ Listing #1 ━━━
   📋 Scraped Data:
     Title: "Ivermectin Tablets Bulk Order"
     Country: "India"
     Quantity: "500"
     Buyer: "ABC Pharma Ltd"
     Product ID: "ivermectintabletsbulkorder_abcpharmaltd"
   
   🔍 Matching Criteria:
     Medicine: ✓ (matched: "ivermectin")
     Quantity: ✓ (500 > 2)
     Country: ✓ (matched: "india")
     Date: ✓ (2 months ago)
     Verification: ✓ (email:✓, mobile:✓)
   
   🎯 FULL MATCH!
   🧪 TEST MODE: Would click contact button (not clicking)
   ```

### Step 5: Switch Tabs (Optional)

**Here's the magic**: 
- You can **switch to YouTube, email, or any other tab**
- The extension **continues scanning in the background**
- **Come back anytime** to check the sidebar for results

### Step 6: Go Live (When Ready)

After verifying everything works in test mode:

1. **Click the extension icon** again
2. **Uncheck** "🧪 Test Mode - Only Logging"
3. **Read the warning**: "⚠️ Verify scraping before enabling auto-click"
4. **Click "💾 Save Criteria"**
5. The extension will now **automatically click contact buttons** on matching products
6. Watch the sidebar - contacted products turn **purple** with "Contacted" badge

---

## 🔄 How Background Scanning Works

### ✅ What Stays Active

As long as **Chrome is running** and the **IndiaMArt tab is open** (anywhere):

```
✅ Scanning continues every X seconds (your interval)
✅ New products are detected automatically
✅ Matching logic runs in background
✅ Contact buttons get clicked (in live mode)
✅ Logs are saved continuously
✅ Statistics update in real-time
✅ Duplicate tracking prevents re-contacting
```

**You can**:
- ✅ Switch to YouTube and watch videos
- ✅ Browse other websites in different tabs
- ✅ Minimize Chrome window
- ✅ Work in other applications
- ✅ Switch between multiple Chrome windows

**The IndiaMArt tab continues working silently in the background!**

### 🔄 Auto-Resume Feature

The extension is **smart about persistence**:

1. **Started scanning → Closed Chrome**
   - Next time you open Chrome and visit IndiaMArt
   - Extension **automatically resumes** scanning after 1.5 seconds
   - Uses your saved criteria
   - Remembers which products were already contacted

2. **Started scanning → Closed IndiaMArt tab**
   - Scanning stops (nothing to scan)
   - **Open a new IndiaMArt tab**
   - Extension **auto-resumes** within 1.5 seconds

3. **Stopped scanning → Closed Chrome**
   - Stays stopped
   - Manual start required next time

### ❌ What Stops Scanning

| Action | Scanning Stops? | Auto-Resume? |
|--------|----------------|--------------|
| Switch to another tab | ❌ No - keeps running | N/A - never stopped |
| Minimize Chrome | ❌ No - keeps running | N/A - never stopped |
| Close IndiaMArt tab | ✅ Yes | ✅ Yes (when you open new IndiaMArt tab) |
| Close Chrome completely | ✅ Yes | ✅ Yes (if it was running before) |
| Click "Stop" button | ✅ Yes | ❌ No (manual restart) |
| Computer restart | ✅ Yes | ✅ Yes (if it was running before) |
| Extension disabled | ✅ Yes | ❌ No |

---

## 🧠 Understanding the Filtering Logic

### How Matching Works

A product must pass **ALL** these checks to trigger contact:

```javascript
1. Medicine Match
   ✓ Product title contains at least one medicine from your list
   → Case insensitive: "Ivermectin" matches "ivermectin", "IVERMECTIN"

2. Quantity Check
   ✓ Extracted quantity > your minimum threshold
   → Extracts first number found in quantity field
   → Example: "500 units" → extracts 500

3. Country Check
   ✓ If you specified countries: product country must match
   ✓ If you left empty: all countries pass
   → Case insensitive matching

4. Date Check
   ✓ Product posted within your specified timeframe
   → Handles formats: "2 months ago", "Jan 15, 2024", etc.
   → If date can't be parsed: assumes valid (gives benefit of doubt)

5. Verification Check
   ✓ Product must have ALL required verifications
   → If you checked "Email": must show email verification
   → If you checked "Mobile": must show mobile verification
   → If you checked "WhatsApp": must show WhatsApp verification

6. Duplicate Check
   ✓ Product must NOT have been contacted before
   → Creates unique ID from title + buyer name
   → Tracked for 30 days in Chrome storage
```

### Example Scenarios

**Scenario 1 - Perfect Match:**
```
Product: "Ivermectin 500mg Tablets - Bulk Order"
Country: "India"
Quantity: "1000 units"
Posted: "1 month ago"
Verification: Email ✓, Mobile ✓

Your Criteria:
Medicines: ivermectin, azithromycin
Min Quantity: 2
Countries: India, USA
Posted Within: 3 months
Verify: Email ✓, Mobile ✓

Result: ✅ MATCH → Will contact (if live mode)
```

**Scenario 2 - Quantity Too Low:**
```
Product: "Ivermectin 100mg Tablets"
Quantity: "1 unit"
(Other criteria match)

Your Criteria:
Min Quantity: 2

Result: ❌ NO MATCH → Will skip
Reason: Quantity (1) ≤ threshold (2)
```

**Scenario 3 - Already Contacted:**
```
Product: "Ivermectin Bulk Order" by "ABC Pharma"
(All criteria match)

But: Contacted this exact product 5 days ago

Result: ⏭️ SKIP → Already contacted
```

---

## 🎛️ Sidebar Dashboard Guide

### Status Section

**Status Indicator:**
- 🔴 **Stopped** (red dot pulsing) - Not scanning
- 🟢 **Running** (green dot pulsing) - Actively scanning

**Mode Badge:**
- 🧪 **Test Mode** (orange gradient) - Logging only, safe
- 🔴 **Live Mode** (red gradient, blinking) - Auto-clicking enabled

### Control Buttons

- **▶ Start** (green) - Begin/resume scanning
- **⏸ Stop** (red) - Pause scanning

### Statistics Display

- **Scans**: Total number of page scans completed
  - Updates every time the page is re-scanned
  - Example: Scan interval of 30s → increments every 30s

- **Matches**: Products that met ALL criteria
  - Green highlighted products
  - Count of potential contacts

- **Contacted**: Products where contact button was clicked
  - Only increments in **Live Mode**
  - Purple highlighted products

### Product Details Table

**Columns:**
- **Time**: When product was scanned
- **Title**: Product name (truncated, hover to see full)
- **Country**: Buyer location
- **Qty**: Quantity extracted
- **Posted**: How many months ago
- **Status**: Visual badge showing outcome

**Row Colors:**
- 🟢 **Green** - Matched all criteria
  - Badge: "Match" (test mode) or "Would Contact" (test mode)
- 🟣 **Purple** - Successfully contacted
  - Badge: "Contacted"
  - Bold text, stands out
- 🔴 **Red** - Did not match criteria
  - Badge: "No Match"

**Table Features:**
- Shows last **50 products** (newest first)
- Scrollable with custom scrollbar
- Sticky header (stays visible while scrolling)
- Auto-updates every 500ms

### Toggle Sidebar

- Click the **◀** button in header to collapse/expand
- Collapsed: Only shows toggle button on right edge
- Useful when you need more screen space

---

## 📥 Exporting Your Data

### Export to CSV

1. **Click the extension icon** (📊)
2. **Click "📥 Export CSV"** button
3. **Save the file** (`indiamart_logs.csv`)
4. **Open in**:
   - Microsoft Excel
   - Google Sheets
   - LibreOffice Calc
   - Any CSV viewer

### CSV Contents

The exported file includes:

| Column | Description | Example |
|--------|-------------|---------|
| Time | When scanned | "2:30:45 PM" |
| Title | Product name | "Ivermectin Tablets Bulk" |
| Country | Buyer location | "India" |
| Posted Date | Original date text | "2 months ago" |
| Months Ago | Calculated months | "2" |
| Quantity | Extracted quantity | "500 units" |
| Buyer | Company/person name | "ABC Pharma Ltd" |
| Available | Verification text | "Email, Mobile verified" |
| Engaged | Contact status | "Just contacted" |
| Matched | Match status | "YES" or "NO" |

### Use Cases for CSV Data

- 📊 **Analyze patterns**: Which products get contacted most
- 📈 **Track performance**: Conversion rates over time
- 🔍 **Audit scanning**: Verify the extension worked correctly
- 📝 **Manual follow-up**: Review contacted companies
- 📅 **Historical record**: Keep permanent logs

---

## 🔧 Customizing CSS Selectors

**Why would you need this?**

IndiaMArt may update their website design, changing HTML class names. If the extension stops detecting products, you'll need to update the CSS selectors.

### 🔍 How to Find the Correct Selectors

**Step 1: Inspect the Page**

1. Open IndiaMArt with product listings
2. **Right-click** on a product card → **Inspect** (or press `F12`)
3. Chrome DevTools opens with HTML highlighted

**Step 2: Identify the Structure**

Look for the **main container** of each product listing:

```html
<!-- Example IndiaMArt structure (hypothetical) -->
<div class="buyLeadCard">           ← Main product container
  <h3 class="leadTitle">Product</h3>      ← Title
  <span class="leadLocation">India</span> ← Country
  <span class="leadQty">500 units</span>  ← Quantity
  <button class="contactBtn">Contact</button> ← Contact button
</div>
```

**Step 3: Test Selectors in Console**

In DevTools Console tab, test if your selector works:

```javascript
// Test main container
document.querySelectorAll('.buyLeadCard')
// Should return: NodeList of all product cards

// Test title
document.querySelector('.buyLeadCard .leadTitle').textContent
// Should return: Product title text
```

### 📝 Updating Selectors in Code

Open `content.js` in your extension folder and update these lines:

**Line ~90 - Main Product Listings Container:**

```javascript
// CURRENT (generic fallback):
const listings = document.querySelectorAll(
  '[class*="listing"], [class*="product"], [data-type="listing"], .prd, .bl_item'
);

// UPDATE TO (if IndiaMArt uses .buyLeadCard):
const listings = document.querySelectorAll(
  '.buyLeadCard, .leadCard, [class*="listing"]'
);
```

**Lines ~111-116 - Data Extraction Selectors:**

Update the `extractText()` calls in the `scrapedData` object:

```javascript
// CURRENT:
const scrapedData = {
  title: extractText(listing, '[class*="title"], h2, h3, .prd-name, [class*="name"]'),
  country: extractText(listing, '[class*="country"], [class*="location"], [class*="place"]'),
  quantity: extractText(listing, '[class*="quantity"], [class*="qty"], [class*="amount"]'),
  buyer: extractText(listing, '[class*="buyer"], [class*="company"], [class*="seller"]'),
  available: extractText(listing, '[class*="available"], [class*="verification"], [class*="verified"]'),
  postedDate: extractText(listing, '[class*="date"], [class*="time"], [class*="posted"], .dt, time')
};

// UPDATE TO (example with correct classes):
const scrapedData = {
  title: extractText(listing, '.leadTitle, h3, [class*="title"]'),
  country: extractText(listing, '.leadLocation, [class*="country"]'),
  quantity: extractText(listing, '.leadQty, [class*="quantity"]'),
  buyer: extractText(listing, '.companyName, [class*="company"]'),
  available: extractText(listing, '.verificationBadge, [class*="verified"]'),
  postedDate: extractText(listing, '.postDate, time, [class*="date"]')
};
```

**Line ~144 - Contact Button:**

```javascript
// CURRENT:
const contactBtn = listing.querySelector(
  '[class*="contact"], button[class*="btn"], [class*="enquiry"], button'
);

// UPDATE TO (example):
const contactBtn = listing.querySelector(
  '.contactBtn, .enquiryBtn, button[class*="contact"]'
);
```

### 📋 Selector Reference Table

| Data Point | File | Line # | Current Selector | What to Look For |
|------------|------|--------|------------------|------------------|
| Product Container | content.js | ~90 | `[class*="listing"], .prd` | Main div wrapping each product |
| Product Title | content.js | ~111 | `[class*="title"], h2, h3` | Heading with product name |
| Country/Location | content.js | ~112 | `[class*="country"], [class*="location"]` | Span/div with location text |
| Quantity | content.js | ~113 | `[class*="quantity"], [class*="qty"]` | Text showing amount/units |
| Buyer/Company | content.js | ~114 | `[class*="buyer"], [class*="company"]` | Company or person name |
| Verification | content.js | ~115 | `[class*="available"], [class*="verification"]` | Email/Mobile/WhatsApp badges |
| Posted Date | content.js | ~116 | `[class*="date"], [class*="posted"]` | Date/time element |
| Contact Button | content.js | ~144 | `[class*="contact"], button` | Clickable contact/enquiry button |

### ✅ After Updating

1. **Reload the extension**: 
   - Go to `chrome://extensions/`
   - Click the refresh icon on your extension
2. **Refresh the IndiaMArt page**
3. **Check Console** (F12) for "Found X listings to process"
4. **Verify sidebar** shows products in the table

---

## 🐛 Troubleshooting Guide

### ❌ "No listings found on this page"

**Problem**: Console shows "No listings found" but you can see products

**Solutions**:

1. **Update selectors** (see [Customizing Selectors](#customizing-css-selectors))
2. **Check if you're on the right page**:
   - Extension works on buy leads / product listing pages
   - May not work on homepage or company profiles
3. **Refresh the page** after updating selectors
4. **Test in Console**:
   ```javascript
   document.querySelectorAll('[class*="listing"]').length
   // Should return number > 0
   ```

### 🔇 Sidebar Not Appearing

**Problem**: No sidebar visible on IndiaMArt pages

**Solutions**:

1. **Refresh the page** (`Ctrl+R` or `F5`)
2. **Check URL**: Make sure you're on `*.indiamart.com`
3. **Check extension is enabled**: `chrome://extensions/` → Extension should be ON
4. **Reload extension**:
   - `chrome://extensions/`
   - Click refresh icon on extension card
   - Refresh IndiaMArt page
5. **Check Console for errors**: Press `F12` → Console tab
6. **Verify `sidebar.js` loaded**: Console should show "IndiaMArt Auto Contact Content Script Loaded"

### 🧪 Test Mode Not Clicking (Expected Behavior)

**Problem**: Says "Would click contact button" but nothing happens

**Solution**: **This is correct!** Test mode is designed to NOT click buttons.

- Test mode **only logs** what would happen
- To enable clicking: **Uncheck** "Test Mode" in popup → Save
- Mode badge will change to 🔴 **Live Mode**

### 🔄 Extension Not Auto-Resuming

**Problem**: Closed Chrome, reopened, but scanning didn't auto-resume

**Check**:

1. **Was scanning running** when you closed Chrome?
   - If you clicked "Stop" before closing, it won't auto-resume
2. **Did you open an IndiaMArt page**?
   - Extension only resumes on IndiaMArt pages
3. **Wait 1.5 seconds** after page loads
   - Auto-resume has a built-in delay
4. **Check storage**:
   ```javascript
   // In Console:
   chrome.storage.local.get(['isRunning'], console.log)
   // Should show: {isRunning: true}
   ```

### 🔁 Already Contacted Products Still Showing

**Problem**: Products marked as "Already contacted" appear again

**Understanding**:

- Extension **does skip** already contacted products (check console logs)
- They **appear in table** for history/record keeping
- They show "⏭ SKIPPED - Already contacted" in console

**If truly being re-contacted**:

1. **Check button state**: Extension checks if button is disabled
2. **Clear contacted history**:
   - Extension popup → "🗑️ Clear Logs"
   - This resets the 30-day tracking
3. **Verify Product ID** in console - should be identical for same product

### 📊 Statistics Not Updating

**Problem**: Scan count / match count frozen

**Solutions**:

1. **Check if scanning is running**: Status should show "Running" with green dot
2. **Refresh the sidebar**: Toggle collapse/expand
3. **Reload the page**: Sometimes helps reset state
4. **Check Console for errors**: May show JavaScript errors blocking updates

### 🚫 Buttons Being Clicked When Shouldn't

**Problem**: Extension clicking buttons that don't match criteria

**Debug Steps**:

1. **Enable Test Mode** immediately
2. **Check Console logs** for that specific product:
   - Look for "FULL MATCH!" or "NO MATCH"
   - Review each criterion: Medicine, Quantity, Country, etc.
3. **Verify your criteria**:
   - Extension popup → review all settings
   - Check for typos in medicine names
4. **Check for false positives**:
   - Medicine name too generic? (e.g., "tab" matches "tablets")
   - Use more specific names

### 💾 Data Loss After Chrome Restart

**Problem**: Logs/criteria disappeared after restarting Chrome

**This shouldn't happen**. If it does:

1. **Check if extension was disabled**:
   - `chrome://extensions/` → Make sure extension is ON
2. **Check Chrome's storage isn't cleared**:
   - Settings → Privacy → Clear browsing data
   - Make sure "Site settings" isn't cleared
3. **Reinstall extension** if persistent
4. **Export CSV regularly** as backup

### 🐌 Extension Running Slow / Page Lagging

**Problem**: IndiaMArt page becomes slow or unresponsive

**Solutions**:

1. **Increase scan interval**:
   - Extension popup → Set to 30s or 1m instead of 5s
   - Reduces CPU usage
2. **Clear old logs**:
   - Extension popup → "🗑️ Clear Logs"
   - Keeps only fresh data
3. **Check listings count**:
   - If page has 100+ products, processing takes time
   - Consider filtering at source (use IndiaMArt's own filters)
4. **Close other tabs**: Free up browser resources

---

## ⚙️ Configuration Reference

### Complete Settings Breakdown

#### 🎯 Medicines Field

- **Type**: Text input (comma-separated)
- **Default**: Empty
- **Format**: `Medicine1, Medicine2, Medicine3`
- **Case**: Insensitive (IVERmectin = ivermectin)
- **Matching**: Partial match (Ivermectin matches "Ivermectin Tablets 500mg")
- **Examples**:
  - `Ivermectin` - matches any product with "ivermectin" in title
  - `Ivermectin, Azithromycin, Doxycycline` - matches ANY of these
  - Empty = matches all products (not recommended)

#### 📊 Minimum Quantity

- **Type**: Number input
- **Default**: 2
- **Range**: 1 to unlimited
- **Logic**: Product quantity must be **greater than** this value (not equal)
- **Extraction**: Takes first number found in quantity field
- **Examples**:
  - Set to `5` → "10 units" passes ✓, "3 units" fails ✗
  - "500-1000 units" → extracts 500

#### 📅 Posted Within

- **Type**: Dropdown select
- **Default**: Last 3 months
- **Options**: 1, 2, 3, 6, 12, 24 months, Any time
- **Logic**: Product posted date ≤ selected months ago
- **Handles**:
  - "2 months ago" format
  - "Jan 15, 2024" format
  - "15-01-2024" format
- **Unknown dates**: Treated as valid (benefit of doubt)

#### 🌍 Country Filter

- **Type**: Text input (comma-separated)
- **Default**: Empty (all countries)
- **Format**: `India, USA, UK`
- **Case**: Insensitive
- **Matching**: Partial (India matches "India" or "Indian")
- **Empty behavior**: Accepts ALL countries

#### ✅ Verification Checkboxes

- **Email Verified**: Checks if "email" appears in verification text
- **Mobile Verified**: Checks if "mobile" or "phone" appears
- **WhatsApp Verified**: Checks if "whatsapp" or "wa" appears
- **Logic**: ALL checked boxes must pass
- **Example**: If Email ✓ and Mobile ✓ are checked, product must have BOTH

#### ⏱️ Scan Interval

- **Type**: Number + Unit selector
- **Units**: Milliseconds (ms), Seconds (s), Minutes (m)
- **Default**: 5 seconds
- **Range**: 1ms to unlimited
- **Recommendations**:
  - **Fast** (1-5s): High activity, CPU intensive
  - **Moderate** (10-30s): Balanced for most users
  - **Slow** (1-5m): Background monitoring, low CPU
- **How it works**: Page rescans every X time units

#### 🧪 Test Mode

- **Type**: Checkbox
- **Default**: Checked (ON)
- **When ON**: Logs actions but doesn't click buttons
- **When OFF**: Actually clicks contact buttons (LIVE MODE)
- **Recommendation**: Always test with this ON first!

---

## 📂 Extension File Structure

```
indiamart-auto-contact/
│
├── manifest.json              # Extension configuration
│   ├── Name, version, permissions
│   ├── Defines which scripts load where
│   └── Specifies IndiaMArt URL patterns
│
├── background.js              # Service worker (always running)
│   ├── Manages extension state (isRunning, criteria)
│   ├── Handles auto-resume after Chrome restart
│   ├── Monitors tab updates
│   ├── Cleans old contacted products (30-day window)
│   └── Keeps service worker alive
│
├── popup.html                 # Extension popup UI (click icon to see)
│   ├── Form inputs for criteria
│   ├── Save/Export/Clear buttons
│   └── Visual styling
│
├── popup.js                   # Popup logic
│   ├── Load/save criteria from storage
│   ├── Form validation
│   ├── CSV export function
│   └── Clear logs function
│
├── content.js                 # Main scanning engine (runs on IndiaMArt pages)
│   ├── Product detection and scraping
│   ├── Matching logic (filters)
│   ├── Duplicate prevention
│   ├── Contact button clicking
│   ├── Logging and storage
│   └── Auto-resume handling
│
├── sidebar.js                 # Sidebar UI (visible on IndiaMArt)
│   ├── Real-time dashboard
│   ├── Statistics display
│   ├── Product table
│   ├── Start/Stop controls
│   └── Auto-updates every 500ms
│
├── icons/                     # Extension icons
│   ├── icon16.png            # Toolbar icon (small)
│   ├── icon48.png            # Extension management (medium)
│   └── icon128.png           # Chrome Web Store (large)
│
└── README.md                  # This file
```

### How Files Interact

```
User clicks extension icon
    ↓
popup.html opens
    ↓
popup.js loads criteria from Chrome storage
    ↓
User fills form and clicks "Save"
    ↓
popup.js saves to Chrome storage
    ↓
background.js monitors storage changes
    ↓
User opens IndiaMArt page
    ↓
content.js automatically injects
    ↓
sidebar.js creates UI on page
    ↓
User clicks "Start" in sidebar
    ↓
content.js retrieves criteria from storage
    ↓
setInterval() begins scanning loop
    ↓
For each product:
    - Scrape data with CSS selectors
    - Check against criteria
    - Log to storage
    - Click button if match (live mode)
    ↓
sidebar.js reads storage every 500ms
    ↓
Updates dashboard in real-time
    ↓
User can export CSV via popup.js
```

---

## 💾 Data Storage & Privacy

### What Gets Stored (Chrome Local Storage)

```javascript
{
  criteria: {                    // Your filter settings
    medicines: ['ivermectin', 'azithromycin'],
    minQuantity: 2,
    monthsBefore: 3,
    countries: ['india', 'usa'],
    verifyEmail: true,
    verifyMobile: true,
    verifyWhatsapp: false,
    interval: 5000,
    testMode: true
  },
  
  isRunning: true,               // Current scanning state
  
  scanCount: 42,                 // Total scans performed
  
  logs: [                        // Last 500 product scans
    {
      time: "2:30:45 PM",
      timestamp: 1704567045000,
      title: "Ivermectin Tablets",
      country: "India",
      quantity: "500 units",
      buyer: "ABC Pharma",
      matched: true,
      engaged: "Just contacted",
      productId: "ivermectintablets_abcpharma",
      // ... more fields
    },
    // ... up to 500 entries
  ],
  
  contactedProducts: {           // Prevent duplicates (30-day history)
    "ivermectintablets_abcpharma": {
      timestamp: 1704567045000,
      date: "2024-01-06T09:30:45.000Z"
    },
    // ... more products
  },
  
  lastScan: 1704567045000,       // Timestamp of last scan
  nextScan: 1704567050000        // Timestamp of next scheduled scan
}
```

### Storage Limits

- **Chrome Local Storage**: 10 MB per extension
- **Logs**: Capped at 500 entries (auto-deletes oldest)
- **Contacted Products**: Cleaned every 24 hours (removes entries > 30 days old)
- **Criteria**: No limit (typically < 1 KB)

### Privacy Guarantees

✅ **All data stays on your computer**
- No external servers
- No data transmission
- No cloud sync
- No analytics or tracking

✅ **What we DON'T collect**:
- Personal information
- Browsing history (outside IndiaMArt)
- Contact information from products
- Usage statistics

✅ **Data you can delete**:
- Extension popup → "🗑️ Clear Logs" (clears logs + contacted history)
- `chrome://extensions/` → Remove extension (deletes ALL data)

---

## 🔒 Security Considerations

### Permissions Required

The extension requests these Chrome permissions:

```json
{
  "permissions": [
    "storage",          // Save criteria and logs
    "activeTab",        // Access current tab content
    "scripting"         // Inject sidebar on IndiaMArt pages
  ],
  "host_permissions": [
    "*://*.indiamart.com/*"  // Only works on IndiaMArt
  ]
}
```

### What Extension Can Do

✅ **Allowed**:
- Read IndiaMArt page content
- Click buttons on IndiaMArt
- Store data locally
- Inject sidebar UI

❌ **Cannot**:
- Access other websites
- Access your Google account
- Read emails or personal data
- Modify data outside IndiaMArt
- Send data to external servers

### Safe Usage

- ✅ Only download from trusted sources (official repo or Chrome Web Store)
- ✅ Review code before installing (it's open source!)
- ✅ Start with Test Mode to verify behavior
- ✅ Use reasonable scan intervals (avoid 1-2 second intervals for extended periods)

---

## ⚖️ Legal & Ethical Usage

### Terms of Service Compliance

**Important**: You are responsible for ensuring your use of this extension complies with IndiaMArt's Terms of Service.

**Recommendations**:
- ✅ Use **reasonable scan intervals** (30+ seconds)
- ✅ Don't spam contact buttons
- ✅ Respect rate limits
- ✅ Use for legitimate business purposes
- ❌ Don't scrape data for resale
- ❌ Don't harass buyers with repeated contacts

### Best Practices

1. **Start with Test Mode** - Verify filtering works correctly
2. **Use conservative intervals** - 30-60 seconds is reasonable
3. **Monitor results** - Check that you're contacting appropriate leads
4. **Don't run 24/7** - Give the platform (and yourself) breaks
5. **Clear old logs** - Maintain data hygiene
6. **Export data periodically** - Keep offline backups

### Disclaimer

⚠️ **This extension is provided as-is for personal/business use.**

- The developers are **NOT responsible** for:
  - Account suspensions or bans
  - Terms of Service violations
  - Missed business opportunities
  - Data loss or corruption
  - Any damages arising from use

- Users **ARE responsible** for:
  - Complying with IndiaMArt's ToS
  - Using the extension ethically
  - Verifying that automation is permitted on their account
  - Any consequences of misuse

**Use at your own risk.**

---

## 🎓 Tips & Best Practices

### Getting Started

1. **First Week - Test Mode Only**
   - Run in test mode for at least 3-7 days
   - Review console logs daily
   - Verify filtering is accurate
   - Adjust criteria as needed

2. **Monitor Match Quality**
   - Are matched products actually relevant?
   - Too many matches? Tighten criteria (higher quantity, specific countries)
   - Too few matches? Loosen criteria (remove country filter, lower quantity)

3. **Optimize Scan Interval**
   - Fast listings turnover? Use 10-30 seconds
   - Slow listings? Use 1-5 minutes
   - Balance between responsiveness and resource usage

### Advanced Usage

**Multiple Medicine Lists (Workaround)**

Since extension supports one criteria set, you can:
1. Save criteria for Medicine Set A
2. Run scanning for a while
3. Update criteria to Medicine Set B
4. Continue scanning

*Future versions may support profiles*

**Combining with Manual Review**

1. Set **Test Mode ON**
2. Let extension identify matches
3. Review sidebar table
4. Manually click contact buttons for best prospects
5. Extension still prevents duplicates!

**Time-Based Scanning**

1. **Morning** (9 AM - 12 PM): Fast interval (10-20s) - high activity
2. **Afternoon** (12 PM - 5 PM): Moderate (30-60s)
3. **Evening** (5 PM - 9 PM): Slow (2-5m) - background monitoring
4. **Night**: Stop scanning (let the server rest!)

### Troubleshooting Workflow

```
Problem detected
    ↓
Enable Test Mode (if not already)
    ↓
Open Console (F12)
    ↓
Trigger one scan
    ↓
Review logs for that scan:
    - Was product detected? → Check listing selector
    - Was data scraped? → Check field selectors
    - Did it match? → Review criteria logic
    - Should it match? → Adjust criteria
    ↓
Make necessary changes
    ↓
Reload extension
    ↓
Test again
```

---

## 📊 Common Use Cases

### Use Case 1: Bulk Medicine Supplier

**Goal**: Find bulk orders for specific medicines

**Configuration**:
```
Medicines: Ivermectin, Azithromycin, Doxycycline
Min Quantity: 100
Posted Within: 1 month
Countries: (empty - all countries)
Verifications: Email ✓, Mobile ✓
Interval: 30 seconds
Test Mode: OFF (after testing)
```

**Result**: Automatically contacts bulk buyers of these medicines

---

### Use Case 2: Regional Distributor

**Goal**: Find Indian buyers only for various medicines

**Configuration**:
```
Medicines: Paracetamol, Ibuprofen, Amoxicillin
Min Quantity: 10
Posted Within: 2 months
Countries: India
Verifications: Email ✓, Mobile ✓, WhatsApp ✓
Interval: 1 minute
Test Mode: OFF
```

**Result**: Contacts only verified Indian buyers

---

### Use Case 3: Research/Monitoring

**Goal**: Monitor market activity without contacting

**Configuration**:
```
Medicines: (all medicines you track)
Min Quantity: 1
Posted Within: Any time
Countries: (empty)
Verifications: (none required)
Interval: 5 minutes
Test Mode: ON (keep permanently)
```

**Result**: Logs all activity, export CSV for analysis

---

## 🆘 Getting Help

### Self-Service Troubleshooting

1. **Check this README** - Most answers are here
2. **Check Console logs** - F12 → Console tab shows detailed info
3. **Test selectors** - Use DevTools to verify CSS selectors work
4. **Clear and restart** - Clear logs, reload extension, refresh page
5. **Reinstall** - Last resort: remove and reinstall extension

### Reporting Issues

If you find a bug or need help:

1. **Gather information**:
   - Extension version
   - Chrome version (`chrome://version/`)
   - Screenshot of issue
   - Console logs (if relevant)
   - Steps to reproduce

2. **Check existing issues** (GitHub/support channel)
3. **Create new issue** with all gathered info

### Feature Requests

Have an idea? Suggest features like:
- Multiple criteria profiles
- Scheduled scanning
- Email notifications
- Advanced filters
- Custom templates

---

## 🔄 Version History

### v1.0.0 (Current Release)

**Features**:
- ✅ Smart filtering by medicine, quantity, country, date
- ✅ Background scanning (works in inactive tabs)
- ✅ Auto-resume after Chrome restart
- ✅ Test mode for safe verification
- ✅ Duplicate prevention (30-day tracking)
- ✅ Real-time sidebar dashboard
- ✅ CSV export functionality
- ✅ Detailed console logging
- ✅ Product highlighting
- ✅ Toast notifications

**Known Limitations**:
- Single criteria set (no profiles)
- Generic CSS selectors (may need customization)
- No scheduled scanning (time-based)
- No remote notifications

---

## 🚀 Future Roadmap

**Planned Features** (subject to change):

### v1.1.0
- [ ] Multiple criteria profiles (save/switch between sets)
- [ ] Improved selector auto-detection
- [ ] Better date parsing
- [ ] Statistics dashboard in popup

### v1.2.0
- [ ] Schedule-based scanning (start/stop at specific times)
- [ ] Daily/weekly summary reports
- [ ] Export to Excel format
- [ ] Import criteria from CSV

### v2.0.0
- [ ] Email/SMS notifications for matches
- [ ] Custom message templates
- [ ] Integration with CRM systems
- [ ] Advanced analytics and insights

---

## 🤝 Contributing

**Want to improve this extension?**

### How to Contribute

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Update code, test thoroughly
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open Pull Request**: Describe changes clearly

### Development Setup

```bash

# Load in Chrome
1. Open chrome://extensions/
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select project folder

# Make changes
# Edit files in your code editor

# Test changes
# Reload extension in chrome://extensions/
# Refresh IndiaMArt page
# Verify functionality
```

### Code Guidelines

- Use clear, descriptive variable names
- Comment complex logic
- Follow existing code style
- Test in Test Mode first
- Don't break backward compatibility

---

## 📞 Support & Community

### Resources

- 📖 **Documentation**: This README
- 💻 **Source Code**: GitHub repository (if applicable)
- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions

### Contact

- **Technical Support**: Open an issue on GitHub
- **General Questions**: Check FAQ in this README
- **Security Issues**: Report privately (security@yourdomain.com)

---

## 🎯 Quick Reference Card

**Keyboard Shortcuts:**
- `F12` - Open DevTools / Console
- `Ctrl+R` - Refresh page
- `Ctrl+Shift+I` - Open DevTools (alternative)

**Important URLs:**
- `chrome://extensions/` - Manage extensions
- IndiaMArt buy leads page - Where to use extension

**Key Concepts:**
- **Test Mode**: Logs only, no clicking
- **Live Mode**: Auto-clicks contact buttons
- **Product ID**: Unique identifier = title + buyer name
- **Scan Interval**: How often page is rescanned
- **Contacted Products**: 30-day tracking to prevent duplicates

**Troubleshooting Checklist:**
- [ ] Extension enabled in chrome://extensions/
- [ ] On IndiaMArt page with listings
- [ ] Criteria saved in popup
- [ ] Sidebar visible (toggle if needed)
- [ ] Scanning started (green "Running" status)
- [ ] Console open (F12) to see logs
- [ ] Selectors match current HTML (if no products found)

---

## 📝 License

This project is provided **as-is** for personal and business use.

**You are free to**:
- ✅ Use for personal business
- ✅ Modify for your needs
- ✅ Share with others

**Conditions**:
- ⚖️ Use responsibly and ethically
- ⚖️ Comply with IndiaMArt's Terms of Service
- ⚖️ No warranty or liability from developers
- ⚖️ Credit original authors (if redistributing)

---

## 🙏 Acknowledgments

Built for **IndiaMArt sellers** to streamline lead generation.

**Technologies Used**:
- Chrome Extension APIs
- Vanilla JavaScript
- CSS3 for UI
- Chrome Local Storage

**Inspiration**: Helping small businesses automate repetitive tasks

---

## 📢 Final Notes

### Remember

1. **Always start with Test Mode** - Verify before going live
2. **Use responsibly** - Respect IndiaMArt's platform and users
3. **Monitor results** - Check that matches are relevant
4. **Export data regularly** - Keep backups of your logs
5. **Update selectors as needed** - IndiaMArt may change their HTML

### Thank You!

Thank you for using **IndiaMArt Auto Contact Extension**!

We hope it helps you:
- ✅ Save time on repetitive tasks
- ✅ Find quality leads faster
- ✅ Grow your business
- ✅ Focus on what matters - closing deals!

---

**Happy Selling! 🚀**

---

*Last Updated: January 2026*
*Version: 1.0.0*
*For support: See [Support & Community](#support--community) section*

---

## 📋 Appendix: Selector Examples

### Real IndiaMArt Selector Examples (Hypothetical)

**If IndiaMArt uses these classes (inspect to verify)**:

```javascript
// Main container
'.bl_item'                     // Buy lead item
'.buyLead'                     // Buy lead card
'[data-type="buylead"]'        // Data attribute

// Title
'.bl-title'                    // Buy lead title
'.buyLead-title'               // Alternative
'h2.title'                     // H2 heading

// Location/Country
'.bl-location'                 // Location text
'.buyLead-country'             // Country specific
'.location-badge'              // Badge style

// Quantity
'.bl-quantity'                 // Quantity field
'.qty-value'                   // Quantity value
'[data-qty]'                   // Data attribute

// Company/Buyer
'.bl-company'                  // Company name
'.buyer-name'                  // Buyer name
'.companyName'                 // Alternative

// Date
'.bl-date'                     // Posted date
'time.posted-date'             // Time element
'.date-posted'                 // Alternative

// Contact Button
'.contact-btn'                 // Contact button
'button.bl-contact'            // Button element
'.enquiry-btn'                 // Enquiry button
```

**Update these in `content.js` based on actual IndiaMArt HTML structure!**

---

**END OF README**