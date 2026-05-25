import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./hooks/useI18n";
import { ToastProvider } from "./components/Toast";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminReports from "./pages/Dashboard/AdminReports";
import ERDViewer from "./pages/ERD/ERDViewer";
import InvernaderoList from "./pages/Invernadero/InvernaderoList";
import ZonaList from "./pages/Zona/ZonaList";
import CultivoList from "./pages/Cultivo/CultivoList";
import InsumoList from "./pages/Insumo/InsumoList";
import RegistroActividadList from "./pages/RegistroActividad/RegistroActividadList";
import LecturaSensorList from "./pages/LecturaSensor/LecturaSensorList";
import UsuarioList from "./pages/Usuario/UsuarioList";
import Parametrizacion from "./pages/Parametro/Parametrizacion";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"/></div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <I18nProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/change-password" element={<PublicRoute><ChangePassword /></PublicRoute>} />

              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/erd" element={<ERDViewer />} />
                <Route path="/admin-reports" element={<AdminReports />} />
                <Route path="/invernaderos/*" element={<InvernaderoList />} />
                <Route path="/zonas/*" element={<ZonaList />} />
                <Route path="/cultivos/*" element={<CultivoList />} />
                <Route path="/insumos/*" element={<InsumoList />} />
                <Route path="/registros/*" element={<RegistroActividadList />} />
                <Route path="/sensores/*" element={<LecturaSensorList />} />
                <Route path="/usuarios/*" element={<UsuarioList />} />
                <Route path="/parametros/*" element={<Parametrizacion />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </I18nProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
