//@ts-nocheck
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateData, RowData } from "./utils/dataGenerator";
import HandsontableGrid from "./pages/HandsontableGrid";
import AgGrid from "./pages/AgGrid";
import GlideDataGrid from "./pages/GlideDataGrid";
import TanstackTable from "./pages/TanstackTable";
import DevExtremeDataGrid from "./pages/DevExtremeDataGrid";
import { MRTTable } from "./pages/MRTTable";

function App() {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate data asynchronously to prevent UI blocking
    setLoading(true);
    const timer = setTimeout(() => {
      const generatedData = generateData(6000);
      setData(generatedData);
      setLoading(false);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  console.log("data===", data)

  return (
    <Router>
      <div className="app-container" style={{ padding: "20px" }}>
        <h1>React Data Grid Performance POC</h1>
        <p>Testing performance with 6000 rows and expandable column groups</p>

        <nav style={{ marginBottom: "20px" }}>
          <ul
            style={{
              display: "flex",
              gap: "15px",
              listStyle: "none",
              padding: 0,
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/handsontable"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                Handsontable
              </Link>
            </li>
            <li>
              <Link
                to="/glide"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                Glide Data Grid
              </Link>
            </li>
            <li>
              <Link
                to="/ag-grid"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                AG Grid
              </Link>
            </li>
            <li>
              <Link
                to="/tanstack"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                TanStack Table
              </Link>
            </li>
            <li>
              <Link
                to="/devextreme"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                DevExtreme
              </Link>
            </li>

            <li>
              <Link
                to="/mrt"
                style={{
                  padding: "8px 16px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                MRT Table
              </Link>
            </li>
          </ul>
        </nav>

        {loading ? (
          <div>Loading data (generating 6000 rows)...</div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Welcome to the Data Grid Performance POC</h2>
                  <p>
                    Select one of the grid implementations from the navigation
                    menu above to see it in action.
                  </p>
                  <h3>Comparison Criteria:</h3>
                  <ul>
                    <li>Initial render time</li>
                    <li>Scroll performance</li>
                    <li>Column group expandability</li>
                    <li>Memory usage</li>
                  </ul>
                </div>
              }
            />
            <Route
              path="/handsontable"
              element={<HandsontableGrid data={data} />}
            />
            <Route path="/glide" element={<GlideDataGrid data={data} />} />
            <Route path="/ag-grid" element={<AgGrid data={data} />} />
            <Route path="/tanstack" element={<TanstackTable data={data} />} />
            <Route
              path="/devextreme"
              element={<DevExtremeDataGrid data={data} />}
            />
            <Route
              path="/mrt"
              element={<MRTTable />}
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
