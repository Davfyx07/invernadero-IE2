// src/api/ZonaApi.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/zonas";

export const getAllZonas    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getZonaById    = (id)   => api.get(`${BASE}/${id}`);
export const createZona     = (data) => api.post(BASE, data);
export const updateZona     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteZona     = (id)   => api.delete(`${BASE}/${id}`);
