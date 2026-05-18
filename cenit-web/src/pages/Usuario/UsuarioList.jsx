import CrudList from "../../components/CrudList";
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from "../../api/UsuarioApi";

const ROL_COLORS = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  OPERARIO: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
};

const COLUMNS = [
  { key: "nombre", header: "Nombre", type: "text" },
  { key: "email", header: "Email", type: "text" },
  { key: "rol", header: "Rol", type: "enum", enumColors: ROL_COLORS },
  { key: "activo", header: "Activo", type: "bool" },
];

const API = { getAll: getAllUsuarios, getById: getUsuarioById, create: createUsuario, update: updateUsuario, delete: deleteUsuario, adminOnly: true };

const ROL_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "OPERARIO", label: "Operario" },
];

const FIELDS = [
  { name: "nombre", label: "Nombre completo", type: "text", required: true },
  { name: "email", label: "Correo electrónico", type: "text", required: true },
  { name: "rol", label: "Rol", type: "enum", options: ROL_OPTIONS, required: true },
];

export default function UsuarioList() {
  return <CrudList entity="Usuarios" columns={COLUMNS} api={API} formFields={FIELDS} />;
}
