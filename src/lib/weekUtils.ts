/**
 * Calendar week utilities (Monday-Sunday).
 * Dates are returned as YYYY-MM-DD strings for easy comparison with DB entries.
 */

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMondayOffset(date: Date): number {
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return day === 0 ? 6 : day - 1;
}

export function getCurrentWeekBounds(): { mondayStr: string; sundayStr: string } {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - getMondayOffset(now));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { mondayStr: toDateStr(monday), sundayStr: toDateStr(sunday) };
}

export function getPreviousWeekBounds(): { mondayStr: string; sundayStr: string } {
  const now = new Date();
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - getMondayOffset(now));
  const prevMonday = new Date(thisMonday);
  prevMonday.setDate(thisMonday.getDate() - 7);
  const prevSunday = new Date(prevMonday);
  prevSunday.setDate(prevMonday.getDate() + 6);
  return { mondayStr: toDateStr(prevMonday), sundayStr: toDateStr(prevSunday) };
}
