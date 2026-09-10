/**
 * Single source of truth for scheduling rules, weekly time windows,
 * and slot calculations across LinkedFlow.
 */

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DEFAULT_TIMEZONE = 'America/New_York';

export const DEFAULT_WEEKLY_RULES = [
  { day: 'Monday', enabled: true, slots: [{ id: 'slot-mon-1', time: '09:00', enabled: true }] },
  { day: 'Tuesday', enabled: true, slots: [{ id: 'slot-tue-1', time: '09:15', enabled: true }] },
  { day: 'Wednesday', enabled: true, slots: [{ id: 'slot-wed-1', time: '10:00', enabled: true }] },
  { day: 'Thursday', enabled: true, slots: [{ id: 'slot-thu-1', time: '11:00', enabled: true }] },
  { day: 'Friday', enabled: true, slots: [{ id: 'slot-fri-1', time: '12:00', enabled: true }] },
  { day: 'Saturday', enabled: false, slots: [{ id: 'slot-sat-1', time: '10:00', enabled: true }] },
  { day: 'Sunday', enabled: false, slots: [{ id: 'slot-sun-1', time: '10:00', enabled: true }] },
];

/**
 * Retrieves the current configured publishing schedule rules and timezone from storage.
 */
export function getScheduleSettings() {
  try {
    const raw = localStorage.getItem('linkedflow_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        rules: Array.isArray(parsed.rules) && parsed.rules.length > 0 ? parsed.rules : DEFAULT_WEEKLY_RULES,
        timezone: parsed.timezone || DEFAULT_TIMEZONE,
      };
    }
  } catch {
    // Ignore storage parse error
  }
  return {
    rules: DEFAULT_WEEKLY_RULES,
    timezone: DEFAULT_TIMEZONE,
  };
}

/**
 * Formats a Date object into YYYY-MM-DD
 */
export function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the next available schedule slot strictly following Settings weekly time windows.
 * @param {Date|string} fromDate - Starting date (defaults to tomorrow if after hours, or today)
 * @returns {{ date: string, time: string, day: string, isSettingsSlot: true }}
 */
export function getNextAvailableSlot(fromDate = new Date()) {
  const { rules } = getScheduleSettings();
  const start = new Date(fromDate);
  if (isNaN(start.getTime())) {
    start.setTime(Date.now());
  }

  // Look ahead up to 14 days for the first enabled day with an active slot
  for (let offset = 0; offset < 14; offset++) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + offset);

    const dayName = DAYS_OF_WEEK[candidate.getDay()];
    const rule = rules.find((r) => r.day.toLowerCase() === dayName.toLowerCase());

    if (rule && rule.enabled) {
      const activeSlot = (rule.slots || []).find((s) => s.enabled !== false);
      if (activeSlot && activeSlot.time) {
        // If candidate is today, verify the slot hasn't already passed
        if (offset === 0) {
          const now = new Date();
          const [h, m] = activeSlot.time.split(':').map(Number);
          const slotTimeMinutes = h * 60 + m;
          const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
          if (slotTimeMinutes > currentTimeMinutes) {
            return {
              date: formatDateISO(candidate),
              time: activeSlot.time,
              day: dayName,
              isSettingsSlot: true,
            };
          }
        } else {
          return {
            date: formatDateISO(candidate),
            time: activeSlot.time,
            day: dayName,
            isSettingsSlot: true,
          };
        }
      }
    }
  }

  // Fallback if all days disabled: 3 days out at 09:00
  const fallbackDate = new Date();
  fallbackDate.setDate(fallbackDate.getDate() + 3);
  return {
    date: formatDateISO(fallbackDate),
    time: '09:00',
    day: DAYS_OF_WEEK[fallbackDate.getDay()],
    isSettingsSlot: false,
  };
}

/**
 * Generates an array of N sequential slots according to Settings weekly rules.
 * @param {number} count
 * @param {Date|string} fromDate
 */
export function getSequentialScheduleSlots(count = 3, fromDate = new Date()) {
  const { rules } = getScheduleSettings();
  const slots = [];
  let current = new Date(fromDate);
  if (isNaN(current.getTime())) current = new Date();

  let daysSearched = 0;
  while (slots.length < count && daysSearched < 60) {
    const dayName = DAYS_OF_WEEK[current.getDay()];
    const rule = rules.find((r) => r.day.toLowerCase() === dayName.toLowerCase());

    if (rule && rule.enabled) {
      const activeSlots = (rule.slots || []).filter((s) => s.enabled !== false);
      for (const slot of activeSlots) {
        if (slots.length < count) {
          slots.push({
            date: formatDateISO(current),
            time: slot.time || '09:00',
            day: dayName,
            isSettingsSlot: true,
          });
        }
      }
    }

    current.setDate(current.getDate() + 1);
    daysSearched++;
  }

  return slots;
}

/**
 * Checks whether a selected date/time matches an enabled weekly slot in Settings
 */
export function isSlotFromSettings(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const { rules } = getScheduleSettings();
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return false;

  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const rule = rules.find((r) => r.day.toLowerCase() === dayName.toLowerCase());
  if (!rule || !rule.enabled) return false;

  return (rule.slots || []).some((s) => s.time === timeStr && s.enabled !== false);
}
