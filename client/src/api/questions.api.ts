import api from './axios'

export const questionsApi = {
  getQuestions: (params?: Record<string, string | number>) =>
    api.get('/questions', { params }),
  getQuestion: (id: string) => api.get(`/questions/${id}`),
  getCategories: () => api.get('/questions/categories'),
  toggleBookmark: (id: string) => api.post(`/questions/${id}/bookmark`),
  getBookmarks: (params?: Record<string, number>) => api.get('/questions/bookmarks', { params }),
}
