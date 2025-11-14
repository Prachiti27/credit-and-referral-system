import { Router } from 'express';
import { User } from '../models/User';
import { Referral } from '../models/Referral';
import { generateReferralCode } from '../utils/generateReferralCode';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await hashPassword(password);

    let code = generateReferralCode(name);
    while (await User.findOne({ referralCode: code })) {
      code = generateReferralCode(name);
    }

    let referredBy = null;

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      referredBy = referrer._id;
    }

    const user = await User.create({
      name,
      email,
      passwordHash,
      referralCode: code,
      referredBy,
    });

    if (referredBy) {
      await Referral.create({
        referrer: referredBy,
        referredUser: user._id,
        status: 'PENDING',
      });
    }

    const token = signToken({ userId: user._id.toString() });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user._id.toString() });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        credits: user.credits,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
