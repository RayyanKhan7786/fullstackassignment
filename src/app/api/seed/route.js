import { NextResponse } from 'next/server';
import { getDb, seedInitialLeads } from '@/lib/db';

export async function POST() {
  try {
    const db = getDb();
    db.prepare('DELETE FROM leads').run();
    seedInitialLeads(db);

    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();

    return NextResponse.json({
      success: true,
      message: 'Database reset and reseeded with sample event leads',
      data: leads
    });
  } catch (error) {
    console.error('Error reseeding database:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
