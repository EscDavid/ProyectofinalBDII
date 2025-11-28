import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Columns, Plus, ShoppingCart, Edit, X } from "lucide-react";
import { productService } from "services/productService";

export default function ProductosDashboardContent({
  productos,
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
  reloadProductos, 
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState(null);

  const [showUpdtModal, setShowUpdtModal] = useState(false);
  const [showCreatModal, setShowCreatModal] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await productService.getProductTypes();
        setProductTypes(types); // [{ id: 1, nombre: "Electrónica" }, ...]
      } catch (error) {
        console.error("Error al cargar tipos:", error);
      }
    };

    loadTypes();
  }, []);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nombre: true,
    tipo: true,
    precio: true,
    stock: true,
    creation: true,
  });

  const [createForm, setCreateForm] = useState({
    producto: "",
    stock: 1,
    total: 0,

  });

  const [updateForm, setUpdateForm] = useState({
    id_venta: "",
    producto: "",
    stock: 1,
    total: 0,
    fecha: "",
  });

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const columnMenuRef = useRef(null);

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

  const handleCreateSubmit = async () => {
    try {
      await productService.create({
        nombre: createForm.producto,
        tipo: createForm.id_tipo,
        stock: createForm.cantidad,
        precio: createForm.total,
        creation: createForm.fecha,

      });

      setShowCreatModal(false);
      setCreateForm({ producto: "", cantidad: 1, total: 0, fecha: "", usuario: "" });
      reloadProductos?.();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };


  const handleRowDoubleClick = async (productoId) => {
    try {
      const producto = await productService.getById(productoId);

      setUpdateForm({
        id_producto: producto.id,
        producto: producto.nombre,
        stock: producto.stock,
        total: producto.precio,
        fecha: producto.creation,
        tipo: producto.tipo,

      });

      setSelectedProductoId(productoId);
      setShowUpdtModal(true);
    } catch (error) {
      console.error("Error al obtener producto:", error);
    }
  };


  const handleUpdateSubmit = async () => {
    try {
      await productService.update(updateForm.id, {
        nombre: updateForm.nombre,
        id_tipo: updateForm.tipo,
        stock: updateForm.cantidad,
        precio: updateForm.total,
      });
      console.log (id_tipo, nombre, stock);

      setShowUpdtModal(false);
      reloadProductos?.();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      
    }
  };


  const handleDelete = async (id) => {
    if (!confirm("¿Desea eliminar este producto?")) return;

    try {
      await productService.delete(id);
      setSelectedRows((prev) => prev.filter((r) => r !== id));
      reloadProductos?.();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
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
        <h2 className="text-xs font-semibold text-gray-800">Productos</h2>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-lg shadow-sm relative z-20">
        {/* Encabezado */}
        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Productos</h3>

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
                    { key: "nombre", label: "Nombre" },
                    { key: "tipo", label: "Tipo" },
                    { key: "precio", label: "Precio" },
                    { key: "stock", label: "Stock" },
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
                    selectedRows.length === productos.length &&
                    productos.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>

              {visibleColumns.id && <SortableHeader label="ID" sortKey="id" />}
              {visibleColumns.nombre && (
                <SortableHeader label="Nombre" sortKey="nombre" />
              )}
              {visibleColumns.tipo && (
                <SortableHeader label="Tipo" sortKey="tipo" />
              )}
              {visibleColumns.precio && (
                <SortableHeader label="Precio" sortKey="precio" />
              )}
              {visibleColumns.stock && (
                <SortableHeader label="Stock" sortKey="stock" />
              )}
              {visibleColumns.creation && (
                <SortableHeader label="Creación" sortKey="creation" />
              )}
            </tr>
          </thead>

          <tbody>
            {productos.length ? (
              productos.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${selectedRows.includes(p.id) ? "bg-indigo-50" : ""
                    }`}
                  onDoubleClick={() => handleRowDoubleClick(p.id)}

                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.id)}
                      onChange={() => handleRowSelect(p.id)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>

                  {visibleColumns.id && <td className="px-3 py-2">{p.id}</td>}
                  {visibleColumns.nombre && (
                    <td className="px-3 py-2">{p.nombre}</td>
                  )}
                  {visibleColumns.tipo && (
                    <td className="px-3 py-2">{p.tipo}</td>
                  )}
                  {visibleColumns.precio && (
                    <td className="px-3 py-2">${p.precio}</td>
                  )}
                  {visibleColumns.stock && (
                    <td className="px-3 py-2">{p.stock}</td>
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

      {showCreatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="bg-purple-600 p-4 rounded-t-xl text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart /> Nuevo Producto
              </h2>
              <button onClick={() => setShowCreatModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* CAMPOS */}
              <input
                type="text"
                value={createForm.producto}
                onChange={(e) => setCreateForm({ ...createForm, producto: e.target.value })}
                placeholder="Nombre del producto"
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={createForm.cantidad}
                onChange={(e) => setCreateForm({ ...createForm, cantidad: e.target.value })}
                placeholder="Stock"
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={createForm.total}
                onChange={(e) => setCreateForm({ ...createForm, total: e.target.value })}
                placeholder="Precio"
                className="w-full border p-2 rounded"
              />

              <select
                className="w-full border p-2 rounded"
                value={createForm.tipo}
                onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
              >
                <option value="">Seleccione tipo...</option>
                {productTypes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.nombre}
                  </option>
                ))}
              </select>


              <button
                onClick={handleCreateSubmit}
                className="w-full bg-purple-600 text-white p-3 rounded mt-4"
              >
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------ */}
      {/* MODAL - ACTUALIZAR */}
      {/* ------------------------ */}
      {showUpdtModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="bg-blue-600 p-4 rounded-t-xl text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit /> Actualizar Producto #{updateForm.id_venta}
              </h2>
              <button onClick={() => setShowUpdtModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="text"
                value={updateForm.producto}
                onChange={(e) => setUpdateForm({ ...updateForm, producto: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={updateForm.cantidad}
                onChange={(e) => setUpdateForm({ ...updateForm, cantidad: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                value={updateForm.total}
                onChange={(e) => setUpdateForm({ ...updateForm, total: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <select
                className="w-full border p-2 rounded"
                value={updateForm.tipo}
                onChange={(e) => setUpdateForm({ ...updateForm, tipo: e.target.value })}
              >
                {productTypes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={updateForm.fecha}
                readOnly
                className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
              />


              <button
                onClick={handleUpdateSubmit}
                className="w-full bg-blue-600 text-white p-3 rounded"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

