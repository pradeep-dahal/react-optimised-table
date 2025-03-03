import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DataEditor,
  GridColumn,
  GridCellKind,
  Item,
  EditableGridCell,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { RowData, measureRenderTime } from "../utils/dataGenerator";

interface Props {
  data: RowData[];
}

const GlideDataGrid = ({ data }: Props) => {
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Define column groups
  const columns = useMemo<GridColumn[]>(
    () => [
      {
        title: "ID",
        id: "id",
        width: 80,
      },
      {
        title: "Name",
        id: "name",
        width: 180,
      },
      {
        title: "Email",
        id: "email",
        width: 220,
      },
      {
        title: "Department",
        id: "department",
        width: 150,
      },
      {
        title: "Position",
        id: "position",
        width: 150,
      },
      {
        title: "Location",
        id: "location",
        width: 150,
      },
      {
        title: "Start Date",
        id: "startDate",
        width: 120,
      },
      {
        title: "Salary",
        id: "salary",
        width: 120,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      {
        title: "Performance",
        id: "performance",
        width: 120,
        formatter: (v: number) => `${v}%`,
      },
      {
        title: "Status",
        id: "status",
        width: 120,
      },
      // Unit group (expandable)
      {
        title: "Unit",
        id: "unit",
        group: "Unit",
        width: 100,
      },
      {
        title: "Qty",
        id: "unit.qty",
        group: "Unit",
        width: 100,
      },
      {
        title: "Rate",
        id: "unit.rate",
        group: "Unit",
        width: 100,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      {
        title: "Total Sum",
        id: "unit.totalSum",
        group: "Unit",
        width: 120,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      // Product group (expandable)
      {
        title: "Product",
        id: "product",
        group: "Product",
        width: 100,
      },
      {
        title: "Product ID",
        id: "product.id",
        group: "Product",
        width: 120,
      },
      {
        title: "Category",
        id: "product.category",
        group: "Product",
        width: 130,
      },
      {
        title: "Subcategory",
        id: "product.subcategory",
        group: "Product",
        width: 140,
      },
      {
        title: "Price",
        id: "product.price",
        group: "Product",
        width: 100,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      // Order group (expandable)
      {
        title: "Order",
        id: "order",
        group: "Order",
        width: 100,
      },
      {
        title: "Date",
        id: "order.date",
        group: "Order",
        width: 110,
      },
      {
        title: "Quantity",
        id: "order.quantity",
        group: "Order",
        width: 100,
      },
      {
        title: "Discount %",
        id: "order.discount",
        group: "Order",
        width: 110,
        formatter: (v: number) => `${v}%`,
      },
      {
        title: "Total",
        id: "order.total",
        group: "Order",
        width: 100,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      // Vendor group (expandable)
      {
        title: "Vendor",
        id: "vendor",
        group: "Vendor",
        width: 100,
      },
      {
        title: "Vendor Name",
        id: "vendor.name",
        group: "Vendor",
        width: 150,
      },
      {
        title: "Rating",
        id: "vendor.rating",
        group: "Vendor",
        width: 100,
      },
      {
        title: "Last Delivery",
        id: "vendor.lastDelivery",
        group: "Vendor",
        width: 130,
      },
      // Metrics group (expandable)
      {
        title: "Metrics",
        id: "metrics",
        group: "Metrics",
        width: 100,
      },
      {
        title: "Sales",
        id: "metrics.sales",
        group: "Metrics",
        width: 120,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      {
        title: "Growth %",
        id: "metrics.growth",
        group: "Metrics",
        width: 100,
        formatter: (v: number) => `${v}%`,
      },
      {
        title: "Target",
        id: "metrics.target",
        group: "Metrics",
        width: 120,
        formatter: (v: number) => `$${Number(v).toLocaleString()}`,
      },
      {
        title: "Achievement %",
        id: "metrics.achievement",
        group: "Metrics",
        width: 140,
        formatter: (v: number) => `${v}%`,
      },
    ],
    []
  );

  // Define column grouping
  //   const groups = useMemo(
  //     () => [
  //       {
  //         title: "Unit",
  //         id: "Unit",
  //       },
  //       {
  //         title: "Product",
  //         id: "Product",
  //       },
  //       {
  //         title: "Order",
  //         id: "Order",
  //       },
  //       {
  //         title: "Vendor",
  //         id: "Vendor",
  //       },
  //       {
  //         title: "Metrics",
  //         id: "Metrics",
  //       },
  //     ],
  //     []
  //   );

  // Function to get cell content
  const getCellContent = useCallback(
    (cell: Item): EditableGridCell => {
      const [col, row] = cell;
      const dataRow = data[row];
      const column = columns[col];

      if (!dataRow || !column) {
        return {
          kind: GridCellKind.Text,
          allowOverlay: false,
          readonly: true,
          displayData: "",
          data: "",
        };
      }
      let cellData: string | number;
      if (column.id?.includes(".")) {
        // Handle nested properties
        const [parentProp, childProp] = column.id?.split(".") || [];
        cellData =
          dataRow[parentProp as keyof RowData]?.[
            childProp as keyof (typeof dataRow)[keyof RowData]
          ] || "";
      } else {
        cellData = dataRow[column.id as keyof RowData] as string | number;
      }
      // Format the data for display
      const displayData = String(cellData || "");

      if (typeof cellData === "number") {
        return {
          kind: GridCellKind.Number,
          allowOverlay: false,
          readonly: true,
          displayData,
          data: cellData,
        };
      }

      return {
        kind: GridCellKind.Text,
        allowOverlay: false,
        readonly: true,
        displayData,
        data: cellData || "",
      };
    },
    [data, columns]
  );

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
      <h2>Glide Data Grid Implementation</h2>
      {renderTime && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Render Time:</strong> {renderTime.toFixed(2)}ms
        </div>
      )}

      <div style={{ height: "70vh", width: "95vw", overflow: "hidden" }}>
        <DataEditor
          columns={columns}
          rows={data.length}
          getCellContent={getCellContent}
          rowHeight={35}
          theme={{
            accentColor: "#4f46e5",
            accentLight: "rgba(79, 70, 229, 0.1)",
            bgCell: "#ffffff",
            bgHeader: "#f9fafb",
            borderColor: "#e5e7eb",
            fontFamily: "sans-serif",
            headerFontStyle: "600 13px",
            baseFontStyle: "13px",
          }}
          headerHeight={35}
          smoothScrollX={true}
          smoothScrollY={true}
          verticalBorder={true}
          overscrollX={0}
          overscrollY={0}
          freezeColumns={1}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Features used for optimization:</h3>
        <ul>
          <li>
            Canvas-based rendering for high performance with large datasets
          </li>
          <li>Virtualized rendering of rows and columns</li>
          <li>Column grouping with expand/collapse functionality</li>
          <li>Smooth scrolling optimization</li>
          <li>Freezing first column for better navigation</li>
        </ul>
      </div>
    </div>
  );
};

export default GlideDataGrid;
