'use client';

import React, { useState } from 'react';
import { 
  X, 
  ScanLine, 
  Sparkles, 
  Check, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  Flame, 
  Loader2,
  FileText
} from 'lucide-react';

const SAMPLE_RAW_TEXTS = [
  {
    title: 'Business Card OCR Sample',
    text: `Dr. Aris Thorne
Chief Technology Officer
NeuralVoxel Dynamics LLC
Email: a.thorne@neuralvoxel.ai
Direct: +1 (650) 412-9081
Met at: AI Hardware Expo 2026
Notes: Impressed by our inference optimization engine. They are burning $40k/mo on GPU servers. Wants to run a proof of concept next month. Send technical benchmark whitepaper.`
  },
  {
    title: 'Voice Note Transcription Sample',
    text: `Quick voice note from AWS Summit lunch: Met Maya Lin, she runs Growth Marketing at FinPulse Technologies (maya@finpulse.io, phone 415-802-9912). They have 50 SDRs and need automated lead routing before Q3. She is the budget decision maker. High urgency.`
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
      setError(err.message || 'Error communicating with AI service');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                AI Quick Capture & Business Card Parser
              </h3>
              <p className="text-xs text-gray-400">
                Paste raw meeting notes, business card text, or voice transcripts to auto-extract structured lead data
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

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Input Raw Text */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-300">
              Paste Raw Content / Transcripts / Business Card OCR:
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-gray-500">Quick Test Samples:</span>
              {SAMPLE_RAW_TEXTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setRawText(sample.text);
                    handleExtract(sample.text);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-purple-300 hover:bg-gray-800 transition-colors"
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
            placeholder="Paste raw text here... e.g. 'Met Sarah from Apex AI (sarah@apex.io) at TechCrunch Disrupt...'"
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleExtract()}
              disabled={isExtracting || !rawText.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Lead Fields...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Extracted Fields Review */}
        {extractedData && (
          <div className="mt-5 p-4 rounded-xl bg-purple-950/20 border border-purple-800/40">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Extracted Lead Profile (Review & Adjust):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={extractedData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Company</label>
                <input
                  type="text"
                  value={extractedData.company || ''}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={extractedData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={extractedData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Event</label>
                <input
                  type="text"
                  value={extractedData.event || ''}
                  onChange={(e) => handleFieldChange('event', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Suggested Priority</label>
                <select
                  value={extractedData.priority || 'Warm'}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Hot">🔥 Hot</option>
                  <option value="Warm">⚡ Warm</option>
                  <option value="Cold">❄️ Cold</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Tags</label>
                <input
                  type="text"
                  value={extractedData.tags || ''}
                  onChange={(e) => handleFieldChange('tags', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Cleaned Meeting Notes</label>
                <textarea
                  rows={2}
                  value={extractedData.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLead}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all hover:scale-102"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Create Lead</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
