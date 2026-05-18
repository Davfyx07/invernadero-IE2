import api from "./axiosConfig";

const BASE = "/parametros";

export const getAllParametros       = (page = 0, size = 100) => api.get(BASE, { params: { page, size } });
export const getParametrosByTipo    = (tipo) => api.get(`${BASE}/by-tipo`, { params: { tipo } });
export const getParametroById       = (id) => api.get(`${BASE}/${id}`);
export const createParametro        = (data) => api.post(BASE, data);
export const updateParametro        = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteParametro        = (id) => api.delete(`${BASE}/${id}`);
