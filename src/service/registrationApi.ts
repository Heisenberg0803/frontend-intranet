import api  from "./api";
import type { Registration } from "../types/type";

const token = localStorage.getItem("token");

export const registrationApi = {

    create: async(eventId: number) => {
        try{
            const responnse = await api.post(`/events/${eventId}/registration`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }});
            return responnse.data;
        }catch(error){
            console.error("Erro ao registra usuario", error);
            throw error;
        }
    },

    getAll: async(eventId: number) => {
        try{
            const response = await api.get<Registration[]>(`/events/${eventId}/registration`);
            return response.data;
        }catch(error){
            console.error("Falha ao mostrar registros", error);
            throw error;
        }

    },

    getById: async(eventId: number, registrationId: number) => {
        try{
            const response = await api.get<Registration[]>(`/events/${eventId}/registration/${registrationId}`);
            return response.data;
        }catch(error){
            console.error("Falha ao buscar registro", error);
            throw error;
        }
    },

    delete: async(eventId:number, registrationId:number) => {
        try{
            const responnse = await api.delete<Registration>(`/events/${eventId}/registration/${registrationId}`,)
            return responnse.data;
        }catch(error){
            console.error("Falha ao excluir registro", error);
        }
    }
}