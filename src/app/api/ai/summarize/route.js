import { NextResponse } from 'next/server';
import { summarizeLeadNotes } from '@/lib/ai';
import { getDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { leadId, name, company, event, notes, apiKey, provider, autoSave = false } = body;

    let leadNotes = notes;
    let leadName = name;
    let leadCompany = company;
    let leadEvent = event;

    const db = getDb();

    if (leadId) {
      const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
      if (existing) {
        leadNotes = leadNotes || existing.notes;
        leadName = leadName || existing.name;
        leadCompany = leadCompany || existing.company;
        leadEvent = leadEvent || existing.event;
      }
    }

    if (!leadNotes || !leadNotes.trim()) {
      return NextResponse.json(
        { success: false, error: 'Notes content is required to generate a summary.' },
        { status: 400 }
      );
    }

    const summary = await summarizeLeadNotes({
      name: leadName || 'Contact',
      company: leadCompany || 'Company',
      event: leadEvent || 'Event',
      notes: leadNotes,
      apiKey,
      provider
    });

    if (autoSave && leadId) {
      db.prepare('UPDATE leads SET ai_summary = ?, updated_at = ? WHERE id = ?')
        .run(summary, new Date().toISOString(), leadId);
    }

    return NextResponse.json({
      success: true,
      summary,
      message: 'Summary generated successfully'
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to summarize notes' },
      { status: 500 }
    );
  }
}
