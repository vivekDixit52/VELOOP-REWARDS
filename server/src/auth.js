import jwt from 'jsonwebtoken';
import { getDb } from './db.js';
import { levelInfo } from './config.js';

const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
if (!process.env.JWT_SECRET) console.warn('[auth] JWT_SECRET not set — using an insecure development secret.');

export const signToken = (userId) => jwt.sign({ sub: userId }, SECRET, { expiresIn: '7d' });

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    veloopId: user.veloopId,
    referralCode: user.referralCode,
    gems: user.gems,
    ves: user.ves,
    ...levelInfo(user.xp),
  };
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
  try {
    const { sub } = jwt.verify(token, SECRET);
    const user = getDb().users.find((u) => u.id === sub);
    if (!user) return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}
