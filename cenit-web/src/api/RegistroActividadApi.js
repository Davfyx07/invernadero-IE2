// src/api/RegistroActividadApi.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/registroactividads";

export const getAllRegistroActividads    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getRegistroActividadById    = (id)   => api.get(`${BASE}/${id}`);
export const createRegistroActividad     = (data) => api.post(BASE, data);
export const updateRegistroActividad     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteRegistroActividad     = (id)   => api.delete(`${BASE}/${id}`);
