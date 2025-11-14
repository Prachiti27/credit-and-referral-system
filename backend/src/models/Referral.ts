import { Schema, model, Document, Types } from 'mongoose';

export type ReferralStatus = 'PENDING' | 'CONVERTED';

export interface IReferral extends Document {
  referrer: Types.ObjectId;
  referredUser: Types.ObjectId;
  status: ReferralStatus;
  createdAt: Date;
  convertedAt?: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['PENDING', 'CONVERTED'], default: 'PENDING' },
    convertedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Referral = model<IReferral>('Referral', referralSchema);
