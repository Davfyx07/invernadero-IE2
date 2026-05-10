// src/api/InsumoApi.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/insumos";

export const getAllInsumos    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getInsumoById    = (id)   => api.get(`${BASE}/${id}`);
export const createInsumo     = (data) => api.post(BASE, data);
export const updateInsumo     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteInsumo     = (id)   => api.delete(`${BASE}/${id}`);
