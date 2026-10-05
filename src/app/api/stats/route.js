import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;

    const statusCounts = db.prepare(`
      SELECT follow_up_status as status, COUNT(*) as count 
      FROM leads 
      GROUP BY follow_up_status
    `).all();

    const priorityCounts = db.prepare(`
      SELECT priority, COUNT(*) as count 
      FROM leads 
      GROUP BY priority
    `).all();

    const topEvents = db.prepare(`
      SELECT event, COUNT(*) as count 
      FROM leads 
      GROUP BY event 
      ORDER BY count DESC 
      LIMIT 6
    `).all();

    const hotLeadsCount = db.prepare("SELECT COUNT(*) as count FROM leads WHERE priority = 'Hot'").get().count;
    const pendingFollowUps = db.prepare("SELECT COUNT(*) as count FROM leads WHERE follow_up_status = 'pending'").get().count;
    const followedUpCount = db.prepare("SELECT COUNT(*) as count FROM leads WHERE follow_up_status IN ('followed_up', 'closed')").get().count;

    const conversionRate = totalLeads > 0 ? Math.round((followedUpCount / totalLeads) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        hotLeadsCount,
        pendingFollowUps,
        followedUpCount,
        conversionRate,
        statusCounts,
        priorityCounts,
        topEvents
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
