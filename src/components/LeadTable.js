'use client';

import React from 'react';
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Edit3, 
  Trash2, 
  FileText, 
  ArrowUpDown,
  FileEdit
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  drafted: { label: 'Draft Ready', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  sent: { label: 'Sent', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
  followed_up: { label: 'Followed Up', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  closed: { label: 'Closed', bg: 'bg-slate-100 text-slate-700 border-slate-200' }
};

const PRIORITY_CONFIG = {
  Hot: { label: 'High', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  Warm: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  Cold: { label: 'Low', bg: 'bg-slate-100 text-slate-600 border-slate-200' }
};

export default function LeadTable({
  leads,
  onEditLead,
  onDeleteLead,
  onOpenDraftModal,
  onOpenSummaryModal,
  onStatusChange,
  onSort,
  sortBy,
  sortOrder
}) {
  const getInitials = (name) => {
    if (!name) return 'L';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              
              <th scope="col" className="py-3 pl-4 pr-3 sm:pl-6 cursor-pointer hover:text-slate-800" onClick={() => onSort('name')}>
                <div className="flex items-center space-x-1.5">
                  <span>Contact</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3 cursor-pointer hover:text-slate-800" onClick={() => onSort('company')}>
                <div className="flex items-center space-x-1.5">
                  <span>Company</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3 cursor-pointer hover:text-slate-800" onClick={() => onSort('event')}>
                <div className="flex items-center space-x-1.5">
                  <span>Event</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3 cursor-pointer hover:text-slate-800" onClick={() => onSort('priority')}>
                <div className="flex items-center space-x-1.5">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3">
                <span>Status</span>
              </th>

              <th scope="col" className="px-3 py-3">
                <span>Notes & Summary</span>
              </th>

              <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <FileText className="w-6 h-6 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No leads found</p>
                    <p className="text-xs text-slate-400">Try changing your filters or add a new contact.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const statusInfo = STATUS_CONFIG[lead.follow_up_status] || STATUS_CONFIG.pending;
                const priorityInfo = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.Warm;

                return (
                  <tr 
                    key={lead.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Contact */}
                    <td className="py-3 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-semibold">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {lead.name}
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <a 
                              href={`mailto:${lead.email}`}
                              className="hover:text-slate-900 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-3 py-3">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{lead.company}</span>
                      </div>
                      {lead.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.tags.split(',').slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Event */}
                    <td className="px-3 py-3">
                      <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]" title={lead.event}>{lead.event}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityInfo.bg}`}>
                        {priorityInfo.label}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td className="px-3 py-3">
                      <select
                        value={lead.follow_up_status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-medium rounded px-2 py-1 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 ${statusInfo.bg}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="drafted">Draft Ready</option>
                        <option value="sent">Sent</option>
                        <option value="followed_up">Followed Up</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Notes & Summary */}
                    <td className="px-3 py-3 max-w-xs">
                      <div className="text-xs text-slate-600 line-clamp-2" title={lead.notes}>
                        {lead.notes || <span className="italic text-slate-400">No notes</span>}
                      </div>

                      {lead.ai_summary ? (
                        <button
                          onClick={() => onOpenSummaryModal(lead)}
                          className="mt-1 flex items-center space-x-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>View Summary</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenSummaryModal(lead)}
                          className="mt-1 flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-700"
                        >
                          <span>+ Summarize</span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pl-3 pr-4 sm:pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        
                        {/* Draft Follow-up */}
                        <button
                          onClick={() => onOpenDraftModal(lead)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                          title="Draft Follow-up Message"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-slate-500" />
                          <span className="hidden xl:inline">Draft Message</span>
                        </button>

                        {/* Direct Email */}
                        <a
                          href={`mailto:${lead.email}?subject=Great%20meeting%20you%20at%20${encodeURIComponent(lead.event)}`}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit */}
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteLead(lead.id, lead.name)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
