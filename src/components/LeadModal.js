'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  Flame, 
  Check,
  Loader2
} from 'lucide-react';

export default function LeadModal({
  isOpen,
  onClose,
  onSave,
  initialLead = null,
  eventsList = [],
  apiKey = ''
}) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    event: '',
    notes: '',
    follow_up_status: 'pending',
    priority: 'Warm',
    tags: '',
    ai_summary: '',
    ai_draft: ''
  });

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLead) {
      setFormData({
        name: initialLead.name || '',
        company: initialLead.company || '',
        email: initialLead.email || '',
        phone: initialLead.phone || '',
        event: initialLead.event || '',
        notes: initialLead.notes || '',
        follow_up_status: initialLead.follow_up_status || 'pending',
        priority: initialLead.priority || 'Warm',
        tags: initialLead.tags || '',
        ai_summary: initialLead.ai_summary || '',
        ai_draft: initialLead.ai_draft || ''
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        event: eventsList.length > 0 ? eventsList[0] : 'TechCrunch Disrupt 2026',
        notes: '',
        follow_up_status: 'pending',
        priority: 'Warm',
        tags: '',
        ai_summary: '',
        ai_draft: ''
      });
    }
    setError('');
  }, [initialLead, isOpen, eventsList]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiSummarize = async () => {
    if (!formData.notes.trim()) {
      setError('Please enter some meeting notes first before summarizing.');
      return;
    }
    setError('');
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          event: formData.event,
          notes: formData.notes,
          apiKey
        })
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setFormData(prev => ({ ...prev, ai_summary: data.summary }));
      } else {
        setError(data.error || 'Failed to summarize notes.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || !formData.event.trim()) {
      setError('Name, Company, Email, and Event are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{initialLead ? 'Edit Lead Contact' : 'Capture New Event Lead'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Record key details and discussion points from your conversation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sarah Chen"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Company / Organization <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="e.g. Apex AI Systems"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="sarah@apex-ai.io"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Event & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Met At Event <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="event"
                  required
                  list="event-suggestions"
                  placeholder="e.g. TechCrunch Disrupt 2026"
                  value={formData.event}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <datalist id="event-suggestions">
                  {eventsList.map((e, idx) => (
                    <option key={idx} value={e} />
                  ))}
                  <option value="TechCrunch Disrupt 2026" />
                  <option value="AWS Summit San Francisco" />
                  <option value="SaaS Growth Summit 2026" />
                  <option value="FinTech Nexus 2026" />
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full py-2 px-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Hot">🔥 Hot (High Intent)</option>
                <option value="Warm">⚡ Warm (Engaged)</option>
                <option value="Cold">❄️ Cold (Nurture)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Status & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Follow-up Status
              </label>
              <select
                name="follow_up_status"
                value={formData.follow_up_status}
                onChange={handleChange}
                className="w-full py-2 px-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="pending">⏳ Pending Follow-up</option>
                <option value="drafted">📝 Draft Ready</option>
                <option value="sent">📤 Message Sent</option>
                <option value="followed_up">💬 Followed Up</option>
                <option value="closed">✅ Closed / Won</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="tags"
                  placeholder="Decision Maker, AI, Q2 Budget"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Notes with integrated AI Summarize action */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-300">
                Meeting / Interaction Notes
              </label>
              <button
                type="button"
                onClick={handleAiSummarize}
                disabled={isSummarizing || !formData.notes.trim()}
                className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 font-medium px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 transition-colors disabled:opacity-50"
              >
                {isSummarizing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>✨ AI Summarize Notes</span>
              </button>
            </div>
            <textarea
              name="notes"
              rows={4}
              placeholder="What did you discuss? Key pain points, timeline, product interest, next steps..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* AI Summary Preview if present */}
          {formData.ai_summary && (
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
              <div className="flex items-center space-x-1.5 font-semibold text-purple-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generated Summary:</span>
              </div>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {formData.ai_summary}
              </p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <Check className="w-4 h-4" />
              <span>{initialLead ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
