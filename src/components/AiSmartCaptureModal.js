'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Loader2,
  FileText
} from 'lucide-react';

const SAMPLE_RAW_TEXTS = [
  {
    title: 'Business Card Sample',
    text: `Dr. Aris Thorne
Chief Technology Officer
NeuralVoxel Dynamics LLC
Email: a.thorne@neuralvoxel.ai
Direct: +1 (650) 412-9081
Met at: AI Hardware Expo 2026
Notes: Interested in inference latency optimization. Budget approved for Q2. Wants PoC next month.`
  },
  {
    title: 'Meeting Note Sample',
    text: `Quick note from AWS Summit lunch: Met Maya Lin, she runs Growth Marketing at FinPulse Technologies (maya@finpulse.io, phone 415-802-9912). They have 50 SDRs and need automated lead routing before Q3. She is the budget decision maker. High priority.`
  }
];

export default function AiSmartCaptureModal({
  isOpen,
  onClose,
  onLeadCreated,
  apiKey = ''
}) {
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleExtract = async (textToUse = rawText) => {
    if (!textToUse || !textToUse.trim()) {
      setError('Please paste or type raw notes or business card text.');
      return;
    }
    setError('');
    setIsExtracting(true);
    try {
      const res = await fetch('/api/ai/smart-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: textToUse, apiKey })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setExtractedData(data.data);
      } else {
        setError(data.error || 'Failed to extract lead data.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with service');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = async () => {
    if (!extractedData.name || !extractedData.company || !extractedData.email || !extractedData.event) {
      setError('Name, company, email, and event are required.');
      return;
    }
    await onLeadCreated(extractedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Quick Lead Parser
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste meeting notes, business card text, or voice transcripts to parse fields
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
          <div className="mt-3 p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700">
              Paste Unstructured Content:
            </label>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400">Sample:</span>
              {SAMPLE_RAW_TEXTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setRawText(sample.text);
                    handleExtract(sample.text);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste text here..."
            className="w-full p-2.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
          />

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleExtract()}
              disabled={isExtracting || !rawText.trim()}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <span>Extract Lead Info</span>
              )}
            </button>
          </div>
        </div>

        {/* Extracted Fields */}
        {extractedData && (
          <div className="mt-4 p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <div className="text-xs font-semibold text-slate-800 mb-2.5">
              Extracted Information (Review & Edit):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Name</label>
                <input
                  type="text"
                  value={extractedData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Company</label>
                <input
                  type="text"
                  value={extractedData.company || ''}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Email</label>
                <input
                  type="email"
                  value={extractedData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone</label>
                <input
                  type="text"
                  value={extractedData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Event</label>
                <input
                  type="text"
                  value={extractedData.event || ''}
                  onChange={(e) => handleFieldChange('event', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Priority</label>
                <select
                  value={extractedData.priority || 'Warm'}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="Hot">High</option>
                  <option value="Warm">Medium</option>
                  <option value="Cold">Low</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Tags</label>
                <input
                  type="text"
                  value={extractedData.tags || ''}
                  onChange={(e) => handleFieldChange('tags', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Notes</label>
                <textarea
                  rows={2}
                  value={extractedData.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-3.5 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded text-xs font-medium text-white bg-slate-900 hover:bg-slate-800"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Create Lead</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
