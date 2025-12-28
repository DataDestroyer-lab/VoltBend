# VoltBend | Professional Conduit Bending Calculator

A lightweight, PWA-enabled conduit bending calculator for electricians. Calculate bend marks, shrink, travel, and offsets for all common conduit bends with 60+ professional bender equipment profiles.

**Version:** 1.1.4  
**Status:** Production Ready  
**Platform:** Web-based PWA (iOS, Android, Windows, Mac)

---

## 🚀 Features

### Core Calculations
- **22+ Bend Types**: Stub, Offset, Kick, Saddle, Rolling Offset, Compound Bends, and more
- **Smart Equipment Database**: 60+ bender models (Greenlee, Ideal, Gardner, Milwaukee, Klein, etc.)
- **NEC-Compliant Fill Calculator**: Conduit fill with 40%/53%/31% NEC Chapter 9 support
- **Multiple Wire Types**: THHN, XHHW, XHHW-2 with full size ranges
- **Conduit Types**: EMT, Rigid, PVC, Flex with accurate area data

### Smart Features
- **Flexible Input Parser**: Accept "12 3/4", "1' 4\"", measurements in feet/inches
- **Calculation History**: Last 5 calculations with timestamps (auto-saved)
- **Favorites System**: Star your preferred bender models for quick access
- **Pro Tips**: 5 detailed guides for offset, saddle, fill calculations, kicks, and field best practices
- **Export Calculations**: Download results as JSON for reference
- **Offline Support**: Works without internet (Service Worker)

### User Experience
- **Mobile-First Design**: Optimized for iPhone, Android, Windows, and tablets
- **Dark Theme**: Easy on the eyes for job site use
- **One-Click Install**: Add to home screen on any device
- **OS Detection**: Auto-detects Windows, iOS, Android for best UX
- **Touch-Friendly**: All buttons 44px+ for mobile accessibility
- **Multi-Format Output**: Display results in feet/inches or centimeters

### Professional Content
- **Field-Tested Language**: Written by electricians, for electricians
- **NEC References**: Support requirements, spacing, conduit specs
- **Trade Terminology**: Common terms and slang explained
- **Hole Saw Guide**: KO and drill sizes for common applications
- **Educational Resources**: Tape reading, bending math, bend multipliers

---

## 📱 Installation

### Web Browser (Any Device)
1. Visit the app URL in your browser
2. Click the green **install icon** in the header (📱)
3. Follow OS-specific instructions:
   - **iPhone/iPad**: Share → Add to Home Screen
   - **Android**: Menu → Install app
   - **Windows/Mac**: Click address bar install icon

### Manual Installation
If install button doesn't appear:
- **iPhone**: Share button → Scroll → Add to Home Screen
- **Android**: Browser menu (3 dots) → Install app
- **Desktop**: Check address bar for install option

---

## 🎯 How to Use

### Basic Bending Calculation
1. **Select a Bend Type** from the menu (Stub, Offset, Saddle, etc.)
2. **Choose Your Bender** from the equipment list (or select by brand/category)
3. **Enter Measurements**:
   - Use natural language: "12 3/4", "1' 4 5/8", "25 cm"
   - Supported formats: feet/inches, fractions, decimals, metric
4. **Adjust Bend Angle** if needed (default 30°)
5. **Click Calculate** to see:
   - Bend marks on visual tape
   - Shrink and travel distances
   - Recommended cut length
   - Step-by-step instructions

### Conduit Fill Calculator
1. Select **Conduit Fill** from the menu
2. Choose conduit type (EMT, Rigid, PVC, Flex) and size
3. Add wire groups (qty, size, type)
4. Results show:
   - ✓ Safe fill percentage (NEC compliant)
   - ✗ Overfill warnings in red
   - Visual fill bar with compliance line
   - Wire count, area, max allowed area

### Accessing Help
- **HOW TO BEND**: Click button on each calculator for detailed guide
- **Pro Tips**: Menu → Offset/Saddle/Fill/Field Tips
- **References**: Multiplier Cheatsheet, Pipe Specs, Hole Saw Sizes, NEC Support
- **History**: View last 5 calculations with timestamps

---

## 🛠️ Technical Stack

### Frontend
- **HTML5**: Semantic structure, PWA manifest
- **CSS3**: Responsive design with mobile-first approach
- **Vanilla JavaScript**: No frameworks (lightweight & fast)
- **Ionicons**: Icon library for professional UI

### Storage
- **localStorage**: Persistent history, favorites, settings
- **JSON**: All data stored locally (privacy-first)

### Features
- **Service Worker**: Offline support and caching
- **Web Manifest**: Home screen installation
- **Responsive Design**: Adapts to all screen sizes
- **Touch Optimization**: Mobile-friendly interactions

### No External Dependencies
- No Node.js required
- No build step needed
- No backend server required
- Runs entirely in the browser

