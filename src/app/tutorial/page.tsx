
"use client";

import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Cpu, Brackets, Calculator, MoveRight, Layers, Radar, Database, Zap } from 'lucide-react';
import Image from 'next/image';

export default function TutorialPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <SidebarNav />

      <main className="flex-1 flex flex-col p-6 overflow-y-auto gap-10">
        <header className="flex flex-col gap-3 max-w-4xl">
          <Badge variant="outline" className="w-fit text-[10px] font-black tracking-widest border-primary/50 text-primary uppercase">
            Education Center
          </Badge>
          <h2 className="text-4xl font-black tracking-tight uppercase leading-none">Engineering Safety</h2>
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
            A deep dive into the mathematics, data structures, and AI logic powering the <span className="text-foreground font-bold">Visionary Transit Guardian</span>.
          </p>
        </header>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'TTC Formula', 
              icon: Calculator, 
              color: 'text-primary',
              desc: 'TTC = Distance / Relative Speed. This is the ultimate metric for safety systems, calculating the exact window for driver reaction.' 
            },
            { 
              title: 'Circular Buffers', 
              icon: Brackets, 
              color: 'text-accent',
              desc: 'High-frequency sensor data is ingested into pre-allocated memory pools, ensuring constant-time (O(1)) operations and zero memory overhead.' 
            },
            { 
              title: 'Priority Queues', 
              icon: Layers, 
              color: 'text-emerald-500',
              desc: 'Critical threats are prioritized using min-heap logic. A pedestrian at 1.5s TTC always jumps to the top of the alert queue regardless of arrival time.' 
            },
          ].map((item, i) => (
            <Card key={i} className="bg-card/40 border-border/50 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-xl bg-background/50 border border-border/50 group-hover:scale-110 transition-transform ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-sm font-black uppercase tracking-widest">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Breakdown Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">System Architecture</h3>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/50">
                <AccordionTrigger className="text-lg font-black uppercase hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-code">01</span>
                    Sensor Ingestion (100Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-4 pb-6">
                  <p>
                    Each bus side is equipped with ultrasonic/LIDAR arrays. These sensors don't just "see" objects; they emit pulses and measure return time. Our system processes these as raw distance vectors in a <span className="text-foreground font-bold">Circular Buffer</span>.
                  </p>
                  <div className="bg-secondary/40 p-6 rounded-2xl border border-border/50 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>In-Memory Buffer [Size: 1024]</span>
                      <span>O(1) Access</span>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                       {[1,2,3,4,5,6,7,8].map(i => (
                         <div key={i} className={`h-8 rounded-md flex items-center justify-center text-[10px] font-bold ${i === 4 ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(41,98,255,0.4)]' : 'bg-background/50 border border-border/30'}`}>
                           {i === 4 ? 'HEAD' : `V_${i}`}
                         </div>
                       ))}
                    </div>
                    <p className="text-[10px] italic">By using pre-allocated memory, we avoid garbage collection pauses that could delay life-saving alerts.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-border/50">
                <AccordionTrigger className="text-lg font-black uppercase hover:no-underline">
                   <div className="flex items-center gap-4">
                    <span className="text-accent font-code">02</span>
                    The TTC Risk Algorithm
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-6 pb-6">
                  <p>
                    Distance alone is misleading. A car 2 meters away moving at the same speed is safe. A car 10 meters away closing at 20m/s is a <span className="text-destructive font-bold uppercase">Critical Threat</span>.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                       <span className="block text-[10px] font-bold uppercase mb-2">Linear TTC</span>
                       <code className="text-sm text-foreground bg-primary/10 px-2 py-1 rounded">T = D / (V_rel)</code>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                       <span className="block text-[10px] font-bold uppercase mb-2">Vector Risk</span>
                       <code className="text-sm text-foreground bg-accent/10 px-2 py-1 rounded">R = Σ (1/T_i)</code>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-border/50">
                <AccordionTrigger className="text-lg font-black uppercase hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-500 font-code">03</span>
                    Alert State Machine
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed space-y-4 pb-6">
                  <div className="relative p-6 bg-background/40 rounded-2xl border border-border/50">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)]">SAFE</div>
                        <span className="text-[10px] font-bold">T {'>'} 5s</span>
                      </div>
                      <MoveRight className="text-muted-foreground/30" />
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(255,145,0,0.4)]">WARN</div>
                        <span className="text-[10px] font-bold">2s {'<'} T {'<'} 5s</span>
                      </div>
                      <MoveRight className="text-muted-foreground/30" />
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)]">DANGER</div>
                        <span className="text-[10px] font-bold">T {'<'} 2s</span>
                      </div>
                    </div>
                    <p className="text-xs italic text-center">Hysteresis logic is applied to prevent "flip-flopping" of alerts at state boundaries.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck className="w-32 h-32" />
               </div>
               <CardHeader>
                 <Badge className="w-fit mb-2 bg-primary">Implementation Advantage</Badge>
                 <CardTitle className="text-xl font-black uppercase">Low Cost, High Intelligence</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Traditional fleet safety often relies on expensive LiDAR units ($5k+). Our system proves that <span className="text-primary font-bold">Smart Math {'>'} Expensive Hardware</span>.
                 </p>
                 <ul className="space-y-3">
                   {[
                     { icon: Radar, text: 'Fusion of ultrasonic + vision data' },
                     { icon: Database, text: 'Edge-optimized data structures' },
                     { icon: Zap, text: 'Real-time prioritisation logic' }
                   ].map((li, i) => (
                     <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                       <li.icon className="w-4 h-4 text-primary" />
                       {li.text}
                     </li>
                   ))}
                 </ul>
               </CardContent>
            </Card>

            <div className="flex-1 bg-card/30 rounded-2xl border border-border/50 p-6 flex flex-col gap-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <h4 className="font-black text-xs uppercase tracking-[0.2em] relative z-10">Real-World Dataset</h4>
               <div className="space-y-4 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-border/50 shadow-lg">
                      <Image 
                        src="https://picsum.photos/seed/car1/100/100" 
                        width={100}
                        height={100}
                        alt="Bus Scene" 
                        className="object-cover" 
                        data-ai-hint="bus scene"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none mb-1">Intersection Training</p>
                      <p className="text-[10px] text-muted-foreground">Scenario #082 - Bike Overtaking</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-border/50 shadow-lg">
                      <Image 
                        src="https://picsum.photos/seed/bus1/100/100" 
                        width={100}
                        height={100}
                        alt="Bus Cockpit" 
                        className="object-cover" 
                        data-ai-hint="bus cockpit"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none mb-1">Human Factors Testing</p>
                      <p className="text-[10px] text-muted-foreground">Driver fatigue and alert fatigue analysis.</p>
                    </div>
                 </div>
               </div>
               <button className="mt-auto w-full py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-border/50">
                  Download Whitepaper
               </button>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary p-12 rounded-[2rem] text-primary-foreground flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-primary/30">
          <div className="flex-1 space-y-6">
            <h3 className="text-4xl font-black uppercase leading-none tracking-tighter">Ready to Deploy?</h3>
            <p className="text-lg opacity-80 max-w-xl font-medium">
              Join the future of public transit safety. Our system is modular, lightweight, and can be integrated into existing fleet management consoles in under 24 hours.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-white text-primary rounded-xl font-black uppercase text-sm shadow-xl hover:scale-105 transition-transform">Get Started</button>
              <button className="px-8 py-4 bg-primary-foreground/10 border border-white/20 rounded-xl font-black uppercase text-sm hover:bg-primary-foreground/20 transition-colors">Book Demo</button>
            </div>
          </div>
          <div className="relative w-full md:w-80 aspect-square bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
             <ShieldCheck className="w-40 h-40 opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                   <ShieldCheck className="w-16 h-16 text-primary" />
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
