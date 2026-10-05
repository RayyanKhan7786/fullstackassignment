'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  Check,
  FileText,
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

  const handleSummarize = async () => {
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
      setError(err.message || 'Error communicating with service');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialLead ? 'Edit Lead' : 'Add New Lead'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter contact details and conversation notes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Sarah Chen"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="Apex AI Systems"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="sarah@apex-ai.io"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Event Met <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="event"
                  required
                  list="event-suggestions"
                  placeholder="TechCrunch Disrupt 2026"
                  value={formData.event}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
                <datalist id="event-suggestions">
                  {eventsList.map((e, idx) => (
                    <option key={idx} value={e} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full py-1.5 px-2.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                <option value="Hot">High Priority</option>
                <option value="Warm">Medium Priority</option>
                <option value="Cold">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Follow-up Status
              </label>
              <select
                name="follow_up_status"
                value={formData.follow_up_status}
                onChange={handleChange}
                className="w-full py-1.5 px-2.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-500 cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="drafted">Draft Ready</option>
                <option value="sent">Sent</option>
                <option value="followed_up">Followed Up</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tags (comma separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="tags"
                  placeholder="Decision Maker, Q2 Budget"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Meeting / Interaction Notes
              </label>
              <button
                type="button"
                onClick={handleSummarize}
                disabled={isSummarizing || !formData.notes.trim()}
                className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {isSummarizing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3 text-slate-500" />
                )}
                <span>Auto-Summarize</span>
              </button>
            </div>
            <textarea
              name="notes"
              rows={3}
              placeholder="Key discussion points, pain points, next steps..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2.5 rounded-md bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* AI Summary Preview if present */}
          {formData.ai_summary && (
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
              <div className="font-semibold text-slate-700 mb-1">
                Summary:
              </div>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {formData.ai_summary}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{initialLead ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
