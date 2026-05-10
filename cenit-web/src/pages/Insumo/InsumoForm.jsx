// src/pages/Insumo/InsumoForm.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInsumoById, createInsumo, updateInsumo } from "../../api/InsumoApi";

export default function InsumoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    unidadMedida: "",
    stockActual: ""
  });

  useEffect(() => {
    if (isEdit) {
      getInsumoById(id).then(res => setForm(res.data));
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
        await updateInsumo(id, form);
      } else {
        await createInsumo(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Editar" : "Nuevo"} Insumo</h2>
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

        <label>tipo
          <select name="tipo" value={form.tipo} onChange={handleChange} style={inputStyle}>
              <option value="FERTILIZANTE">FERTILIZANTE</option>
              <option value="PESTICIDA">PESTICIDA</option>
              <option value="AGUA">AGUA</option>
              <option value="OTRO">OTRO</option>
          </select>
        </label>

        <label>unidadMedida
          <input
            type="text"
            name="unidadMedida"
            value={form.unidadMedida}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>stockActual
          <input
            type="text"
            name="stockActual"
            value={form.stockActual}
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
