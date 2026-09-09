'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  alert?: boolean;
  span?: 'normal' | 'wide';
  subMetric?: string;
}

const metrics: MetricCard[] = [
  {
    id: 'metric-impressions',
    label: 'Total Impressions',
    value: '284,712',
    change: 18.4,
    changeLabel: 'vs last period',
    icon: Eye,
    trend: 'up',
    span: 'wide',
    subMetric: '↑ 43,892 new this week',
  },
  {
    id: 'metric-engagement',
    label: 'Avg Engagement Rate',
    value: '4.7%',
    change: -0.8,
    changeLabel: 'vs last period',
    icon: TrendingDown,
    trend: 'down',
    alert: true,
    subMetric: 'Below 5% target',
  },
  {
    id: 'metric-reactions',
    label: 'Total Reactions',
    value: '8,341',
    change: 12.1,
    changeLabel: 'vs last period',
    icon: Heart,
    trend: 'up',
  },
  {
    id: 'metric-comments',
    label: 'Comments',
    value: '1,204',
    change: 6.3,
    changeLabel: 'vs last period',
    icon: MessageCircle,
    trend: 'up',
  },
  {
    id: 'metric-profile-visits',
    label: 'Profile Visits Driven',
    value: '3,891',
    change: 24.7,
    changeLabel: 'vs last period',
    icon: UserCheck,
    trend: 'up',
  },
  {
    id: 'metric-queue',
    label: 'Scheduled Queue',
    value: '12 posts',
    change: 0,
    changeLabel: 'next 14 days',
    icon: Clock,
    trend: 'neutral',
    subMetric: '3 pending approval',
  },
];

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        const isWide = metric.span === 'wide';
        const isAlert = metric.alert;

        return (
          <div
            key={metric.id}
            className={`card p-5 flex flex-col gap-3 transition-all duration-150 hover:card-shadow-md ${
              isWide ? 'md:col-span-2' : ''
            } ${isAlert ? 'border-warning/40 bg-warning/5' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-600 text-muted-foreground uppercase tracking-wide">
                {metric.label}
              </span>
              <div className={`p-1.5 rounded-lg ${
                isAlert ? 'bg-warning/10' :
                metric.trend === 'up' ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {isAlert
                  ? <AlertTriangle size={14} className="text-warning" />
                  : <Icon size={14} className={metric.trend === 'up' ? 'text-primary' : 'text-muted-foreground'} />
                }
              </div>
            </div>

            <div>
              <p className={`font-700 tabular-nums text-foreground ${isWide ? 'text-4xl' : 'text-2xl'}`}>
                {metric.value}
              </p>
              {metric.subMetric && (
                <p className={`text-xs mt-0.5 font-500 ${isAlert ? 'text-warning' : 'text-muted-foreground'}`}>
                  {metric.subMetric}
                </p>
              )}
            </div>

            {metric.change !== 0 && (
              <div className="flex items-center gap-1">
                {metric.trend === 'up'
                  ? <TrendingUp size={13} className="text-success" />
                  : <TrendingDown size={13} className="text-danger" />
                }
                <span className={`text-xs font-600 ${metric.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">{metric.changeLabel}</span>
              </div>
            )}
            {metric.change === 0 && (
              <p className="text-xs text-muted-foreground">{metric.changeLabel}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}