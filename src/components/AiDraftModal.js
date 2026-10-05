'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Mail, 
  Save, 
  RotateCw, 
  Send, 
  MessageSquare,
  Building2,
  Calendar,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TONE_OPTIONS = [
  { id: 'warm', label: 'Warm & Professional', desc: 'Friendly, collaborative & engaging' },
  { id: 'executive', label: 'Executive Brief', desc: 'Direct, concise, value & ROI focused' },
  { id: 'pitch', label: 'Solution Pitch', desc: 'Highlights problem-solution fit & demo CTA' },
  { id: 'casual', label: 'Coffee / Casual', desc: 'Informal networking connect' }
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
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Parse subject and body for mailto link
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>AI Follow-Up Message Generator</span>
              </h3>
              <p className="text-xs text-gray-400">
                Personalized follow-up for <span className="text-indigo-300 font-semibold">{lead.name}</span> ({lead.company}) met at <span className="text-gray-300">{lead.event}</span>
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

        {/* Lead Context Snapshot */}
        <div className="mt-4 p-3 rounded-xl bg-gray-900/70 border border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-gray-500" />
              <strong className="text-gray-200">{lead.company}</strong>
            </span>
            <span className="text-gray-400 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lead.event}</span>
            </span>
          </div>
          {lead.notes && (
            <div className="w-full text-[11px] text-gray-400 italic line-clamp-1 mt-1">
              Notes: "{lead.notes}"
            </div>
          )}
        </div>

        {/* Tone Selector */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Select Message Tone & Style:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTone(t.id);
                  generateDraft(t.id, customPrompt);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  tone === t.id
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'border-gray-800 bg-gray-900/60 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Instructions / Special Focus */}
        <div className="mt-3">
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Custom Emphasis / Specific Points (Optional):
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. Mention our special event discount or invite them to Thursday webinar"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  generateDraft(tone, customPrompt);
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => generateDraft(tone, customPrompt)}
              disabled={isGenerating}
              className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 flex items-center space-x-1 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Generated Email Content (Editable) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center space-x-1.5">
              <span>Follow-up Draft (Editable):</span>
              {isGenerating && (
                <span className="text-[11px] text-purple-400 font-normal animate-pulse flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>AI Crafting message...</span>
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy text'}</span>
            </button>
          </div>

          <textarea
            rows={10}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            disabled={isGenerating}
            placeholder="AI generated message will appear here..."
            className="w-full p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-sm text-gray-100 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2">
            {/* Open in Email Client (mailto) */}
            <a
              href={getMailtoLink()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 transition-all hover:scale-102"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in Email App</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>

            {/* Save to Lead & Mark as Drafted */}
            <button
              type="button"
              onClick={handleSaveAndMarkDrafted}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-md ${
                savedSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30 hover:scale-102'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Draft Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Draft to Lead</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
