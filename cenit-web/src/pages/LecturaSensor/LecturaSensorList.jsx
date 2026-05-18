import CrudList from "../../components/CrudList";
import { getAllLecturaSensors, getLecturaSensorById, createLecturaSensor, updateLecturaSensor, deleteLecturaSensor } from "../../api/LecturaSensorApi";
import { FK_RELATIONS } from "../../api/entityRegistry";

const COLUMNS = [
  { key: "zona_id", header: "Zona", type: "fk" },
  { key: "humedad", header: "Humedad %", type: "number" },
  { key: "temperatura", header: "Temp °C", type: "number" },
  { key: "fechaHora", header: "Fecha/Hora", type: "datetime" },
  { key: "activo", header: "Activo", type: "bool" },
];

const API = { getAll: getAllLecturaSensors, getById: getLecturaSensorById, create: createLecturaSensor, update: updateLecturaSensor, delete: deleteLecturaSensor };

const FIELDS = [
  { name: "zona_id", label: "Zona", type: "fk", required: true },
  { name: "humedad", label: "Humedad (%)", type: "number", required: true },
  { name: "temperatura", label: "Temperatura (°C)", type: "number", required: true },
  { name: "fechaHora", label: "Fecha/Hora", type: "datetime", required: true },
];

const FK_MAP = { zona_id: "zona" };
const FK_ENTITIES = Object.values(FK_RELATIONS.LecturaSensor || {});

export default function LecturaSensorList() {
  return <CrudList entity="Lecturas de Sensores" columns={COLUMNS} api={API} formFields={FIELDS} fkMap={FK_MAP} fkEntities={FK_ENTITIES.length ? FK_ENTITIES : ["zona"]} />;
}
