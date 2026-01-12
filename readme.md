# ⚡ IndiaMART Ultra-Fast Scanner

**Version:** 2.0.0  
**Last Updated:** January 12, 2026

An advanced Chrome extension for automated scanning and filtering of IndiaMART buyer leads with intelligent matching, real-time notifications, and comprehensive history tracking.

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start Guide](#-quick-start-guide)
- [Settings & Configuration](#-settings--configuration)
- [How It Works](#-how-it-works)
- [Notification System](#-notification-system)
- [History & Tracking](#-history--tracking)
- [Test Mode vs Live Mode](#-test-mode-vs-live-mode)
- [Advanced Features](#-advanced-features)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Privacy & Data](#-privacy--data)

---

## 🚀 Features

### Core Functionality
- ✅ **Ultra-Fast Scanning** - Instant or customizable refresh intervals (0ms to 60s)
- ✅ **Smart DOM Loading** - Automatically waits for listings to load before scanning
- ✅ **Multi-Product Scanning** - Scan 1 or 2 products per page refresh
- ✅ **Intelligent Matching** - Filter by products, country, age, and verification status
- ✅ **Auto-Contact** - Automatically click contact buttons for matched leads (Live mode)
- ✅ **Browser Notifications** - Persistent notifications that survive page refreshes
- ✅ **History Tracking** - Complete scan history with detailed matching information
- ✅ **CSV Export** - Export all scan data for analysis
- ✅ **Duplicate Detection** - Never contact the same lead twice

### Smart Features
- 🧠 **Test Mode** - Review matches before auto-contacting
- 🔄 **Auto-Resume** - Continues scanning after browser restart
- 📊 **Real-Time Stats** - Live scan count and contact tracking
- 🎯 **Flexible Filtering** - Mix and match multiple criteria
- 💾 **Persistent Storage** - All data saved locally and securely

---

## 📦 Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download/Clone** this repository to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"**
5. **Select the extension folder** containing `manifest.json`
6. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store (Coming Soon)
_Extension will be available on Chrome Web Store after review_

### Required Files
```
indiamart-extension/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── icon16.png
├── icon48.png
└── icon128.png
```

---

## 🎯 Quick Start Guide

### Step 1: Configure Settings

1. **Click the extension icon** in your Chrome toolbar
2. **Configure your filters:**
   - **Products**: Enter medicine/product names (comma-separated)
   - **Products to Scan**: Choose 1 or 2 products per page
   - **Refresh Interval**: Set scan speed (0 = instant, recommended)
   - **Minimum User Age**: Filter by buyer account age
   - **Countries**: Target specific countries (optional)
   - **Verification**: Require email/mobile verification
   - **Test Mode**: Keep enabled for testing (default)

3. **Click "💾 Save Settings"**

### Step 2: Enable Notifications

1. **Open IndiaMART** buyer leads page: `https://seller.indiamart.com/bltxn/?pref=`
2. **Browser will prompt** for notification permission
3. **Click "Allow"** to enable notifications

### Step 3: Start Scanning

1. **Click "▶ Start"** in the extension popup
2. **Watch the magic happen!** The extension will:
   - Auto-refresh the page
   - Scan products based on your criteria
   - Show notifications for matches
   - Track everything in the history table

### Step 4: Review Results

- **Check the History Table** in the popup for all scanned products
- **Export to CSV** for detailed analysis
- **Switch to Live Mode** when ready to auto-contact leads

---

## ⚙️ Settings & Configuration

### 1. Products (Medicine/Product Names)
- **Format**: Comma-separated list
- **Example**: `Ivermectin, Azithromycin, Doxycycline`
- **Case-Insensitive**: Works with any capitalization
- **Leave Empty**: Scans ALL products (not recommended)

**Matching Logic:**
- Checks both product title AND buyer's "Buys" field
- Partial matching supported (e.g., "Iver" matches "Ivermectin")

---

### 2. Products to Scan
- **Options**:
  - `First product only` (Default) - Faster, scans list1
  - `First 2 products` - More thorough, scans list1 + list2

**When to Use:**
- **1 Product**: Maximum speed, lower chances per scan
- **2 Products**: Better match rate, slightly slower
- **Live Mode**: Stops after first successful contact

---

### 3. Refresh Interval
- **Format**: Number + Unit (milliseconds or seconds)
- **Examples**:
  - `0 ms` = Instant refresh (maximum speed) ⚡
  - `1000 ms` / `1 s` = 1 second delay
  - `3 s` = 3 second delay

**Recommended Settings:**
- **Testing**: 2-3 seconds (easier to observe)
- **Production**: 0-500ms (maximum speed)
- **Conservative**: 1-2 seconds (more stable)

---

### 4. Minimum User Age
- **Options**: Any age, 1+, 2+, 3+, 6+, 12+ months
- **Default**: 2+ months
- **Purpose**: Filter out brand new accounts

**Conversion:**
- "Member since 2+ years" = 24+ months ✅
- "Member since 1 year" = 12 months ✅
- "Member since 6 months" = 6 months ✅

---

### 5. Countries
- **Format**: Comma-separated list
- **Example**: `India, USA, United Kingdom, Germany`
- **Case-Insensitive**: Works with any capitalization
- **Leave Empty**: All countries accepted

**Matching Logic:**
- Partial matching supported
- "India" matches "India 🇮🇳"
- "United" matches "United States" or "United Kingdom"

---

### 6. Verification Requirements
- **Email Verified**: Requires "Email Verified" badge
- **Mobile Verified**: Requires "Phone Verified" badge
- **Both Checked** (Default): Buyer must have both verifications
- **Uncheck**: Allow buyers without verification (not recommended)

---

### 7. Test Mode
- **Default**: ✅ Enabled (🧪 Test Mode)
- **Purpose**: Review matches without auto-clicking
- **Live Mode**: ⚠️ Uncheck to enable auto-contact

**Important**: Extension will warn you before enabling Live Mode!

---

## 🔄 How It Works

### Scanning Process

```
┌─────────────────────────────────────────────────────────┐
│ 1. Page Loads                                           │
│    ↓                                                     │
│ 2. Wait for DOM (Smart Retry Logic)                    │
│    ↓                                                     │
│ 3. Find Products (1 or 2 based on setting)             │
│    ↓                                                     │
│ 4. Extract Data (Title, Country, Age, Verification)    │
│    ↓                                                     │
│ 5. Check Matching Criteria                             │
│    ├─ Product Name Match?                              │
│    ├─ Country Match?                                   │
│    ├─ Age Requirement?                                 │
│    └─ Verification Status?                             │
│    ↓                                                     │
│ 6. Save to History                                      │
│    ↓                                                     │
│ 7. TEST MODE: Show Notification if Match               │
│    LIVE MODE: Click Button if Match                    │
│    ↓                                                     │
│ 8. Refresh Page (After Interval)                       │
│    ↓                                                     │
│ 9. Repeat from Step 1                                   │
└─────────────────────────────────────────────────────────┘
```

### Smart DOM Loading
- **Tries up to 10 times** to find listings (200ms intervals)
- **Never refreshes prematurely** - always waits for DOM
- **Logs retry attempts** in console for debugging
- **Fails gracefully** - records failure and moves on

---

## 🔔 Notification System

### Browser Notifications (Persistent)
- **Appear in**: System notification area (Windows/Mac/Linux)
- **Duration**: 6 seconds (auto-close)
- **Survive**: Page refreshes, tab switches
- **Sound**: System notification sound (optional)

### Notification Types

#### ✅ Match Found (Test Mode)
```
⚡ IndiaMART Ultra-Fast Scanner
✅ MATCH FOUND! (Test Mode)

Product 1/2
Ivermectin - India
ABC Pharma Ltd

🧪 Test mode: Not clicking
```

#### 🔔 Contacted (Live Mode)
```
⚡ IndiaMART Ultra-Fast Scanner
🔔 CONTACTED!

Product 2/2
Azithromycin - USA
XYZ Medical Corp

Total Contacted: 5
```

### Enabling Notifications

**First Time:**
1. Open IndiaMART page
2. Browser shows: "indiamart.com wants to show notifications"
3. Click **"Allow"**

**If Blocked:**
1. Click lock icon 🔒 in address bar
2. Find "Notifications"
3. Change to "Allow"
4. Refresh page

**Or via Settings:**
- Visit: `chrome://settings/content/notifications`
- Find `indiamart.com`
- Set to "Allow"

---

## 📊 History & Tracking

### History Table Columns

| Column | Description |
|--------|-------------|
| **Scan#** | Sequential scan number |
| **Time** | Time of scan (HH:MM:SS) |
| **Title** | Product/buyer title (truncated) |
| **Match** | ✓ = All criteria matched, ✗ = Some failed |
| **Prod** | ✓ = Product name matched |
| **Age** | Buyer account age in months |
| **Age✓** | ✓ = Age requirement met |
| **Country** | Buyer's country |
| **Ctry✓** | ✓ = Country matched |
| **Email** | ✓ = Email verified |
| **Phone** | ✓ = Phone verified |
| **Status** | CONTACTED / PREV CONTACTED / AVAILABLE |

### Color Coding
- 🟢 **Green Cell** = Criteria matched (✓)
- 🔴 **Red Cell** = Criteria failed (✗)
- 🟣 **Purple Row** = Product contacted
- 🔵 **Blue Badge** = Available to contact
- 🟣 **Purple Badge** = Already contacted

### Data Export (CSV)
1. **Click "📥 Export CSV"** button
2. **Opens save dialog** - choose location
3. **File includes**:
   - All scan history
   - Full product details
   - Match results
   - Contact status
   - Product IDs

**CSV Columns:**
```
Scan#, Time, Title, Strength, Age, Country, Buyer, 
Email, Phone, Matched, Contacted, Product ID
```

### Clear Data
- **Click "🗑️ Clear All Data"**
- **Removes**:
  - Product history (all scans)
  - Contacted products list
  - Scan count
  - Total contacted count
- **Keeps**: Settings/criteria intact
- **Warning**: Action cannot be undone!

---

## 🧪 Test Mode vs Live Mode

### Test Mode (Default) 🧪

**Purpose**: Review and validate matches before auto-contacting

**Behavior:**
- ✅ Scans all products normally
- ✅ Shows notifications for ALL matches
- ✅ Records everything in history
- ❌ **Does NOT click contact buttons**
- ✅ Allows manual review of matches

**Best For:**
- Initial setup and testing
- Validating criteria accuracy
- Reviewing match quality
- Training and learning

**Notification Example:**
```
✅ MATCH FOUND! (Test Mode)
Ivermectin - India
ABC Pharma

🧪 Test mode: Not clicking
```

---

### Live Mode 🔴

**Purpose**: Automatically contact matched leads

**Behavior:**
- ✅ Scans products normally
- ✅ Clicks contact buttons for matches
- ✅ Shows notification ONLY when contacted
- ✅ Stops scanning after first contact (if scanning 2 products)
- ✅ Marks products as contacted
- ⚠️ **Cannot undo contact actions**

**Best For:**
- Production use after testing
- High-volume lead generation
- Automated workflows
- Hands-free operation

**Notification Example:**
```
🔔 CONTACTED!
Ivermectin - India
ABC Pharma

Total Contacted: 15
```

**⚠️ Important Warnings:**
1. **Test thoroughly** in Test Mode first
2. **Cannot undo** contact actions
3. **May trigger** rate limits if too fast
4. **Monitor regularly** to ensure quality

---

## 🔧 Advanced Features

### 1. Duplicate Detection
- **Unique Product ID**: Generated from title + buyer + member age
- **Automatic Tracking**: Stores all contacted products
- **Smart Checking**: Checks both storage and button state
- **Prevention**: Never contacts same lead twice
- **Cleanup**: Auto-removes entries older than 30 days

### 2. Auto-Resume
- **Browser Restart**: Automatically resumes if was running
- **Tab Navigation**: Continues when navigating IndiaMART
- **Tab Close**: Remembers state, resumes on new tab
- **Crash Recovery**: State persisted in Chrome storage

### 3. Performance Optimization
- **Parallel Storage**: Non-blocking save operations
- **Efficient Selectors**: Multiple fallback CSS selectors
- **Smart Refresh**: Only refreshes after completing scans
- **Memory Management**: Limits history to last 100 entries
- **Storage Cleanup**: Auto-removes old data

### 4. Console Logging
Open DevTools (F12) to see detailed logs:
```
⚡ Scan #15 - Refresh: 1250ms - Scanning 2 product(s)
📦 [1/2] Ivermectin Tablets - 10mg
✅ MATCH
💾 Saved to History
🧪 TEST MODE - NOT CLICKING
📦 [2/2] Azithromycin Suspension
❌ NO MATCH
🔄 Refresh in 0ms
```

---

## 🐛 Troubleshooting

### Extension Not Working

**Problem**: Extension doesn't start scanning

**Solutions:**
1. ✅ Verify you're on IndiaMART: `seller.indiamart.com/bltxn/`
2. ✅ Check settings are saved
3. ✅ Refresh the page
4. ✅ Check console (F12) for errors
5. ✅ Reload extension: `chrome://extensions/`

---

### No Listings Found

**Problem**: "DOM Load Failed" or "No listing found"

**Solutions:**
1. ✅ Wait 5-10 seconds for page to fully load
2. ✅ Check internet connection
3. ✅ Verify IndiaMART page has leads
4. ✅ Clear browser cache
5. ✅ Try different IndiaMART page

---

### Notifications Not Showing

**Problem**: No notifications appear

**Solutions:**
1. ✅ Check browser notification settings:
   - Visit `chrome://settings/content/notifications`
   - Ensure `indiamart.com` is allowed
2. ✅ Check system notifications are enabled (Windows/Mac)
3. ✅ Look for notifications in notification center
4. ✅ Check "Do Not Disturb" mode is off
5. ✅ Refresh IndiaMART page to re-request permission

---

### Not Matching Expected Leads

**Problem**: Extension skips leads that should match

**Solutions:**
1. ✅ Check product names are spelled correctly
2. ✅ Try shorter/partial names (e.g., "Iver" instead of "Ivermectin")
3. ✅ Review age requirements (convert years to months)
4. ✅ Check verification requirements
5. ✅ Look at History table to see why leads failed
6. ✅ Enable console logging to debug

---

### Too Slow / Too Fast

**Problem**: Scanning speed not optimal

**Solutions:**

**Too Slow:**
1. ✅ Reduce refresh interval (try 0ms)
2. ✅ Scan only 1 product instead of 2
3. ✅ Check internet speed
4. ✅ Close other browser tabs

**Too Fast:**
1. ✅ Increase refresh interval (try 2-3 seconds)
2. ✅ May trigger rate limits from IndiaMART
3. ✅ Consider scanning 2 products per refresh instead

---

### History Table Not Updating

**Problem**: Scans happening but table empty

**Solutions:**
1. ✅ Refresh extension popup (close and reopen)
2. ✅ Check storage usage: `chrome://extensions/` → Details → Storage
3. ✅ Clear data and restart
4. ✅ Check console for storage errors

---

## ❓ FAQ

### Q: Is this extension safe to use?
**A:** Yes! All data is stored locally in your browser. No external servers involved. Code is open-source for review.

### Q: Will I get banned from IndiaMART?
**A:** No evidence of bans, but use responsibly:
- Don't set interval to 0ms for extended periods
- Use 1-3 second intervals for safety
- Monitor your account regularly
- Follow IndiaMART's terms of service

### Q: Can I scan multiple tabs simultaneously?
**A:** No, only one active scanning tab at a time. Extension tracks state globally.

### Q: What happens if I close the browser?
**A:** Extension remembers if it was running and auto-resumes when you reopen IndiaMART.

### Q: How many leads can I track?
**A:** History stores last 100 products. Export to CSV for unlimited storage.

### Q: Can I customize the matching logic?
**A:** Currently no, but you can:
- Use partial product names
- Leave criteria empty for broader matching
- Mix and match filters

### Q: Does it work on mobile Chrome?
**A:** No, Chrome extensions only work on desktop browsers.

### Q: What data is stored?
**A:** Everything is stored locally:
- Settings/criteria
- Scan history (last 100)
- Contacted products (30 days)
- Statistics (scan count, total contacted)

### Q: Can I use this for other websites?
**A:** No, specifically designed for IndiaMART's structure and selectors.

---

## 🔒 Privacy & Data

### Data Storage
- **Location**: Chrome local storage (on your computer)
- **No Cloud**: Never sent to external servers
- **No Tracking**: No analytics or telemetry
- **No Ads**: Completely ad-free

### Data Collected
- ✅ Product titles and details (from IndiaMART)
- ✅ Buyer information (from IndiaMART)
- ✅ Scan statistics
- ✅ User settings/preferences
- ❌ No personal information
- ❌ No browsing history
- ❌ No passwords or credentials

### Permissions Explained

**Required Permissions:**
- `storage` - Save settings and history locally
- `tabs` - Detect IndiaMART tabs and auto-resume
- `notifications` - Show match/contact alerts

**Host Permissions:**
- `*://*.indiamart.com/*` - Only works on IndiaMART
- No access to other websites

### Data Retention
- **Settings**: Permanent (until cleared)
- **History**: Last 100 scans (auto-cleanup)
- **Contacted Products**: 30 days (auto-cleanup)
- **Clear Anytime**: "Clear All Data" button

---

## 📈 Best Practices

### 1. Start with Test Mode
- Run for 1-2 hours in Test Mode
- Review match quality in History table
- Adjust criteria based on results
- Switch to Live Mode when satisfied

### 2. Optimize Your Criteria
- **Be Specific**: Use exact product names for better matches
- **Not Too Strict**: Don't over-filter (you'll miss leads)
- **Test Variations**: Try different product name spellings
- **Monitor Results**: Check History table regularly

### 3. Set Reasonable Intervals
- **Testing**: 2-3 seconds
- **Production**: 500-1000ms
- **Aggressive**: 0-500ms (monitor for issues)
- **Conservative**: 2-5 seconds (most stable)

### 4. Regular Maintenance
- Export CSV weekly for analysis
- Clear old data monthly
- Review contacted products
- Update criteria based on trends

### 5. Monitor Performance
- Check console logs for errors
- Watch for "DOM Load Failed" messages
- Track contact success rate
- Adjust settings based on results

---

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Latest Chrome extension standard
- **Service Worker**: Background.js runs persistently
- **Content Script**: Injected into IndiaMART pages
- **Popup**: User interface for configuration

### Browser Compatibility
- ✅ Google Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Brave Browser
- ✅ Opera 74+
- ❌ Firefox (uses different extension API)
- ❌ Safari (no extension support)

### System Requirements
- Modern browser with extension support
- Active internet connection
- Notification permissions (optional)
- ~5MB storage space

---

## 📝 Version History

### Version 2.0.0 (Current)
- ✅ Browser notifications (persist across refresh)
- ✅ Multi-product scanning (1 or 2 products)
- ✅ Smart DOM loading with retry logic
- ✅ Improved notification logic per mode
- ✅ Better console logging
- ✅ Fixed dropdown visibility issues

### Version 1.0.0
- Initial release
- Basic scanning functionality
- Test mode support
- History tracking
- CSV export

---

## 🤝 Contributing

### Report Issues
Found a bug? Have a suggestion?
1. Check existing issues first
2. Provide detailed steps to reproduce
3. Include console logs (F12)
4. Mention browser version

### Feature Requests
- Describe the use case
- Explain expected behavior
- Consider feasibility

---

## 📄 License

**MIT License** - Free for personal and commercial use

Copyright (c) 2026 IndiaMART Ultra-Fast Scanner

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 📞 Support

### Resources
- **Documentation**: This README
- **Console Logs**: Press F12 for detailed debugging
- **Extension Page**: `chrome://extensions/` for management

### Tips
- Always test in Test Mode first
- Export data regularly
- Monitor console for errors
- Use reasonable refresh intervals
- Follow IndiaMART's terms of service

---

## ⚡ Quick Reference

### Essential Shortcuts
- **F12** - Open DevTools/Console
- **Ctrl+Shift+I** - Open DevTools (alternative)
- **Extension Icon** - Open popup interface

### Key URLs
- **IndiaMART Leads**: `https://seller.indiamart.com/bltxn/?pref=`
- **Chrome Extensions**: `chrome://extensions/`
- **Notification Settings**: `chrome://settings/content/notifications`

### Default Settings
- Products: Empty (scan all)
- Products to Scan: 1
- Refresh Interval: 0ms (instant)
- Min Age: 2 months
- Countries: Empty (all countries)
- Verification: Email + Mobile required
- Test Mode: Enabled

---

**Made with ⚡ for efficient lead generation on IndiaMART**

**Current Version:** 2.0.0 | **Last Updated:** January 12, 2026