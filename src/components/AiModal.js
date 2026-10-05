'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, Send, Loader2 } from 'lucide-react';

export default function AiModal({ isOpen, onClose, lead, onSaveDraft }) {
  const [activeTab, setActiveTab] = useState('draft'); // 'draft' | 'summary'
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // When modal opens, load initial draft or summary
  useEffect(() => {
    if (lead && isOpen) {
      setError('');
      setCopied(false);
      if (activeTab === 'draft') {
        if (lead.ai_draft) {
          setResultText(lead.ai_draft);
        } else {
          handleGenerate('draft');
        }
      } else {
        if (lead.ai_summary) {
          setResultText(lead.ai_summary);
        } else {
          handleGenerate('summary');
        }
      }
    }
  }, [lead, isOpen, activeTab]);

  if (!isOpen || !lead) return null;

  // Call the AI endpoint
  const handleGenerate = async (type = activeTab) => {
    setLoading(true);
    setError('');
    try {
      if (type === 'draft') {
        const res = await fetch('/api/ai/draft-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: lead.id,
            name: lead.name,
            company: lead.company,
            event: lead.event,
            notes: lead.notes || 'Interested in connecting after the event.'
          })
        });
        const data = await res.json();
        if (data.success && data.draft) {
          setResultText(data.draft);
        } else {
          setError(data.error || 'Failed to generate draft.');
        }
      } else {
        // Summary
        const res = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: lead.id,
            name: lead.name,
            company: lead.company,
            event: lead.event,
            notes: lead.notes || 'No notes available to summarize.'
          })
        });
        const data = await res.json();
        if (data.success && data.summary) {
          setResultText(data.summary);
        } else {
          setError(data.error || 'Failed to summarize notes.');
        }
      }
    } catch (err) {
      setError('Network error while connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save draft to lead
  const handleSaveDraft = () => {
    if (activeTab === 'draft' && onSaveDraft) {
      onSaveDraft(lead.id, resultText);
      onClose();
    }
  };

  // Prepare mailto link
  const getMailtoLink = () => {
    let subject = `Follow-up from ${lead.event}`;
    let body = resultText;

    const subjectMatch = resultText.match(/Subject:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      body = resultText.replace(/Subject:\s*.*(\r\n|\n|\r)+/i, '').trim();
    }

    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span>AI Lead Assistant</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact: <span className="font-medium text-slate-800">{lead.name}</span> ({lead.company})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons (Draft Message vs Summarize Notes) */}
        <div className="flex space-x-2 mt-4 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'draft'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Draft Follow-up Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'summary'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Summarize Notes
          </button>
        </div>

        {/* Notes preview */}
        <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Meeting Notes: </span>
          <span>{lead.notes || 'No notes entered.'}</span>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {error}
          </div>
        )}

        {/* Content Area */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-medium text-slate-700">
              {activeTab === 'draft' ? 'Generated Email Draft:' : 'Summary of Key Points:'}
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleGenerate(activeTab)}
                disabled={loading}
                className="text-slate-500 hover:text-slate-800 text-xs underline"
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
              <span>Generating with AI...</span>
            </div>
          ) : (
            <textarea
              rows={7}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-slate-500 focus:bg-white"
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {activeTab === 'draft' ? (
            <a
              href={getMailtoLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
            >
              <Send className="w-3 h-3 text-slate-500" />
              <span>Open in Email App</span>
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            {activeTab === 'draft' && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium transition-colors"
              >
                Save Draft
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
