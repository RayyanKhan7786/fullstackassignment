'use client';

import React from 'react';
import { 
  Mail, 
  Building2, 
  Calendar, 
  Edit3, 
  Trash2, 
  ArrowRight,
  FileEdit
} from 'lucide-react';

const COLUMNS = [
  { id: 'pending', title: 'Pending', countColor: 'bg-amber-100 text-amber-800' },
  { id: 'drafted', title: 'Draft Ready', countColor: 'bg-indigo-100 text-indigo-800' },
  { id: 'sent', title: 'Sent', countColor: 'bg-blue-100 text-blue-800' },
  { id: 'followed_up', title: 'Followed Up', countColor: 'bg-emerald-100 text-emerald-800' },
  { id: 'closed', title: 'Closed', countColor: 'bg-slate-200 text-slate-800' }
];

const PRIORITY_BADGES = {
  Hot: { label: 'High', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  Warm: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  Cold: { label: 'Low', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
};

export default function LeadKanban({
  leads,
  onEditLead,
  onDeleteLead,
  onOpenDraftModal,
  onOpenSummaryModal,
  onStatusChange
}) {
  const getInitials = (name) => {
    if (!name) return 'L';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getNextStatus = (current) => {
    const sequence = ['pending', 'drafted', 'sent', 'followed_up', 'closed'];
    const idx = sequence.indexOf(current);
    if (idx < sequence.length - 1) return sequence[idx + 1];
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter(l => l.follow_up_status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-lg border border-slate-200 bg-slate-100/70 p-2.5 min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 px-1">
              <span className="text-xs font-semibold text-slate-700">
                {col.title}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.2 rounded-full ${col.countColor}`}>
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {columnLeads.length === 0 ? (
                <div className="h-28 flex items-center justify-center border border-dashed border-slate-300 rounded-md text-xs text-slate-400">
                  <span>No leads</span>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const priorityInfo = PRIORITY_BADGES[lead.priority] || PRIORITY_BADGES.Warm;
                  const nextStatus = getNextStatus(lead.follow_up_status);

                  return (
                    <div
                      key={lead.id}
                      className="group rounded-md border border-slate-200 bg-white p-3 hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-[11px] font-semibold">
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-slate-900">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{lead.company}</span>
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${priorityInfo.bg}`}>
                          {priorityInfo.label}
                        </span>
                      </div>

                      {/* Event */}
                      <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{lead.event}</span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
                          {lead.notes}
                        </p>
                      )}

                      {/* Actions & Next Stage */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {/* Draft Button */}
                          <button
                            onClick={() => onOpenDraftModal(lead)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            title="Draft Message"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>

                          {/* Email */}
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit */}
                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteLead(lead.id, lead.name)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Advance stage */}
                        {nextStatus && (
                          <button
                            onClick={() => onStatusChange(lead.id, nextStatus)}
                            className="flex items-center space-x-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition-colors"
                            title="Move to next stage"
                          >
                            <span>Move</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
