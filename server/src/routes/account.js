import { Router } from 'express';
import { getDb, save, uid } from '../db.js';
import { publicUser, requireAuth } from '../auth.js';
import { EARN_TASKS, REWARDS } from '../config.js';

const router = Router();
router.use(requireAuth);

const toActivity = (a) => ({ id: a.id, type: a.type, title: a.title, gems: a.gems, ves: a.ves, status: a.status, createdAt: a.createdAt });
const mine = (user) => getDb().activities.filter((a) => a.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/* ---------- Dashboard & activity ---------- */
router.get('/dashboard', (req, res) => {
  const all = mine(req.user);
  const done = all.filter((a) => a.status === 'completed');
  res.json({
    user: publicUser(req.user),
    stats: {
      conversions: done.filter((a) => a.type === 'conversion').length,
      gemsConverted: done.filter((a) => a.type === 'conversion').reduce((s, a) => s + Math.abs(a.gems), 0),
      vesEarned: done.filter((a) => a.type === 'conversion').reduce((s, a) => s + a.ves, 0),
      redemptions: done.filter((a) => a.type === 'redeem').length,
    },
    recent: all.slice(0, 5).map(toActivity),
  });
});

router.get('/activities', (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  let list = mine(req.user);
  if (type && type !== 'all') list = list.filter((a) => a.type === type);
  const size = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const current = Math.max(Number(page) || 1, 1);
  res.json({
    total: list.length, page: current, pageSize: size,
    items: list.slice((current - 1) * size, current * size).map(toActivity),
  });
});

/* ---------- Earn ---------- */
const taskState = (user, task) => {
  const last = user.claims?.[task.id];
  if (!last) return { available: true, nextAvailableAt: null };
  if (task.once) return { available: false, nextAvailableAt: null, completed: true };
  const next = new Date(new Date(last).getTime() + task.cooldownHours * 3600 * 1000);
  return next <= new Date() ? { available: true, nextAvailableAt: null } : { available: false, nextAvailableAt: next.toISOString() };
};

router.get('/earn/tasks', (req, res) => {
  res.json({ user: publicUser(req.user), tasks: EARN_TASKS.map((t) => ({ ...t, ...taskState(req.user, t) })) });
});

router.post('/earn/claim', (req, res) => {
  const task = EARN_TASKS.find((t) => t.id === req.body.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  const user = req.user;
  if (!taskState(user, task).available) return res.status(409).json({ message: 'This reward is not available yet.' });

  const before = publicUser(user).level;
  user.claims = { ...user.claims, [task.id]: new Date().toISOString() };
  user.gems += task.gems;
  user.xp += task.xp;
  const activity = { id: uid('act'), userId: user.id, type: 'earn', title: task.title, gems: task.gems, ves: 0, status: 'completed', createdAt: new Date().toISOString() };
  getDb().activities.push(activity);
  save();
  const next = publicUser(user);
  res.json({ user: next, task: { ...task, ...taskState(user, task) }, leveledUp: next.level > before });
});

/* ---------- Rewards ---------- */
router.get('/rewards', (req, res) => res.json({ user: publicUser(req.user), rewards: REWARDS }));

router.post('/rewards/redeem', (req, res) => {
  const reward = REWARDS.find((r) => r.id === req.body.rewardId);
  if (!reward) return res.status(404).json({ message: 'Reward not found.' });
  const user = req.user;
  if (user.ves < reward.costVEs) return res.status(409).json({ message: `You need ${reward.costVEs - user.ves} more VEs.` });
  user.ves -= reward.costVEs;
  const code = `VL-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const activity = { id: uid('act'), userId: user.id, type: 'redeem', title: reward.title, gems: 0, ves: -reward.costVEs, status: 'completed', createdAt: new Date().toISOString(), code };
  getDb().activities.push(activity);
  save();
  res.status(201).json({ user: publicUser(user), code, reward });
});

/* ---------- Referrals ---------- */
router.get('/referrals', (req, res) => {
  const invited = getDb().users
    .filter((u) => u.referredBy === req.user.id)
    .map((u) => ({ id: u.id, name: u.name.split(' ')[0], joinedAt: u.createdAt }));
  res.json({ user: publicUser(req.user), code: req.user.referralCode, invited });
});

/* ---------- Support ---------- */
router.get('/support/tickets', (req, res) => {
  res.json({ tickets: getDb().tickets.filter((t) => t.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

router.post('/support/tickets', (req, res) => {
  const subject = String(req.body.subject || '').trim();
  const message = String(req.body.message || '').trim();
  if (subject.length < 3 || message.length < 10) {
    return res.status(400).json({ message: 'Add a subject and a message of at least 10 characters.' });
  }
  const ticket = { id: uid('tkt'), userId: req.user.id, subject, message, status: 'open', createdAt: new Date().toISOString() };
  getDb().tickets.push(ticket);
  save();
  res.status(201).json({ ticket });
});

export default router;
