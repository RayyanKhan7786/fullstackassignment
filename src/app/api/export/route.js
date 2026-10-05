import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();

    // Generate CSV string
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Event', 'Status', 'Priority', 'Tags', 'Notes', 'AI Summary', 'Created At'];
    
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map(l => [
      escapeCsv(l.id),
      escapeCsv(l.name),
      escapeCsv(l.company),
      escapeCsv(l.email),
      escapeCsv(l.phone || ''),
      escapeCsv(l.event),
      escapeCsv(l.follow_up_status),
      escapeCsv(l.priority),
      escapeCsv(l.tags || ''),
      escapeCsv(l.notes),
      escapeCsv(l.ai_summary || ''),
      escapeCsv(l.created_at)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="event-leads-export-${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
