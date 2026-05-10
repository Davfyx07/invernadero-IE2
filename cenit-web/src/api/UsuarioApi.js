// src/api/UsuarioApi.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/usuarios";

export const getAllUsuarios    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getUsuarioById    = (id)   => api.get(`${BASE}/${id}`);
export const createUsuario     = (data) => api.post(BASE, data);
export const updateUsuario     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteUsuario     = (id)   => api.delete(`${BASE}/${id}`);
