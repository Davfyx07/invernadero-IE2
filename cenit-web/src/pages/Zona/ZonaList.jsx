import CrudList from "../../components/CrudList";
import { getAllZonas, getZonaById, createZona, updateZona, deleteZona } from "../../api/ZonaApi";
import { FK_RELATIONS } from "../../api/entityRegistry";

const COLUMNS = [
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "capacidad", header: "Capacidad", type: "number" },
  { key: "invernadero_id", header: "Invernadero", type: "fk" },
];

const API = { getAll: getAllZonas, getById: getZonaById, create: createZona, update: updateZona, delete: deleteZona };

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "capacidad", label: "Capacidad", type: "number" },
  { name: "invernadero_id", label: "Invernadero", type: "fk", required: true },
];

const FK_MAP = { invernadero_id: "invernadero" };

const FK_ENTITIES = Object.values(FK_RELATIONS.Zona);

export default function ZonaList() {
  return <CrudList entity="Zonas" columns={COLUMNS} api={API} formFields={FIELDS} fkMap={FK_MAP} fkEntities={FK_ENTITIES} />;
}
