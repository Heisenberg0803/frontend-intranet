import api from './api';
import type {User} from '../types/type';


export const userApi ={ 
    getAll: async() => {
        const res = await api.get<User[]>('/user');
        return res.data;
    },

    getById: async(id: number) => {
        const res = await api.get<User>(`/user/${id}`);
        return res.data;
    },

    create: async(data: Omit<User,'id'>) => {
        const res = await api.post<User>('/user/new', data);
        return res.data;
    },

    update: async(id: number, data: Partial<User>) => {
        const res = await api.put<User>(`/user/${id}`,data);
        return res.data;
    },

    delete: async(id:number) => {
        await api.delete<User>(`/user/${id}`)
    },

  // dentro de usersApi
    resetPassword: async (id: number, newPassword: string) => {
        const res = await api.put<User>(`/user/${id}/reset-password`, {
        password: newPassword, // 👈 enviando a nova senha no body
    });
        return res.data;
    }

}