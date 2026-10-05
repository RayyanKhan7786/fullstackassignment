'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, User, Check } from 'lucide-react';

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
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Preferences & Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Set your sender name and optional API keys
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Name */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Sender Name (Your Name)
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={localSender}
              onChange={(e) => setLocalSender(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Used as the signature for generated follow-up messages.
          </p>
        </div>

        {/* Optional Gemini API Key */}
        <div className="mt-3.5">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Google Gemini API Key (Optional)
          </label>
          <div className="relative">
            <Key className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Leave empty to use built-in processor"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            If left blank, the app uses its internal processing logic out of the box.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-1 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
