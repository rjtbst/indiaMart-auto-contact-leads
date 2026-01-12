# 📊 IndiaMArt Auto Contact Extension

A Chrome extension that automatically scans and contacts IndiaMArt buyers based on customizable criteria. Built for sellers who want to streamline their lead generation process on the IndiaMArt platform.



## ✨ Features

- **🎯 Smart Filtering**: Filter buyers by products, account age, country, and verification status
- **⏱️ Customizable Intervals**: Set scan intervals from milliseconds to minutes
- **🧪 Test Mode**: Verify scraping accuracy before enabling auto-contact
- **📈 Real-time Dashboard**: Live sidebar showing scan progress, matches, and contacted leads
- **💾 Persistent Tracking**: Never contact the same buyer twice with built-in duplicate prevention
- **📊 Detailed Logs**: Color-coded tables showing match status for each criterion
- **📥 CSV Export**: Export all scan data for external analysis
- **🔄 Auto-Resume**: Continues scanning across page navigations

## 📦 Installation

### From Source

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the extension folder containing `manifest.json`

4. **Verify installation**
   - The extension icon should appear in your Chrome toolbar
   - Icon images should display properly

## 🚀 Quick Start

### 1. Configure Criteria

Click the extension icon to open the settings popup:

**🎯 Filters**
- **Products**: Enter comma-separated product names (e.g., "Ivermectin, Azithromycin")
- **Minimum User Age**: Set minimum account age (1-24 months)
- **Country Filter**: Specify countries (leave empty for all)

**✅ Verification Required**
- Email Verified
- Mobile Verified

**⏱️ Timing**
- Set scan interval (e.g., 5 seconds, 1 minute)

**🧪 Test Mode**
- Enable to verify scraping without clicking contact buttons
- Disable for live auto-contact

### 2. Start Scanning

1. Navigate to IndiaMArt's buyer leads page:
   ```
   https://seller.indiamart.com/bltxn/?pref=*
   ```

2. The sidebar will automatically appear on the right side

3. Click the **▶ Start** button in the sidebar

4. Monitor real-time results in the dashboard

### 3. Review Results

**📊 Dashboard Tabs**
- **All Products**: Complete scan history with color-coded match indicators
- **Matched Only**: Filtered view of qualified leads

**Color Coding**
- 🟢 Green cells: Criteria matched
- 🔴 Red cells: Criteria not matched
- 🟣 Purple rows: Already contacted

## 📋 File Structure

```
indiamart-auto-contact/
│
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for state management
├── content.js            # Main scanning and contact logic
├── sidebar.js            # Live dashboard UI
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
└── icon128.png           # Extension icon (128x128)
```

## ⚙️ Configuration Options

### Product Filtering
```javascript
medicines: ["Ivermectin", "Azithromycin", "Pregabalin"]
```
Leave empty to match all products.

### Age Filtering
```javascript
monthsBefore: 2  // Minimum 2 months old
```
Set to `0` to disable age filtering.

### Country Filtering
```javascript
countries: ["India", "USA", "UK"]
```
Leave empty to match all countries.

### Verification Requirements
```javascript
verifyEmail: true,    // Require verified email
verifyMobile: true,   // Require verified mobile
```

### Scan Interval
```javascript
interval: 5000  // 5 seconds in milliseconds
```

### Operating Mode
```javascript
testMode: true   // true = test only, false = live contact
```

## 🔍 How It Works

### 1. Scanning Process

The extension scans the page at your configured interval:

```javascript
// Extract buyer information
- Title/Product name
- User account age
- Country location
- Email verification status
- Mobile verification status
- Current contact status
```

### 2. Matching Logic

Each listing is evaluated against your criteria:

```javascript
✓ Product name matches
✓ Account age >= minimum
✓ Country matches (if specified)
✓ Email verified (if required)
✓ Mobile verified (if required)
```

### 3. Contact Action

**Test Mode**: Highlights matches without clicking

**Live Mode**: Automatically clicks contact buttons for matches

### 4. Duplicate Prevention

```javascript
contactedProducts: {
  "product_buyer_age": {
    timestamp: 1234567890,
    date: "2024-01-01T00:00:00.000Z"
  }
}
```

## 📊 Data Storage

### Chrome Local Storage

All data is stored locally using Chrome's storage API:

```javascript
{
  isRunning: false,
  scanCount: 0,
  contactedProducts: {},
  productLogs: {},
  criteria: { /* your settings */ }
}
```

### Automatic Cleanup

- Old contacted products (>30 days) are automatically removed
- Console logs are limited to the last 100 entries

## 🧪 Testing Mode

**Always test before going live!**

1. Enable Test Mode in settings
2. Click "Start" in the sidebar
3. Verify in the dashboard that:
   - Correct products are matched
   - Age filtering works as expected
   - Country filtering is accurate
   - Verification checks are correct
4. Check browser console for detailed logs
5. Once verified, disable Test Mode for live operation

## 📥 Export Data

Click the **📥 Export CSV** button in the popup to download scan results:

```csv
Time,Title,User Months Old,Country,Buyer,Email,Phone,Engaged,Matched,...
12:34:56,Product Name,6,India,Buyer Name,Verified,Verified,CONTACTED,YES,...
```

## 🛡️ Safety Features

- **Duplicate Prevention**: Never contacts the same buyer twice
- **Test Mode**: Verify everything before live contact
- **Error Handling**: Gracefully handles page changes and errors
- **Rate Limiting**: Configurable intervals prevent spam
- **Button Validation**: Double-checks buttons before clicking

## 🐛 Troubleshooting

### Extension Not Loading

1. Check Developer Mode is enabled
2. Verify all files are present in the folder
3. Check browser console for errors
4. Try reloading the extension

### Sidebar Not Appearing

1. Ensure you're on the correct IndiaMArt page
2. Refresh the page
3. Check content script is injected (F12 → Console)

### Not Detecting Products

1. IndiaMArt may have changed their HTML structure
2. Check browser console for extraction errors
3. Open an issue with the current page HTML

### Contact Buttons Not Clicking

1. Verify Test Mode is disabled
2. Check button selectors are still valid
3. Ensure buttons aren't disabled
4. Review console logs for errors

### Storage Issues

1. Clear extension data: `chrome://extensions/` → Details → Remove
2. Reinstall the extension
3. Reconfigure settings

## 🔒 Privacy & Permissions

### Required Permissions

- **storage**: Save settings and scan history locally
- **activeTab**: Access current tab for scanning
- **scripting**: Inject content scripts

### Host Permissions

- `*://*.indiamart.com/*`: Access IndiaMArt pages only

### Data Privacy

- All data stored locally on your machine
- No external servers or APIs
- No data collection or tracking

## ⚠️ Disclaimer

This extension is for educational purposes. Users are responsible for:

- Complying with IndiaMArt's Terms of Service
- Ensuring ethical use of automation tools
- Verifying local laws regarding automated contact
- Using Test Mode before live operation

**The developers are not responsible for any account restrictions or violations resulting from misuse.**

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📝 License

MIT License - feel free to modify and distribute.

## 🆘 Support

For issues, questions, or feature requests:

1. Check the troubleshooting section
2. Review browser console logs
3. Open an issue with details:
   - Chrome version
   - Extension version
   - Error messages
   - Steps to reproduce

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Product, age, country, and verification filtering
- Test mode and live mode
- Real-time dashboard
- CSV export
- Duplicate prevention
- Auto-resume across page navigation

---

**Made with ❤️ for IndiaMArt sellers**