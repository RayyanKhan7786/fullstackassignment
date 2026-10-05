# ⚡ LeadVortex AI — AI Event Lead & Follow-Up Manager

> An intelligent, full-stack event lead management platform built with **React**, **Next.js**, **Tailwind CSS**, and **SQLite**. Capture, synthesize, organize, and follow up with event contacts at lightning speed using integrated AI.

---

## 🌟 Key Features

### 1. 👥 Complete Lead Lifecycle Management (CRUD)
- **Capture Leads**: Store `name`, `company`, `email`, `phone`, `event`, `notes`, `priority` (🔥 Hot, ⚡ Warm, ❄️ Cold), `follow_up_status` (Pending, Draft Ready, Message Sent, Followed Up, Closed), and custom `tags`.
- **Edit & Delete**: Full modal-driven editing, instant status advancement, and safe deletion.
- **Dual View Modes**:
  - **Table View**: Rich data grid with sorting, quick actions, priority badges, and status selectors.
  - **Kanban Pipeline View**: Visual 5-stage drag & advance board (Pending ➡️ Draft Ready ➡️ Sent ➡️ Followed Up ➡️ Closed).

### 2. 🔍 Real-Time Search & Multi-Dimensional Filtering
- **Faceted Search**: Instant full-text search across name, company, email, event, interaction notes, and tags.
- **Event Filter**: Dynamically populated filter dropdown for all attended conferences/summits.
- **Status & Priority Filters**: 1-click filter pills for Hot/Warm/Cold leads and pipeline stages.
- **Dynamic Sorting**: Sort by Met Date, Name, Company, Event, or Priority in ASC/DESC order.

### 3. ✨ AI-Powered Intelligence
- **Interaction Note Summarizer**: Condenses rambling conversation notes into structured executive takeaways:
  - Key Background & Context
  - Core Pain Points / Topics Discussed
  - Concrete Next Action Items
  - Recommended Urgency & Lead Quality
- **AI Follow-Up Message Generator**:
  - Automatically drafts personalized emails referencing the exact event and discussion points.
  - **4 Tone Presets**: *Warm & Professional*, *Executive Brief*, *Solution Pitch*, *Casual Coffee Chat*.
  - **Custom Focus Input**: Add specific promotional links or call-to-action requests.
  - **1-Click Mail Client Integration**: Generates ready-to-send `mailto:` links with subject & pre-filled body.
  - **Direct Save & Mark as Drafted**: Persists draft to lead and automatically advances lead status.
- **AI Quick Capture / Business Card OCR Extractor**:
  - Paste messy handwritten notes, business card text, or voice transcriptions.
  - AI extracts structured fields (*Name, Company, Email, Phone, Event, Notes, Priority*) ready for 1-click creation.

### 4. 📊 Analytics Dashboard & CSV Export
- **Pipeline Velocity**: Real-time KPI metrics for Total Leads, Hot Opportunities, Pending Actions, and Conversion Rate.
- **Visual Distribution**: Pipeline stage breakdown bars and priority intent distribution.
- **Top Yielding Events**: See which conferences produce the highest volume of high-intent leads.
- **1-Click CSV Export**: Download a full, structured CSV export of all leads for CRM synchronization (Salesforce, HubSpot).

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend UI** | **React 19** (pure JavaScript/JSX) | Component-driven UI with state hooks, modals, and reactive updates |
| **Styling** | **Tailwind CSS v4** + Vanilla CSS | Modern glassmorphism dark aesthetic, custom gradients, badge systems |
| **Fullstack Framework** | **Next.js (App Router)** | High-performance server routes, fast bundling with Turbopack |
| **Database** | **SQLite** (via `better-sqlite3`) | Zero-latency, zero-configuration local database with WAL mode |
| **AI Engine** | **Google Gemini 1.5 Flash** + **Intelligent Built-In Engine** | Zero-config out-of-the-box mode with optional live Gemini API key support |
| **Icons & Effects** | `lucide-react` & `canvas-confetti` | Crisp visual hierarchy and delightful micro-interactions |

---

## 📐 Architecture & Key Design Decisions

