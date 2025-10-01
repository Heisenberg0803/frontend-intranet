import api from './api';
import type {Event} from '../types/type';

export const eventApi ={ 
    getAll: async() => {
        const res = await api.get<Event[]>('/event');
        return res.data;
    },

    getById: async(id: number) => {
        const res = await api.get<Event>(`/event/${id}`);
        return res.data;
    },

    create: async(data: Omit<Event,'id'>) => {
        const res = await api.post<Event>('/news/new', data);
        return res.data;
    },

    update: async(id: number, data: Partial<Event>) => {
        const res = await api.put<Event>(`/event/${id}`,data);
        return res.data;
    },

    delete: async(id:number) => {
        await api.delete<Event>(`/event/${id}`)
    }
}