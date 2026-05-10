// src/pages/Zona/ZonaForm.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getZonaById, createZona, updateZona } from "../../api/ZonaApi";

export default function ZonaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre: "",
    capacidad: "",
    invernadero_id: ""
  });

  useEffect(() => {
    if (isEdit) {
      getZonaById(id).then(res => setForm(res.data));
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
        await updateZona(id, form);
      } else {
        await createZona(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Editar" : "Nuevo"} Zona</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <label>nombre
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>capacidad
          <input
            type="text"
            name="capacidad"
            value={form.capacidad}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>invernadero_id
          <input
            type="text"
            name="invernadero_id"
            value={form.invernadero_id}
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
