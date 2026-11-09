import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, save, uid, randomVeloopId, randomReferralCode } from '../db.js';
import { publicUser, requireAuth, signToken } from '../auth.js';
import { REFERRAL_BONUS, SIGNUP_BALANCE } from '../config.js';

const router = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const referralCode = String(req.body.referralCode || '').trim().toUpperCase();
  const db = getDb();

  const errors = {};
  if (name.length < 2) errors.name = 'Enter your name.';
  if (!EMAIL.test(email)) errors.email = 'Enter a valid email address.';
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Use at least 8 characters with a letter and a number.';
  }
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please check the highlighted fields.', errors });
  if (db.users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'An account with this email already exists.', errors: { email: 'Already registered. Try logging in.' } });
  }

  const referrer = referralCode ? db.users.find((u) => u.referralCode === referralCode) : null;
  if (referralCode && !referrer) {
    return res.status(400).json({ message: 'That referral code is not valid.', errors: { referralCode: 'Code not found.' } });
  }

  const now = new Date().toISOString();
  const user = {
    id: uid('user'), name, email, passwordHash: bcrypt.hashSync(password, 10),
    veloopId: randomVeloopId(), referralCode: randomReferralCode(),
    gems: SIGNUP_BALANCE.gems, ves: SIGNUP_BALANCE.ves, xp: 0, claims: {},
    referredBy: referrer?.id ?? null, createdAt: now,
  };
  db.users.push(user);

  if (referrer) {
    user.gems += REFERRAL_BONUS.referee;
    referrer.gems += REFERRAL_BONUS.referrer;
    db.activities.push(
      { id: uid('act'), userId: user.id, type: 'earn', title: 'Referral welcome bonus', gems: REFERRAL_BONUS.referee, ves: 0, status: 'completed', createdAt: now },
      { id: uid('act'), userId: referrer.id, type: 'earn', title: `Referral bonus · ${name.split(' ')[0]} joined`, gems: REFERRAL_BONUS.referrer, ves: 0, status: 'completed', createdAt: now },
    );
  }
  save();
  return res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = getDb().users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }
  return res.json({ token: signToken(user.id), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

export default router;
