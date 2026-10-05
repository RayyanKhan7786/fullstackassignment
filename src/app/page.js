'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LeadTable from '@/components/LeadTable';
import LeadModal from '@/components/LeadModal';
import AiModal from '@/components/AiModal';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // Main list of leads and loading state
  const [leads, setLeads] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeAiLead, setActiveAiLead] = useState(null);

  // Fetch leads from the API
  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedEvent !== 'all') params.append('event', selectedEvent);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

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
    } finally {
      setLoading(false);
    }
  };

  // Run fetchLeads on initial render and when search/filters change
  useEffect(() => {
    fetchLeads();
  }, [search, selectedEvent, selectedStatus]);

  // Handle Add / Edit lead
  const handleSaveLead = async (formData) => {
    try {
      if (editingLead) {
        // Edit existing lead
        await fetch(`/api/leads/${editingLead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Add new lead
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsLeadModalOpen(false);
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  };

  // Handle Delete lead
  const handleDeleteLead = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
      return;
    }
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Handle Quick Status Dropdown change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status: newStatus })
      });
      fetchLeads();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Save draft from AI modal
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
      fetchLeads();
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        onAddLead={() => {
          setEditingLead(null);
          setIsLeadModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1">
        
        {/* Simple Page Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Event Leads</h2>
          <p className="text-xs text-slate-500">
            View, search, filter, and manage your contacts from conferences and events.
          </p>
        </div>

        {/* Loading Spinner or Leads Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            <p className="text-xs">Loading leads...</p>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            search={search}
            setSearch={setSearch}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            eventsList={eventsList}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsLeadModalOpen(true);
            }}
            onDeleteLead={handleDeleteLead}
            onOpenAiModal={(lead) => {
              setActiveAiLead(lead);
              setIsAiModalOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-400 mt-auto">
        Event Lead Manager • Built with React, Next.js, Tailwind CSS & SQLite
      </footer>

      {/* Add / Edit Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
        eventsList={eventsList}
      />

      {/* AI Assistant Modal */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setActiveAiLead(null);
        }}
        lead={activeAiLead}
        onSaveDraft={handleSaveDraft}
      />

    </div>
  );
}
