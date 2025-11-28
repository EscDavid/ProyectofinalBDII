import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Columns, Plus } from "lucide-react";

export default function VentasDashboardContent({
    ventas,
    isLoading,
    sortField,
    sortOrder,
    handleSort,
    page,
    setPage,
    totalPages,
    perPage,
    setPerPage,
    totalRecords,
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedVentaId, setSelectedVentaId] = useState(null);
    const [showUpdtModal, setShowUpdtModal] = useState(false);  //Modal actualizar
    const [showCreatModal, setShowCreatModal] = useState(false);  //Modal para crear
    const [showValidtModal, setShowValidtModal] = useState(false); //Modal para valiadcion



    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        nombre: true,
        cantidad: true,
        total: true,
        creation: true,
    });

    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const columnMenuRef = useRef(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
                setShowColumnMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleColumn = (col) =>
        setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));

    const handleTableSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";

        setSortConfig({ key, direction });
        handleSort(key === "creation" ? "created_at" : key);
    };
    const handleRowDoubleClick = (ventaId) => {
        console.log("✅ ID recibido en handleRowDoubleClick:", ventaId);
        setSelectedVentaId(ventaId);
        setShowUpdtModal(true);
      };
    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedRows.length === productos.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(productos.map((p) => p.id));
        }
    };

    const SortableHeader = ({ label, sortKey }) => (
        <th
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleTableSort(sortKey)}
        >
            <div className="flex items-center justify-between w-full">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUp
                        size={16}
                        className={`-mb-1 ${sortConfig.key === sortKey && sortConfig.direction === "asc"
                                ? "text-indigo-600"
                                : "text-gray-400"
                            }`}
                    />
                    <ChevronDown
                        size={16}
                        className={`-mt-1 ${sortConfig.key === sortKey && sortConfig.direction === "desc"
                                ? "text-indigo-600"
                                : "text-gray-400"
                            }`}
                    />
                </div>
            </div>
        </th>
    );

    return (
        <div className="flex-1 overflow-auto p-4 text-sm relative">
            <div className="mb-4">
                <h2 className="text-xs font-semibold text-gray-800">Ventas</h2>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-lg shadow-sm relative z-20">
                {/* Encabezado */}
                <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Ventas</h3>

                    <div className="flex items-center gap-2">
                        {/* Crear producto */}
                        <button
                            onClick={() => setShowCreatModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Crear Producto</span>
                        </button>

                        {/* Menú de columnas */}
                        <div className="relative" ref={columnMenuRef}>
                            <button
                                onClick={() => setShowColumnMenu(!showColumnMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Columns size={16} />
                                <span>Columnas</span>
                            </button>

                            {showColumnMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-2">
                                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2">
                                        Mostrar columnas
                                    </div>

                                    {[
                                        { key: "id", label: "ID" },
                                        { key: "producto", label: "Producto" },
                                        { key: "cantidad", label: "Cantidad" },
                                        { key: "total", label: "Total" },
                                        { key: "creation", label: "Creación" },
                                    ].map((col) => (
                                        <label
                                            key={col.key}
                                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[col.key]}
                                                onChange={() => toggleColumn(col.key)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-3 py-2 text-left">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedRows.length === ventas.length &&
                                        ventas.length > 0
                                    }
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </th>

                            {visibleColumns.id && <SortableHeader label="ID" sortKey="id" />}
                            {visibleColumns.producto && (
                                <SortableHeader label="producto" sortKey="producto" />
                            )}
                            {visibleColumns.cantidad && (
                                <SortableHeader label="Cantidad" sortKey="cantidad" />
                            )}
                            {visibleColumns.total && (
                                <SortableHeader label="Total" sortKey="total" />
                            )}

                            {visibleColumns.creation && (
                                <SortableHeader label="Creación" sortKey="creation" />
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {ventas.length ? (
                            ventas.map((v) => (
                                <tr
                                    key={v.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50 ${selectedRows.includes(v.id) ? "bg-indigo-50" : ""

                                        }`}
                                    onDoubleClick={() => handleRowDoubleClick(v.id)}

                                >
                                    <td className="px-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(v.id)}
                                            onChange={() => handleRowSelect(v.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>

                                    {visibleColumns.id && <td className="px-3 py-2">{v.id}</td>}
                                    {visibleColumns.producto && (
                                        <td className="px-3 py-2">{v.producto}</td>
                                    )}
                                    {visibleColumns.cantidad && (
                                        <td className="px-3 py-2">{v.cantidad}</td>
                                    )}
                                    {visibleColumns.total && (
                                        <td className="px-3 py-2">${v.total}</td>
                                    )}

                                    {visibleColumns.creation && (
                                        <td className="px-3 py-2">{p.creation}</td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-4 text-xs text-gray-400"
                                >
                                    No hay productos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Paginación */}
                <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Mostrar:</label>
                        <select
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-600">
                        Mostrando {(page - 1) * perPage + 1} -{" "}
                        {Math.min(page * perPage, totalRecords)} de {totalRecords}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-2 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-2 py-1 rounded text-sm ${page === p
                                            ? "font-bold text-indigo-600"
                                            : "text-gray-600 hover:text-indigo-600"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="px-2 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear Producto */}
            {showCreateModal && (
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 flex items-center justify-center">
                    {/* Aquí pones tu modal CreateProductoModal */}
                    <div className="bg-white rounded-lg p-4 shadow-xl">
                        <h3 className="font-bold mb-2">Crear Producto</h3>

                        <p>Tu formulario aquí…</p>

                        <button
                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => setShowCreatModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
