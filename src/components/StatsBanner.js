'use client';

import React from 'react';
import { Users, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function StatsBanner({ stats, onFilterPriority, onFilterStatus }) {
  const cards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      action: () => onFilterStatus && onFilterStatus('all')
    },
    {
      title: 'High Priority',
      value: stats?.hotLeadsCount || 0,
      icon: AlertCircle,
      subtext: 'High intent / immediate follow-up',
      action: () => onFilterPriority && onFilterPriority('Hot')
    },
    {
      title: 'Pending Follow-up',
      value: stats?.pendingFollowUps || 0,
      icon: Clock,
      subtext: 'Awaiting first message',
      action: () => onFilterStatus && onFilterStatus('pending')
    },
    {
      title: 'Follow-up Rate',
      value: `${stats?.conversionRate || 0}%`,
      icon: CheckCircle2,
      subtext: `${stats?.followedUpCount || 0} contacted or closed`,
      action: () => onFilterStatus && onFilterStatus('followed_up')
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.action}
            className="cursor-pointer rounded-lg p-4 bg-white border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {card.title}
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </span>
                </div>
                {card.subtext && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {card.subtext}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-md bg-slate-100 text-slate-600">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
