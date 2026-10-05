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
  Filter, 
  LayoutList, 
  Kanban, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Loader2, 
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
    }, 3500);
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
          showToast(`Captured lead for ${formData.name}`);
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
    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
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

  // Quick Status Change (from Table dropdown or Kanban column advance)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
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
      showToast('AI follow-up draft saved & lead marked as Draft Ready!');
      fetchLeads();
      fetchStats();
    } catch (err) {
      showToast('Failed to save draft', 'error');
    }
  };

  // Save AI Summary to Lead
  const handleSaveSummary = async (leadId, summaryText) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_summary: summaryText })
      });
      showToast('AI Summary saved to lead profile');
      fetchLeads();
    } catch (err) {
      showToast('Failed to save summary', 'error');
    }
  };

  // Reset Sample Data
  const handleResetData = async () => {
    if (!window.confirm('Reset database with 5 fresh sample event leads? Any custom leads will be refreshed.')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Sample event leads reseeded successfully!');
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
    showToast('Exporting leads to CSV...');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl text-xs font-semibold text-white animate-bounce">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Intelligence Stats Banner */}
        <StatsBanner
          stats={stats}
          onFilterPriority={(p) => setSelectedPriority(p)}
          onFilterStatus={(s) => setSelectedStatus(s)}
        />

        {/* Filter, Search & View Controls Bar */}
        <div className="rounded-2xl border border-gray-800/80 bg-gray-950/80 glass-card p-4 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search leads by name, company, email, event, notes, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              {/* Event Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-medium text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Events ({eventsList.length})</option>
                  {eventsList.map((ev, i) => (
                    <option key={i} value={ev}>
                      {ev}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-medium text-gray-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Stages</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="drafted">📝 Draft Ready</option>
                  <option value="sent">📤 Sent</option>
                  <option value="followed_up">💬 Followed Up</option>
                  <option value="closed">✅ Closed / Won</option>
                </select>
              </div>

              {/* Priority Pill Filters */}
              <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs">
                {['all', 'Hot', 'Warm', 'Cold'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedPriority === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {p === 'all' ? 'All' : p === 'Hot' ? '🔥 Hot' : p === 'Warm' ? '⚡ Warm' : '❄️ Cold'}
                  </button>
                ))}
              </div>

              {/* View Toggle: Table vs Kanban */}
              <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'table' ? 'bg-gray-800 text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'kanban' ? 'bg-gray-800 text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Kanban Pipeline View"
                >
                  <Kanban className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Active Filter Indicators */}
          {(search || selectedEvent !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') && (
            <div className="mt-3 pt-3 border-t border-gray-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-indigo-300">
                  <span>Search: "{search}"</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearch('')} />
                </span>
              )}
              {selectedEvent !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-indigo-300">
                  <span>Event: {selectedEvent}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedEvent('all')} />
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-indigo-300">
                  <span>Status: {selectedStatus}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedStatus('all')} />
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-indigo-300">
                  <span>Priority: {selectedPriority}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedPriority('all')} />
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedEvent('all');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
                className="text-[11px] text-gray-400 hover:text-rose-400 underline ml-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Data Views (Table or Kanban) */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-gray-400 font-medium">Loading event leads...</p>
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
      <footer className="border-t border-gray-900 bg-gray-950 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-gray-400">LeadVortex AI</span> — Intelligent Event Lead & Follow-Up Manager
          </div>
          <div className="flex items-center space-x-3 text-gray-500">
            <span>Powered by Next.js & React</span>
            <span>•</span>
            <span>SQLite Database</span>
            <span>•</span>
            <span>AI Summarization & Drafts</span>
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
