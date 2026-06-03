import api from './axios'

export const quizApi = {
  getQuizzes: (params?: Record<string, string | number>) =>
    api.get('/quizzes', { params }),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  startQuiz: (id: string) => api.post(`/quizzes/${id}/start`),
  submitQuiz: (id: string, data: { answers: unknown[]; timeSpent: number }) =>
    api.post(`/quizzes/${id}/submit`, data),
  getMyResults: (params?: Record<string, number>) => api.get('/quizzes/results/my', { params }),
  getResult: (id: string) => api.get(`/quizzes/results/${id}`),
  getLeaderboard: () => api.get('/quizzes/leaderboard'),
}
