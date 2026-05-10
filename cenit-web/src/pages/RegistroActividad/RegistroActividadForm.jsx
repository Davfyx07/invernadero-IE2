// src/pages/RegistroActividad/RegistroActividadForm.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRegistroActividadById, createRegistroActividad, updateRegistroActividad } from "../../api/RegistroActividadApi";

export default function RegistroActividadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    tipo: "",
    fecha: "",
    cantidad: "",
    notas: "",
    cultivo_id: "",
    insumo_id: "",
    usuario_id: ""
  });

  useEffect(() => {
    if (isEdit) {
      getRegistroActividadById(id).then(res => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateRegistroActividad(id, form);
      } else {
        await createRegistroActividad(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Editar" : "Nuevo"} RegistroActividad</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <label>tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} style={inputStyle}>
              <option value="RIEGO">RIEGO</option>
              <option value="FERTILIZACION">FERTILIZACION</option>
              <option value="FUMIGACION">FUMIGACION</option>
              <option value="INSPECCION">INSPECCION</option>
              <option value="OTRO">OTRO</option>
          </select>
        </label>

        <label>fecha
          <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>cantidad
          <input
            type="text"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>notas
          <input
            type="text"
            name="notas"
            value={form.notas}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>cultivo_id
          <input
            type="text"
            name="cultivo_id"
            value={form.cultivo_id}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>insumo_id
          <input
            type="text"
            name="insumo_id"
            value={form.insumo_id}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>usuario_id
          <input
            type="text"
            name="usuario_id"
            value={form.usuario_id}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
        <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
          <button type="submit" style={btnStyle}>Guardar</button>
          <button type="button" onClick={() => navigate(-1)} style={{ ...btnStyle, background: "#757575" }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", padding: "6px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" };
const btnStyle   = { background: "#2e7d32", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };
