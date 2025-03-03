import { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Sorting,
  Paging,
  Scrolling,
  ColumnFixing,
  GroupPanel,
  SearchPanel,
  HeaderFilter,
  FilterRow,
  Export,
  Selection,
} from "devextreme-react/data-grid";
import { RowData, measureRenderTime } from "../utils/dataGenerator";
import "devextreme/dist/css/dx.light.css";

interface Props {
  data: RowData[];
}

const DevExtremeDataGrid = ({ data }: Props) => {
  const [renderTime, setRenderTime] = useState<number | null>(null);

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

  // Format currency values
  const currencyFormatter = (cellInfo: { value: number }) => {
    return `$${cellInfo.value.toLocaleString()}`;
  };

  // Format percentage values
  const percentFormatter = (cellInfo: { value: number }) => {
    return `${cellInfo.value}%`;
  };

  return (
    <div>
      <h2>DevExtreme Data Grid Implementation</h2>
      {renderTime && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Render Time:</strong> {renderTime.toFixed(2)}ms
        </div>
      )}

      <div style={{ width: "95vw" }}>
        <DataGrid
          dataSource={data}
          showBorders={true}
          columnAutoWidth={false}
          allowColumnReordering={true}
          allowColumnResizing={true}
          rowAlternationEnabled={true}
          hoverStateEnabled={true}
          wordWrapEnabled={false}
          height="70vh"
        >
          <Sorting mode="multiple" />
          <Scrolling
            mode="virtual"
            rowRenderingMode="virtual"
            columnRenderingMode="virtual"
          />
          <Paging enabled={false} />
          <ColumnFixing enabled={true} />
          <GroupPanel visible={true} />
          <SearchPanel visible={true} highlightCaseSensitive={false} />
          <HeaderFilter visible={true} />
          <FilterRow visible={true} />
          <Export enabled={true} />
          <Selection mode="multiple" />

          {/* Basic columns */}
          <Column
            dataField="id"
            caption="ID"
            dataType="number"
            width={80}
            fixed={true}
          />
          <Column dataField="name" caption="Name" width={180} />
          <Column dataField="email" caption="Email" width={220} />
          <Column dataField="department" caption="Department" width={150} />
          <Column dataField="position" caption="Position" width={150} />
          <Column dataField="location" caption="Location" width={150} />
          <Column
            dataField="startDate"
            caption="Start Date"
            dataType="date"
            width={120}
          />
          <Column
            dataField="salary"
            caption="Salary"
            dataType="number"
            width={120}
            customizeText={currencyFormatter}
          />
          <Column
            dataField="performance"
            caption="Performance"
            dataType="number"
            width={120}
            customizeText={percentFormatter}
          />
          <Column dataField="status" caption="Status" width={120} />

          {/* Unit group */}
          <Column caption="Unit">
            <Column
              dataField="unit.qty"
              caption="Qty"
              dataType="number"
              width={100}
            />
            <Column
              dataField="unit.rate"
              caption="Rate"
              dataType="number"
              width={100}
              customizeText={currencyFormatter}
            />
            <Column
              dataField="unit.totalSum"
              caption="Total Sum"
              dataType="number"
              width={120}
              customizeText={currencyFormatter}
            />
          </Column>

          {/* Product group */}
          <Column caption="Product">
            <Column dataField="product.id" caption="Product ID" width={120} />
            <Column
              dataField="product.category"
              caption="Category"
              width={130}
            />
            <Column
              dataField="product.subcategory"
              caption="Subcategory"
              width={140}
            />
            <Column
              dataField="product.price"
              caption="Price"
              dataType="number"
              width={100}
              customizeText={currencyFormatter}
            />
          </Column>

          {/* Order group */}
          <Column caption="Order">
            <Column
              dataField="order.date"
              caption="Date"
              dataType="date"
              width={110}
            />
            <Column
              dataField="order.quantity"
              caption="Quantity"
              dataType="number"
              width={100}
            />
            <Column
              dataField="order.discount"
              caption="Discount %"
              dataType="number"
              width={110}
              customizeText={percentFormatter}
            />
            <Column
              dataField="order.total"
              caption="Total"
              dataType="number"
              width={100}
              customizeText={currencyFormatter}
            />
          </Column>

          {/* Vendor group */}
          <Column caption="Vendor">
            <Column dataField="vendor.name" caption="Vendor" width={150} />
            <Column
              dataField="vendor.rating"
              caption="Rating"
              dataType="number"
              width={100}
            />
            <Column
              dataField="vendor.lastDelivery"
              caption="Last Delivery"
              dataType="date"
              width={130}
            />
          </Column>

          {/* Metrics group */}
          <Column caption="Metrics">
            <Column
              dataField="metrics.sales"
              caption="Sales"
              dataType="number"
              width={120}
              customizeText={currencyFormatter}
            />
            <Column
              dataField="metrics.growth"
              caption="Growth %"
              dataType="number"
              width={100}
              customizeText={percentFormatter}
            />
            <Column
              dataField="metrics.target"
              caption="Target"
              dataType="number"
              width={120}
              customizeText={currencyFormatter}
            />
            <Column
              dataField="metrics.achievement"
              caption="Achievement %"
              dataType="number"
              width={140}
              customizeText={percentFormatter}
            />
          </Column>
        </DataGrid>
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Features used for optimization:</h3>
        <ul>
          <li>Virtual scrolling for both rows and columns</li>
          <li>Column grouping with expand/collapse functionality</li>
          <li>Fixed columns for better navigation</li>
          <li>Disabled word wrapping for better performance</li>
          <li>Optimized rendering modes for large datasets</li>
          <li>Advanced filtering, sorting, and search capabilities</li>
        </ul>
      </div>
    </div>
  );
};

export default DevExtremeDataGrid;
