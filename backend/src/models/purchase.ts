import { Schema, model, Document, Types } from 'mongoose';

export interface IPurchase extends Document {
  user: Types.ObjectId;
  productId: string;
  amount: number;
  createdAt: Date;
  isReferralCredited: boolean;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: String, required: true },
    amount: { type: Number, required: true },
    isReferralCredited: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Purchase = model<IPurchase>('Purchase', purchaseSchema);
