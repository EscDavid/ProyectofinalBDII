import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "layout/MainLayout";
import DashboardContent from "components/DashboardVentas";

import { ventaService} from "services/ventaService";

export default function VentasDashboard() {
  const [ventas, setVentas] = useState([]);

  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(true);


  const fetchData = useCallback(async () => {
    setIsLoading(true);

    const data = await ventaService.getDashboard({ 
      sortField, 
      sortOrder, 
      page, 
      perPage 
    });

    const ventas = data.ventas;

    const mappedVentas = ventas.map((v) => ({
      id: v.id_venta,
      producto: v.nombre_producto,
      cantidad: v.categoria,
      total: v.precio,
      creation: new Date(v.fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    setVentas(mappedVentas);
    setTotalPages(data.totalPages || 1);
    setTotalRecords(data.totalRecords || data.ventas.length || 0);

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
        ventas={ventas}               
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
