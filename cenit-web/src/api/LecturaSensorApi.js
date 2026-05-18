import api from "./axiosConfig";

const BASE = "/lecturas-sensores";

export const getAllLecturaSensors    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const getLatestLecturaSensors = () => api.get(`${BASE}/latest`);
export const getLecturaSensorById    = (id)   => api.get(`${BASE}/${id}`);
export const createLecturaSensor     = (data) => api.post(BASE, data);
export const updateLecturaSensor     = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteLecturaSensor     = (id)   => api.delete(`${BASE}/${id}`);
