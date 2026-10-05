'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  drafted: { label: 'Draft Ready', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  sent: { label: 'Message Sent', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  followed_up: { label: 'Followed Up', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  closed: { label: 'Closed / Won', bg: 'bg-gray-500/20 text-gray-300 border-gray-500/30' }
};

const PRIORITY_CONFIG = {
  Hot: { label: 'Hot', icon: '🔥', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  Warm: { label: 'Warm', icon: '⚡', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  Cold: { label: 'Cold', icon: '❄️', bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' }
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
  const [activeMenuId, setActiveMenuId] = useState(null);

  const getInitials = (name) => {
    if (!name) return 'L';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getRandomGradient = (name) => {
    const gradients = [
      'from-indigo-600 to-purple-600',
      'from-pink-600 to-rose-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-blue-600 to-cyan-600'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-800/80 bg-gray-950/60 glass-card shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800/80 bg-gray-900/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
              
              <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 cursor-pointer hover:text-white" onClick={() => onSort('name')}>
                <div className="flex items-center space-x-1.5">
                  <span>Lead Contact</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3.5 cursor-pointer hover:text-white" onClick={() => onSort('company')}>
                <div className="flex items-center space-x-1.5">
                  <span>Company</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3.5 cursor-pointer hover:text-white" onClick={() => onSort('event')}>
                <div className="flex items-center space-x-1.5">
                  <span>Met At Event</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3.5 cursor-pointer hover:text-white" onClick={() => onSort('priority')}>
                <div className="flex items-center space-x-1.5">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>

              <th scope="col" className="px-3 py-3.5">
                <span>Follow-up Status</span>
              </th>

              <th scope="col" className="px-3 py-3.5">
                <span>Interaction Notes & AI Insights</span>
              </th>

              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/60 text-sm">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-gray-600" />
                    <p className="text-base font-medium text-gray-400">No event leads match your search criteria</p>
                    <p className="text-xs text-gray-500">Try adjusting your filters or add a new lead above.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const statusInfo = STATUS_CONFIG[lead.follow_up_status] || STATUS_CONFIG.pending;
                const priorityInfo = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.Warm;
                const avatarGradient = getRandomGradient(lead.name);

                return (
                  <tr 
                    key={lead.id}
                    className="hover:bg-gray-900/40 transition-colors group"
                  >
                    {/* Lead Contact info */}
                    <td className="py-4 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-100 group-hover:text-indigo-300 transition-colors">
                            {lead.name}
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <a 
                              href={`mailto:${lead.email}`}
                              className="hover:text-indigo-400 hover:underline"
                            >
                              {lead.email}
                            </a>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1 text-[11px] text-gray-500 mt-0.5">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-3 py-4">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="font-medium text-gray-200">{lead.company}</span>
                      </div>
                      {lead.tags && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {lead.tags.split(',').slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Event Met At */}
                    <td className="px-3 py-4">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300">
                        <Calendar className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]" title={lead.event}>{lead.event}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityInfo.bg}`}>
                        <span>{priorityInfo.icon}</span>
                        <span>{priorityInfo.label}</span>
                      </span>
                    </td>

                    {/* Follow-up Status */}
                    <td className="px-3 py-4">
                      <select
                        value={lead.follow_up_status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-all cursor-pointer bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${statusInfo.bg}`}
                      >
                        <option value="pending" className="bg-gray-900 text-amber-400">⏳ Pending</option>
                        <option value="drafted" className="bg-gray-900 text-purple-400">📝 Draft Ready</option>
                        <option value="sent" className="bg-gray-900 text-blue-400">📤 Message Sent</option>
                        <option value="followed_up" className="bg-gray-900 text-emerald-400">💬 Followed Up</option>
                        <option value="closed" className="bg-gray-900 text-gray-400">✅ Closed / Won</option>
                      </select>
                    </td>

                    {/* Notes & AI Summary */}
                    <td className="px-3 py-4 max-w-xs">
                      <div className="text-xs text-gray-300 line-clamp-2" title={lead.notes}>
                        {lead.notes || <span className="italic text-gray-600">No notes captured</span>}
                      </div>

                      {lead.ai_summary ? (
                        <div 
                          onClick={() => onOpenSummaryModal(lead)}
                          className="mt-1.5 flex items-center space-x-1 text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                        >
                          <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                          <span>View AI Summary</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenSummaryModal(lead)}
                          className="mt-1 flex items-center space-x-1 text-[10px] text-gray-500 hover:text-purple-400 transition-colors"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Generate AI Summary</span>
                        </button>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 pl-3 pr-4 sm:pr-6 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        
                        {/* Draft Follow-up AI Button */}
                        <button
                          onClick={() => onOpenDraftModal(lead)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm shadow-purple-600/20 transition-all hover:scale-105"
                          title="Generate AI Follow-up Message"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span className="hidden xl:inline">AI Follow-up</span>
                        </button>

                        {/* Direct Mailto */}
                        <a
                          href={`mailto:${lead.email}?subject=Great%20meeting%20you%20at%20${encodeURIComponent(lead.event)}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Edit Lead */}
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors"
                          title="Edit Lead Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Lead */}
                        <button
                          onClick={() => onDeleteLead(lead.id, lead.name)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
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
