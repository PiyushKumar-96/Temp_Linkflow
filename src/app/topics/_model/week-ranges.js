export const MONTHS_2026 = [
  { key: '2026-01', name: 'January 2026', short: 'Jan' },
  { key: '2026-02', name: 'February 2026', short: 'Feb' },
  { key: '2026-03', name: 'March 2026', short: 'Mar' },
  { key: '2026-04', name: 'April 2026', short: 'Apr' },
  { key: '2026-05', name: 'May 2026', short: 'May' },
  { key: '2026-06', name: 'June 2026', short: 'Jun' },
  { key: '2026-07', name: 'July 2026', short: 'Jul' },
  { key: '2026-08', name: 'August 2026', short: 'Aug' },
  { key: '2026-09', name: 'September 2026', short: 'Sep' },
  { key: '2026-10', name: 'October 2026', short: 'Oct' },
  { key: '2026-11', name: 'November 2026', short: 'Nov' },
  { key: '2026-12', name: 'December 2026', short: 'Dec' },
];

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function computeWeekRanges(monthKey) {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const totalDays = getDaysInMonth(year, month);

  const ranges = [
    { weekNumber: 1, startDay: 1, endDay: 7 },
    { weekNumber: 2, startDay: 8, endDay: 14 },
    { weekNumber: 3, startDay: 15, endDay: 21 },
    { weekNumber: 4, startDay: 22, endDay: 28 },
  ];

  if (totalDays > 28) {
    ranges.push({ weekNumber: 5, startDay: 29, endDay: totalDays });
  }

  const pad = (n) => String(n).padStart(2, '0');

  return ranges.map((r) => ({
    label: `Week ${r.weekNumber}`,
    startDate: `${yearStr}-${monthStr}-${pad(r.startDay)}`,
    endDate: `${yearStr}-${monthStr}-${pad(r.endDay)}`,
    subtext: `Day ${r.startDay}–${r.endDay}`,
  }));
}
