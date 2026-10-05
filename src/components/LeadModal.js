'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function LeadModal({
  isOpen,
  onClose,
  onSave,
  initialLead = null,
  eventsList = []
}) {
  // State for the form inputs
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    event: '',
    notes: '',
    follow_up_status: 'pending'
  });

  const [error, setError] = useState('');

  // Whenever the modal opens or initialLead changes, update form data
  useEffect(() => {
    if (initialLead) {
      setFormData({
        name: initialLead.name || '',
        company: initialLead.company || '',
        email: initialLead.email || '',
        event: initialLead.event || '',
        notes: initialLead.notes || '',
        follow_up_status: initialLead.follow_up_status || 'pending'
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        event: eventsList.length > 0 ? eventsList[0] : 'Tech Conference 2026',
        notes: '',
        follow_up_status: 'pending'
      });
    }
    setError('');
  }, [initialLead, isOpen, eventsList]);

  if (!isOpen) return null;

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || !formData.event.trim()) {
      setError('Please fill in all required fields (Name, Company, Email, and Event).');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">
            {initialLead ? 'Edit Lead' : 'Add New Event Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          
          {/* Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Sarah Chen"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                required
                placeholder="Apex AI Systems"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {/* Email & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="sarah@apex.io"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Event Met At <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="event"
                required
                placeholder="TechCrunch Disrupt 2026"
                value={formData.event}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {/* Follow-up Status */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Follow-up Status
            </label>
            <select
              name="follow_up_status"
              value={formData.follow_up_status}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-slate-500 cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="drafted">Draft Ready</option>
              <option value="sent">Sent</option>
              <option value="followed_up">Followed Up</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Conversation Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Conversation / Meeting Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="What did you talk about? Pain points, product interests, action items..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
            >
              {initialLead ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
