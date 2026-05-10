// src/api/InvernaderoApi.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/invernaderos";

export const getAllInvernaderos    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getInvernaderoById    = (id)   => api.get(`${BASE}/${id}`);
export const createInvernadero     = (data) => api.post(BASE, data);
export const updateInvernadero     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteInvernadero     = (id)   => api.delete(`${BASE}/${id}`);
