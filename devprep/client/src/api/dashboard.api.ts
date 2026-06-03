import api from './axios'

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRoadmap: (track: string) => api.get(`/dashboard/roadmap/${track}`),
  completeNode: (nodeId: string) => api.post(`/dashboard/roadmap/${nodeId}/complete`),
  getNotifications: () => api.get('/dashboard/notifications'),
  markRead: (id: string) => api.patch(`/dashboard/notifications/${id}/read`),
  getAchievements: () => api.get('/dashboard/achievements'),
}
