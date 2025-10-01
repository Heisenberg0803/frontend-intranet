import api from './api';
import type {Announcement} from '../types/type';

export const announcementApi ={ 
    getAll: async() => {
        const res = await api.get<Announcement[]>('/announcement');
        return res.data;
    },

    getById: async(id: number) => {
        const res = await api.get<Announcement>(`/announcement/${id}`);
        return res.data;
    },

    create: async(data: Omit<Announcement,'id'>) => {
        const res = await api.post<Announcement>('/announcement/new', data);
        return res.data;
    },

    update: async(id: number, data: Partial<Announcement>) => {
        const res = await api.put<Announcement>(`/announcement/${id}`,data);
        return res.data;
    },

    delete: async(id:number) => {
        await api.delete<Announcement>(`/announcement/${id}`)
    }
}