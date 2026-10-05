'use client';

import React from 'react';
import { Plus, Users } from 'lucide-react';

export default function Navbar({ onAddLead }) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-base">
              Event Lead Manager
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Track contacts met at events and generate follow-ups
            </p>
          </div>
        </div>

        {/* Add Lead button */}
        <button
          onClick={onAddLead}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>
    </header>
  );
}
