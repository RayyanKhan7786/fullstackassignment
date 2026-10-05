'use client';

import React from 'react';
import { 
  Plus, 
  ScanLine, 
  BarChart3, 
  Download, 
  RotateCcw, 
  Settings, 
  Users
} from 'lucide-react';

export default function Navbar({
  onNewLead,
  onSmartCapture,
  onOpenAnalytics,
  onOpenSettings,
  onResetData,
  onExport,
  isResetting
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-900 text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base text-slate-900">
                  Event Lead Manager
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Capture and follow up with event contacts
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Text / Business Card Parse */}
            <button
              id="btn-smart-capture"
              onClick={onSmartCapture}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Paste notes or card text to extract lead details"
            >
              <ScanLine className="w-3.5 h-3.5 text-slate-500" />
              <span>Paste Notes / Card</span>
            </button>

            {/* Analytics */}
            <button
              id="btn-analytics"
              onClick={onOpenAnalytics}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              title="View pipeline analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Export CSV */}
            <button
              id="btn-export-csv"
              onClick={onExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              title="Export all leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Reset Data */}
            <button
              id="btn-reset-data"
              onClick={onResetData}
              disabled={isResetting}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Reset sample leads"
            >
              <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin text-slate-600' : ''}`} />
              <span>Reset Data</span>
            </button>

            {/* Settings */}
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              id="btn-add-lead-main"
              onClick={onNewLead}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
