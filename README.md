# AI-Spawned UI Demo

> A demonstration of how AI can dynamically spawn contextual user interfaces in response to user queries.

## 🎯 Overview

This is a **100% client-side, serverless** demonstration application that showcases intelligent UI generation for contract review, approval workflows, and document signing processes. No backend required!

## ✨ Features

### 📋 Approval Workflow Management
- Visualize approval status across multiple stakeholders
- Interactive approval with real-time updates
- Send approval requests to team members

### ⚠️ Risk Analysis
- Automated clause risk assessment
- Color-coded severity indicators (High/Medium/Low)
- One-click document updates with suggested changes
- Document highlighting for specific clauses

### ✍️ Signature Placement
- Multi-step signature wizard
- Configure multiple signatories
- Auto-place signature blocks in document
- Email integration for sending documents

### 💬 AI Chat Interface
- Natural language interaction
- Pre-defined quick action buttons
- Canned responses with contextual UI spawning
- Typing indicators and smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation & Running

**Option 1: Use the startup script (easiest)**
```bash
# Windows
start.bat

# Mac/Linux
./start.sh
```

**Option 2: Manual commands**
```bash
# Clone or navigate to the project directory
cd spawn_ui

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

**Troubleshooting:** If you see a blank page, check the terminal output for the actual URL (might be 3001, 3002 if 3000 is busy)

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🌐 Deployment

This app is **100% serverless** and can be deployed to any static hosting service:

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Follow the prompts
4. For production: `netlify deploy --prod`

### Deploy to GitHub Pages
1. Update `vite.config.js` with your repo name as base
2. Run: `npm run build`
3. Deploy the `dist/` folder to GitHub Pages

### Deploy to Any Static Host
Simply upload the contents of the `dist/` folder after running `npm run build` to:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Firebase Hosting
- Any web server (Apache, Nginx, etc.)

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React useState (no external libraries needed!)

## 📁 Project Structure

```
spawn_ui/
├── src/
│   ├── components/
│   │   ├── DocumentViewer/
│   │   │   └── DocumentViewer.jsx     # Document display with highlighting
│   │   ├── Sidepane/
│   │   │   ├── Sidepane.jsx           # Right panel container
│   │   │   ├── ChatInterface.jsx      # AI chat with quick actions
│   │   │   └── DynamicUIArea.jsx      # Spawned UI container
│   │   └── SpawnedUI/
│   │       ├── ApprovalWorkflow.jsx   # Approval visualization
│   │       ├── RiskAnalysisReport.jsx # Risk assessment UI
│   │       └── SignatureWizard.jsx    # Signature placement flow
│   ├── data/
│   │   ├── sampleDocument.js          # Demo contract content
│   │   ├── approvalWorkflow.js        # Workflow state data
│   │   ├── cannedResponses.js         # Chat response matching
│   │   └── riskAnalysis.js            # Risk assessment data
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎮 How to Use

### Quick Actions
Click any of the three quick action buttons to see AI-spawned UIs:

1. **"Who has approved so far?"**
   - See approval workflow status
   - Approve the document yourself
   - Send approval requests

2. **"What is high risk in indemnification clause?"**
   - View detailed risk analysis
   - Apply suggested changes
   - Jump to document clauses

3. **"I'm ready to sign"**
   - Configure signatories
   - Place signature blocks
   - Send for signature

### Chat Interface
Type natural language queries like:
- "What's the payment term?"
- "When does this expire?"
- "Summarize this document"
- "Show me risks"

The AI will respond with relevant information and spawn appropriate UIs.

## 🎨 Customization

### Adding New Canned Responses
Edit `src/data/cannedResponses.js`:

```javascript
export const cannedResponses = {
  myNewResponse: {
    keywords: ['custom', 'trigger', 'words'],
    response: "AI response text here",
    spawnComponent: 'ComponentName' // or null
  }
}
```

### Creating New Spawned UI Components
1. Create component in `src/components/SpawnedUI/`
2. Import in `src/components/Sidepane/DynamicUIArea.jsx`
3. Add case in the switch statement
4. Reference in canned responses

### Styling
- Global colors: `tailwind.config.js`
- Component styles: Tailwind classes in JSX
- Custom CSS: `src/index.css`

## 🎯 Demo Scenarios

### Scenario 1: Approval Flow (30 seconds)
1. Click "Who has approved so far?"
2. Review workflow status
3. Check the approval box
4. Watch real-time updates

### Scenario 2: Risk Review (60 seconds)
1. Click "What is high risk..."
2. Review risk items
3. Click "View in document"
4. Apply suggested change
5. See document update

### Scenario 3: Signature Process (90 seconds)
1. Click "I'm ready to sign"
2. Configure 2 signatories
3. Place signature blocks
4. Send for signature

## 🔒 Security Note

This is a **demonstration application** with:
- No real authentication
- No backend API calls
- Hardcoded sample data
- Simulated AI responses

**Do not use for production contract management without:**
- Proper authentication/authorization
- Secure backend API
- Real document storage
- Actual AI/ML integration
- Compliance with legal requirements

## 📝 License

This is a demonstration project. Feel free to use as a reference or starting point for your own projects.

## 🙋‍♂️ Support

For questions or issues:
1. Check the code comments
2. Review the spec: `PRODUCT_SPEC.md`
3. Inspect browser console for errors

## 🚀 Next Steps

To turn this into a production application, consider:

1. **Backend Integration**
   - Real API endpoints
   - Document storage (S3, etc.)
   - Database for workflows
   - Authentication (OAuth, JWT)

2. **Real AI Integration**
   - OpenAI GPT-4 API
   - Claude API
   - Custom trained models
   - RAG for document analysis

3. **Production Features**
   - Multi-user collaboration
   - Real-time sync (WebSockets)
   - Document version control
   - Audit trails
   - E-signature integration (DocuSign, HelloSign)
   - PDF generation

4. **Enterprise Features**
   - SSO integration
   - Role-based access control
   - Compliance certifications
   - SLA guarantees
   - Custom branding

---

**Built with ❤️ to demonstrate the future of adaptive user interfaces**

🌟 **100% Serverless • Zero Configuration • Instant Deploy**

