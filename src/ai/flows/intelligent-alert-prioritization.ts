'use server';
/**
 * @fileOverview This file implements a Genkit flow for intelligent alert prioritization
 * based on simulated blind spot data. It analyzes object distance, speed, and Time-to-Collision (TTC)
 * to categorize threats and provide concise explanations.
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
    .enum(['car', 'bike', 'pedestrian'])
    .describe('The type of object detected.'),
  distanceMeters: z.number().describe('The distance to the detected object in meters.'),
  ttcSeconds: z
    .number()
    .describe('The Time-to-Collision (TTC) with the object in seconds.'),
  threatExplanation: z
    .string()
    .describe(
      'A concise explanation of the immediate threat, suitable for a driver. Focus on the most critical threats.'
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
            'The relative speed of the detected object in meters per second (positive if approaching, negative if moving away).'
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
      'A list of prioritized alerts, ordered from most critical to least critical. Only include alerts with WARNING or DANGER threat levels, unless all objects are SAFE, in which case return a single SAFE alert for the entire system.'
    ),
});
export type PrioritizeAlertsOutput = z.infer<typeof PrioritizeAlertsOutputSchema>;

export async function prioritizeAlerts(
  input: PrioritizeAlertsInput
): Promise<PrioritizeAlertsOutput> {
  return intelligentAlertPrioritizationFlow(input);
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

    // Ensure output has at least one SAFE alert if no warnings/dangers were detected
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
