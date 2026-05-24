// src/api/CultivoApi.js
// Generado desde frontend.json — no editar manualmentee
import api from "./axiosConfig";

const BASE = "/cultivos";

export const getAllCultivos    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getCultivoById    = (id)   => api.get(`${BASE}/${id}`);
export const createCultivo     = (data) => api.post(BASE, data);
export const updateCultivo     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteCultivo     = (id)   => api.delete(`${BASE}/${id}`);
