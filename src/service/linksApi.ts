import api from './api';
import type {FavoriteLink} from '../types/type';

const token = localStorage.getItem("token");

export const linkApi ={ 
    getAll: async() => {
        const res = await api.get<FavoriteLink[]>('/links');
        return res.data;
    },

    getById: async(id: number) => {
        const res = await api.get<FavoriteLink>(`/links/${id}`);
        return res.data;
    },

    create: async(data: Omit<FavoriteLink,'id'>) => {
        const res = await api.post<FavoriteLink>('/links', data, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    update: async(id: number, data: Partial<FavoriteLink>) => {
        const res = await api.put<FavoriteLink>(`/links/${id}`,data,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    delete: async(id:number) => {
        await api.delete<FavoriteLink>(`/links/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    }
}