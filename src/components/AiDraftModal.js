'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Mail, 
  Save, 
  RotateCw, 
  Send, 
  Loader2
} from 'lucide-react';

const TONE_OPTIONS = [
  { id: 'warm', label: 'Professional & Warm' },
  { id: 'executive', label: 'Executive Brief' },
  { id: 'pitch', label: 'Product Pitch' },
  { id: 'casual', label: 'Casual / Coffee' }
];

export default function AiDraftModal({
  isOpen,
  onClose,
  lead,
  onSaveDraft,
  senderName = 'Alex',
  apiKey = ''
}) {
  const [tone, setTone] = useState('warm');
  const [customPrompt, setCustomPrompt] = useState('');
  const [draftText, setDraftText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      if (lead.ai_draft) {
        setDraftText(lead.ai_draft);
      } else {
        generateDraft(tone, customPrompt);
      }
      setCopied(false);
      setSavedSuccess(false);
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const generateDraft = async (selectedTone = tone, promptText = customPrompt) => {
    setIsGenerating(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          name: lead.name,
          company: lead.company,
          event: lead.event,
          notes: lead.notes,
          ai_summary: lead.ai_summary,
          tone: selectedTone,
          customPrompt: promptText,
          senderName,
          apiKey
        })
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setDraftText(data.draft);
      }
    } catch (err) {
      console.error('Error drafting message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndMarkDrafted = async () => {
    await onSaveDraft(lead.id, draftText);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const getMailtoLink = () => {
    let subject = `Connecting after ${lead.event}`;
    let body = draftText;

    const subjectMatch = draftText.match(/Subject:\s*(.*)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      body = draftText.replace(/Subject:\s*.*(\r\n|\n|\r)+/i, '').trim();
    }

    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Draft Follow-Up Email
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              To: <span className="font-semibold text-slate-800">{lead.name}</span> ({lead.company}) • Met at {lead.event}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selection & Custom Focus */}
        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-600">Tone:</span>
            <div className="flex flex-wrap gap-1.5">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTone(t.id);
                    generateDraft(t.id, customPrompt);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    tone === t.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add specific points (e.g. mention Thursday demo call)..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  generateDraft(tone, customPrompt);
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
            />
            <button
              type="button"
              onClick={() => generateDraft(tone, customPrompt)}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center space-x-1 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-slate-600' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-600 flex items-center space-x-1.5">
              <span>Message Content:</span>
              {isGenerating && (
                <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Drafting...</span>
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-slate-100"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            rows={8}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            disabled={isGenerating}
            placeholder="Generated follow-up message will appear here..."
            className="w-full p-3 rounded-md bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono leading-relaxed focus:outline-none focus:border-slate-500 focus:bg-white"
          />
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href={getMailtoLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-slate-500" />
            <span>Open in Email App</span>
          </a>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSaveAndMarkDrafted}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
