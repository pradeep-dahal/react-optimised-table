import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowVirtualizer,
  MRT_SortingState,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";
import jsonData from "../../data.json";

type Person = (typeof jsonData)[0];

export const MRTTable: FC = () => {
  const [quantityAndRateHidden, setQuantityAndRateHidden] = useState(false);

  const toggleQuantityAndRateHidden = (
    table: MRT_TableInstance<Person>,
    value: boolean
  ) => {
    table.setColumnVisibility({ quantity: value });
    table.setColumnVisibility({ rate: value });
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "claim_ref",
        header: "Ref",
        size: 150,
      },
      {
        accessorKey: "title",
        header: "Description",
        size: 170,
      },
      {
        accessorKey: "unit",
        header: "Unit",
        size: 150,
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        size: 150,
      },
      {
        accessorKey: "rate",
        header: "Rate",
        size: 150,
      },
      {
        accessorKey: "total_sum",
        header: "Total Sum",
        Header: () => {
          return (
            <span>
              "Total Sum"
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleQuantityAndRateHidden(table, !quantityAndRateHidden);
                  setQuantityAndRateHidden(!quantityAndRateHidden);
                }}
              >
                '🔵'
              </button>
            </span>
          );
        },
        size: 150,
      },
      {
        accessorKey: "claimed_to_date",
        header: "Progress",
      },
      {
        accessorKey: "current_percentage",
        header: "Qty Complete",
        size: 220,
      },
      {
        accessorKey: "current_quantity",
        header: "Work Progress",
      },
      {
        accessorKey: "previous_approved_percentage",
        header: "Previous Approved",
        size: 350,
      },
      {
        accessorKey: "previous_approved_quantity",
        header: "Previous Approved Qty",
      },
      {
        accessorKey: "previous_approved_claim",
        header: "Previous Approved Amount",
      },
    ],
    [quantityAndRateHidden]
    //end
  );

  //optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);

  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setData(jsonData);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const table = useMaterialReactTable({
    columns,
    data, //10,000 rows
    defaultDisplayColumn: { enableResizing: true },
    enableBottomToolbar: false,
    enableColumnResizing: true,
    // enableColumnVirtualization: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableColumnPinning: true,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    onSortingChange: setSorting,
    state: {
      isLoading,
      sorting,
    },

    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 20 }, //optionally customize the row virtualizer
    // columnVirtualizerOptions: { overscan: 2 }, //optionally customize the column virtualizer
  });

  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <MaterialReactTable table={table} />;
    </div>
  );
};
