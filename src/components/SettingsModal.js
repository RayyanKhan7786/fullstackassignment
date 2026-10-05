'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Key, User, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  senderName,
  setSenderName
}) {
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [localSender, setLocalSender] = useState(senderName || 'Alex');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalKey(apiKey || '');
      setLocalSender(senderName || 'Alex');
      setSaved(false);
    }
  }, [isOpen, apiKey, senderName]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(localKey);
    setSenderName(localSender);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lead_vortex_gemini_key', localKey);
      localStorage.setItem('lead_vortex_sender_name', localSender);
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Application & AI Configuration
              </h3>
              <p className="text-xs text-gray-400">
                Personalize follow-up sender signature & AI provider
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

        {/* Sender Name */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Default Sender Name (Your Name)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={localSender}
              onChange={(e) => setLocalSender(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            This name will be used to sign your AI-generated follow-up emails.
          </p>
        </div>

        {/* Optional Gemini API Key */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Google Gemini API Key (Optional)
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="AIzaSy... (Leave empty to use built-in engine)"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          
          <div className="mt-3 p-3 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-[11px] text-indigo-300 space-y-1">
            <div className="flex items-center space-x-1 font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Built-in Engine Active</span>
            </div>
            <p className="text-gray-400">
              Zero configuration required! The app comes with an intelligent built-in heuristic AI engine that works immediately. If you provide a Gemini API Key, live Gemini 1.5 Flash models will be used.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
