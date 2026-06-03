export const APP_NAME = 'DevPrep AI'
export const APP_DESCRIPTION = 'IT interview tayyorgarlik platformasi'

export const TRACKS = [
  { value: 'FRONTEND', label: '🎨 Frontend', desc: 'HTML, CSS, JS, React, Next.js' },
  { value: 'BACKEND', label: '⚙️ Backend', desc: 'Node.js, Express, Databases' },
  { value: 'FULLSTACK', label: '🚀 Full Stack', desc: 'Frontend + Backend' },
] as const

export const DIFFICULTIES = [
  { value: 'EASY', label: 'Oson', color: 'text-emerald-400' },
  { value: 'MEDIUM', label: "O'rta", color: 'text-amber-400' },
  { value: 'HARD', label: 'Qiyin', color: 'text-rose-400' },
] as const

export const QUESTION_TYPES = [
  { value: 'SINGLE_CHOICE', label: 'Bir to\'g\'ri javob' },
  { value: 'MULTIPLE_CHOICE', label: 'Ko\'p to\'g\'ri javob' },
  { value: 'OPEN_ENDED', label: 'Ochiq savol' },
] as const

export const CATEGORY_GROUPS = [
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'GENERAL', label: 'Umumiy' },
] as const

export const PAGINATION_LIMIT = 20
export const QUIZ_DEFAULT_TIME = 600 // 10 minutes
