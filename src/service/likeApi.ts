import api from "./api";
import type { Like } from "../types/type";
const token = localStorage.getItem("token")
export const likeApi = {
  likeNews: (newsId: number) => api.post(`/news/${newsId}/likes`,{},{
        headers: {
                Authorization: `Bearer ${token}`
            }
  }),

  unlikeNews: (newsId: number) => api.delete(`/news/${newsId}/unlike`,{
    headers: {
                Authorization: `Bearer ${token}`
            }
  }),
  getLikes: (newsId: number) => api.get<Like>(`/news/${newsId}/likes`,{
    headers: {
                Authorization: `Bearer ${token}`
            }
  }),

  likeComment: (newsId: number, commentNumber: number) =>
    api.post(`/news/${newsId}/comments/${commentNumber}/likes`,{},{
        headers: {
                Authorization: `Bearer ${token}`
            }
    }
    ),
  unlikeComment: (newsId: number, commentNumber: number) =>
    api.delete(`/news/${newsId}/comments/${commentNumber}/unlike`,{
        headers: {
                Authorization: `Bearer ${token}`
            }
    }),
  getCommentLikes: (newsId: number, commentNumber: number) =>
    api.get<Like>(`/news/${newsId}/comments/${commentNumber}/likes`,{
        headers: {
                Authorization: `Bearer ${token}`
            }
    }),
};
