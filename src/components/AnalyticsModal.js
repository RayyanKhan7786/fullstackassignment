'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose, stats }) {
  if (!isOpen || !stats) return null;

  const total = stats.totalLeads || 0;

  const statusMap = {
    pending: { label: 'Pending', count: 0, color: 'bg-amber-500' },
    drafted: { label: 'Draft Ready', count: 0, color: 'bg-indigo-500' },
    sent: { label: 'Sent', count: 0, color: 'bg-blue-500' },
    followed_up: { label: 'Followed Up', count: 0, color: 'bg-emerald-500' },
    closed: { label: 'Closed', count: 0, color: 'bg-slate-400' }
  };

  (stats.statusCounts || []).forEach(sc => {
    if (statusMap[sc.status]) {
      statusMap[sc.status].count = sc.count;
    }
  });

  const priorityMap = {
    Hot: { label: 'High Priority', count: 0, color: 'bg-rose-500' },
    Warm: { label: 'Medium Priority', count: 0, color: 'bg-amber-500' },
    Cold: { label: 'Low Priority', count: 0, color: 'bg-slate-400' }
  };

  (stats.priorityCounts || []).forEach(pc => {
    if (priorityMap[pc.priority]) {
      priorityMap[pc.priority].count = pc.count;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pipeline & Event Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of lead status, priorities, and event performance
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">Total Leads</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{total}</div>
          </div>
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">High Priority</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats.hotLeadsCount || 0}</div>
          </div>
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">Pending Action</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats.pendingFollowUps || 0}</div>
          </div>
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500">Follow-up Rate</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{stats.conversionRate || 0}%</div>
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
            Pipeline Distribution
          </h4>
          <div className="space-y-2">
            {Object.entries(statusMap).map(([key, item]) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="text-slate-500">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Top Events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          
          {/* Priority */}
          <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
              Priority Breakdown
            </h4>
            <div className="space-y-2">
              {Object.entries(priorityMap).map(([key, item]) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-semibold text-slate-900 w-4 text-right">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Events */}
          <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
              Top Events
            </h4>
            <div className="space-y-1.5">
              {(stats.topEvents || []).length === 0 ? (
                <p className="text-xs text-slate-400">No events yet.</p>
              ) : (
                stats.topEvents.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-200/60 last:border-0">
                    <span className="text-slate-700 truncate max-w-[160px]" title={ev.event}>
                      {ev.event}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-semibold text-[11px]">
                      {ev.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Close */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
