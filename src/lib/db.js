import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path in root of the project
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'leads.db');

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db) {
  // Create leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event TEXT NOT NULL,
      notes TEXT NOT NULL,
      follow_up_status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'Warm',
      tags TEXT,
      ai_summary TEXT,
      ai_draft TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if table is empty, if so, seed sample realistic event leads
  const count = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  if (count === 0) {
    seedInitialLeads(db);
  }
}

export function seedInitialLeads(db = getDb()) {
  const sampleLeads = [
    {
      id: 'lead-101',
      name: 'Sarah Chen',
      company: 'Apex AI Systems',
      email: 'sarah.chen@apex-ai.io',
      phone: '+1 (415) 890-3412',
      event: 'TechCrunch Disrupt 2026',
      notes: 'VP of Engineering. Met at the AI Infrastructure booth. Looking for automated workflow tools to reduce API latency. Mentioned they have budget approved for Q2. Very interested in our SDK integration.',
      follow_up_status: 'pending',
      priority: 'Hot',
      tags: 'Decision Maker, Enterprise, AI Tech, Q2 Budget',
      ai_summary: '• VP of Engineering with Q2 budget approved.\n• Pain point: API latency in AI pipelines.\n• Action: Send technical SDK documentation and schedule a 20-min architecture demo.',
      ai_draft: 'Hi Sarah,\n\nIt was great meeting you at the AI Infrastructure booth at TechCrunch Disrupt today! \n\nI loved our conversation about streamlining API latencies for Apex AI Systems. As promised, I\'m sharing our SDK documentation and would love to set up a quick 20-minute technical walkthrough with our solution architect.\n\nWould this Thursday or Friday afternoon work for a brief call?\n\nBest regards,\nAlex',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'lead-102',
      name: 'Marcus Vance',
      company: 'HyperScale Cloud',
      email: 'marcus.v@hyperscale.com',
      phone: '+1 (206) 555-0199',
      event: 'AWS Summit San Francisco',
      notes: 'Head of Developer Relations. Discussed co-hosting a developer webinar next month on cloud cost optimization. They have 45k active community members. Need to share deck by end of week.',
      follow_up_status: 'drafted',
      priority: 'Warm',
      tags: 'Partnership, DevRel, Webinar, High Reach',
      ai_summary: '• DevRel Lead exploring co-marketing webinar.\n• Audience size: 45k developer community.\n• Action: Send co-marketing proposal deck and draft webinar topic outlines.',
      ai_draft: 'Hi Marcus,\n\nFantastic chatting with you at AWS Summit yesterday! I\'m really excited about partnering on the cloud cost optimization developer webinar for your community.\n\nI\'ve attached an initial outline with 3 proposed session formats and dates for next month. Let me know which angle resonates best with your team!\n\nCheers,\nAlex',
      created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    },
    {
      id: 'lead-103',
      name: 'Elena Rostova',
      company: 'FinVanguard Partners',
      email: 'e.rostova@finvanguard.capital',
      phone: '+1 (212) 778-9902',
      event: 'FinTech Nexus 2026',
      notes: 'Principal Investor. Focused on Series A B2B SaaS in vertical compliance. Asked for our latest metrics, ARR growth rate, and customer churn stats. Wants to introduce us to their portfolio partner.',
      follow_up_status: 'followed_up',
      priority: 'Hot',
      tags: 'Investor, Series A, FinTech, High Priority',
      ai_summary: '• VC Principal interested in Series A round.\n• Requested: ARR metrics, growth deck, churn rates.\n• Action: Send investor one-pager and coordinate portfolio partner introduction.',
      ai_draft: 'Dear Elena,\n\nThank you for the insightful conversation at FinTech Nexus. Following up on your request, I\'ve attached our Q1 growth overview including ARR velocity and key retention metrics.\n\nWe would be thrilled to connect with your portfolio partner as discussed. Let me know when suits you best.\n\nWarm regards,\nAlex',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      id: 'lead-104',
      name: 'David Kim',
      company: 'Nexus Robotics',
      email: 'dkim@nexusrobotics.de',
      phone: '+49 89 2441 5560',
      event: 'Global Robotics & AI Expo',
      notes: 'Product Manager. Looking for edge telemetry solutions. Currently evaluating 3 competing vendors. Timeline is late Q3. Keep in touch with quarterly newsletter.',
      follow_up_status: 'pending',
      priority: 'Cold',
      tags: 'Product, Hardware/Edge, Q3 Timeline, Evaluation',
      ai_summary: '• Evaluating 3 vendors for Q3 edge telemetry rollout.\n• Action: Send comparative feature sheet and add to quarterly product updates.',
      ai_draft: 'Hi David,\n\nGreat meeting you at the Global Robotics & AI Expo. Here is a brief feature overview comparing our edge telemetry reliability metrics.\n\nI understand your rollout is scheduled for Q3, so I\'ll check back in closer to mid-summer. Feel free to reach out if any questions arise in the meantime!\n\nBest,\nAlex',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      id: 'lead-105',
      name: 'Amara Okafor',
      company: 'Zenith Logistics Global',
      email: 'a.okafor@zenith-logistics.com',
      phone: '+44 20 7946 0192',
      event: 'SaaS Growth Summit 2026',
      notes: 'Chief Operating Officer. Met at executive roundtable lunch. Frustrated with manual lead routing across regional teams. Needs enterprise SOC-2 compliance and SSO. Ready for pilot next month if security checks pass.',
      follow_up_status: 'sent',
      priority: 'Hot',
      tags: 'C-Suite, Enterprise, Security/SOC2, High Value',
      ai_summary: '• COO seeking automated lead routing solution.\n• Critical requirements: SOC-2 Type II, SSO, multi-region routing.\n• Action: Send security compliance packet and schedule pilot scoping call.',
      ai_draft: 'Dear Amara,\n\nIt was a pleasure speaking with you during today\'s executive roundtable at the SaaS Growth Summit. \n\nI appreciated learning about Zenith\'s global routing challenges. I have attached our SOC-2 Type II compliance summary and SSO integration documentation. We\'d love to outline what a tailored 14-day pilot would look like for your regional teams.\n\nLooking forward to speaking soon,\nAlex',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO leads (id, name, company, email, phone, event, notes, follow_up_status, priority, tags, ai_summary, ai_draft, created_at, updated_at)
    VALUES (@id, @name, @company, @email, @phone, @event, @notes, @follow_up_status, @priority, @tags, @ai_summary, @ai_draft, @created_at, @updated_at)
  `);

  const insertMany = db.transaction((leads) => {
    for (const lead of leads) {
      stmt.run(lead);
    }
  });

  insertMany(sampleLeads);
}
