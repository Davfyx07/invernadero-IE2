// src/pages/Insumo/InsumoList.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllInsumos, deleteInsumo } from "../../api/InsumoApi";

export default function InsumoList() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await getAllInsumos();
      // Soporta respuesta paginada o lista simple
      setItems(res.data?.content ?? res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    await deleteInsumo(id);
    load();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Insumo</h2>
        <button onClick={() => navigate("nuevo")} style={btnStyle}>+ Nuevo</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead style={{ background: "#2e7d32", color: "#fff" }}>
          <tr>
          <th>nombre</th>
          <th>tipo</th>
          <th>unidadMedida</th>
          <th>stockActual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
          <td>{item.nombre}</td>
          <td>{item.tipo}</td>
          <td>{item.unidadMedida}</td>
          <td>{item.stockActual}</td>
              <td>
                <button onClick={() => navigate(`${item.id}/editar`)} style={btnSmall}>Editar</button>
                <button onClick={() => handleDelete(item.id)} style={{ ...btnSmall, background: "#c62828" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle = { background: "#2e7d32", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };
const btnSmall = { ...btnStyle, padding: "4px 10px", marginRight: "4px", fontSize: "12px" };
