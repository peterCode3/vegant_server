// suite.schema.ts
import * as mongoose from 'mongoose';

export const SuiteSchema = new mongoose.Schema({
  febricaSelection: { type: String, required: true },
  price: { type: String, required: true },
  style: { type: String, required: true },
  Mixmatchfabrics: { type: String, required: true },
  lapelStyle: { type: String, required: true },
  j17lapelWidth: { type: String, required: true },
  pocketStyle: { type: String, required: true },
  j25insidePockets: { type: String },
  lapelbuttonwholecolor: { type: String },
  positionOfbuttons: { type: String },
  sleeveButtonholes: { type: String },
  sleeveButtonPositions: { type: String },
  typesOfTheStitching: { type: String },
  elbowPatches: { type: String },
  Embroideryposition: { type: String },
  pocketEnvelopeFlapPosition: { type: String },
  quantity: { type: Number, default: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  checkoutStatus: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  stripeSessionId: { type: String },
});
