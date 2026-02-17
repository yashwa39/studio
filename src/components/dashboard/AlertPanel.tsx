"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { type PrioritizedAlert } from '@/ai/flows/intelligent-alert-prioritization';

interface AlertPanelProps {
  alerts: PrioritizedAlert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priority = { DANGER: 0, WARNING: 1, SAFE: 2 };
    return priority[a.threatLevel] - priority[b.threatLevel];
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          Priority Alert Queue
        </h3>
        <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full font-bold text-muted-foreground">
          {sortedAlerts.length} Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedAlerts.map((alert, idx) => (
            <motion.div
              layout
              key={`${alert.objectType}-${alert.distanceMeters}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border-l-4 flex items-start gap-3 ${
                alert.threatLevel === 'DANGER' 
                  ? 'bg-destructive/10 border-destructive' 
                  : alert.threatLevel === 'WARNING'
                    ? 'bg-accent/10 border-accent'
                    : 'bg-emerald-500/10 border-emerald-500'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                alert.threatLevel === 'DANGER' ? 'bg-destructive text-white' : 
                alert.threatLevel === 'WARNING' ? 'bg-accent text-white' : 'bg-emerald-500 text-white'
              }`}>
                {alert.threatLevel === 'SAFE' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase">{alert.objectType}</span>
                  <span className="text-[10px] font-medium opacity-70">TTC: {alert.ttcSeconds.toFixed(1)}s</span>
                </div>
                <p className="text-sm font-medium leading-tight">
                  {alert.threatExplanation}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}