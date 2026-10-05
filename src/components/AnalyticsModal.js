'use client';

import React from 'react';
import { X, BarChart3, PieChart, Users, Flame, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose, stats }) {
  if (!isOpen || !stats) return null;

  const total = stats.totalLeads || 0;

  const statusMap = {
    pending: { label: 'Pending', count: 0, color: 'bg-amber-500' },
    drafted: { label: 'Draft Ready', count: 0, color: 'bg-purple-500' },
    sent: { label: 'Sent', count: 0, color: 'bg-blue-500' },
    followed_up: { label: 'Followed Up', count: 0, color: 'bg-emerald-500' },
    closed: { label: 'Closed / Won', count: 0, color: 'bg-gray-400' }
  };

  (stats.statusCounts || []).forEach(sc => {
    if (statusMap[sc.status]) {
      statusMap[sc.status].count = sc.count;
    }
  });

  const priorityMap = {
    Hot: { label: 'Hot 🔥', count: 0, color: 'bg-rose-500' },
    Warm: { label: 'Warm ⚡', count: 0, color: 'bg-amber-500' },
    Cold: { label: 'Cold ❄️', count: 0, color: 'bg-cyan-500' }
  };

  (stats.priorityCounts || []).forEach(pc => {
    if (priorityMap[pc.priority]) {
      priorityMap[pc.priority].count = pc.count;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Event Lead Intelligence & Pipeline Analytics
              </h3>
              <p className="text-xs text-gray-400">
                Performance metrics, follow-up velocity, and event ROI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
            <span className="text-[11px] text-gray-400">Total Leads Met</span>
            <div className="text-2xl font-bold text-white mt-1">{total}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
            <span className="text-[11px] text-gray-400">Hot Opportunities</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{stats.hotLeadsCount || 0}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
            <span className="text-[11px] text-gray-400">Pending Action</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.pendingFollowUps || 0}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800">
            <span className="text-[11px] text-gray-400">Conversion / Followed</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.conversionRate || 0}%</div>
          </div>
        </div>

        {/* Section 1: Pipeline Stage Progress Bars */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Pipeline Distribution
          </h4>
          <div className="space-y-2.5">
            {Object.entries(statusMap).map(([key, item]) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium">{item.label}</span>
                    <span className="text-gray-400">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Priority Distribution & Top Events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          
          {/* Priority */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Intent / Priority Breakdown
            </h4>
            <div className="space-y-3">
              {Object.entries(priorityMap).map(([key, item]) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white w-6 text-right">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Events */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Top Yielding Events
            </h4>
            <div className="space-y-2">
              {(stats.topEvents || []).length === 0 ? (
                <p className="text-xs text-gray-500">No event records yet.</p>
              ) : (
                stats.topEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-gray-850">
                    <span className="text-gray-300 truncate max-w-[170px]" title={ev.event}>
                      {ev.event}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                      {ev.count} leads
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Close button */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
