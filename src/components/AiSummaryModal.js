'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  RotateCw, 
  Copy, 
  Save,
  FileText,
  Loader2
} from 'lucide-react';

export default function AiSummaryModal({
  isOpen,
  onClose,
  lead,
  onSaveSummary,
  apiKey = ''
}) {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      if (lead.ai_summary) {
        setSummary(lead.ai_summary);
      } else {
        fetchSummary();
      }
      setCopied(false);
      setSaved(false);
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const fetchSummary = async () => {
    setIsSummarizing(true);
    setSaved(false);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          name: lead.name,
          company: lead.company,
          event: lead.event,
          notes: lead.notes,
          apiKey
        })
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    await onSaveSummary(lead.id, summary);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Interaction Notes Summary
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Summary for <span className="font-semibold text-slate-800">{lead.name}</span> ({lead.company})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Notes Box */}
        <div className="mt-3.5">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Raw Meeting Notes:
          </label>
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
            {lead.notes || 'No notes provided.'}
          </div>
        </div>

        {/* Summary Content */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700">
              Structured Key Takeaways:
            </label>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={fetchSummary}
                disabled={isSummarizing}
                className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100"
              >
                <RotateCw className={`w-3 h-3 ${isSummarizing ? 'animate-spin text-slate-600' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            {isSummarizing ? (
              <div className="h-32 flex flex-col items-center justify-center rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Summarizing notes...</span>
              </div>
            ) : (
              <textarea
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:border-slate-500 focus:bg-white"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSummarizing || !summary}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Summary</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
