const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

const pad = (n: number) => String(n).padStart(2, '0')

/** HH:MM */
export const hm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

/** HH:MM:SS */
export const hms = (d: Date) => `${hm(d)}:${pad(d.getSeconds())}`

/** DDD MON DD, e.g. "MON JUL 20" */
export const dateLabel = (d: Date) =>
  `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${pad(d.getDate())}`
