import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from "components/ProtectedRoute";
import Login from "pages/Login";
import MainLayout from "layout/MainLayout";
import ProductosDashboard from "pages/productosDashboard";
import VentasDashboard from "pages/ventasDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProductosDashboard />} />
        <Route path="productos/dashboard" element={<ProductosDashboard />} />
        <Route path="ventas/dashboard" element={<VentasDashboard />} /> 
      </Route>
    </Routes>
  );
}

export default App;