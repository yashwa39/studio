"use client";

import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useSimulation, type SimulationScenario } from '@/hooks/use-simulation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BusMonitor } from '@/components/dashboard/BusMonitor';
import { AlertPanel } from '@/components/dashboard/AlertPanel';
import { Car, Bike, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const scenarios: { id: SimulationScenario; label: string; icon: any; desc: string }[] = [
  { id: 'NORMAL', label: 'Normal Traffic', icon: ShieldCheck, desc: 'Regular city driving with vehicles at safe distances.' },
  { id: 'BIKE_OVERTAKING', label: 'Bike Overtaking', icon: Bike, desc: 'A cyclist enters the blind spot rapidly from the rear.' },
  { id: 'PEDESTRIAN_CROSSING', label: 'Pedestrian Cross', icon: User, desc: 'A pedestrian walks dangerously close to the front-left wheel.' },
  { id: 'SUDDEN_CUT_IN', label: 'Sudden Cut-In', icon: Car, desc: 'A vehicle swerves into the bus path at high speed.' },
];

export default function ScenariosPage() {
  const { scenario, setScenario, currentAlerts } = useSimulation();
  const alerts = currentAlerts?.prioritizedAlerts || [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarNav />

      <main className="flex-1 flex flex-col p-6 overflow-hidden gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-2xl font-black tracking-tight uppercase">What-If Scenarios</h2>
          <p className="text-muted-foreground text-sm">Simulate dangerous road situations to test the AI response and driver alerts.</p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Scenario Selection */}
          <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2">
            {scenarios.map((s) => (
              <Card 
                key={s.id} 
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  scenario === s.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "bg-card/50"
                )}
                onClick={() => setScenario(s.id)}
              >
                <CardHeader className="p-4 flex flex-row items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    scenario === s.id ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                  )}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-bold uppercase">{s.label}</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">{s.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
            
            <Card className="p-6 bg-secondary/30 border-dashed border-2 flex flex-col gap-4">
              <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Scenario Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Risk Probability</span>
                  <span className="font-bold">{scenario === 'NORMAL' ? '5%' : scenario === 'BIKE_OVERTAKING' ? '65%' : '90%'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>System Confidence</span>
                  <span className="font-bold">98.2%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs font-bold uppercase" onClick={() => window.location.reload()}>
                Reset Stream
              </Button>
            </Card>
          </div>

          {/* Live Preview of Scenario */}
          <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
             <div className="flex flex-col gap-6">
               <Card className="flex-1 bg-card/20 border-border overflow-hidden relative">
                 <BusMonitor alerts={alerts} />
               </Card>
             </div>
             <div className="flex flex-col">
               <AlertPanel alerts={alerts} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}