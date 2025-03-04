//@ts-nocheck
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FixedSizeList as List } from "react-window";

// Create a column helper for easier column definition
const columnHelper = createColumnHelper();

export default function VirtualizedCascadingTable() {
  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("claim_ref", {
        id: "claim_ref",
        header: ({ table }) => (
          <>
            <button
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? "👇" : "👉"}
            </button>{" "}
            Ref
          </>
        ),
        cell: ({ row, getValue }) => (
          <div
            style={{
              // Since rows are flattened by default,
              // we can use the row.depth property
              // and paddingLeft to visually indicate the depth
              // of the row
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <div>
              {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? "👇" : "👉"}
                </button>
              ) : (
                ""
              )}{" "}
              {getValue<boolean>()}
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("title", {
        header: ({ table }) => (
          <span>
            "Description"
            <button
              onClick={() => {
                const column = table.getColumn("claim_ref");
                if (column) {
                  column.toggleVisibility(!column.getIsVisible());
                }
              }}
            >
              '🔵'
            </button>
          </span>
        ),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("unit", {
        header: "Unit",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("rate", {
        header: "Rate",
        cell: (info) => `$ ${info.getValue()}`,
      }),
      columnHelper.accessor("totalSum", {
        header: ({ table }) => (
          <span>
            "Total Sum"
            <button
              onClick={() => {
                const column = table.getColumn("ref");
                if (column) {
                  column.toggleVisibility(!column.getIsVisible());
                }
              }}
            >
              '🔵'
            </button>
          </span>
        ),
        cell: (info) => `$ ${(info.getValue() || 0)?.toFixed(2)}`,
      }),
      columnHelper.accessor("claimed_to_date", {
        header: "Progress",
        cell: (info) => {
          const val = info.getValue() || 0;
          return `${val.toFixed(2)}%`;
        },
      }),
      columnHelper.accessor("qtyComplete", {
        header: "Qty Complete",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("workProgress", {
        header: "Work Progress",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("previousAmt", {
        header: "Previous Amt",
        cell: (info) => `$ ${info.getValue()}`,
      }),
      // Example of an editable cell
      columnHelper.accessor("currentQty", {
        header: "Current Qty",
        cell: ({ getValue, row }) => {
          // We track local state for this example
          // const [val, setVal] = useState(getValue() || 0);

          // You might want to store this in your global state,
          // or a form library. For a quick demo, we do local state.
          const onChange = (e) => {
            const newVal = parseFloat(e.target.value || 0);
            // setVal(newVal);
            // Also update the row's original data if desired:
            row.original.currentQty = newVal;
          };

          return (
            <input
              type="number"
              value={getValue() || 0}
              onChange={onChange}
              style={{ width: "100%" }}
            />
          );
        },
      }),
      // Another editable cell example
      columnHelper.accessor("claimAmount", {
        header: "Claim Amount",
        cell: ({ getValue, row }) => {
          const [val, setVal] = useState(getValue() || 0);

          const onChange = (e) => {
            const newVal = parseFloat(e.target.value || 0);
            setVal(newVal);
            row.original.claimAmount = newVal;
          };

          return (
            <input
              type="number"
              value={val}
              onChange={onChange}
              style={{ width: "100%" }}
            />
          );
        },
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: () => {
          // You can render buttons, icons, or anything needed here
          return <button>Action</button>;
        },
      }),
    ],
    []
  );

  // Create state for your data
  const [data] = useState(() => makeData());

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    // We tell the table where to find sub-rows for nested data
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
  });

  // The table internally organizes rows/sub-rows, but for virtualization
  // we typically want a flat list of "renderable" rows in the correct order.
  // TanStack Table's getRowModel().rows already provides a flattened
  // structure including nested rows in order.
  const allRows = table.getRowModel().rows;

  // ---------------------------------------------------------
  // 3. Row renderer for react-window
  // ---------------------------------------------------------
  const RenderRow = ({ index, style }) => {
    const row = allRows[index];

    return (
      <div
        // Must apply the react-window 'style' for correct row positioning
        style={{
          ...style,
          display: "flex",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Indent child rows to visually show hierarchy */}
        <div style={{ width: `${row.depth * 20}px` }} />
        {/* Render each cell */}
        {row.getVisibleCells().map((cell) => (
          <div
            key={cell.id}
            style={{
              flex: 1,
              padding: "8px",
              borderRight: "1px solid #eee",
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  };

  // ---------------------------------------------------------
  // 4. Table layout with header + virtualized body
  // ---------------------------------------------------------
  return (
    <div style={{ width: "100%", border: "1px solid #ccc" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #ccc",
        }}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} style={{ display: "flex", flex: 1 }}>
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRight: "1px solid #eee",
                  fontWeight: "bold",
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <List
        height={600} // Adjust the table body height as needed
        itemCount={allRows.length}
        itemSize={35} // Row height in pixels
        width="100%"
      >
        {RenderRow}
      </List>
    </div>
  );
}
