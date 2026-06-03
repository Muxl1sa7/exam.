import api from './axios'

export const aiApi = {
  evaluate: (data: { questionText: string; userAnswer: string; category?: string }) =>
    api.post('/ai/evaluate', data),
  startMockInterview: (track: string, count?: number) =>
    api.post('/ai/mock-interview/start', { track, count }),
  getSessions: (params?: Record<string, number>) => api.get('/ai/sessions', { params }),
  getSession: (id: string) => api.get(`/ai/sessions/${id}`),
}
