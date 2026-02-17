
"use client";

import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { BusMonitor } from '@/components/dashboard/BusMonitor';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { Gauge } from '@/components/dashboard/Gauges';
import { useSimulation } from '@/hooks/use-simulation';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Radar, Activity, Volume2, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { currentAlerts, isProcessing } = useSimulation();
  const alerts = currentAlerts?.prioritizedAlerts || [];
  const topAlert = alerts[0];
  const [audioWarning, setAudioWarning] = useState(false);

  // Trigger visual audio warning simulation
  useEffect(() => {
    if (topAlert?.threatLevel === 'DANGER') {
      setAudioWarning(true);
      const timer = setTimeout(() => setAudioWarning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [topAlert]);

  const getThreatColorClass = (level?: string) => {
    if (level === 'DANGER') return 'text-destructive border-destructive';
    if (level === 'WARNING') return 'text-accent border-accent';
    return 'text-emerald-500 border-emerald-500';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <SidebarNav />

      <main className="flex-1 flex flex-col p-6 overflow-hidden gap-6">
        {/* Top Header Controls */}
        <header className="flex items-center justify-between bg-card/30 p-4 rounded-2xl border border-border/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase leading-none">Driver Control Panel</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[9px] h-4 border-primary/50 text-primary bg-primary/5">
                  SYSTEM READY
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Unit 0824-A (San Francisco Fleet)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${audioWarning ? 'bg-destructive text-white scale-110 shadow-lg shadow-destructive/40' : 'bg-secondary/50 text-muted-foreground'}`}>
              <Volume2 className={`w-4 h-4 ${audioWarning ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{audioWarning ? 'ALARM ACTIVE' : 'AUDIO READY'}</span>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black leading-none">Jonas Driver</p>
                <p className="text-[10px] text-muted-foreground font-bold">Class B Certified</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Main Visualizer */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <Card className="flex-1 relative overflow-hidden bg-card/30 backdrop-blur-sm border-none shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <BusMonitor alerts={alerts} />
            </Card>

            {/* Automotive Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Gauge 
                label="Closest Object" 
                value={topAlert?.distanceMeters || 0} 
                min={0} 
                max={20} 
                unit="meters" 
                colorClass={getThreatColorClass(topAlert?.threatLevel)}
              />
              <Gauge 
                label="Time To Impact" 
                value={topAlert?.ttcSeconds || 10} 
                min={0} 
                max={10} 
                unit="seconds" 
                colorClass={getThreatColorClass(topAlert?.threatLevel)}
              />
              
              <Card className="p-4 bg-card/50 border-border flex flex-col justify-between overflow-hidden relative group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Radar className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Detection Density</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-black tracking-tighter">10</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">hz</span>
                  </div>
                  <Progress value={85} className="h-1 bg-secondary" />
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Radar className="w-24 h-24" />
                </div>
              </Card>

              <Card className="p-4 bg-card/50 border-border flex flex-col justify-between overflow-hidden relative group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Core Confidence</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-black tracking-tighter">98.4</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">%</span>
                  </div>
                  <div className="flex gap-1 h-1">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 bg-primary/20 rounded-full" />)}
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Activity className="w-24 h-24" />
                </div>
              </Card>
            </div>
          </div>

          {/* Side Panel: Alerts & Controls */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
            <AlertPanel alerts={alerts} />
            
            <Card className="p-6 bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 flex flex-col gap-4 group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-80">Safety Logic Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Latency</span>
                      <span className="text-2xl font-black">1.8<span className="text-xs font-normal opacity-80">ms</span></span>
                    </div>
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[15%] rounded-full shadow-[0_0_8px_white]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">CPU Load</span>
                      <span className="text-2xl font-black">12<span className="text-xs font-normal opacity-80">%</span></span>
                    </div>
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[12%] rounded-full shadow-[0_0_8px_white]" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] opacity-70 leading-relaxed font-medium mt-2 italic">
                * Circular buffers and priority queues active for sub-2ms threat prioritization.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
