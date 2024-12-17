// suite.model.ts
import { Document } from 'mongoose';

export interface Suite {
  febricaSelection: string;
  price: string;
  style: string;
  Mixmatchfabrics: string;
  lapelStyle: string;
  j17lapelWidth: string;
  pocketStyle: string;
  j25insidePockets?: string;
  lapelbuttonwholecolor?: string;
  positionOfbuttons?: string;
  sleeveButtonholes?: string;
  sleeveButtonPositions?: string;
  typesOfTheStitching?: string;
  elbowPatches?: string;
  Embroideryposition?: string;
  pocketEnvelopeFlapPosition?: string;
  quantity: number;
  user: string; // assuming it is a string, change as necessary
  timestamp: Date;
  checkoutStatus: string; // 'pending', 'completed', 'cancelled'
  stripeSessionId?: string; // Optional field
}

export type SuiteDocument = Suite & Document;
