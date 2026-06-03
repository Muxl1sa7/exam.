// Format date to readable string
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format time ago
export const timeAgo = (date: string | Date): string => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'Hozirgina'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} daqiqa oldin`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  return `${days} kun oldin`
}

// Format seconds to mm:ss
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Get score color class
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-rose-400'
}

// Get score label
export const getScoreLabel = (score: number): string => {
  if (score >= 80) return "A'lo"
  if (score >= 60) return 'Yaxshi'
  if (score >= 40) return "O'rtacha"
  return 'Past'
}

// Truncate text
export const truncate = (text: string, length = 100): string => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Difficulty labels
export const difficultyLabel: Record<string, string> = {
  EASY: 'Oson',
  MEDIUM: "O'rta",
  HARD: 'Qiyin',
  MIXED: 'Aralash',
}

// Track labels
export const trackLabel: Record<string, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  FULLSTACK: 'Full Stack',
}
