import { getAllInvernaderos } from "../api/InvernaderoApi";
import { getAllZonas } from "../api/ZonaApi";
import { getAllCultivos } from "../api/CultivoApi";
import { getAllInsumos } from "../api/InsumoApi";
import { getAllUsuarios } from "../api/UsuarioApi";
import { getAllLecturaSensors } from "../api/LecturaSensorApi";

const registry = {
  invernadero: {
    fetch: () => getAllInvernaderos(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "nombre",
  },
  zona: {
    fetch: () => getAllZonas(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "nombre",
  },
  cultivo: {
    fetch: () => getAllCultivos(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "especie",
  },
  insumo: {
    fetch: () => getAllInsumos(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "nombre",
  },
  usuario: {
    fetch: () => getAllUsuarios(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "nombre",
  },
  lecturasensor: {
    fetch: () => getAllLecturaSensors(0, 500).then((r) => r.data?.content ?? r.data ?? []),
    labelKey: "id",
  },
};

export async function fetchFkOptions(entityName) {
  const entry = registry[entityName.toLowerCase()];
  if (!entry) return [];
  try {
    const items = await entry.fetch();
    return items
      .filter((item) => item.activo !== false)
      .map((item) => ({ id: item.id, label: item[entry.labelKey] || `ID ${item.id}` }));
  } catch {
    return [];
  }
}

export function findFkLabel(entityName, id, items) {
  if (!items || !id) return `ID ${id || "—"}`;
  const item = items.find((i) => i.id === Number(id));
  return item?.label || `ID ${id}`;
}

export const FK_RELATIONS = {
  Zona: { invernadero_id: "invernadero" },
  Cultivo: { zona_id: "zona", usuario_id: "usuario" },
  RegistroActividad: { cultivo_id: "cultivo", insumo_id: "insumo", usuario_id: "usuario" },
  LecturaSensor: { zona_id: "zona" },
};
