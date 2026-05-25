import { useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/axiosConfig";
import { useAuth } from "../../hooks/useAuth";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useToast } from "../../components/Toast";

const AdminReports = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [commitsOutput, setCommitsOutput] = useState("");
  const [loadingCommits, setLoadingCommits] = useState(false);
  
  const [commitMessage, setCommitMessage] = useState("");
  const [taigaOutput, setTaigaOutput] = useState("");
  const [loadingTaiga, setLoadingTaiga] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleValidateTaiga = async () => {
    if (!commitMessage.trim()) return;
    
    setLoadingTaiga(true);
    setTaigaOutput("");
    try {
      const res = await api.post("/admin/system/taiga-validate", { commitMessage });
      setTaigaOutput(res.data.output);
      toast.show(res.data.success ? "Comentario Válido en Taiga" : "Fallo reportado a Taiga", res.data.success ? "success" : "error");
    } catch (error) {
      setTaigaOutput("Error ejecutando validación: " + (error.response?.data?.error || error.message));
      toast.show("Error al comunicar con backend", "error");
    } finally {
      setLoadingTaiga(false);
      setShowConfirm(false);
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

        {/* Sección: Validación Taiga */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4 border-b dark:border-slate-700 text-gray-800 dark:text-gray-100 pb-2">2. Validación de Políticas de Git & Taiga</h2>
          <p className="text-gray-600 dark:text-slate-300 mb-4 text-sm">
            Evalúa un mensaje de commit usando las reglas del repositorio. Si el formato es incorrecto, abrirá una Issue automáticamente en tu proyecto de Taiga.
          </p>
          
          <div className="flex gap-4">
            <input 
              type="text" 
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder='Ej: [FIX] Corrección de estilos'
              className="flex-1 p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-md focus:border-primary-500 focus:ring-primary-500"
            />
            <button 
              onClick={() => setShowConfirm(true)}
              disabled={loadingTaiga || !commitMessage.trim()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition font-medium shadow-sm"
            >
              Forzar Evaluación
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            * Para causar un fallo a propósito, intenta enviar un texto sin los corchetes o vacío (ej. "hola mundo").
          </div>

          {taigaOutput && (
            <div className={`mt-4 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap border ${taigaOutput.includes('✅') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'}`}>
              {taigaOutput}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Validar y Notificar a Taiga"
        message={`¿Estás seguro de evaluar el mensaje "${commitMessage}"? Si incumple las políticas, se mandará una advertencia a tu proyecto de Taiga.`}
        onConfirm={handleValidateTaiga}
        onCancel={() => setShowConfirm(false)}
        confirmText="Evaluar y Reportar"
        type="danger"
      />
    </>
  );
};

export default AdminReports;