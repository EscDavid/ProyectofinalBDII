import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "layout/MainLayout";
import DashboardContent from "components/DashboardProducts";

import { productService
} from "services/productService";

export default function ProductosDashboard() {
  const [productos, setProductos] = useState([]);

  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  //const [isLoadingStats, setIsLoadingStats] = useState(true);


  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const data = await productService.getDashboard({ 
      sortField, 
      sortOrder, 
      page, 
      perPage 
    });

    const productos = data.productos;

    const mappedProductos = productos.map((p) => ({
      id: p.id_producto,
      nombre: p.nombre,
      tipo: p.tipo,
      precio: p.precio,
      stock: p.stock,
      creation: new Date(p.created_at).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    setProductos(mappedProductos);
    setTotalPages(data.totalPages || 1);
    setTotalRecords(data.totalRecords || data.productos.length || 0);

    setIsLoading(false);
  }, [sortField, sortOrder, page, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    
      <DashboardContent
        productos={productos}               
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        totalRecords={totalRecords}
        isLoading={isLoading}
        onPerPageChange={fetchData}
      />
    
  );
}
