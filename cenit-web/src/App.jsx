import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import InvernaderoList from './pages/Invernadero/InvernaderoList.jsx'
import InvernaderoForm from './pages/Invernadero/InvernaderoForm.jsx'
import ZonaList from './pages/Zona/ZonaList.jsx'
import ZonaForm from './pages/Zona/ZonaForm.jsx'
import CultivoList from './pages/Cultivo/CultivoList.jsx'
import CultivoForm from './pages/Cultivo/CultivoForm.jsx'
import InsumoList from './pages/Insumo/InsumoList.jsx'
import InsumoForm from './pages/Insumo/InsumoForm.jsx'
import RegistroActividadList from './pages/RegistroActividad/RegistroActividadList.jsx'
import RegistroActividadForm from './pages/RegistroActividad/RegistroActividadForm.jsx'
import UsuarioList from './pages/Usuario/UsuarioList.jsx'
import ERDViewer from './pages/ERD/ERDViewer.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/invernaderos" replace />} />
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

        <Route path="*" element={<Navigate to="/invernaderos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
