# IndiaMArt Auto Contact Chrome Extension

A Chrome extension that automatically filters and contacts suppliers on IndiaMArt with a **persistent sidebar interface** that works across all tabs.

## Features

- **🎯 Persistent Sidebar**: Modern sidebar overlay on the right side of any IndiaMArt page
- **🔄 Continuous Operation**: Keeps running even when you switch tabs or navigate
- **🧪 Test Mode**: Verify scraping is working correctly before enabling auto-contact
- **Smart Filtering**: Filter products by medicine names, quantity, and verification requirements
- **Automated Contact**: Automatically clicks "Contact Now" button for matching products (when enabled)
- **Real-time Stats**: Live counters for scans, matches, and contacted suppliers
- **📊 Activity Feed**: Recent activity log in the sidebar
- **🔔 Toast Notifications**: Get instant notifications for matches and contacts
- **Verification Checks**: Verify suppliers by Email, Mobile, and WhatsApp
- **CSV Export**: Export all logs to CSV for analysis
- **💾 Smart Storage**: Efficiently stores data in local storage (keeps last 500 entries)

## Installation

1. **Download the Extension Files**
   - Create a new folder called `indiamart-extension`
   - Save all the files in this folder:
     - `manifest.json`
     - `popup.html`
     - `popup.js`
     - `content.js`
     - `background.js`

2. **Create Icons** (optional but recommended)
   - Create three PNG icons: `icon16.png`, `icon48.png`, `icon128.png`
   - Or use any square PNG image and rename it to these sizes

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `indiamart-extension` folder
   - The extension icon should appear in your toolbar

## Usage

### 🧪 IMPORTANT: Start with Test Mode

**Always verify scraping works before enabling auto-contact!**

### 1. Configure Settings

