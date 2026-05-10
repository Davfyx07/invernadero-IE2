// src/pages/Cultivo/CultivoForm.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCultivoById, createCultivo, updateCultivo } from "../../api/CultivoApi";

export default function CultivoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    especie: "",
    variedad: "",
    estado: "",
    fechaSiembra: "",
    fechaCosecha: "",
    zona_id: "",
    usuario_id: ""
  });

  useEffect(() => {
    if (isEdit) {
      getCultivoById(id).then(res => setForm(res.data));
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
        await updateCultivo(id, form);
      } else {
        await createCultivo(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Editar" : "Nuevo"} Cultivo</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <label>especie
          <input
            type="text"
            name="especie"
            value={form.especie}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>variedad
          <input
            type="text"
            name="variedad"
            value={form.variedad}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>estado
          <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="COSECHADO">COSECHADO</option>
              <option value="PERDIDO">PERDIDO</option>
          </select>
        </label>

        <label>fechaSiembra
          <input
            type="date"
            name="fechaSiembra"
            value={form.fechaSiembra}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>fechaCosecha
          <input
            type="date"
            name="fechaCosecha"
            value={form.fechaCosecha}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>zona_id
          <input
            type="text"
            name="zona_id"
            value={form.zona_id}
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
