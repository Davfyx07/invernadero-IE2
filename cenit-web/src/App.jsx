import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ERDViewer from "./pages/ERD/ERDViewer";

/* ─── Entidades CRUD (generadas) ─────────────────────────────────────────── */
import InvernaderoList from "./pages/Invernadero/InvernaderoList";
import InvernaderoForm from "./pages/Invernadero/InvernaderoForm";
import ZonaList from "./pages/Zona/ZonaList";
import ZonaForm from "./pages/Zona/ZonaForm";
import CultivoList from "./pages/Cultivo/CultivoList";
import CultivoForm from "./pages/Cultivo/CultivoForm";
import InsumoList from "./pages/Insumo/InsumoList";
import InsumoForm from "./pages/Insumo/InsumoForm";
import RegistroActividadList from "./pages/RegistroActividad/RegistroActividadList";
import RegistroActividadForm from "./pages/RegistroActividad/RegistroActividadForm";
import UsuarioList from "./pages/Usuario/UsuarioList";

/* ─── Layout protegido con Navbar ────────────────────────────────────────── */
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Verificando sesión…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

/* ─── Ruta login pública ─────────────────────────────────────────────────── */
function PublicLogin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Verificando sesión…</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<PublicLogin />} />

        {/* Rutas protegidas con Navbar */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/erd" element={<ERDViewer />} />

          <Route path="/invernaderos" element={<InvernaderoList />} />
          <Route path="/invernaderos/nuevo" element={<InvernaderoForm />} />
          <Route path="/invernaderos/:id/editar" element={<InvernaderoForm />} />

          <Route path="/zonas" element={<ZonaList />} />
          <Route path="/zonas/nuevo" element={<ZonaForm />} />
          <Route path="/zonas/:id/editar" element={<ZonaForm />} />

          <Route path="/cultivos" element={<CultivoList />} />
          <Route path="/cultivos/nuevo" element={<CultivoForm />} />
          <Route path="/cultivos/:id/editar" element={<CultivoForm />} />

          <Route path="/insumos" element={<InsumoList />} />
          <Route path="/insumos/nuevo" element={<InsumoForm />} />
          <Route path="/insumos/:id/editar" element={<InsumoForm />} />

          <Route path="/registros" element={<RegistroActividadList />} />
          <Route path="/registros/nuevo" element={<RegistroActividadForm />} />
          <Route path="/registros/:id/editar" element={<RegistroActividadForm />} />

          <Route path="/usuarios" element={<UsuarioList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
