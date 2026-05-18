import CrudList from "../../components/CrudList";
import { getAllInvernaderos, getInvernaderoById, createInvernadero, updateInvernadero, deleteInvernadero } from "../../api/InvernaderoApi";

const COLUMNS = [
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "ubicacion", header: "Ubicación", type: "text" },
  { key: "descripcion", header: "Descripción", type: "text" },
];

const API = { getAll: getAllInvernaderos, getById: getInvernaderoById, create: createInvernadero, update: updateInvernadero, delete: deleteInvernadero };

const FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", required: true },
  { name: "ubicacion", label: "Ubicación", type: "text" },
  { name: "descripcion", label: "Descripción", type: "textarea" },
];

export default function InvernaderoList() {
  return <CrudList entity="Invernaderos" columns={COLUMNS} api={API} formFields={FIELDS} />;
}
