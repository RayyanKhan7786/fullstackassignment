import { NextResponse } from 'next/server';
import { draftFollowUpMessage } from '@/lib/ai';
import { getDb } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      leadId,
      name,
      company,
      event,
      notes,
      ai_summary,
      tone = 'warm',
      customPrompt = '',
      senderName = 'Alex',
      apiKey,
      provider,
      autoSave = false
    } = body;

    let leadNotes = notes;
    let leadName = name;
    let leadCompany = company;
    let leadEvent = event;
    let leadSummary = ai_summary;

    const db = getDb();

    if (leadId) {
      const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
      if (existing) {
        leadNotes = leadNotes || existing.notes;
        leadName = leadName || existing.name;
        leadCompany = leadCompany || existing.company;
        leadEvent = leadEvent || existing.event;
        leadSummary = leadSummary || existing.ai_summary;
      }
    }

    const draft = await draftFollowUpMessage({
      name: leadName || 'Contact',
      company: leadCompany || 'Company',
      event: leadEvent || 'Event',
      notes: leadNotes || '',
      ai_summary: leadSummary || '',
      tone,
      customPrompt,
      senderName,
      apiKey,
      provider
    });

    if (autoSave && leadId) {
      // Update draft and if status was pending, update to 'drafted'
      db.prepare(`
        UPDATE leads 
        SET ai_draft = ?, 
            follow_up_status = CASE WHEN follow_up_status = 'pending' THEN 'drafted' ELSE follow_up_status END,
            updated_at = ? 
        WHERE id = ?
      `).run(draft, new Date().toISOString(), leadId);
    }

    return NextResponse.json({
      success: true,
      draft,
      message: 'Follow-up draft created successfully'
    });
  } catch (error) {
    console.error('Error drafting follow-up message:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to draft message' },
      { status: 500 }
    );
  }
}
