'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import StatsBanner from '@/components/StatsBanner';
import LeadTable from '@/components/LeadTable';
import LeadKanban from '@/components/LeadKanban';
import LeadModal from '@/components/LeadModal';
import AiDraftModal from '@/components/AiDraftModal';
import AiSummaryModal from '@/components/AiSummaryModal';
import AiSmartCaptureModal from '@/components/AiSmartCaptureModal';
import AnalyticsModal from '@/components/AnalyticsModal';
import SettingsModal from '@/components/SettingsModal';
import { 
  Search, 
  LayoutList, 
  Kanban, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';

export default function HomePage() {
  // Leads & Stats State
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [activeDraftLead, setActiveDraftLead] = useState(null);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeSummaryLead, setActiveSummaryLead] = useState(null);

  const [isSmartCaptureOpen, setIsSmartCaptureOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Settings State
  const [apiKey, setApiKey] = useState('');
  const [senderName, setSenderName] = useState('Alex');

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Load stored settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('lead_vortex_gemini_key');
      const savedSender = localStorage.getItem('lead_vortex_sender_name');
      if (savedKey) setApiKey(savedKey);
      if (savedSender) setSenderName(savedSender);
    }
  }, []);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedEvent && selectedEvent !== 'all') params.append('event', selectedEvent);
      if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPriority && selectedPriority !== 'all') params.append('priority', selectedPriority);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        if (data.events) {
          setEventsList(data.events);
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      showToast('Error loading leads', 'error');
    }
  }, [search, selectedEvent, selectedStatus, selectedPriority, sortBy, sortOrder]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchLeads(), fetchStats()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchLeads, fetchStats]);

  // Handle Sort Toggle
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Save Lead (Add or Edit)
  const handleSaveLead = async (formData) => {
    try {
      if (editingLead) {
        // Edit existing
        const res = await fetch(`/api/leads/${editingLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Updated lead for ${formData.name}`);
          setIsLeadModalOpen(false);
          setEditingLead(null);
          fetchLeads();
          fetchStats();
        } else {
          showToast(data.error || 'Failed to update lead', 'error');
        }
      } else {
        // Create new
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Created lead for ${formData.name}`);
          setIsLeadModalOpen(false);
          fetchLeads();
          fetchStats();
        } else {
          showToast(data.error || 'Failed to create lead', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Network error', 'error');
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted lead for ${name}`);
        fetchLeads();
        fetchStats();
      } else {
        showToast(data.error || 'Failed to delete lead', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error', 'error');
    }
  };

  // Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status set to ${newStatus.replace('_', ' ')}`);
        fetchLeads();
        fetchStats();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Save AI Draft to Lead
  const handleSaveDraft = async (leadId, draftText) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_draft: draftText,
          follow_up_status: 'drafted'
        })
      });
      showToast('Follow-up draft saved');
      fetchLeads();
      fetchStats();
    } catch (err) {
      showToast('Failed to save draft', 'error');
    }
  };

  // Save Summary to Lead
  const handleSaveSummary = async (leadId, summaryText) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_summary: summaryText })
      });
      showToast('Summary saved');
      fetchLeads();
    } catch (err) {
      showToast('Failed to save summary', 'error');
    }
  };

  // Reset Sample Data
  const handleResetData = async () => {
    if (!window.confirm('Reset sample leads database?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Sample leads restored');
        fetchLeads();
        fetchStats();
      }
    } catch (err) {
      showToast('Failed to reset data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    window.open('/api/export', '_blank');
    showToast('Exporting CSV...');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-3.5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onNewLead={() => {
          setEditingLead(null);
          setIsLeadModalOpen(true);
        }}
        onSmartCapture={() => setIsSmartCaptureOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
        onExport={handleExport}
        isResetting={isResetting}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Stats Banner */}
        <StatsBanner
          stats={stats}
          onFilterPriority={(p) => setSelectedPriority(p)}
          onFilterStatus={(s) => setSelectedStatus(s)}
        />

        {/* Filter & Search Bar */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 mb-5 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads by name, company, email, event, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Event Filter */}
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="all">All Events ({eventsList.length})</option>
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
                className="px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="all">All Stages</option>
                <option value="pending">Pending</option>
                <option value="drafted">Draft Ready</option>
                <option value="sent">Sent</option>
                <option value="followed_up">Followed Up</option>
                <option value="closed">Closed</option>
              </select>

              {/* Priority Segmented Control */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-xs">
                {['all', 'Hot', 'Warm', 'Cold'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedPriority === p
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p === 'all' ? 'All' : p === 'Hot' ? 'High' : p === 'Warm' ? 'Medium' : 'Low'}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-md text-xs">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Board View"
                >
                  <Kanban className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Active Filter Row */}
          {(search || selectedEvent !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <span>"{search}"</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSearch('')} />
                </span>
              )}
              {selectedEvent !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <span>Event: {selectedEvent}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedEvent('all')} />
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <span>Status: {selectedStatus}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedStatus('all')} />
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  <span>Priority: {selectedPriority}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-slate-900" onClick={() => setSelectedPriority('all')} />
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedEvent('all');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
                className="text-[11px] text-slate-500 hover:text-rose-600 underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Data View */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
            <p className="text-xs text-slate-500">Loading leads...</p>
          </div>
        ) : viewMode === 'table' ? (
          <LeadTable
            leads={leads}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsLeadModalOpen(true);
            }}
            onDeleteLead={handleDeleteLead}
            onOpenDraftModal={(lead) => {
              setActiveDraftLead(lead);
              setIsDraftModalOpen(true);
            }}
            onOpenSummaryModal={(lead) => {
              setActiveSummaryLead(lead);
              setIsSummaryModalOpen(true);
            }}
            onStatusChange={handleStatusChange}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        ) : (
          <LeadKanban
            leads={leads}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsLeadModalOpen(true);
            }}
            onDeleteLead={handleDeleteLead}
            onOpenDraftModal={(lead) => {
              setActiveDraftLead(lead);
              setIsDraftModalOpen(true);
            }}
            onOpenSummaryModal={(lead) => {
              setActiveSummaryLead(lead);
              setIsSummaryModalOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">Event Lead Manager</span> — Capture & Follow-up
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>React & Next.js</span>
            <span>•</span>
            <span>SQLite Database</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
        eventsList={eventsList}
        apiKey={apiKey}
      />

      <AiDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => {
          setIsDraftModalOpen(false);
          setActiveDraftLead(null);
        }}
        lead={activeDraftLead}
        onSaveDraft={handleSaveDraft}
        senderName={senderName}
        apiKey={apiKey}
      />

      <AiSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => {
          setIsSummaryModalOpen(false);
          setActiveSummaryLead(null);
        }}
        lead={activeSummaryLead}
        onSaveSummary={handleSaveSummary}
        apiKey={apiKey}
      />

      <AiSmartCaptureModal
        isOpen={isSmartCaptureOpen}
        onClose={() => setIsSmartCaptureOpen(false)}
        onLeadCreated={handleSaveLead}
        apiKey={apiKey}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        stats={stats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        senderName={senderName}
        setSenderName={setSenderName}
      />

    </div>
  );
}
