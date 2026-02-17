
'use server';
/**
 * @fileOverview This file implements a Genkit flow for intelligent alert prioritization
 * based on simulated blind spot data. It analyzes object distance, speed, and Time-to-Collision (TTC)
 * to categorize threats. It includes a local fallback to allow the app to function without
 * an external API key.
 *
 * - prioritizeAlerts - A function that handles the intelligent alert prioritization process.
 * - PrioritizeAlertsInput - The input type for the prioritizeAlerts function.
 * - PrioritizeAlertsOutput - The return type for the prioritizeAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizedAlertSchema = z.object({
  threatLevel: z
    .enum(['SAFE', 'WARNING', 'DANGER'])
    .describe('The categorized threat level based on TTC and other factors.'),
  objectType: z
    .enum(['car', 'bike', 'pedestrian', 'system'])
    .describe('The type of object detected.'),
  distanceMeters: z.number().describe('The distance to the detected object in meters.'),
  ttcSeconds: z
    .number()
    .describe('The Time-to-Collision (TTC) with the object in seconds.'),
  threatExplanation: z
    .string()
    .describe(
      'A concise explanation of the immediate threat, suitable for a driver.'
    ),
});

const PrioritizeAlertsInputSchema = z.object({
  simulatedData: z
    .array(
      z.object({
        objectType: z
          .enum(['car', 'bike', 'pedestrian'])
          .describe('The type of object detected.'),
        distanceMeters: z
          .number()
          .describe('The distance to the detected object in meters.'),
        speedMps: z
          .number()
          .describe(
            'The relative speed of the detected object in meters per second.'
          ),
        ttcSeconds: z
          .number()
          .describe('The Time-to-Collision (TTC) with the object in seconds.'),
      })
    )
    .describe('An array of simulated sensor data for objects in blind spots.'),
});
export type PrioritizeAlertsInput = z.infer<typeof PrioritizeAlertsInputSchema>;

const PrioritizeAlertsOutputSchema = z.object({
  prioritizedAlerts: z
    .array(PrioritizedAlertSchema)
    .describe(
      'A list of prioritized alerts. If no objects are WARNING or DANGER, return a single SAFE alert.'
    ),
});
export type PrioritizeAlertsOutput = z.infer<typeof PrioritizeAlertsOutputSchema>;

/**
 * Main entry point for alert prioritization.
 * Checks for API key availability and falls back to local logic if needed.
 */
export async function prioritizeAlerts(
  input: PrioritizeAlertsInput
): Promise<PrioritizeAlertsOutput> {
  // Check for various possible API key environment variables
  const hasKey = !!(process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY) && 
                 process.env.GOOGLE_GENAI_API_KEY !== 'YOUR_API_KEY';

  if (!hasKey) {
    return localPrioritizeAlerts(input);
  }

  try {
    return await intelligentAlertPrioritizationFlow(input);
  } catch (error) {
    console.warn("AI Prioritization failed, falling back to local heuristic logic.");
    return localPrioritizeAlerts(input);
  }
}

/**
 * Deterministic fallback logic that mimics the AI's reasoning using simple thresholds.
 */
function localPrioritizeAlerts(input: PrioritizeAlertsInput): PrioritizeAlertsOutput {
  const alerts = input.simulatedData.map(obj => {
    let threatLevel: 'SAFE' | 'WARNING' | 'DANGER' = 'SAFE';
    let explanation = '';

    if (obj.ttcSeconds < 2) {
      threatLevel = 'DANGER';
      explanation = `${obj.objectType.charAt(0).toUpperCase() + obj.objectType.slice(1)} very close, immediate collision risk.`;
    } else if (obj.ttcSeconds <= 5) {
      threatLevel = 'WARNING';
      explanation = `${obj.objectType.charAt(0).toUpperCase() + obj.objectType.slice(1)} approaching, potential conflict.`;
    } else {
      threatLevel = 'SAFE';
      explanation = `${obj.objectType.charAt(0).toUpperCase() + obj.objectType.slice(1)} at safe distance.`;
    }

    return {
      threatLevel,
      objectType: obj.objectType,
      distanceMeters: obj.distanceMeters,
      ttcSeconds: obj.ttcSeconds,
      threatExplanation: explanation,
    };
  });

  // Filter to show only WARNING or DANGER, unless all are SAFE
  const filtered = alerts.filter(a => a.threatLevel !== 'SAFE');
  const prioritized = filtered.sort((a, b) => a.ttcSeconds - b.ttcSeconds);

  if (prioritized.length === 0) {
    return {
      prioritizedAlerts: [
        {
          threatLevel: 'SAFE',
          objectType: 'system',
          distanceMeters: 0,
          ttcSeconds: 0,
          threatExplanation: 'All blind spots clear.',
        },
      ],
    };
  }

  return { prioritizedAlerts: prioritized };
}

const alertPrioritizationPrompt = ai.definePrompt({
  name: 'alertPrioritizationPrompt',
  input: {schema: PrioritizeAlertsInputSchema},
  output: {schema: PrioritizeAlertsOutputSchema},
  prompt: `You are an intelligent blind spot detection system. Your task is to analyze simulated sensor data for objects near a bus, prioritize potential threats, and provide concise, actionable alerts for a bus driver.\n\nSimulated Sensor Data:\n{{#each simulatedData}}\n- Object Type: {{{objectType}}}, Distance: {{{distanceMeters}}}m, Relative Speed: {{{speedMps}}}m/s, TTC: {{{ttcSeconds}}}s\n{{/each}}\n\nCategorize each object's threat level based on Time-to-Collision (TTC) as follows:\n- DANGER: TTC is less than 2 seconds. Immediate action required.\n- WARNING: TTC is between 2 and 5 seconds (inclusive). Increased awareness needed.\n- SAFE: TTC is greater than 5 seconds. No immediate threat.\n\nPrioritize the alerts, focusing on objects with 'DANGER' or 'WARNING' threat levels first. If no objects are in 'DANGER' or 'WARNING', categorize all as 'SAFE'.\n\nFor each prioritized alert, provide a clear and concise 'threatExplanation' that briefly describes the immediate threat to the driver, minimizing jargon. Only include alerts that are 'WARNING' or 'DANGER'. If all objects are 'SAFE', return an array containing a single 'SAFE' alert for the entire system (e.g., threatLevel: 'SAFE', objectType: 'system', distanceMeters: 0, ttcSeconds: 0, threatExplanation: 'All blind spots clear.').\n\nExample for 'DANGER' explanation: 'Pedestrian very close, immediate collision risk.'\nExample for 'WARNING' explanation: 'Car approaching fast, potential conflict.'\n`,
});

const intelligentAlertPrioritizationFlow = ai.defineFlow(
  {
    name: 'intelligentAlertPrioritizationFlow',
    inputSchema: PrioritizeAlertsInputSchema,
    outputSchema: PrioritizeAlertsOutputSchema,
  },
  async (input) => {
    const {output} = await alertPrioritizationPrompt(input);

    if (output && output.prioritizedAlerts.length === 0) {
      return {
        prioritizedAlerts: [
          {
            threatLevel: 'SAFE',
            objectType: 'system',
            distanceMeters: 0,
            ttcSeconds: 0,
            threatExplanation: 'All blind spots clear.',
          },
        ],
      };
    }

    return output!;
  }
);
