import api from './api';
import type {News} from '../types/type';

export const newApi ={ 
    getAll: async() => {
        const res = await api.get<News[]>('/news');
        return res.data;
    },

    getById: async(id: number) => {
        const res = await api.get<News>(`/news/${id}`);
        return res.data;
    },

    create: async(data: Omit<News,'id'>) => {
        const res = await api.post<News>('/news/new', data);
        return res.data;
    },

    update: async(id: number, data: Partial<News>) => {
        const res = await api.put<News>(`/news/${id}`,data);
        return res.data;
    },

    delete: async(id:number) => {
        await api.delete<News>(`/news/${id}`)
    }
}