'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  RotateCw, 
  Copy, 
  Building2, 
  Calendar,
  Save,
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
      console.error('Error fetching AI summary:', err);
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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                AI Interaction Notes Summary
              </h3>
              <p className="text-xs text-gray-400">
                Key takeaways & action items for <span className="text-indigo-300 font-semibold">{lead.name}</span> ({lead.company})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Notes Box */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Original Conversation Notes:
          </label>
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 italic">
            {lead.notes || 'No raw notes provided.'}
          </div>
        </div>

        {/* AI Synthesis */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-purple-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Summary:</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={fetchSummary}
                disabled={isSummarizing}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <RotateCw className={`w-3 h-3 ${isSummarizing ? 'animate-spin text-purple-400' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            {isSummarizing ? (
              <div className="h-40 flex flex-col items-center justify-center rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-300 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span>Distilling meeting notes with AI...</span>
              </div>
            ) : (
              <textarea
                rows={6}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-gray-200 leading-relaxed font-sans focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSummarizing || !summary}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all hover:scale-102 disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Summary Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save to Lead Profile</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
