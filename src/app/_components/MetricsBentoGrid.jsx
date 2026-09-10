'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  UserCheck,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { getAnalyticsSummary } from '@/temp-backend';

const ICON_MAP = {
  Eye,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  UserCheck,
  Clock,
  AlertTriangle,
};

export default function MetricsBentoGrid({ activeRange = 'range-30d', refreshKey = 0 }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadMetrics() {
      setLoading(true);
      try {
        const data = await getAnalyticsSummary(activeRange);
        if (!cancelled) {
          setMetrics(data);
        }
      } catch {
        // Fallback
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadMetrics();
    return () => {
      cancelled = true;
    };
  }, [activeRange, refreshKey]);

  if (loading && metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`card p-5 flex flex-col gap-3 animate-pulse bg-muted/40 ${i === 1 ? 'md:col-span-2' : ''}`}
          >
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-8 bg-muted rounded w-1/2 mt-2" />
            <div className="h-3 bg-muted rounded w-2/3 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = ICON_MAP[metric.iconName] || Eye;
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
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {metric.label}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  isAlert ? 'bg-warning/10' : metric.trend === 'up' ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                {isAlert ? (
                  <AlertTriangle size={14} className="text-warning" />
                ) : (
                  <Icon
                    size={14}
                    className={metric.trend === 'up' ? 'text-primary' : 'text-muted-foreground'}
                  />
                )}
              </div>
            </div>

            <div>
              <p
                className={`font-bold tabular-nums text-foreground ${isWide ? 'text-4xl' : 'text-2xl'}`}
              >
                {metric.value}
              </p>
              {metric.subMetric && (
                <p
                  className={`text-xs mt-0.5 font-medium ${isAlert ? 'text-warning' : 'text-muted-foreground'}`}
                >
                  {metric.subMetric}
                </p>
              )}
            </div>

            {metric.change !== 0 && (
              <div className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TrendingUp size={13} className="text-success" />
                ) : (
                  <TrendingDown size={13} className="text-danger" />
                )}
                <span
                  className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-success' : 'text-danger'}`}
                >
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
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
