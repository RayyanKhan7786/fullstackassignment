'use client';

import React from 'react';
import { Mail, Edit2, Trash2, Sparkles, Search, FileText } from 'lucide-react';

export default function LeadTable({
  leads,
  search,
  setSearch,
  selectedEvent,
  setSelectedEvent,
  selectedStatus,
  setSelectedStatus,
  eventsList,
  onEditLead,
  onDeleteLead,
  onOpenAiModal,
  onStatusChange
}) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Event Filter */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full md:w-auto text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="all">All Events</option>
            {eventsList.map((ev, i) => (
              <option key={i} value={ev}>
                {ev}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto text-xs px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="drafted">Draft Ready</option>
            <option value="sent">Sent</option>
            <option value="followed_up">Followed Up</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <FileText className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                    <p className="font-medium text-slate-500">No leads found</p>
                    <p className="text-[11px]">Try adjusting your search or add a new lead.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    {/* Name */}
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {lead.name}
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 text-slate-700">
                      {lead.company}
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-600">
                      <a href={`mailto:${lead.email}`} className="hover:underline hover:text-slate-900">
                        {lead.email}
                      </a>
                    </td>

                    {/* Event */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                        {lead.event}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={lead.notes}>
                      {lead.notes || <span className="italic text-slate-400">No notes</span>}
                    </td>

                    {/* Follow-up Status */}
                    <td className="py-3 px-4">
                      <select
                        value={lead.follow_up_status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        className="text-[11px] px-2 py-0.5 border border-slate-200 rounded bg-white text-slate-800 cursor-pointer focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="drafted">Draft Ready</option>
                        <option value="sent">Sent</option>
                        <option value="followed_up">Followed Up</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* AI Assistant Button */}
                        <button
                          onClick={() => onOpenAiModal(lead)}
                          className="flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          title="AI Follow-up & Summary"
                        >
                          <Sparkles className="w-3 h-3 text-slate-600" />
                          <span>AI Assistant</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditLead(lead)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteLead(lead.id, lead.name)}
                          className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
