/**
 * Tiny JSON-file database. Everything is held in memory and flushed to disk
 * on every change (atomic rename), which is plenty for a demo-scale app.
 * Swap this module for MySQL/Mongo/Postgres without touching the routes much.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { SIGNUP_BALANCE } from './config.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const file = path.join(dir, 'db.json');

let db = { users: [], activities: [], tickets: [] };

export const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function save() {
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, file);
}

export function getDb() {
  return db;
}

export function randomVeloopId() {
  let id;
  do id = String(Math.floor(100000 + Math.random() * 900000));
  while (db.users.some((u) => u.veloopId === id));
  return id;
}

export function randomReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do code = 'VL' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  while (db.users.some((u) => u.referralCode === code));
  return code;
}

function seedDemoUser() {
  const id = 'user-demo';
  db.users.push({
    id,
    name: 'Hasan',
    email: 'demo@veloop.in',
    passwordHash: bcrypt.hashSync('Demo@123', 10),
    veloopId: '784659',
    referralCode: 'VLDEMO24',
    gems: SIGNUP_BALANCE.gems,
    ves: SIGNUP_BALANCE.ves,
    xp: 960,
    claims: {},
    createdAt: '2026-06-01T10:00:00.000Z',
  });
  const conv = (n, title, gems, ves, status, createdAt) => ({
    id: `seed-${n}`, userId: id, type: 'conversion', title, gems: -gems, ves, status, createdAt,
  });
  db.activities.push(
    conv(1, 'Daily Gem Conversion', 28, 151, 'completed', '2026-08-26T16:23:00.000Z'),
    conv(2, 'Reward Conversion', 39, 168, 'completed', '2026-08-25T11:15:00.000Z'),
    conv(3, 'Value Conversion', 57, 255, 'completed', '2026-08-23T16:49:00.000Z'),
    conv(4, 'Daily Gem Conversion', 25, 112, 'completed', '2026-08-20T09:10:00.000Z'),
    conv(5, 'Daily Gem Conversion', 28, 151, 'failed', '2026-08-19T14:22:00.000Z'),
    { id: 'seed-6', userId: id, type: 'earn', title: 'Daily check-in', gems: 5, ves: 0, status: 'completed', createdAt: '2026-08-18T08:05:00.000Z' },
    { id: 'seed-7', userId: id, type: 'redeem', title: 'Mobile Recharge ₹50', gems: 0, ves: -600, status: 'completed', createdAt: '2026-08-15T19:40:00.000Z' },
  );
}

export function initDb() {
  if (fs.existsSync(file)) {
    db = JSON.parse(fs.readFileSync(file, 'utf8'));
  } else {
    seedDemoUser();
    save();
  }
}
