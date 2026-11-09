/** Business rules in one place: exchange values, earn tasks, rewards, levels. */

export const XP_PER_LEVEL = 150;
export const SIGNUP_BALANCE = { gems: 420, ves: 3850 }; // demo starting balance for new accounts
export const REFERRAL_BONUS = { referrer: 25, referee: 10 };
export const XP_PER_CONVERSION = 10;

export const EXCHANGE_OPTIONS = [
  { id: 'exchange-01', type: 'gem-to-ve', title: 'Daily Gem Conversion', tone: 'purple', requiredGems: 28, receiveVEs: 151, popular: true },
  { id: 'exchange-02', type: 'gem-to-ve', title: 'Reward Conversion', tone: 'blue', requiredGems: 39, receiveVEs: 168, popular: true },
  { id: 'exchange-03', type: 'gem-to-ve', title: 'Value Conversion', tone: 'green', requiredGems: 57, receiveVEs: 255, popular: false },
  { id: 'exchange-04', type: 'gem-to-ve', title: 'Premium Conversion', tone: 'orange', requiredGems: 100, receiveVEs: 455, popular: false },
];

export const EARN_TASKS = [
  { id: 'daily-checkin', title: 'Daily check-in', text: 'Open VELOOP every day.', gems: 5, xp: 10, cooldownHours: 24 },
  { id: 'watch-ad', title: 'Watch a short video', text: 'Takes about 5 seconds.', gems: 3, xp: 5, cooldownHours: 1, durationSec: 5 },
  { id: 'daily-survey', title: 'Quick survey', text: 'Share your opinion.', gems: 8, xp: 15, cooldownHours: 24 },
  { id: 'complete-profile', title: 'Complete your profile', text: 'One-time bonus.', gems: 10, xp: 30, once: true },
];

export const REWARDS = [
  { id: 'rw-recharge', title: 'Mobile Recharge ₹50', category: 'Recharge', costVEs: 600, tone: 'blue' },
  { id: 'rw-voucher', title: 'Shopping Voucher ₹100', category: 'Voucher', costVEs: 1200, tone: 'purple' },
  { id: 'rw-food', title: 'Food Voucher ₹200', category: 'Voucher', costVEs: 2200, tone: 'orange' },
  { id: 'rw-stream', title: 'Streaming Pass · 1 month', category: 'Entertainment', costVEs: 1800, tone: 'green' },
  { id: 'rw-badge', title: 'Gold Profile Badge', category: 'Collectible', costVEs: 300, tone: 'orange' },
  { id: 'rw-chest', title: 'Mystery Reward Chest', category: 'Collectible', costVEs: 500, tone: 'purple' },
];

export const levelInfo = (xp) => {
  const level = 1 + Math.floor(xp / XP_PER_LEVEL);
  const start = (level - 1) * XP_PER_LEVEL;
  return { level, xp, levelStartXp: start, nextLevelXp: start + XP_PER_LEVEL };
};
