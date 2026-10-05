import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const event = searchParams.get('event') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = {};

    if (search) {
      query += ` AND (
        name LIKE @search OR 
        company LIKE @search OR 
        email LIKE @search OR 
        event LIKE @search OR 
        notes LIKE @search OR 
        tags LIKE @search
      )`;
      params.search = `%${search}%`;
    }

    if (event && event !== 'all') {
      query += ' AND event = @event';
      params.event = event;
    }

    if (status && status !== 'all') {
      query += ' AND follow_up_status = @status';
      params.status = status;
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = @priority';
      params.priority = priority;
    }

    // Allowed sort columns for SQL safety
    const allowedSortCols = ['created_at', 'name', 'company', 'event', 'priority', 'follow_up_status'];
    const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';

    query += ` ORDER BY ${safeSortCol} ${sortOrder}`;

    const leads = db.prepare(query).all(params);

    // Also get unique events list for dropdown filtering
    const eventsList = db.prepare("SELECT DISTINCT event FROM leads WHERE event IS NOT NULL AND event != '' ORDER BY event ASC").all().map(e => e.event);

    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length,
      events: eventsList
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    const body = await request.json();

    const {
      name,
      company,
      email,
      phone = '',
      event,
      notes = '',
      follow_up_status = 'pending',
      priority = 'Warm',
      tags = '',
      ai_summary = '',
      ai_draft = ''
    } = body;

    // Validation
    if (!name?.trim() || !company?.trim() || !email?.trim() || !event?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, company, email, and event are required fields.' },
        { status: 400 }
      );
    }

    const id = body.id || 'lead-' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO leads (
        id, name, company, email, phone, event, notes, 
        follow_up_status, priority, tags, ai_summary, ai_draft, 
        created_at, updated_at
      ) VALUES (
        @id, @name, @company, @email, @phone, @event, @notes, 
        @follow_up_status, @priority, @tags, @ai_summary, @ai_draft, 
        @created_at, @updated_at
      )
    `);

    stmt.run({
      id,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      event: event.trim(),
      notes: notes?.trim() || '',
      follow_up_status: follow_up_status || 'pending',
      priority: priority || 'Warm',
      tags: tags?.trim() || '',
      ai_summary: ai_summary?.trim() || '',
      ai_draft: ai_draft?.trim() || '',
      created_at: now,
      updated_at: now
    });

    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    return NextResponse.json({
      success: true,
      data: newLead,
      message: 'Lead created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}
