import { Router } from 'express';
import { authMiddleware, AuthedRequest } from '../middleware/auth';
import { Referral } from '../models/Referral';
import { User } from '../models/User';

const router = Router();

router.get('/me/dashboard', authMiddleware, async (req: AuthedRequest, res) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalReferredUsers = await Referral.countDocuments({ referrer: userId });
    const convertedUsers = await Referral.countDocuments({
      referrer: userId,
      status: 'CONVERTED',
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const referralLink = `${frontendUrl}/register?r=${user.referralCode}`;

    res.json({
      referredUsers: totalReferredUsers,
      convertedUsers,
      totalCredits: user.credits,
      referralLink,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

export default router;