```
event-lead-manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── leads/              # GET (search/filter/sort), POST (create)
│   │   │   │   └── [id]/           # GET, PUT (update), DELETE (remove)
│   │   │   ├── ai/
│   │   │   │   ├── summarize/      # AI meeting notes synthesis endpoint
│   │   │   │   ├── draft-message/  # AI personalized follow-up generation
│   │   │   │   └── smart-extract/  # Business card / raw notes parser
│   │   │   ├── stats/              # Real-time pipeline & event analytics
│   │   │   ├── export/             # Formatted CSV download stream
│   │   │   └── seed/               # Sample data reset & reseed endpoint
│   │   ├── globals.css             # Glassmorphism, animations, theme tokens
│   │   ├── layout.js               # Metadata & responsive app shell
│   │   └── page.js                 # Unified state orchestrator & UI views
│   ├── components/
│   │   ├── Navbar.js               # Logo, quick actions, primary CTA
│   │   ├── StatsBanner.js          # KPI metric cards with 1-click filter hooks
│   │   ├── LeadTable.js            # Interactive table with badges & actions
│   │   ├── LeadKanban.js           # 5-column stage progression board
│   │   ├── LeadModal.js            # Add/Edit modal with integrated AI tool
│   │   ├── AiDraftModal.js         # Follow-up generator with tones & mailto
│   │   ├── AiSummaryModal.js       # Executive summary modal
│   │   ├── AiSmartCaptureModal.js  # Raw transcript / card text extractor
│   │   ├── AnalyticsModal.js       # Visual charts & ROI breakdown
│   │   └── SettingsModal.js        # AI key & sender personalization
│   └── lib/
│       ├── db.js                   # SQLite database manager & schema init
│       └── ai.js                   # Gemini LLM + Contextual Fallback Engine
├── data/
│   └── leads.db                    # Persistent SQLite database file
├── package.json
└── README.md
```

### Key Architectural Choices:
1. **Zero-Configuration Fallback AI Engine**:
   - The application does **NOT** crash or block if the user has not configured a Gemini API key.
   - It includes an intelligent contextual heuristic NLP synthesizer that generates realistic structured summaries, email drafts, and extracted lead profiles immediately.
   - Users can optionally enter a live `GEMINI_API_KEY` in the UI Settings modal or via `.env` to switch to live Gemini 1.5 Flash LLM generation.
2. **Persistent Embedded Database**:
   - Uses `better-sqlite3` for persistent storage in `data/leads.db`.
   - Automatically bootstraps with 5 realistic sample leads across major tech conferences (*TechCrunch Disrupt, AWS Summit, FinTech Nexus, SaaS Growth Summit, AI Hardware Expo*) upon first launch.
3. **Pure JavaScript (No TypeScript)**:
   - Scaffolding and components are built in clean, modern JavaScript/JSX with ES modules.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd event-lead-manager

# Install dependencies
npm install
```

### 2. (Optional) Set Environment Variables
Create a `.env.local` file in the project root if you wish to use a live Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If omitted, the app will seamlessly use its built-in intelligent AI engine!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads` | List leads with `search`, `event`, `status`, `priority`, `sortBy`, `sortOrder` |
| `POST` | `/api/leads` | Create a new lead record |
| `GET` | `/api/leads/:id` | Fetch a single lead by ID |
| `PUT` | `/api/leads/:id` | Update lead fields, notes, status, or AI drafts |
| `DELETE` | `/api/leads/:id` | Delete lead record |
| `POST` | `/api/ai/summarize` | Generate structured AI bullet points from meeting notes |
| `POST` | `/api/ai/draft-message` | Generate personalized follow-up email draft with tone options |
| `POST` | `/api/ai/smart-extract` | Extract structured lead fields from raw text or business card OCR |
| `GET` | `/api/stats` | Retrieve aggregate metrics and event breakdown |
| `GET` | `/api/export` | Download full database in CSV format |
| `POST` | `/api/seed` | Reset and reseed database with realistic sample leads |

---

## 📄 License
MIT License. Built for the Technical Assignment.
