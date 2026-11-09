const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today, 4:23 PM" · "Yesterday, 11:15 AM" · "26 Aug 2026, 4:23 PM" */
export function formatWhen(iso, now = new Date()) {
  const date = new Date(iso);
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);
  const time = timeFormatter.format(date);
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${dateFormatter.format(date)}, ${time}`;
}

export const formatNumber = (value) => Number(value).toLocaleString('en-IN');
export const cx = (...names) => names.filter(Boolean).join(' ');

export function formatRemaining(iso, now = Date.now()) {
  const ms = new Date(iso).getTime() - now;
  if (ms <= 0) return null;
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/** Unique key sent with each conversion so a repeated request can never convert twice. */
export const makeKey = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
