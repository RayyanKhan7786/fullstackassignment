'use client';

import React from 'react';
import { 
  Sparkles, 
  Plus, 
  ScanLine, 
  BarChart3, 
  Download, 
  RotateCcw, 
  Settings, 
  Layers
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
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-indigo-200">
                  LeadVortex AI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Event CRM
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Capture & follow up with event connections at lightning speed
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* AI Smart Extract / Business Card */}
            <button
              id="btn-smart-capture"
              onClick={onSmartCapture}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/60 transition-all hover:scale-102 hover:shadow-lg hover:shadow-purple-900/20"
              title="Paste messy notes or card text to auto-create lead"
            >
              <ScanLine className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Quick Capture</span>
            </button>

            {/* Analytics */}
            <button
              id="btn-analytics"
              onClick={onOpenAnalytics}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-gray-900/70 hover:bg-gray-800 border border-gray-800 transition-all hover:text-white"
              title="View pipeline analytics and conversion rate"
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Export CSV */}
            <button
              id="btn-export-csv"
              onClick={onExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-gray-900/70 hover:bg-gray-800 border border-gray-800 transition-all hover:text-white"
              title="Export all leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Reset Sample Data */}
            <button
              id="btn-reset-data"
              onClick={onResetData}
              disabled={isResetting}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-amber-300 hover:bg-gray-900/60 transition-all"
              title="Reset with 5 realistic sample leads"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-amber-400' : ''}`} />
              <span>Reset Data</span>
            </button>

            {/* Settings */}
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 border border-transparent hover:border-gray-700 transition-all"
              title="AI & App Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* New Lead Primary Button */}
            <button
              id="btn-add-lead-main"
              onClick={onNewLead}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 hover:bg-right transition-all duration-300 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
