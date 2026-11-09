import { Router } from 'express';
import { getDb, save, uid } from '../db.js';
import { publicUser, requireAuth } from '../auth.js';
import { EXCHANGE_OPTIONS, XP_PER_CONVERSION } from '../config.js';

const router = Router();
router.use(requireAuth);

const toActivity = (a) => ({ id: a.id, type: a.type, title: a.title, gems: a.gems, ves: a.ves, status: a.status, createdAt: a.createdAt });

router.get('/', (req, res) => {
  const history = getDb().activities
    .filter((a) => a.userId === req.user.id && a.type === 'conversion')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20)
    .map(toActivity);
  res.json({ user: publicUser(req.user), options: EXCHANGE_OPTIONS, history });
});

router.post('/convert', (req, res) => {
  const { optionId, idempotencyKey } = req.body;
  const db = getDb();
  const user = req.user;
  const option = EXCHANGE_OPTIONS.find((o) => o.id === optionId);
  if (!option) return res.status(404).json({ message: 'This conversion is no longer available.' });

  // Same key = same conversion: a repeated request never converts twice.
  if (idempotencyKey) {
    const previous = db.activities.find((a) => a.userId === user.id && a.idempotencyKey === idempotencyKey);
    if (previous) return res.json({ duplicate: true, activity: toActivity(previous), user: publicUser(user) });
  }

  if (user.gems < option.requiredGems) {
    return res.status(409).json({
      code: 'INSUFFICIENT_GEMS',
      message: `You need ${option.requiredGems - user.gems} more Gems for this conversion.`,
    });
  }

  user.gems -= option.requiredGems;
  user.ves += option.receiveVEs;
  user.xp += XP_PER_CONVERSION;
  const activity = {
    id: uid('txn'), userId: user.id, type: 'conversion', title: option.title,
    gems: -option.requiredGems, ves: option.receiveVEs, status: 'completed',
    createdAt: new Date().toISOString(), idempotencyKey: idempotencyKey || undefined,
  };
  db.activities.push(activity);
  save();
  return res.status(201).json({ activity: toActivity(activity), user: publicUser(user) });
});

export default router;
