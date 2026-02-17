
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, User, ShieldCheck, Zap } from 'lucide-react';
import { type PrioritizedAlert } from '@/ai/flows/intelligent-alert-prioritization';

interface BusMonitorProps {
  alerts: PrioritizedAlert[];
}

export function BusMonitor({ alerts }: BusMonitorProps) {
  const hasDanger = alerts.some(a => a.threatLevel === 'DANGER');
  const hasWarning = alerts.some(a => a.threatLevel === 'WARNING');
  const isSafe = !hasDanger && !hasWarning;

  const getThreatColor = (level: string) => {
    if (level === 'DANGER') return 'text-destructive fill-destructive/20';
    if (level === 'WARNING') return 'text-accent fill-accent/20';
    return 'text-emerald-500 fill-emerald-500/20';
  };

  return (
    <div className="relative w-full h-full min-h-[450px] flex items-center justify-center bg-card/10 rounded-2xl overflow-hidden border border-border/50">
      {/* Dynamic Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] transition-all duration-700" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', 
          backgroundSize: '30px 30px',
          backgroundPosition: hasDanger ? 'center 50%' : 'center'
        }} 
      />
      
      {/* Status HUD Overlays */}
      <div className="absolute top-8 left-8 z-10 space-y-3">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-xl border ${isSafe ? 'bg-emerald-500/10 border-emerald-500/30' : hasDanger ? 'bg-destructive/10 border-destructive/30' : 'bg-accent/10 border-accent/30'} transition-all duration-500`}>
          <div className="relative">
             <div className={`w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-500' : hasDanger ? 'bg-destructive' : 'bg-accent'} ${hasDanger || hasWarning ? 'animate-ping' : ''}`} />
             <div className={`absolute inset-0 w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : hasDanger ? 'bg-destructive shadow-[0_0_15px_#ef4444]' : 'bg-accent shadow-[0_0_15px_#ff9100]'}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
              {isSafe ? 'Path Secure' : hasDanger ? 'IMMEDIATE DANGER' : 'CAUTION ADVISED'}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-80 mt-0.5">
              Live Sensor Stream 102
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-background/80 border border-border/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-wider">AI Active</span>
          </div>
          <div className="bg-background/80 border border-border/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-wider">GPS Locked</span>
          </div>
        </div>
      </div>

      {/* Bus Visualization Container */}
      <motion.div 
        className="relative z-0"
        animate={hasDanger ? { x: [0, -4, 4, -4, 4, 0], y: [0, -1, 1, -1, 1, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.15 }}
      >
        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/40 blur-xl rounded-full" />
        
        {/* Main Bus Body */}
        <div className="relative w-28 h-72 bg-slate-800 rounded-2xl border-[6px] border-slate-700 shadow-2xl overflow-hidden ring-1 ring-white/10">
          {/* Internal Details */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/20 to-transparent" />
          
          {/* Windshield */}
          <div className="absolute top-4 left-2 right-2 h-14 bg-sky-900/40 rounded-lg border border-sky-400/20 shadow-inner overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-4 bg-white/5" />
          </div>

          {/* Passenger Windows */}
          <div className="absolute top-24 left-2 right-2 h-36 flex flex-col gap-2">
             <div className="h-full w-full bg-slate-900/80 rounded-md border border-white/5" />
          </div>
          
          {/* Rear Window */}
          <div className="absolute bottom-4 left-2 right-2 h-10 bg-sky-900/30 rounded-lg border border-sky-400/10" />
          
          {/* Headlights */}
          <div className={`absolute top-1 left-3 w-4 h-1.5 rounded-full ${hasDanger ? 'bg-red-500 animate-status-blink shadow-[0_0_15px_red]' : 'bg-slate-500 shadow-[0_0_5px_rgba(255,255,255,0.2)]'}`} />
          <div className={`absolute top-1 right-3 w-4 h-1.5 rounded-full ${hasDanger ? 'bg-red-500 animate-status-blink shadow-[0_0_15px_red]' : 'bg-slate-500 shadow-[0_0_5px_rgba(255,255,255,0.2)]'}`} />

          {/* Bus Number Label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[10px] font-black text-white/10 tracking-[1em] whitespace-nowrap">
            TRANSIT-0824
          </div>
        </div>

        {/* Blind Spots Zones - Field of View representation */}
        <div className={`absolute top-1/4 -left-48 w-48 h-80 bg-gradient-to-r from-transparent ${hasDanger ? 'via-destructive/20' : hasWarning ? 'via-accent/20' : 'via-primary/10'} to-transparent rounded-l-full pointer-events-none transition-colors duration-500`} />
        <div className={`absolute top-1/4 -right-48 w-48 h-80 bg-gradient-to-l from-transparent ${hasDanger ? 'via-destructive/20' : hasWarning ? 'via-accent/20' : 'via-primary/10'} to-transparent rounded-r-full pointer-events-none transition-colors duration-500`} />
      </motion.div>

      {/* Active Threats Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <AnimatePresence>
          {alerts.filter(a => a.threatLevel !== 'SAFE').map((alert, idx) => {
            // Calculate a horizontal offset based on index and some fixed positioning logic
            const isLeftSide = idx % 2 === 0;
            const xPos = isLeftSide ? -140 : 140;
            const yOffset = idx * 60 - 80;

            return (
              <motion.div
                key={`${alert.objectType}-${idx}`}
                initial={{ opacity: 0, scale: 0.5, x: isLeftSide ? -250 : 250 }}
                animate={{ opacity: 1, scale: 1, x: xPos, y: yOffset }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border-2 shadow-2xl ${alert.threatLevel === 'DANGER' ? 'border-destructive ring-4 ring-destructive/20' : 'border-accent ring-4 ring-accent/10'}`}
                style={{ width: '120px' }}
              >
                <div className={`p-3 rounded-full ${alert.threatLevel === 'DANGER' ? 'bg-destructive/10' : 'bg-accent/10'}`}>
                  {alert.objectType === 'car' && <Car className={`w-8 h-8 ${getThreatColor(alert.threatLevel)}`} />}
                  {alert.objectType === 'bike' && <Bike className={`w-8 h-8 ${getThreatColor(alert.threatLevel)}`} />}
                  {alert.objectType === 'pedestrian' && <User className={`w-8 h-8 ${getThreatColor(alert.threatLevel)}`} />}
                </div>
                
                <div className="text-center">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${alert.threatLevel === 'DANGER' ? 'text-destructive' : 'text-accent'}`}>{alert.threatLevel}</p>
                  <p className="text-xl font-black tabular-nums">{alert.distanceMeters.toFixed(1)}<span className="text-[10px] font-bold ml-0.5">m</span></p>
                  <div className="mt-1 h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${alert.threatLevel === 'DANGER' ? 'bg-destructive' : 'bg-accent'}`}
                      animate={{ width: `${Math.max(0, 100 - alert.ttcSeconds * 20)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground font-bold mt-1">TTC: {alert.ttcSeconds.toFixed(1)}s</p>
                </div>

                {/* Arrow connecting to bus */}
                <div className={`absolute top-1/2 ${isLeftSide ? '-right-4 border-l-background' : '-left-4 border-r-background'} border-[8px] border-transparent`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        <div className="flex flex-col gap-2">
           <div className="flex gap-4 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50">
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Ground Speed</span>
                <span className="text-sm font-black tracking-tight">45.2 km/h</span>
             </div>
             <div className="w-px h-6 bg-border/50 self-center" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Processing</span>
                <span className="text-sm font-black tracking-tight">1.2ms</span>
             </div>
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Active Monitor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
