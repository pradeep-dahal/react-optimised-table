import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  getExpandedRowModel,
  ColumnPinningState,
  VisibilityState,
} from "@tanstack/react-table";
import { RowData, measureRenderTime } from "../utils/dataGenerator";
import { FixedSizeList as List } from "react-window";

interface Props {
  data: RowData[];
}

const TanstackTable = ({ data }: Props) => {
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "unit.rate": false,
    "product.id": false,
    "product.category": false,
    "product.subcategory": false,
    "order.date": false,
    "order.quantity": false,
    "order.discount": false,
    "vendor.rating": false,
    "vendor.lastDelivery": false,
    "metrics.growth": false,
    "metrics.target": false,
    "metrics.achievement": false,
  });

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["id"],
    right: [],
  });

  const columnHelper = createColumnHelper<RowData>();

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 80,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        size: 180,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        size: 220,
      }),
      columnHelper.accessor("department", {
        header: "Department",
        size: 150,
      }),
      columnHelper.accessor("position", {
        header: "Position",
        size: 150,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        size: 150,
      }),
      columnHelper.accessor("startDate", {
        header: "Start Date",
        size: 120,
      }),
      columnHelper.accessor("salary", {
        header: "Salary",
        size: 120,
        cell: (info) => `$${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor("performance", {
        header: "Performance",
        size: 120,
        cell: (info) => `${info.getValue()}%`,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        size: 120,
      }),

      // Unit group
      columnHelper.group({
        header: "Unit",
        id: "unit",
        columns: [
          columnHelper.accessor((row) => row.unit.qty, {
            id: "unit.qty",
            header: "Qty",
            size: 100,
          }),
          columnHelper.accessor((row) => row.unit.rate, {
            id: "unit.rate",
            header: "Rate",
            size: 100,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
          columnHelper.accessor((row) => row.unit.totalSum, {
            id: "unit.totalSum",
            header: "Total Sum",
            size: 120,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
        ],
      }),

      // Product group
      columnHelper.group({
        header: "Product",
        id: "product",
        columns: [
          columnHelper.accessor((row) => row.product.id, {
            id: "product.id",
            header: "Product ID",
            size: 120,
          }),
          columnHelper.accessor((row) => row.product.category, {
            id: "product.category",
            header: "Category",
            size: 130,
          }),
          columnHelper.accessor((row) => row.product.subcategory, {
            id: "product.subcategory",
            header: "Subcategory",
            size: 140,
          }),
          columnHelper.accessor((row) => row.product.price, {
            id: "product.price",
            header: "Price",
            size: 100,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
        ],
      }),

      // Order group
      columnHelper.group({
        header: "Order",
        id: "order",
        columns: [
          columnHelper.accessor((row) => row.order.date, {
            id: "order.date",
            header: "Date",
            size: 110,
          }),
          columnHelper.accessor((row) => row.order.quantity, {
            id: "order.quantity",
            header: "Quantity",
            size: 100,
          }),
          columnHelper.accessor((row) => row.order.discount, {
            id: "order.discount",
            header: "Discount %",
            size: 110,
            cell: (info) => `${info.getValue()}%`,
          }),
          columnHelper.accessor((row) => row.order.total, {
            id: "order.total",
            header: "Total",
            size: 100,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
        ],
      }),

      // Vendor group
      columnHelper.group({
        header: "Vendor",
        id: "vendor",
        columns: [
          columnHelper.accessor((row) => row.vendor.name, {
            id: "vendor.name",
            header: "Vendor",
            size: 150,
          }),
          columnHelper.accessor((row) => row.vendor.rating, {
            id: "vendor.rating",
            header: "Rating",
            size: 100,
          }),
          columnHelper.accessor((row) => row.vendor.lastDelivery, {
            id: "vendor.lastDelivery",
            header: "Last Delivery",
            size: 130,
          }),
        ],
      }),

      // Metrics group
      columnHelper.group({
        header: "Metrics",
        id: "metrics",
        columns: [
          columnHelper.accessor((row) => row.metrics.sales, {
            id: "metrics.sales",
            header: "Sales",
            size: 120,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
          columnHelper.accessor((row) => row.metrics.growth, {
            id: "metrics.growth",
            header: "Growth %",
            size: 100,
            cell: (info) => `${info.getValue()}%`,
          }),
          columnHelper.accessor((row) => row.metrics.target, {
            id: "metrics.target",
            header: "Target",
            size: 120,
            cell: (info) => `$${info.getValue().toLocaleString()}`,
          }),
          columnHelper.accessor((row) => row.metrics.achievement, {
            id: "metrics.achievement",
            header: "Achievement %",
            size: 140,
            cell: (info) => `${info.getValue()}%`,
          }),
        ],
      }),
    ],
    [columnHelper]
  );

  // Set up the table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    columnResizeMode: "onChange",
  });

  // Toggle column group visibility
  const toggleColumnGroup = (groupId: string) => {
    // Find the column group and safely access its columns
    const columnGroup = columns.find(
      (col) => "id" in col && col.id === groupId
    ) as (ColumnDef<RowData> & { columns?: ColumnDef<RowData>[] }) | undefined;

    const groupColumns = columnGroup?.columns;

    if (!groupColumns) return;

    const groupColumnIds = groupColumns
      .filter((col) => "id" in col)
      .map((col) => col.id as string);

    const newVisibility = { ...columnVisibility };

    // Check if all columns are visible
    const allVisible = groupColumnIds.every((id) => !columnVisibility[id]);

    // Toggle visibility for all columns in the group
    groupColumnIds.forEach((id) => {
      newVisibility[id] = !allVisible;
    });

    setColumnVisibility(newVisibility);
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

  // Row renderer for react-window
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = table.getRowModel().rows[index];
    if (!row) return null;

    return (
      <div style={{ ...style, display: "flex", width: "100%" }}>
        {row.getVisibleCells().map((cell) => (
          <div
            key={cell.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #e5e7eb",
              width: cell.column.getSize(),
              position: cell.column.getIsPinned() ? "sticky" : "relative",
              left:
                cell.column.getIsPinned() === "left"
                  ? `${cell.column.getStart("left")}px`
                  : undefined,
              right:
                cell.column.getIsPinned() === "right"
                  ? `${cell.column.getStart("right")}px`
                  : undefined,
              zIndex: cell.column.getIsPinned() ? 1 : 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>TanStack Table Implementation</h2>
      {renderTime && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Render Time:</strong> {renderTime.toFixed(2)}ms
        </div>
      )}

      <div
        style={{
          height: "70vh",
          width: "100%",
        }}
      >
        <div style={{ width: "95vw", overflow: "auto" }}>
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.getSize(),
                          position: header.column.getIsPinned()
                            ? "sticky"
                            : "relative",
                          left:
                            header.column.getIsPinned() === "left"
                              ? `${header.getStart("left")}px`
                              : undefined,
                          right:
                            header.column.getIsPinned() === "right"
                              ? `${header.getStart("right")}px`
                              : undefined,
                          padding: "10px",
                          textAlign: "left",
                          borderBottom: "1px solid #e5e7eb",
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                          userSelect: "none",
                          zIndex: header.column.getIsPinned() ? 1 : 0,
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <span>
                            {{ asc: " 🔼", desc: " 🔽" }[
                              header.column.getIsSorted() as string
                            ] ?? " ⏺️"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
          </div>

          <List
            height={400} // Adjust based on your needs
            itemCount={table.getRowModel().rows.length}
            itemSize={50} // Adjust row height as needed
            width="100%"
          >
            {Row}
          </List>
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Features used for optimization:</h3>
        <ul>
          <li>Virtual scrolling with react-window for efficient rendering</li>
          <li>Column pinning for better navigation</li>
          <li>
            Column grouping with expand/collapse functionality via toggle
            buttons
          </li>
          <li>Core row model for efficient rendering</li>
          <li>Column resizing capabilities</li>
        </ul>
      </div>
    </div>
  );
};

export default TanstackTable;
