import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();
    const body = await request.json();

    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!existingLead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const updated = {
      id,
      name: body.name !== undefined ? body.name.trim() : existingLead.name,
      company: body.company !== undefined ? body.company.trim() : existingLead.company,
      email: body.email !== undefined ? body.email.trim() : existingLead.email,
      phone: body.phone !== undefined ? body.phone.trim() : existingLead.phone,
      event: body.event !== undefined ? body.event.trim() : existingLead.event,
      notes: body.notes !== undefined ? body.notes.trim() : existingLead.notes,
      follow_up_status: body.follow_up_status !== undefined ? body.follow_up_status : existingLead.follow_up_status,
      priority: body.priority !== undefined ? body.priority : existingLead.priority,
      tags: body.tags !== undefined ? body.tags : existingLead.tags,
      ai_summary: body.ai_summary !== undefined ? body.ai_summary : existingLead.ai_summary,
      ai_draft: body.ai_draft !== undefined ? body.ai_draft : existingLead.ai_draft,
      updated_at: new Date().toISOString()
    };

    const stmt = db.prepare(`
      UPDATE leads SET
        name = @name,
        company = @company,
        email = @email,
        phone = @phone,
        event = @event,
        notes = @notes,
        follow_up_status = @follow_up_status,
        priority = @priority,
        tags = @tags,
        ai_summary = @ai_summary,
        ai_draft = @ai_draft,
        updated_at = @updated_at
      WHERE id = @id
    `);

    stmt.run(updated);

    const result = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = getDb();

    const existingLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!existingLead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM leads WHERE id = ?').run(id);

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
