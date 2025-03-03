// src/pages/AgGrid.tsx
import { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RowData, measureRenderTime } from "../utils/dataGenerator";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Install with: npm install ag-grid-react ag-grid-community

interface Props {
  data: RowData[];
}

const AgGrid = ({ data }: Props) => {
  const gridRef = useRef<AgGridReact>(null);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  ModuleRegistry.registerModules([AllCommunityModule]);

  // Define column definitions for AG Grid
  const columnDefs = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "position", headerName: "Position", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 120 },
    {
      field: "salary",
      headerName: "Salary",
      width: 120,
      valueFormatter: (params: { value: number }) =>
        `$${params.value.toLocaleString()}`,
    },
    {
      field: "performance",
      headerName: "Performance",
      width: 120,
      valueFormatter: (params: { value: number }) => `${params.value}%`,
    },
    { field: "status", headerName: "Status", width: 120 },
    // Unit group (expandable)
    {
      headerName: "Unit",
      marryChildren: true,
      openByDefault: false,
      children: [
        { field: "unit.qty", headerName: "Qty", width: 100 },
        {
          field: "unit.rate",
          headerName: "Rate",
          width: 100,
          valueFormatter: (params: { value: number }) => `$${params.value}`,
        },
        {
          field: "unit.totalSum",
          headerName: "Total Sum",
          width: 120,
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
      ],
    },
    // Product group (expandable)
    {
      headerName: "Product",
      marryChildren: true,
      openByDefault: false,
      children: [
        { field: "product.id", headerName: "Product ID", width: 120 },
        { field: "product.category", headerName: "Category", width: 130 },
        { field: "product.subcategory", headerName: "Subcategory", width: 140 },
        {
          field: "product.price",
          headerName: "Price",
          width: 100,
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
      ],
    },
    // Order group (expandable)
    {
      headerName: "Order",
      marryChildren: true,
      openByDefault: false,
      children: [
        { field: "order.date", headerName: "Date", width: 110 },
        { field: "order.quantity", headerName: "Quantity", width: 100 },
        {
          field: "order.discount",
          headerName: "Discount %",
          width: 110,
          valueFormatter: (params: { value: number }) => `${params.value}%`,
        },
        {
          field: "order.total",
          headerName: "Total",
          width: 100,
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
      ],
    },
    // Vendor group (expandable)
    {
      headerName: "Vendor",
      marryChildren: true,
      openByDefault: false,
      children: [
        { field: "vendor.name", headerName: "Vendor", width: 150 },
        { field: "vendor.rating", headerName: "Rating", width: 100 },
        {
          field: "vendor.lastDelivery",
          headerName: "Last Delivery",
          width: 130,
        },
      ],
    },
    // Metrics group (expandable)
    {
      headerName: "Metrics",
      marryChildren: true,
      openByDefault: false,
      children: [
        {
          field: "metrics.sales",
          headerName: "Sales",
          width: 120,
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
        {
          field: "metrics.growth",
          headerName: "Growth %",
          width: 100,
          valueFormatter: (params: { value: number }) => `${params.value}%`,
        },
        {
          field: "metrics.target",
          headerName: "Target",
          width: 120,
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
        {
          field: "metrics.achievement",
          headerName: "Achievement %",
          width: 140,
          valueFormatter: (params: { value: number }) => `${params.value}%`,
        },
      ],
    },
  ];

  // Default column definition
  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  // Add master detail configuration
  const detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { field: "product.id", headerName: "Product ID" },
        { field: "product.category", headerName: "Category" },
        { field: "product.subcategory", headerName: "Subcategory" },
        {
          field: "product.price",
          headerName: "Price",
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
        { field: "order.date", headerName: "Order Date" },
        {
          field: "order.total",
          headerName: "Order Total",
          valueFormatter: (params: { value: number }) =>
            `$${params.value.toLocaleString()}`,
        },
      ],
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: (params: {
      successCallback: (data: RowData[]) => void;
      data: RowData;
    }) => {
      params.successCallback([params.data]);
    },
  };

  useEffect(() => {
    if (data.length > 0) {
      const endMeasure = measureRenderTime();

      // Small delay to ensure the grid has rendered
      const timer = setTimeout(() => {
        setRenderTime(endMeasure());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [data]);

  console.log({ data });

  return (
    <div>
      <h2>AG Grid Implementation</h2>
      {renderTime && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Render Time:</strong> {renderTime.toFixed(2)}ms
        </div>
      )}

      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "95vw" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={40}
          headerHeight={40}
          rowBuffer={10}
          rowModelType="clientSide"
          cacheBlockSize={100}
          animateRows={false}
          suppressColumnVirtualisation={false}
          enableCellTextSelection={true}
          pagination={false}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Features used for optimization:</h3>
        <ul>
          <li>Row virtualization with buffer zones</li>
          <li>Column virtualization</li>
          <li>Client-side row model optimized for large datasets</li>
          <li>Disabled row animations to improve performance</li>
          <li>Column groups with expand/collapse functionality</li>
          <li>Master-detail view for expandable rows</li>
        </ul>
      </div>
    </div>
  );
};

export default AgGrid;