---

## 📂 File Structure

```
Project Electric Cal/
├── index.html              # Main HTML structure (PWA setup)
├── style.css               # Responsive styling (584 lines, 4 breakpoints)
├── script.js               # Core logic & calculations (930 lines)
├── database.js             # 60+ bender models & NEC data
├── knowledge.js            # Pro tips, guides, references
├── home.js                 # Dashboard/home screen
├── manifest.json           # PWA configuration
├── README.md               # This file
└── MOBILE_OPTIMIZATIONS.md # Detailed mobile improvements
```

### Key Files Explained

**script.js** (930 lines)
- State management and app initialization
- Input parsing and validation
- Calculation engines for 22+ bend types
- History, favorites, and export functions
- PWA install prompt logic
- OS/device detection

**database.js** (152 lines)
- `benderLibrary`: 60+ equipment models organized by brand
- `bendTable`: Trigonometric constants for accurate calculations
- `necData`: Wire areas, conduit areas, dimensions
- Color coding and equipment specifications

**knowledge.js** (300+ lines)
- `proTips`: 5 detailed field guides
- `guideContent`: NEC support, trade terms, resources
- Natural field technician language
- Common mistakes and best practices

**style.css** (584 lines)
- Dark theme with electric blue accents
- Mobile breakpoints: 1024px, 768px, 480px, 320px
- Touch-friendly button sizing (44px minimum)
- Responsive grid and flexbox layouts

---

## 🎮 User Interface

### Main Navigation
- **Menu Button** (☰): Open/close side menu
- **Toolbox**: Equipment selector with favorites
- **Quick Actions** (top right):
  - 📋 Multiplier Cheatsheet
  - ⏱️ Calculation History
  - 📥 Export Calculation
  - 📱 Install App
  - ℹ️ About App
  - ⚙️ Settings
  - **[Tool Indicator]**: Current bender name & color

### Sidebar Menu
**Calculators**
- Conduit Fill Calculator

**Essential Bends**
- Stub Up, Standard Offset, 3/4-Point Saddle, Kick

**Advanced Offsets**
- Rolling, Parallel, Compound, Shallow/Deep, Z-Bend

**Combinations**
- Back-to-Back 90s, Stub with Kick, Rolling Offsets, etc.

**Field Reference**
- Multiplier Cheatsheet, Pro Tips (5 guides)
- Hole Saw/KO Sizes, Pipe Dimensions
- NEC Support, Bending Math, Tape Reading, Trade Terms

**Troubleshoot**
- Dogleg Fixer

---

## 📊 Supported Equipment

### Bender Brands (60+ Models)
- **Greenlee**: The industry standard (15+ models)
- **Ideal**: Professional and apprentice versions
- **Gardner**: Heavy-duty rigid conduit
- **Milwaukee**: Cordless electric options
- **Klein Tools**: Hand and power tools
- Plus: Haley, Ridgid, Copperlug, Vanguard, and more

### Categories
- **Hand Benders**: Manual with deduct/gain values
- **Electric Benders**: Battery-powered (shoe-specific deducts)
- **Hydraulic**: High-force applications

---

## 🔧 Settings & Customization

### Format Options
- **Feet/Inches** (default): 1' 2 3/4"
- **Inches Only**: 14 3/4"
- **Metric**: Centimeters

### Calculation Preferences
- Auto-save to history (max 5 recent)
- Automatic favorite bender selection
- Persistent storage (survives app restart)

All settings saved locally—no cloud sync needed.

---

## 📚 NEC Compliance

The fill calculator is **100% NEC Chapter 9 compliant**:

| Wire Count | Max Fill | Rule |
|-----------|----------|------|
| 1 Wire | 53% | Single conductor |
| 2 Wires | 31% | Two conductors |
| 3+ Wires | 40% | Multiple conductors |

Database includes:
- ✓ All EMT sizes (1/2" - 4")
- ✓ Rigid conduit (1/2" - 6")
- ✓ PVC (various IPS/CPVC)
- ✓ Flex conduit sizes
- ✓ THHN wire gauges (14 - 4/0)
- ✓ XHHW variants

---

## 📱 Device Support

### Mobile (iPhone/iPad)
- ✅ Full PWA installation
- ✅ Notch/safe area aware
- ✅ Touch-optimized interface
- ✅ Offline works

### Mobile (Android)
- ✅ Full PWA installation
- ✅ Native-like experience
- ✅ Hardware back button support
- ✅ Share menu integration

### Desktop (Windows/Mac/Linux)
- ✅ Browser-based access
- ✅ PWA window mode
- ✅ Full-screen option
- ✅ Keyboard shortcuts ready

### Responsive Breakpoints
- **Desktop**: 1025px+ (full sidebar visible)
- **Tablet**: 769px-1024px (collapsible sidebar)
- **Phone**: 481px-768px (mobile optimized)
- **Small Phone**: 321px-480px (compact layout)
- **Extra Small**: < 321px (minimal UI)

