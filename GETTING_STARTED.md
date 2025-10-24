# 🚀 Getting Started - Run Locally

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages (React, Vite, Tailwind, Framer Motion, etc.)

### Step 2: Start Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 3: Open in Browser
The app should automatically open in your default browser at:
```
http://localhost:3000
```

If it doesn't open automatically, just click the link in your terminal or manually navigate to `http://localhost:3000`

## 🎮 Try It Out!

Once the app loads, you'll see:

**Left Side**: Sample contract document  
**Right Side**: AI chat interface with 3 quick action buttons

**Try these demos:**

1. **Click "Who has approved so far?"**
   - Watch the approval workflow UI spawn
   - Check the approval box to approve
   - See real-time updates

2. **Click "What is high risk in indemnification clause?"**
   - See the risk analysis report spawn
   - Click "View in document" to highlight the clause
   - Click "Apply suggested change" to update the document

3. **Click "I'm ready to sign"**
   - Walk through the signature wizard
   - Add signatories
   - Place signature blocks
   - Send for signature

4. **Type in the chat:**
   - "What's the payment term?"
   - "When does this expire?"
   - "Summarize this document"

## 🛠️ Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Install dependencies
npm install
```

## 🔥 Hot Reload

The dev server includes **hot module replacement (HMR)**:
- Edit any file in `src/`
- Changes appear instantly in browser
- No page refresh needed!

## 📂 Key Files to Explore

```
src/
├── App.jsx                          # Main app - start here!
├── components/
│   ├── DocumentViewer/
│   │   └── DocumentViewer.jsx       # Left panel - document view
│   ├── Sidepane/
│   │   ├── ChatInterface.jsx        # Chat with quick buttons
│   │   └── DynamicUIArea.jsx        # Where spawned UIs appear
│   └── SpawnedUI/
│       ├── ApprovalWorkflow.jsx     # Button 1 UI
│       ├── RiskAnalysisReport.jsx   # Button 2 UI
│       └── SignatureWizard.jsx      # Button 3 UI
└── data/
    ├── sampleDocument.js            # Edit the contract text here
    ├── cannedResponses.js           # Add/edit chat responses
    └── riskAnalysis.js              # Edit risk analysis data
```

## 🎨 Customization Ideas

**Change the document:**
Edit `src/data/sampleDocument.js`

**Add new chat responses:**
Edit `src/data/cannedResponses.js`

**Change colors:**
Edit `tailwind.config.js`

**Modify animations:**
Components use Framer Motion - edit any `.jsx` file

## 🐛 Troubleshooting

**"npm: command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal

**Port 3000 already in use?**
- Vite will automatically try port 3001, 3002, etc.
- Or specify: `npm run dev -- --port 3005`

**Blank page in browser?**
- Check terminal for errors
- Open browser DevTools (F12) and check Console tab
- Make sure `npm install` completed successfully

**Changes not showing?**
- Check terminal - dev server should still be running
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- If stuck, stop server (Ctrl+C) and restart: `npm run dev`

## 📦 Before Deploying to Vercel

Test the production build locally:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

This will:
1. Build optimized production files in `dist/`
2. Start a preview server (usually at `http://localhost:4173`)
3. Let you test the production version locally

If the preview works, you're ready to deploy!

## 🚀 Deploy to Vercel

Once you're happy with local testing:

```bash
# Option 1: Using Vercel CLI
npm install -g vercel
vercel

# Option 2: Push to GitHub and connect in Vercel dashboard
git add .
git commit -m "Initial commit"
git push
# Then connect repo at vercel.com
```

---

## ✅ Success Checklist

- [ ] Ran `npm install` without errors
- [ ] Ran `npm run dev` and server started
- [ ] App opened in browser at localhost:3000
- [ ] Clicked all 3 quick action buttons
- [ ] Tested chat with a few queries
- [ ] Tried the approval workflow
- [ ] Viewed risk analysis and applied a change
- [ ] Went through signature wizard
- [ ] Ran `npm run build` successfully
- [ ] Previewed production build with `npm run preview`

If all items are checked, you're ready to deploy! 🎉

