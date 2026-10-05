'use client';

import React from 'react';
import { 
  Sparkles, 
  Mail, 
  Building2, 
  Calendar, 
  Edit3, 
  Trash2, 
  Phone,
  ArrowRight,
  CheckCircle,
  FileText
} from 'lucide-react';

const COLUMNS = [
  { id: 'pending', title: 'Pending Follow-up', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'drafted', title: 'Draft Ready', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'sent', title: 'Message Sent', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'followed_up', title: 'Followed Up', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'closed', title: 'Closed / Won', color: 'border-gray-500/40 text-gray-400 bg-gray-500/10' }
];

const PRIORITY_BADGES = {
  Hot: { label: 'Hot', icon: '🔥', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  Warm: { label: 'Warm', icon: '⚡', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  Cold: { label: 'Cold', icon: '❄️', bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter(l => l.follow_up_status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-xl border border-gray-800/80 bg-gray-950/50 p-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800/80">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${col.color}`}>
                  {col.title}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {columnLeads.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border border-dashed border-gray-800/60 rounded-xl text-xs text-gray-600">
                  <span>No leads in stage</span>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const priorityInfo = PRIORITY_BADGES[lead.priority] || PRIORITY_BADGES.Warm;
                  const nextStatus = getNextStatus(lead.follow_up_status);

                  return (
                    <div
                      key={lead.id}
                      className="group relative rounded-xl border border-gray-800/80 bg-gray-900/80 p-3.5 hover:border-indigo-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {/* Top row: Name, Priority */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-100 group-hover:text-indigo-300">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-gray-400 flex items-center space-x-1">
                              <Building2 className="w-3 h-3 text-gray-500" />
                              <span>{lead.company}</span>
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${priorityInfo.bg}`}>
                          {priorityInfo.icon} {priorityInfo.label}
                        </span>
                      </div>

                      {/* Event Met */}
                      <div className="mt-2.5 flex items-center space-x-1.5 text-[11px] text-gray-400 bg-gray-950/60 px-2 py-1 rounded-lg border border-gray-800/60">
                        <Calendar className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{lead.event}</span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="mt-2 text-xs text-gray-400 line-clamp-2 italic">
                          "{lead.notes}"
                        </p>
                      )}

                      {/* AI Summary Badge if exists */}
                      {lead.ai_summary && (
                        <div 
                          onClick={() => onOpenSummaryModal(lead)}
                          className="mt-2 flex items-center space-x-1 text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>AI Summary Ready</span>
                        </div>
                      )}

                      {/* Actions & Next Stage */}
                      <div className="mt-3 pt-2.5 border-t border-gray-800/60 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {/* AI Draft Button */}
                          <button
                            onClick={() => onOpenDraftModal(lead)}
                            className="p-1 rounded text-purple-400 hover:bg-purple-950/50 transition-colors"
                            title="Generate AI Follow-up"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Email */}
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit */}
                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1 rounded text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteLead(lead.id, lead.name)}
                            className="p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-gray-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Move to next stage button */}
                        {nextStatus && (
                          <button
                            onClick={() => onStatusChange(lead.id, nextStatus)}
                            className="flex items-center space-x-1 text-[11px] font-medium text-gray-400 hover:text-indigo-300 bg-gray-800/60 hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                            title="Advance to next pipeline stage"
                          >
                            <span>Advance</span>
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
