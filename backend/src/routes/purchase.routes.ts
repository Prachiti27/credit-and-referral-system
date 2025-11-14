import { Router } from 'express';
import mongoose from 'mongoose';
import { authMiddleware, AuthedRequest } from '../middleware/auth';
import { Purchase } from '../models/purchase';
import { User } from '../models/User';
import { Referral } from '../models/Referral';

const router = Router();

router.post('/', authMiddleware, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { productId, amount } = req.body;

  if (!productId || !amount) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User not found' });
    }

    const previous = await Purchase.findOne({ user: userId }).session(session);

    let isReferralCredited = false;

    if (!previous && user.referredBy) {
      const referral = await Referral.findOne({
        referrer: user.referredBy,
        referredUser: userId,
      }).session(session);

      if (referral && referral.status !== 'CONVERTED') {
        await User.findByIdAndUpdate(
          user.referredBy,
          { $inc: { credits: 2 } },
          { session }
        );
        await User.findByIdAndUpdate(
          userId,
          { $inc: { credits: 2 } },
          { session }
        );

        referral.status = 'CONVERTED';
        referral.convertedAt = new Date();
        await referral.save({ session });

        isReferralCredited = true;
      }
    }

    await Purchase.create(
      [
        {
          user: userId,
          productId,
          amount,
          isReferralCredited,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, isReferralCredited });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: 'Purchase failed' });
  }
});

export default router;
