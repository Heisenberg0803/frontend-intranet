import api from "./api";

const token = localStorage.getItem("token")
export const commentApi = {
  getAll: (newsId: number) => api.get(`/news/${newsId}/comments`,{headers: {
                Authorization: `Bearer ${token}`
            }}),
  create: (newsId: number, text: string) =>
    api.post(`/news/${newsId}/comments`, { text },{
        headers: {
                Authorization: `Bearer ${token}`
            }
    }),
  delete: (newsId: number, id: number) => api.delete(`/news/${newsId}/comments/${id}`,{
        headers: {
                Authorization: `Bearer ${token}`
            }}),
};
