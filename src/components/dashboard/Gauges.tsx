
"use client";

import React from 'react';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  colorClass: string;
}

export function Gauge({ value, min, max, label, unit, colorClass }: GaugeProps) {
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card/40 rounded-2xl border border-border/50 relative overflow-hidden group">
      <div className="w-32 h-16 relative overflow-hidden">
        {/* Gauge Background */}
        <div className="absolute top-0 left-0 w-32 h-32 border-[10px] border-secondary rounded-full opacity-20" />
        {/* Gauge Active Track */}
        <div 
          className={`absolute top-0 left-0 w-32 h-32 border-[10px] rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
            transform: `rotate(${rotation}deg)`,
            borderColor: 'currentColor'
          }}
        />
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-12 bg-foreground origin-bottom -translate-x-1/2 transition-transform duration-500 ease-out z-10"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="w-2 h-2 bg-foreground rounded-full absolute -bottom-1 -left-0.5" />
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-2xl font-black tracking-tighter">{value.toFixed(1)}</span>
        <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">{unit}</span>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
      </div>

      {/* Decorative pulse for high risk */}
      {colorClass.includes('destructive') && value < 2 && (
        <div className="absolute inset-0 bg-destructive/5 animate-pulse" />
      )}
    </div>
  );
}
