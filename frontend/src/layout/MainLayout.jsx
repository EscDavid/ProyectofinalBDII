import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  BarChart3,
  Package,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Users,
  Ticket
} from "lucide-react";

import { useAuth } from "context/AuthContext";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-21">D</span>
              </div>
              <span className="font-bold text-l">ElecComer</span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-3 overflow-y-auto">

          <SidebarItem
            icon={<Users size={20} />}
            label="Administración"
            subtitle="USUARIOS"
            to="/user/dashboard"
            active={location.pathname.startsWith("/user")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Ventas"
            to="/ventas/dashboard"
            active={location.pathname.startsWith("/ventas")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<Package size={20} />}
            label="Inventario"
            to="/productos/dashboard"
            active={location.pathname.startsWith("/productos")}
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            icon={<LogOut size={20} />}
            label="Cerrar Sesión"
            onClick={handleLogout}
          />

        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 leading-tight">
              <div className="text-sm font-medium">
                {user?.nombre || "Usuario"}
              </div>
              <div className="text-xs text-gray-500">
                {user?.rol || "Rol"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header móvil */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={29} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="font-bold text-1xl">Elec Comercio</span>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto pt-2 pb-4 px-4 lg:pt-2 lg:pb-4 lg:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label, subtitle, to, active, onClick }) => {
  const content = (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors 
        ${active ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"}
      `}
      onClick={onClick}
    >
      <span className={active ? "text-white" : "text-gray-600"}>{icon}</span>

      <div className="leading-tight">
        <div className="text-sm font-medium">{label}</div>
        {subtitle && (
          <div className={`text-xs ${active ? "text-indigo-200" : "text-gray-500"}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};