1. Click the extension icon in Chrome toolbar
2. Fill in the filter criteria:
   - **Medicines**: Enter medicine names separated by commas
   - **Minimum Quantity**: Products must have quantity greater than this value
   - **Verification Requirements**: Check which verifications are required
   - **Test Mode**: ✅ Keep CHECKED initially (only logs, doesn't click)
   - **Scan Interval**: Choose how often to rescan
     - Recommended: 5-10 seconds for balanced performance
3. Click **"💾 Save Criteria"**

### 2. Start Scanning with Sidebar

1. **Navigate to any IndiaMArt page** (search results, supplier page, etc.)
2. **Sidebar appears automatically** on the right side of the page
3. Click **"▶ Start"** button in the sidebar
4. The extension will now:
   - Continuously scan visible products
   - Show real-time stats (Scans, Matches, Contacted)
   - Display recent activity in the sidebar feed
   - Show toast notifications for matches
   - Log detailed information in browser console (F12)

### 3. Monitor with Sidebar

The sidebar shows:
- **Status Indicator**: Running (green) or Stopped (red)
- **Mode Badge**: 🧪 Test Mode or 🔴 Live Mode
- **Real-time Stats**:
  - Scans: Total number of scan cycles
  - Matches: Products that met all criteria
  - Contacted: Suppliers contacted (live mode only)
- **Recent Activity**: Last 10 product scans with match status
- **Toast Notifications**: Pop-up alerts for important events

### 4. Verify Scraping (Test Mode)

**Open Browser Console** (Press F12):
```
╔═══════════════════════════════════════════════════════════╗
║  IndiaMArt Auto Contact Extension Started                ║
╚═══════════════════════════════════════════════════════════╝
Mode: TEST MODE (Logging Only)

=== Scan #1 at 2:30:45 PM ===
Found 12 listings to process

━━━ Listing #1 ━━━
📋 Scraped Data:
  Title: "Ivermectin Tablets 12mg"
  Country: "USA"
  Quantity: "100 Pieces"
  Buyer: "ABC Pharma"
  Available: "Mobile Number is Available, Email ID is Available"
  Contact Button: ✓ Found

🔍 Matching Criteria:
  Medicine: ✓ (matched: "ivermectin")
  Quantity: ✓ (100 > 2)
  Verification: ✓ (email:✓, mobile:✓)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 FULL MATCH!
  🧪 TEST MODE: Would click contact button (not clicking)
```

### 5. Enable Live Mode (Auto-Contact)

Once verified:
1. Click extension icon
2. **Uncheck** "Test Mode"
3. Click **"💾 Save Criteria"**
4. Sidebar updates to show **🔴 Live Mode**
5. Now matching products will be automatically contacted!

### 6. Continuous Operation

**The extension keeps running:**
- ✅ When you switch tabs
- ✅ When you navigate to different IndiaMArt pages
- ✅ When you scroll or interact with the page
- ✅ Until you click **"⏸ Stop"** in the sidebar

**To stop:** Click **"⏸ Stop"** button in the sidebar

### 7. Sidebar Controls

- **Toggle Sidebar**: Click the ◀ button to collapse/expand
- **Start/Stop**: Control scanning directly from sidebar
- **Always visible**: Sidebar stays on screen across all IndiaMArt pages

### 8. Export Data

1. Click extension icon
2. Click **"📥 Export CSV"** to download all logs
3. Use **"🗑️ Clear Logs"** to reset history

## Customization

### Adjust Scan Interval

**Recommended Settings:**

- **Fast Monitoring** (2-5 seconds):
  - Best for: Active product feeds with frequent updates
  - Good balance of speed and performance

- **Normal Monitoring** (10-15 seconds):
  - Best for: Periodic checks during work hours
  - Low CPU usage, natural browsing pattern

- **Background Monitoring** (1-3 minutes):
  - Best for: Passive monitoring throughout the day
  - Minimal resource usage

### Verification Options

- **Email**: Product shows email verification
- **Mobile**: Product shows mobile verification  
- **WhatsApp**: Product shows WhatsApp verification
- Check only the verifications important to you

## Tips

1. **🧪 ALWAYS Start with Test Mode**: Never enable live mode until verified
2. **📊 Watch the Sidebar**: Real-time stats show exactly what's happening
3. **🔍 Check Console**: Press F12 to see detailed scraping information
4. **🎯 Start Specific**: Use exact medicine names to reduce false matches
5. **⏱️ Choose Right Interval**: 5-10 seconds is ideal for most use cases
6. **🔔 Watch Notifications**: Toast alerts show important events instantly
7. **📱 Works Everywhere**: Navigate freely, the sidebar follows you
8. **💾 Auto-saves**: All data persists across browser sessions
9. **📥 Export Regularly**: Download CSV logs to track contacts
10. **🧹 Clean Storage**: Clear logs periodically to maintain performance

## How It Works

### Persistent Sidebar
- Appears automatically on all IndiaMArt pages
- Stays visible when navigating or switching tabs
- Collapsible to save screen space
- Modern dark theme with gradient accents

### Smart Storage Management
- Keeps last 500 log entries
- Automatically prunes old data
- Stores in browser local storage
- Survives browser restarts

### Continuous Scanning
- Runs in background across all IndiaMArt tabs
- Auto-resumes after page navigation
- Maintains state across sessions
- Efficient resource usage

## Troubleshooting

**Sidebar not appearing?**
- Make sure you're on an IndiaMArt page
- Refresh the page (F5)
- Check if extension is enabled in chrome://extensions/

**Extension not working?**
- Verify criteria are saved (click extension icon)
- Check that Test Mode status is correct
- Try refreshing the page

**No products detected?**
- Open console (F12) and look for errors
- Check if "Found X listings" appears in console
- IndiaMArt may have changed their HTML structure

**Fields showing "Not found"?**
- IndiaMArt changed their class names
- Update selectors in `content.js`
- Check console for extraction errors

**Buttons not clicking in Live Mode?**
- Verify "Contact Button: ✓ Found" in console
- Check if buttons are disabled or hidden
- May need to update button selector

## Privacy & Safety

- Only works on IndiaMArt.com
- All data stored locally in your browser
- No data sent to external servers
- Smart storage management (last 500 entries)
- Use responsibly and follow IndiaMArt's terms of service

## Technical Details

- **Manifest Version**: 3
- **Permissions**: storage, activeTab, alarms, scripting
- **Content Script**: Injects sidebar on all IndiaMArt pages
- **Storage**: Chrome local storage with automatic cleanup
- **UI**: Modern sidebar with dark gradient theme

---

**Version**: 2.0 (Sidebar Edition)  
**Last Updated**: January 2026  
**Compatible**: Chrome 88+

- **🧪 Test Mode**: Verify scraping is working correctly before enabling auto-contact
- **Smart Filtering**: Filter products by medicine names, quantity, and verification requirements
- **Automated Contact**: Automatically clicks "Contact Now" button for matching products (when enabled)
- **Real-time Monitoring**: Continuous scanning at customizable intervals
- **Verification Checks**: Verify suppliers by Email, Mobile, and WhatsApp
- **Detailed Logging**: See all scanned products with complete scraped data
- **Live Logging**: Real-time match/no-match status with detailed reasons
- **CSV Export**: Export all logs to CSV for analysis
- **Visual Feedback**: Products are highlighted green (match) or red (no match)
- **Console Debugging**: Detailed console logs for troubleshooting scraping issues

## Installation

1. **Download the Extension Files**
   - Create a new folder called `indiamart-extension`
   - Save all the files in this folder:
     - `manifest.json`
     - `popup.html`
     - `popup.js`
     - `content.js`
     - `background.js`

2. **Create Icons** (optional but recommended)
   - Create three PNG icons: `icon16.png`, `icon48.png`, `icon128.png`
   - Or use any square PNG image and rename it to these sizes

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `indiamart-extension` folder
   - The extension icon should appear in your toolbar

## Usage

### 🧪 IMPORTANT: Start with Test Mode

**Before enabling auto-contact, always verify the scraping is working correctly:**

1. Keep **"Test Mode"** checkbox **CHECKED** (enabled by default)
2. Set up your criteria and start scanning
3. Open browser console (F12) to see detailed scraping logs
4. Check the Live Log panel for scraped data
5. Verify that:
   - Product titles are being extracted correctly
   - Quantities are parsed properly
   - Verification status is detected
   - Contact buttons are found
   - Matching logic is working as expected

Once you confirm everything is working correctly, you can disable Test Mode to enable auto-clicking.

### 1. Set Up Criteria

1. Click the extension icon in Chrome toolbar
2. Fill in the filter criteria:
   - **Medicines**: Enter medicine names separated by commas (e.g., "Ivermectin, Azithromycin, Pregabalin")
   - **Minimum Quantity**: Products must have quantity greater than this value
   - **Verification Requirements**: Check which verifications are required
   - **Test Mode**: 
     - ✅ **CHECKED (Recommended)**: Only logs matches, doesn't click buttons
     - ❌ **UNCHECKED (Live Mode)**: Automatically clicks contact buttons for matches
   - **Scan Interval**: Choose how often to rescan the page
     - Enter a number value
     - Select unit: Milliseconds, Seconds, or Minutes
     - Examples:
       - `850 Milliseconds` = Scan every 0.85 seconds (very fast)
       - `5 Seconds` = Scan every 5 seconds (balanced)
       - `2 Minutes` = Scan every 2 minutes (slow, for monitoring)
3. Click **"Save Criteria"**

### 2. Start Scanning in Test Mode

1. Navigate to any IndiaMArt page with product listings
2. Click the extension icon
3. Make sure **Test Mode** is enabled (yellow badge showing "🧪 TEST MODE")
4. Click **"Start"** button
5. **Open Browser Console** (Press F12, then click "Console" tab)
6. The extension will now:
   - Scan all visible products
   - Log detailed information about each product
   - Show what data was scraped from each field
   - Display matching logic (which criteria passed/failed)
   - Indicate which products would be contacted in live mode
   - **NOT click any buttons**

### 3. Verify Scraping is Working

In the console, you should see logs like:

```
╔═══════════════════════════════════════════════════════════╗
║  IndiaMArt Auto Contact Extension Started                ║
╚═══════════════════════════════════════════════════════════╝
Mode: TEST MODE (Logging Only)

=== Scan #1 at 2:30:45 PM ===

━━━ Listing #1 ━━━
📋 Scraped Data:
  Title: "Ivermectin Tablets 12mg"
  Country: "USA"
  Quantity: "100 Pieces"
  Buyer: "ABC Pharma"
  Available: "Mobile Number is Available, Email ID is Available"
  Contact Button: ✓ Found

🔍 Matching Criteria:
  Medicine: ✓ (matched: "ivermectin")
  Quantity: ✓ (100 > 2)
  Verification: ✓ (email:✓, mobile:✓)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 FULL MATCH!
  🧪 TEST MODE: Would click contact button (not clicking)
```

**Check in the Live Log panel:**
- Each product should show "📋 Scraped Data" section
- Verify all fields are extracted correctly
- Products matching criteria show "Would Contact (Test Mode)" badge

### 4. Enable Live Mode (Auto-Contact)

Once you've verified the scraping is working correctly:

1. **Uncheck** the "Test Mode" checkbox
2. Click **"Save Criteria"**
3. Click **"Stop"** then **"Start"** to restart with new settings
4. Status will show "🔴 LIVE MODE - Auto-Clicking Enabled"
5. Now matching products will be automatically contacted!

### 3. Monitor Results

- **Mode Indicator**:
  - 🧪 Yellow Badge = Test Mode (Safe, only logging)
  - 🔴 Red Badge = Live Mode (Auto-clicking enabled)
- **Live Log**: See real-time results of scanned products with scraped data
- **Status Information**:
  - Current scan status (Running/Stopped)
  - Active tab URL
  - Time since last scan
  - Total scans completed
  - Time until next scan
  - Current scan interval
- **Match Indicators**:
  - ✓ Green = Match (all criteria met)
  - ✗ Red = No match
  - "Would Contact (Test Mode)" = Match found in test mode
  - "Just Contacted" = Button was clicked in live mode
  - Already contacted products are skipped
- **Scraped Data Section**: Each log entry shows:
  - Raw data extracted from each field
  - Whether contact button was found
  - All extracted values for debugging
- **Console Logging**: Open DevTools (F12) to see detailed scan logs including:
  - Scan number and timestamp
  - Each product evaluation with raw extracted data
  - Match/no-match reasons for each criterion
  - Button click confirmations (in live mode)
  - Test mode indicators

### 4. Export Data

- Click **"Export CSV"** to download all logs
- Use **"Clear"** to reset the log history

### 5. Stop Scanning

- Click **"Stop"** button to pause scanning
- The extension will remember your criteria
- Settings persist between browser sessions

## How It Works

### Filtering Logic

A product matches your criteria if ALL of these conditions are met:

1. **Medicine Name**: Product title contains at least one of your medicine names (case-insensitive)
2. **Quantity**: Product quantity is greater than your minimum quantity
3. **Verification**: Product meets your verification requirements (Email/Mobile/WhatsApp)

### Auto-Contact Feature

When a product matches:
- The extension highlights it in green
- After 0.5 seconds, it automatically clicks the "Contact Now" button
- The product is marked as "contacted" in logs
- Already contacted products are skipped in future scans

### Continuous Monitoring

- The extension rescans the page at your specified interval
- New products are automatically detected and processed
- Perfect for monitoring fresh leads

## Customization

### Adjust Scan Interval

The scan interval determines how often the extension checks the page for new products:

**Recommended Settings:**

- **Ultra-Fast Monitoring** (100-500ms / 0.1-0.5s):
  - Use when: New products appear very frequently
  - Pros: Catches new leads instantly
  - Cons: High CPU usage, may appear unnatural
  
- **Fast Monitoring** (1-3 seconds):
  - Use when: Active product feed with regular updates
  - Pros: Good balance of speed and performance
  - Cons: Moderate CPU usage
  - **Recommended for most users**

- **Normal Monitoring** (5-15 seconds):
  - Use when: Checking established listings periodically
  - Pros: Low CPU usage, natural browsing pattern
  - Cons: May miss very fast-moving leads

- **Slow Monitoring** (1-5 minutes):
  - Use when: Periodic checks throughout the day
  - Pros: Minimal CPU usage
  - Cons: Only suitable for stable/slow-moving markets

**Tips:**
- Start with 5-10 seconds and adjust based on results
- Lower intervals = faster detection but more resource intensive
- Higher intervals = battery friendly but slower detection
- The extension shows "Time until next scan" so you can monitor timing

### Verification Options

- **Email**: Product shows email verification
- **Mobile**: Product shows mobile verification  
- **WhatsApp**: Product shows WhatsApp verification
- Check only the verifications that are important to you

## Tips

1. **🧪 ALWAYS Start with Test Mode**: Never enable live mode until you've verified scraping works
2. **Check Console Logs**: Press F12 to see exactly what data is being extracted
3. **Verify Selectors**: If no data is showing, IndiaMArt's HTML might have changed - check console for empty fields
4. **Start with Specific Criteria**: Use specific medicine names to reduce false matches
5. **Monitor First**: Run in test mode for 10-15 minutes to see how matches look
6. **Adjust Quantity**: Set realistic minimum quantity to avoid spam leads
7. **Choose Right Interval**: 
   - For new product feeds: 1-5 seconds
   - For periodic monitoring: 30-60 seconds
   - For background monitoring: 2-5 minutes
8. **Watch Scan Counter**: The "Total scans completed" shows how active the extension is
9. **Scrape Details**: Check the "📋 Scraped Data" section in logs to verify field extraction
10. **Use Multiple Tabs**: You can run the extension on multiple IndiaMArt tabs simultaneously
11. **Regular Exports**: Export CSV logs regularly to track your contacts and analyze patterns
12. **Test Different Pages**: Try the extension on different IndiaMArt search result pages to ensure compatibility

## Troubleshooting

**Extension not working?**
- Make sure you're on an IndiaMArt page
- Check that criteria are saved
- Verify Test Mode is enabled initially
- Try refreshing the page and restarting the extension

**No products detected?**
- Open console (F12) and check for errors
- IndiaMArt's HTML structure may have changed
- Check if "Found X listings to process" appears in console
- The selectors in `content.js` may need updating

**Fields showing "Not found" in scraped data?**
- IndiaMArt changed their HTML class names
- Open DevTools, inspect a product element
- Update the selectors in `content.js` `extractText()` calls
- Common selectors to check:
  ```javascript
  Title: '[class*="title"], h2, h3, .prd-name, [class*="name"]'
  Country: '[class*="country"], [class*="location"], [class*="place"]'
  Quantity: '[class*="quantity"], [class*="qty"], [class*="amount"]'
  Buyer: '[class*="buyer"], [class*="company"], [class*="seller"]'
  Available: '[class*="available"], [class*="verification"], [class*="verified"]'
  Button: '[class*="contact"], button[class*="btn"], [class*="enquiry"]'
  ```

**Too many false positives?**
- Make medicine names more specific
- Increase minimum quantity requirement
- Enable more verification requirements
- Check console to see why products are matching

**Buttons not clicking in Live Mode?**
- Verify button selector is correct (check console: "Contact Button: ✓ Found")
- Check if button is disabled or hidden
- Try adjusting the click delay in `content.js` (currently 500ms)
- Some buttons may require different interaction methods

## Privacy & Safety

- This extension only works on IndiaMArt.com
- All data is stored locally in your browser
- No data is sent to external servers
- Use responsibly and follow IndiaMArt's terms of service

## Technical Details

- **Manifest Version**: 3
- **Permissions**: storage, activeTab, alarms, scripting
- **Content Script**: Runs on all IndiaMArt pages
- **Storage**: Chrome local storage for criteria and logs

## Support

For issues, feature requests, or questions, please check:
- Browser console for error messages
- Extension popup for status information
- Chrome extensions page for permission issues

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Compatible**: Chrome 88+