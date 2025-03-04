// src/pages/HandsontableGrid.tsx
import { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { HotTableClass } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { RowData, measureRenderTime } from "../utils/dataGenerator";

// Register all Handsontable modules
registerAllModules();

interface Props {
  data: RowData[];
}

const HandsontableGrid = ({ data }: Props) => {
  const hotRef = useRef<HotTableClass>(null);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Flatten the data for Handsontable
  const flattenedData = data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    position: row.position,
    location: row.location,
    startDate: row.startDate,
    salary: row.salary,
    performance: row.performance,
    status: row.status,
    "unit.qty": row.unit.qty,
    "unit.rate": row.unit.rate,
    "unit.totalSum": row.unit.totalSum,
    "product.id": row.product.id,
    "product.category": row.product.category,
    "product.subcategory": row.product.subcategory,
    "product.price": row.product.price,
    "order.date": row.order.date,
    "order.quantity": row.order.quantity,
    "order.discount": row.order.discount,
    "order.total": row.order.total,
    "vendor.name": row.vendor.name,
    "vendor.rating": row.vendor.rating,
    "vendor.lastDelivery": row.vendor.lastDelivery,
    "metrics.sales": row.metrics.sales,
    "metrics.growth": row.metrics.growth,
    "metrics.target": row.metrics.target,
    "metrics.achievement": row.metrics.achievement,
  }));

  // Define nested headers for column groups
  const nestedHeaders = [
    [
      "ID",
      "Name",
      "Email",
      "Department",
      "Position",
      "Location",
      "Start Date",
      "Salary",
      "Performance",
      "Status",
      { label: "Unit", colspan: 3 },
      { label: "Product", colspan: 4 },
      { label: "Order", colspan: 4 },
      { label: "Vendor", colspan: 3 },
      { label: "Metrics", colspan: 4 },
    ],
    [
      "ID",
      "Name",
      "Email",
      "Department",
      "Position",
      "Location",
      "Start Date",
      "Salary",
      "Performance",
      "Status",
      "Qty",
      "Rate",
      "Total Sum",
      "Product ID",
      "Category",
      "Subcategory",
      "Price",
      "Date",
      "Quantity",
      "Discount %",
      "Total",
      "Vendor",
      "Rating",
      "Last Delivery",
      "Sales",
      "Growth %",
      "Target",
      "Achievement %",
    ],
  ];

  // Define columns for Handsontable
  const columns = [
    { data: "id", type: "numeric", width: 80 },
    { data: "name", type: "text", width: 180 },
    { data: "email", type: "text", width: 220 },
    { data: "department", type: "text", width: 150 },
    { data: "position", type: "text", width: 150 },
    { data: "location", type: "text", width: 150 },
    { data: "startDate", type: "date", dateFormat: "YYYY-MM-DD", width: 120 },
    {
      data: "salary",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 120,
    },
    {
      data: "performance",
      type: "numeric",
      numericFormat: { pattern: "0.0%" },
      width: 120,
    },
    { data: "status", type: "text", width: 120 },
    // Unit group
    { data: "unit.qty", type: "numeric", width: 100 },
    {
      data: "unit.rate",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 100,
    },
    {
      data: "unit.totalSum",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 120,
    },
    // Product group
    { data: "product.id", type: "text", width: 120 },
    { data: "product.category", type: "text", width: 130 },
    { data: "product.subcategory", type: "text", width: 140 },
    {
      data: "product.price",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 100,
    },
    // Order group
    { data: "order.date", type: "date", dateFormat: "YYYY-MM-DD", width: 110 },
    { data: "order.quantity", type: "numeric", width: 100 },
    {
      data: "order.discount",
      type: "numeric",
      numericFormat: { pattern: "0.0%" },
      width: 110,
    },
    {
      data: "order.total",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 100,
    },
    // Vendor group
    { data: "vendor.name", type: "text", width: 150 },
    {
      data: "vendor.rating",
      type: "numeric",
      numericFormat: { pattern: "0.0" },
      width: 100,
    },
    {
      data: "vendor.lastDelivery",
      type: "date",
      dateFormat: "YYYY-MM-DD",
      width: 130,
    },
    // Metrics group
    {
      data: "metrics.sales",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 120,
    },
    {
      data: "metrics.growth",
      type: "numeric",
      numericFormat: { pattern: "0.0%" },
      width: 100,
    },
    {
      data: "metrics.target",
      type: "numeric",
      numericFormat: { pattern: "$0,0.00" },
      width: 120,
    },
    {
      data: "metrics.achievement",
      type: "numeric",
      numericFormat: { pattern: "0.0%" },
      width: 140,
    },
  ];

  //   // Setting up collapse/expand functionality for column groups
  //   const collapseExpandConfig = {
  //     // This would require custom implementation with the Handsontable API
  //     // as native support for collapsible column groups is limited
  //   };

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

  return (
    <div>
      <h2>Handsontable Implementation</h2>
      {renderTime && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Render Time:</strong> {renderTime.toFixed(2)}ms
        </div>
      )}

      <div style={{ height: "70vh", width: "95vw", overflow: "hidden" }}>
        <HotTable
          ref={hotRef}
          data={flattenedData}
          colHeaders={true}
          rowHeaders={true}
          width="100%"
          height="100%"
          licenseKey="non-commercial-and-evaluation"
          columns={columns}
          nestedHeaders={nestedHeaders}
          viewportRowRenderingOffset={20}
          viewportColumnRenderingOffset={10}
          renderAllRows={false}
          autoColumnSize={false}
          fixedRowsTop={0}
          fixedColumnsLeft={1}
          manualColumnResize={true}
          manualRowResize={true}
          className="htCenter"
          stretchH="all"
          outsideClickDeselects={true}
          dropdownMenu={true}
          filters={true}
          columnSorting={true}
          collapsibleColumns={[
            { row: -2, col: 11, collapsible: true }, // Add the button to the 4th-level header of the 1st column - counting from the first table row upwards.
            { row: -2, col: 12, collapsible: true }, // Add the button to the 3rd-level header of the 5th column - counting from the first table row upwards.
          ]}
          //   sortIndicator={true}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Features used for optimization:</h3>
        <ul>
          <li>
            Viewport row and column rendering with offset for smoother scrolling
          </li>
          <li>Disabled auto column sizing for better performance</li>
          <li>Nested headers for grouped columns</li>
          <li>Limited fixed rows/columns to improve performance</li>
          <li>
            Note: Handsontable has limited native support for collapsible column
            groups
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HandsontableGrid;
