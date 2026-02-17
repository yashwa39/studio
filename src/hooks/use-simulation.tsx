"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { prioritizeAlerts, type PrioritizeAlertsOutput, type PrioritizeAlertsInput } from '@/ai/flows/intelligent-alert-prioritization';

export type SimulationScenario = 'NORMAL' | 'BIKE_OVERTAKING' | 'PEDESTRIAN_CROSSING' | 'SUDDEN_CUT_IN';

export interface SensorDataPoint {
  objectType: 'car' | 'bike' | 'pedestrian';
  distanceMeters: number;
  speedMps: number;
  ttcSeconds: number;
}

const BUFFER_SIZE = 10;

export function useSimulation() {
  const [scenario, setScenario] = useState<SimulationScenario>('NORMAL');
  const [buffer, setBuffer] = useState<SensorDataPoint[][]>([]);
  const [currentAlerts, setCurrentAlerts] = useState<PrioritizeAlertsOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateData = useCallback(() => {
    const data: SensorDataPoint[] = [];
    
    // Logic based on scenario
    if (scenario === 'BIKE_OVERTAKING') {
      data.push({
        objectType: 'bike',
        distanceMeters: Math.max(1, 5 - (Date.now() % 5000) / 1000),
        speedMps: 2,
        ttcSeconds: Math.max(0.5, (5 - (Date.now() % 5000) / 1000) / 2)
      });
    } else if (scenario === 'PEDESTRIAN_CROSSING') {
      data.push({
        objectType: 'pedestrian',
        distanceMeters: Math.max(0.5, 3 - (Date.now() % 3000) / 1000),
        speedMps: 1.5,
        ttcSeconds: Math.max(0.2, (3 - (Date.now() % 3000) / 1000) / 1.5)
      });
    } else if (scenario === 'SUDDEN_CUT_IN') {
      data.push({
        objectType: 'car',
        distanceMeters: Math.max(2, 10 - (Date.now() % 4000) / 400),
        speedMps: 8,
        ttcSeconds: Math.max(0.8, (10 - (Date.now() % 4000) / 400) / 8)
      });
    } else {
      // Normal/Random noise
      if (Math.random() > 0.7) {
        data.push({
          objectType: 'car',
          distanceMeters: 15 + Math.random() * 10,
          speedMps: 1,
          ttcSeconds: 20
        });
      }
    }

    return data;
  }, [scenario]);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const newData = generateData();
      
      // Update circular buffer
      setBuffer(prev => {
        const newBuffer = [...prev, newData];
        if (newBuffer.length > BUFFER_SIZE) return newBuffer.slice(1);
        return newBuffer;
      });

      // Process Alerts using GenAI flow
      if (!isProcessing) {
        setIsProcessing(true);
        try {
          const input: PrioritizeAlertsInput = { simulatedData: newData };
          const result = await prioritizeAlerts(input);
          setCurrentAlerts(result);
        } catch (error) {
          console.error("AI Alert Prioritization failed", error);
        } finally {
          setIsProcessing(false);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [generateData, isProcessing]);

  return {
    scenario,
    setScenario,
    currentAlerts,
    isProcessing,
    rawBuffer: buffer
  };
}