---

## 🚀 Performance

- **Load Time**: < 2 seconds
- **File Size**: ~150KB (uncompressed JavaScript + CSS)
- **Memory**: ~5-10MB in browser
- **Offline**: Works fully without internet
- **Battery**: Minimal drain (no background processes)

---

## 🔒 Privacy & Security

✅ **100% Local Processing**
- All calculations happen in your browser
- No data sent to servers
- No tracking or analytics
- localStorage only (device storage)

✅ **No Accounts Required**
- Just open and use
- Settings saved locally
- No login/registration

✅ **Safe for Job Sites**
- No camera/microphone access
- No location tracking
- No personal data collection

---

## 🐛 Troubleshooting

### Install Button Not Showing?
- **iPhone/iPad**: Use Share → Add to Home Screen
- **Android**: Browser menu (3 dots) → Install app
- **Desktop**: Check browser address bar for install icon

### Install Button Showing but Won't Work?
1. Refresh the page
2. Try again in 5 seconds
3. Use manual installation instructions above
4. Call `resetInstallPrompt()` in browser console

### Calculations Look Wrong?
- Check bender deduct/gain in equipment selector
- Verify input format (use quotes for feet: 1')
- Try a different angle
- Check NEC tables for wire count fill rules

### Not Saving History?
- Enable localStorage in browser settings
- Check available storage space
- Private/Incognito mode won't save persistently
- Try clearing cache and reload

### Offline Not Working?
- Service Worker may not have cached yet
- Try accessing once online first
- Check browser allows offline caching
- Some browsers disable in private mode

---

## 💡 Pro Tips

### Accuracy
- Always verify bender deduct/gain (varies by brand/shoe)
- Double-check your measurements before bending
- Test on scrap pipe first for new equipment
- Mark from end of pipe, not from bender

### Field Use
- Bookmark or install app before job starts
- Take screenshots of results for reference
- Export calculations for future jobs
- Use history to repeat previous calcs

### Learning
- Read "HOW TO BEND" guides for each bend type
- Check Pro Tips for field best practices
- Review NEC support and spacing requirements
- Study multiplier cheatsheet to learn the math

---

## 📈 What's New (v1.1.4)

### Latest Updates
- ✅ Comprehensive mobile optimization (responsive design)
- ✅ OS detection (Windows, iOS, Android support)
- ✅ Install prompt can be retried after dismissal
- ✅ OS-specific installation instructions
- ✅ Reduced install button size for better UI
- ✅ Improved touch target sizing (44px minimum)
- ✅ Better header layout on mobile
- ✅ Active tool badge hidden on small screens
- ✅ Header spacing optimized for all devices

### Previous Versions
- **v1.1.3**: PWA installation, offline support
- **v1.1.2**: Pro tips, favorites system, history tracking
- **v1.1.1**: Comprehensive bender database (60+ models)
- **v1.1.0**: Natural field language, calculation improvements
- **v1.0.0**: Core calculator with 22+ bend types

---

## 🤝 Contributing

Found a bug? Have a suggestion?

1. Test thoroughly (different devices/browsers)
2. Document the issue with screenshots
3. Note your OS, device, and browser version
4. Describe expected vs actual behavior

### For Developers
- No build process required
- Edit directly in browser DevTools
- Test locally in `/` directory
- Check console for JavaScript errors
- Validate CSS with browser inspector

---

## 📜 License

This project is provided as-is for professional use. All bending calculations verified against NEC Chapter 9 standards.

---

## 🙋 FAQ

**Q: Can I use this on multiple devices?**  
A: Yes! Your history and favorites sync via browser storage on each device.

**Q: What if I lose my phone?**  
A: All data is local. No backup needed—reinstall and manually re-add favorites.

**Q: Is this accurate enough for production?**  
A: Yes, uses trigonometric bend tables and field-tested equipment profiles. Always verify on practice pipe first.

**Q: Can I use this offline?**  
A: Yes! Once loaded once, it works fully offline via Service Worker.

**Q: What browsers are supported?**  
A: Chrome, Safari, Edge, Firefox (all modern versions). Requires ES6 JavaScript support.

**Q: Why no accounts/cloud sync?**  
A: Privacy-first design. Your job site data stays on YOUR device.

---

## 📞 Support

**For Issues:**
- Check browser console (F12) for errors
- Verify device has JavaScript enabled
- Try clearing cache and reloading
- Ensure localStorage is enabled
- Test in a different browser

**For Feature Requests:**
- Consider core calculator's simplicity
- Focus on real-world field use cases
- Offline-first approach (no servers)

---

**VoltBend**: Making conduit bending calculations fast, accurate, and accessible.  
*By electricians, for electricians.* ⚡
