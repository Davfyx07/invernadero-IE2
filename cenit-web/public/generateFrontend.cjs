// generateFrontend.js
// Uso: node generateFrontend.js
// Lee frontend.json + modelo.json y genera el scaffold React en src/

const fs   = require("fs");
const path = require("path");

// ─── Leer JSONs ───────────────────────────────────────────────────────────────
const frontend = JSON.parse(fs.readFileSync("frontend.json", "utf-8"));
const modelo   = JSON.parse(fs.readFileSync("modelo.json",  "utf-8"));

const API_URL  = frontend.apiBaseUrl;
const PRIMARY  = frontend.theme.primary;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath)) {
    console.log(`  [skip]  ${filePath} (ya existe)`);
    return;
  }
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  [ok]    ${filePath}`);
}

function findEntity(name) {
  return modelo.entities.find(e => e.name === name);
}

function toRoute(entity) {
  return entity.toLowerCase() + "s";
}

// ─── 1. axios config ─────────────────────────────────────────────────────────
function generateAxiosConfig() {
  const content = `// src/api/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "${API_URL}",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: agrega el token OAuth2 si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default api;
`;
  write("src/api/axiosConfig.js", content);
}

// ─── 2. API service por entidad ───────────────────────────────────────────────
function generateApiService(page) {
  const name   = page.entity;
  const route  = toRoute(name);
  const content = `// src/api/${name}Api.js
// Generado desde frontend.json — no editar manualmente
import api from "./axiosConfig";

const BASE = "/${route}";

export const getAll${name}s    = (page = 0, size = 10) => api.get(BASE, { params: { page, size } });
export const get${name}ById    = (id)   => api.get(\`\${BASE}/\${id}\`);
export const create${name}     = (data) => api.post(BASE, data);
export const update${name}     = (id, data) => api.put(\`\${BASE}/\${id}\`, data);
export const delete${name}     = (id)   => api.delete(\`\${BASE}/\${id}\`);
`;
  write(`src/api/${name}Api.js`, content);
}

// ─── 3. Página List ───────────────────────────────────────────────────────────
function generateListPage(page) {
  const name    = page.entity;
  const columns = page.listColumns;
  const hasForm = page.views.includes("form");

  const headers = columns.map(c => `          <th>${c}</th>`).join("\n");
  const cells   = columns.map(c => `          <td>{item.${c}}</td>`).join("\n");

  const content = `// src/pages/${name}/${name}List.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll${name}s, delete${name} } from "../../api/${name}Api";

export default function ${name}List() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await getAll${name}s();
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
    await delete${name}(id);
    load();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>${name}</h2>
        ${hasForm ? `<button onClick={() => navigate("nuevo")} style={btnStyle}>+ Nuevo</button>` : ""}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead style={{ background: "${PRIMARY}", color: "#fff" }}>
          <tr>
${headers}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
${cells}
              <td>
                ${hasForm ? `<button onClick={() => navigate(\`\${item.id}/editar\`)} style={btnSmall}>Editar</button>` : ""}
                <button onClick={() => handleDelete(item.id)} style={{ ...btnSmall, background: "#c62828" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle = { background: "${PRIMARY}", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };
const btnSmall = { ...btnStyle, padding: "4px 10px", marginRight: "4px", fontSize: "12px" };
`;
  write(`src/pages/${name}/${name}List.jsx`, content);
}

// ─── 4. Página Form ───────────────────────────────────────────────────────────
function generateFormPage(page) {
  const name       = page.entity;
  const formFields = page.formFields;
  const entity     = findEntity(name);

  if (!formFields || formFields.length === 0) return;

  // Estado inicial
  const initialState = formFields.map(f => `    ${f}: ""`).join(",\n");

  // Inputs
  const inputs = formFields.map(f => {
    const fieldDef = entity?.fields.find(fd => fd.name === f);
    const type = fieldDef?.type;
    let inputType = "text";
    if (type === "Date")     inputType = "date";
    if (type === "DateTime") inputType = "datetime-local";
    if (type === "Boolean")  inputType = "checkbox";

    if (type === "Enum") {
      const opts = fieldDef.values.map(v => `              <option value="${v}">${v}</option>`).join("\n");
      return `
        <label>${f}
          <select name="${f}" value={form.${f}} onChange={handleChange} style={inputStyle}>
${opts}
          </select>
        </label>`;
    }

    return `
        <label>${f}
          <input
            type="${inputType}"
            name="${f}"
            value={form.${f}}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>`;
  }).join("\n");

  const content = `// src/pages/${name}/${name}Form.jsx
// Generado desde frontend.json — no editar manualmente
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get${name}ById, create${name}, update${name} } from "../../api/${name}Api";

export default function ${name}Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
${initialState}
  });

  useEffect(() => {
    if (isEdit) {
      get${name}ById(id).then(res => setForm(res.data));
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
        await update${name}(id, form);
      } else {
        await create${name}(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <h2>{isEdit ? "Editar" : "Nuevo"} ${name}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
${inputs}
        <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
          <button type="submit" style={btnStyle}>Guardar</button>
          <button type="button" onClick={() => navigate(-1)} style={{ ...btnStyle, background: "#757575" }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = { display: "block", width: "100%", padding: "6px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" };
const btnStyle   = { background: "${PRIMARY}", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" };
`;
  write(`src/pages/${name}/${name}Form.jsx`, content);
}

// ─── 5. App.jsx con rutas ─────────────────────────────────────────────────────
function generateAppJsx() {
  const imports = frontend.pages.map(p => {
    const lines = [`import ${p.entity}List from "./pages/${p.entity}/${p.entity}List";`];
    if (p.views.includes("form")) {
      lines.push(`import ${p.entity}Form from "./pages/${p.entity}/${p.entity}Form";`);
    }
    return lines.join("\n");
  }).join("\n");

  const routes = frontend.pages.map(p => {
    const route = p.route;
    const lines = [
      `        <Route path="${route}" element={<${p.entity}List />} />`,
    ];
    if (p.views.includes("form")) {
      lines.push(`        <Route path="${route}/nuevo" element={<${p.entity}Form />} />`);
      lines.push(`        <Route path="${route}/:id/editar" element={<${p.entity}Form />} />`);
    }
    return lines.join("\n");
  }).join("\n");

  const navLinks = frontend.pages.map(p =>
    `        <a href="${p.route}" style={linkStyle}>${p.entity}</a>`
  ).join("\n");

  const content = `// src/App.jsx — generado desde frontend.json
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
${imports}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <span style={{ fontWeight: "bold", color: "#fff", marginRight: "1rem" }}>🌿 Cenit</span>
${navLinks}
      </nav>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Navigate to="${frontend.pages[0].route}" />} />
${routes}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

const navStyle  = { background: "${PRIMARY}", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" };
const linkStyle = { color: "#fff", textDecoration: "none", fontSize: "14px" };
`;
  write("src/App.jsx", content);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log("\n========================================");
console.log("  generateFrontend.js");
console.log("========================================\n");

generateAxiosConfig();

for (const page of frontend.pages) {
  console.log(`\n  → ${page.entity}`);
  generateApiService(page);
  generateListPage(page);
  if (page.views.includes("form")) generateFormPage(page);
}

generateAppJsx();

console.log("\n========================================");
console.log(`  ✓ ${frontend.pages.length} entidades generadas`);
console.log("  Corre: npm run dev");
console.log("========================================\n");