'use client';

import React from 'react';
import { Users, Flame, Clock, CheckCircle2, Calendar } from 'lucide-react';

export default function StatsBanner({ stats, onFilterPriority, onFilterStatus }) {
  const cards = [
    {
      title: 'Total Captured Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      action: () => onFilterStatus && onFilterStatus('all')
    },
    {
      title: 'Hot Priority Leads',
      value: stats?.hotLeadsCount || 0,
      icon: Flame,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      subtext: 'High conversion intent',
      action: () => onFilterPriority && onFilterPriority('Hot')
    },
    {
      title: 'Pending Follow-ups',
      value: stats?.pendingFollowUps || 0,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      subtext: 'Needs immediate action',
      action: () => onFilterStatus && onFilterStatus('pending')
    },
    {
      title: 'Follow-up Success Rate',
      value: `${stats?.conversionRate || 0}%`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      subtext: `${stats?.followedUpCount || 0} contacted/closed`,
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
            className={`cursor-pointer group relative overflow-hidden rounded-xl p-4 glass-card border ${card.border} hover:border-opacity-60 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">
                  {card.title}
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {card.value}
                  </span>
                </div>
                {card.subtext && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    {card.subtext}
                  </p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
