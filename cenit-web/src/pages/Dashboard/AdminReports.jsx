import { useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/Toast";

const AdminReports = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [commitsOutput, setCommitsOutput] = useState("");
  const [loadingCommits, setLoadingCommits] = useState(false);

  const fetchCommits = async () => {
    setLoadingCommits(true);
    setCommitsOutput("");
    try {
      const res = await api.get("/admin/system/commits");
      setCommitsOutput(res.data.output);
    } catch (error) {
      setCommitsOutput("Error cargando los commits: " + (error.response?.data?.error || error.message));
    } finally {
      setLoadingCommits(false);
    }
  };

  if (!user || user.rol !== "ADMIN") {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">Acceso denegado. Solo administradores.</div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Auditoría del Sistema y CI/CD</h1>
        
        {/* Sección: Comparar Commits */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b dark:border-slate-700 text-gray-800 dark:text-gray-100 pb-2">1. Comparación de Commits</h2>
          <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm">
            Ejecuta el script de Python que revisa los cambios recientes en el código (agrupados por carpetas) y métricas de líneas añadidas/eliminadas.
          </p>
          <button 
            onClick={fetchCommits}
            disabled={loadingCommits}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loadingCommits ? "Consultando..." : "Ver Últimos Cambios (Commits)"}
          </button>
          
          {commitsOutput && (
            <div className="mt-4 bg-gray-900 dark:bg-black text-green-400 border border-transparent dark:border-slate-700 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {commitsOutput}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminReports;