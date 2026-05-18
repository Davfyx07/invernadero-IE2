import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cenit-50 dark:bg-cenit-900">
        <div className="flex items-center gap-3 text-cenit-400">
          <div className="w-5 h-5 border-2 border-cenit-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-cenit-50 dark:bg-cenit-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
