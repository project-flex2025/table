// "use client";
// import tableconfig from "@/public/tableconfig.json";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import * as XLSX from "xlsx";
// import {
//   Box,
//   Button,
//   FormControl,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import AddUserDialog from "./AddUserDilog";
// import DownloadCSV from "./DownloadCSV";
// import EditDialog from "./EditDilog";
// import ExportXLSX from "./DownloadCSV";
// import { table } from "console";

// interface TableColumn {
//   key: string;
//   label: string;
//   type: string;
//   sortable: boolean;
//   filterable: boolean;
//   filter_type?: string;
//   options?: string[];
// }

// interface Pagination {
//   page_size: number;
//   current_page: number;
//   total_pages: number;
//   total_records: number;
// }

// interface TableConfig {
//   table_name: string;
//   columns: TableColumn[];
//   pagination: Pagination;
//   api: {
//     endpoint: string;
//     method: string;
//     headers: { [key: string]: string };
//   };
//   toolbar: {
//     enabled: boolean;
//     buttons: {
//       name: string;
//       type: string;
//       icon: string;
//       action: string;
//     }[];
//   };
// }

// interface TableRow {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   status: string;
//   created_at: string;
// }

// export default function DynamicF({ tableconfig, config1 }: any) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [config, setConfig] = useState<TableConfig | null>(null);
//   const [data, setData] = useState<TableRow[]>([]);
//   const [editRow, setEditRow] = useState<any>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState(
//     tableconfig?.tableconfig?.pagination?.page_size || 10
//   );
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [totalCount, setTotalCount] = useState<number | null>(null);
//   const [search, setSearch] = useState("");
//   const [searchDepartment, setSearchDepartment] = useState("");

//   const fetchData = async () => {
//     try {
//       const response = await fetch("api/search", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           conditions: [
//             {
//               field: "feature_name",
//               value: "emp",
//               search_type: "exact",
//             },
//           ],
//           combination_type: "and",
//           page: currentPage,
//           limit: pageSize,
//           dataset: "feature_data",
//           app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       return response.json();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//       return { data: [], total_results: 0 };
//     }
//   };

//   useEffect(() => {
//     const fetchTableData = async () => {
//       setLoading(true);
//       const res = await fetchData();
//       setData(res.data);
//       setTotalCount(res.total_results);
//       setLoading(false);
//     };

//     fetchTableData();
//     if (tableconfig?.table_config) {
//       setConfig(tableconfig.table_config);
//     }
//   }, [currentPage, pageSize, search, searchDepartment]);

//   if (loading) return <p>Loading...</p>;

//   const handleChangeRowsPerPage = (e: any) => {
//     setPageSize(parseInt(e.target.value, 10));
//   };

//   const handleNewPage = (newPage: number) => {
//     setCurrentPage(newPage + 1);
//   };

//   //   useEffect(() => {'
//   //     if (data && tableconfig?.columns) {
//   //       console.log(
//   //         data?.map((row: any, index: number) =>
//   //           tableconfig?.columns?.map((col: any) => {
//   //             console.log(row`${col?.value}`, "fun function");
//   //           })
//   //         ),
//   //         "log in fun useeffect"
//   //       );
//   //     }
//   //   }, [currentPage]);

//   function extractCellValue(tableData: any, columnConfig: any) {
//     const valuePath = columnConfig?.map((ele: any) => ele?.value?.split("."));
//     //   .value.split(".");
//     // ["feature_data", "record_data", "EMP ID"]
//     return tableData.map((row: any) => {
//       let dataPointer = row;

//       // Navigate through the path except the last key
//       for (let i = 0; i < valuePath.length - 1; i++) {
//         if (dataPointer[valuePath[i]]) {
//           dataPointer = dataPointer[valuePath[i]];
//         } else {
//           return null; // Path not found
//         }
//       }

//       // Find the record with matching record_label
//       const recordLabel = valuePath[valuePath.length - 1]; // "EMP ID"
//       const record = dataPointer.find(
//         (entry: any) => entry.record_label === recordLabel
//       );

//       return record ? record.record_value : null;
//     });
//   }

//   const empIds = extractCellValue(data, tableconfig?.columns);
//   //   console.log(empIds, "empids in fun 112233445566");

//   function mapTableDataToRows(tableData: any, tableConfig: any) {
//     console.log(tableData, tableConfig, "table data + tableconfig");

//     return tableData?.map((row: any) => {
//       let rowData: Record<string, any> = {};
//       tableConfig?.columns?.forEach((column: any) => {
//         let valuePath = column?.value?.split("."); // Convert path into array
//         let dataPointer = row;

//         // console.log(valuePath, dataPointer, "...++++-----");

//         // Traverse object path except for record_data (which is an array)
//         for (let i = 0; i < valuePath?.length - 1; i++) {
//           if (dataPointer[valuePath[i]]) {
//             dataPointer = dataPointer[valuePath[i]];
//           } else {
//             dataPointer = null;
//             break;
//           }
//         }

//         let cellValue = null;
//         const lastKey = valuePath[valuePath ? valuePath?.length : 1 - 1];

//         if (Array.isArray(dataPointer)) {
//           // Handle array lookup for record_data
//           const record = dataPointer.find(
//             (entry) => entry.record_label == lastKey
//           );
//           cellValue = record ? record.record_value : null;
//         } else {
//           // Direct property access
//           cellValue = dataPointer ? dataPointer[lastKey] : null;
//         }

//         rowData[column.key] = cellValue;
//       });

//       return rowData;
//     });
//   }

//   // Example usage:
//   const tableRows = mapTableDataToRows(data, tableconfig);
//   console.log(tableRows, "new table row cells1233");

//   return (
//     <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>
//       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
//         <FormControl sx={{ minWidth: 200 }}>
//           <TextField
//             label="Search Name"
//             value={search || ""}
//             size="small"
//             onChange={(e) => setSearch(e.target.value)}
//             variant="outlined"
//           />
//         </FormControl>
//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel>Sort by Department</InputLabel>
//           <Select
//             size="small"
//             value={searchDepartment || ""}
//             onChange={(e) => setSearchDepartment(e.target.value)}
//             label="Sort by Department"
//           >
//             <MenuItem value="">All</MenuItem>
//             <MenuItem value="HR">HR</MenuItem>
//             <MenuItem value="IT">IT</MenuItem>
//             <MenuItem value="Finance">Finance</MenuItem>
//           </Select>
//         </FormControl>
//         <ExportXLSX
//           tableData={data}
//           tableConfig={tableconfig}
//           total_records={totalCount}
//         />
//       </Box>

//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {tableconfig?.columns?.map((col: any) => (
//                 <TableCell
//                   key={col.label}
//                   sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
//                 >
//                   {col.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {data?.map((row: any, index: number) => (
//               <TableRow key={index} hover sx={{ padding: 0 }}>
//                 {tableconfig?.columns?.map((col: any) => {
//                   let cellValue = "";

//                   //   const recordData1 = row?.`${col?.value}`;

//                   //   console.log(recordData1, "recorddata1");

//                   if (col?.value?.startsWith("feature_data.record_data")) {
//                     const recordData = row?.feature_data?.record_data?.find(
//                       (item: any) => item.record_label === col.label
//                     );

//                     if (recordData) {
//                       cellValue =
//                         recordData.record_value ??
//                         recordData.record_value_date ??
//                         recordData.record_value_number ??
//                         "";
//                     }
//                   } else if (col?.value?.startsWith("more_data")) {
//                     cellValue = row?.more_data?.wild_search;
//                   } else {
//                     cellValue = row?.[col.value] ?? "";
//                   }

//                   return (
//                     <TableCell key={col.label} sx={{ padding: 0.2 }}>
//                       {cellValue}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={totalCount || 10}
//         page={currentPage - 1}
//         onPageChange={(_, newPage) => handleNewPage(newPage)}
//         rowsPerPage={pageSize}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }

"use client";
import tableconfig from "@/public/tableconfig.json";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddUserDialog from "./AddUserDilog";
import DownloadCSV from "./DownloadCSV";
import EditDialog from "./EditDilog";
import ExportXLSX from "./DownloadCSV";

interface TableColumn {
  key: string;
  label: string;
  type: string;
  sortable: boolean;
  filterable: boolean;
  filter_type?: string;
  options?: string[];
}

interface Pagination {
  page_size: number;
  current_page: number;
  total_pages: number;
  total_records: number;
}

interface TableConfig {
  table_name: string;
  columns: TableColumn[];
  pagination: Pagination;
  api: {
    endpoint: string;
    method: string;
    headers: { [key: string]: string };
  };
  toolbar: {
    enabled: boolean;
    buttons: {
      name: string;
      type: string;
      icon: string;
      action: string;
    }[];
  };
}

interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export default function DynamicF({ tableconfig, config1 }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [config, setConfig] = useState<TableConfig | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(
    tableconfig?.table_config?.pagination?.page_size || 10
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conditions: [
            {
              field: "feature_name",
              value: "emp",
              search_type: "exact",
            },
          ],
          combination_type: "and",
          page: currentPage,
          limit: 2,
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      return { data: [], total_results: 0 };
    }
  };

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      const res = await fetchData();
      setData(res.data || []);
      setTotalCount(res.total_results || 0);
      setLoading(false);
    };

    fetchTableData();
    if (tableconfig?.table_config) {
      setConfig(tableconfig.table_config);
    }
  }, [currentPage, pageSize, search, searchDepartment]);

  if (loading) return <p>Loading...</p>;

  const handleChangeRowsPerPage = (e: any) => {
    setPageSize(parseInt(e.target.value, 10));
  };

  const handleNewPage = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  function extractCellValue(tableData: any, columnConfig: any) {
    if (!tableData || !columnConfig) return [];

    return tableData.map((row: any) => {
      if (!row) return null;

      return columnConfig?.map((col: any) => {
        const valuePath = col?.value?.split(".");
        if (!valuePath) return null;

        let dataPointer = row;
        for (let i = 0; i < valuePath.length - 1; i++) {
          if (dataPointer?.[valuePath[i]]) {
            dataPointer = dataPointer[valuePath[i]];
          } else {
            return null;
          }
        }

        const lastKey = valuePath[valuePath.length - 1];
        if (Array.isArray(dataPointer)) {
          const record = dataPointer.find(
            (entry) => entry.record_label === lastKey
          );
          return record ? record.record_value : null;
        }

        return dataPointer?.[lastKey] ?? null;
      });
    });
  }

//   function mapTableDataToRows(tableData: any, tableConfig: any) {
//     if (!tableData || !tableConfig?.columns) return [];

//     return tableData.map((row: any) => {
//       let rowData: Record<string, any> = {};

//       tableConfig.columns.forEach((column: any) => {
//         const valuePath = column?.value?.split(".");
//         if (!valuePath) return;

//         let dataPointer = row;
//         for (let i = 0; i < valuePath.length - 1; i++) {
//           if (dataPointer?.[valuePath[i]]) {
//             dataPointer = dataPointer[valuePath[i]];
//           } else {
//             dataPointer = null;
//             break;
//           }
//         }

//         console.log(dataPointer, "data pointer 000 ... 111 222 333 444");

//         let cellValue = null;
//         const lastKey = valuePath[valuePath.length - 1];

//         if (Array.isArray(dataPointer)) {
//           const record = dataPointer.find(
//             (entry) => entry.record_label === lastKey
//           );
//           cellValue = record
//             ? record.record_value ??
//               record.record_value_text ??
//               record.record_value_number ??
//               record.record_value_date
//             : null;
//         } else {
//           cellValue = dataPointer?.[lastKey] ?? null;
//         }

//         rowData[column.label] = cellValue;
//       });

//       return rowData;
//     });
//   }

    function mapTableDataToRows(tableData: any, tableConfig: any) {
      if (!tableData || !tableConfig?.columns) return [];

      return tableData.map((row: any) => {
        let rowData: Record<string, any> = {};

        tableConfig.columns.forEach((column: any) => {
          const valuePath = column?.value?.split(".");
          if (!valuePath) return;

          let dataPointer = row;
          for (let i = 0; i < valuePath.length - 1; i++) {
            if (dataPointer?.[valuePath[i]]) {
              dataPointer = dataPointer[valuePath[i]];
            } else {
              dataPointer = null;
              break;
            }
          }

          let cellValue = null;
          const lastKey = valuePath[valuePath.length - 1];

          if (Array.isArray(dataPointer)) {
            const record = dataPointer.find(
              (entry) => entry.record_label === lastKey
            );
            cellValue = record
              ? record.record_value ??
                record.record_value_text ??
                record.record_value_number ??
                record.record_value_date
              : null;
          } else {
            cellValue = dataPointer?.[lastKey] ?? null;
          }

          // **Fix for `more_data.wildsearch` field**
          if (column.value === "more_data.wildsearch") {
            cellValue = row?.more_data?.wild_search ?? "";
          }

          rowData[column.label] = cellValue;
        });

        return rowData;
      });
    }

  //   function getValueByPath(obj: any, path: string) {
  //     console.log(obj, path, "path.........");

  //     const keys = path?.split(".");
  //     let result = obj;

  //     for (const key of keys) {
  //       if (Array.isArray(result)) {
  //         // If the path leads to an array, search inside it for the matching record_label
  //         result = result.find((entry: any) => entry.record_label === key);
  //         if (!result) return null;
  //       } else {
  //         result = result?.[key];
  //       }

  //       if (result === undefined || result === null) return null;
  //     }

  //     return (
  //       result?.record_value ??
  //       result?.record_value_text ??
  //       result?.record_value_number ??
  //       result?.record_value_date ??
  //       result // Fallback to result if it's a direct value
  //     );
  //   }

  //   function mapTableDataToRows(tableData: any, tableConfig: any) {
  //     if (!tableData || !tableConfig?.columns) return [];

  //     return tableData.map((row: any) => {
  //       let rowData: Record<string, any> = {};

  //       tableConfig?.columns.forEach((column: any) => {
  //         console.log(column?.value, "col val vijay...");
  //         // if (!column?.value) {
  //         //   break;
  //         // }

  //         const cellValue = getValueByPath(row, column?.value);
  //         rowData[column.label] = cellValue ?? ""; // Ensure no undefined values
  //       });

  //       return rowData;
  //     });
  //   }

    const tableRows = mapTableDataToRows(data, tableconfig);

  //   console.log(tableRows, "table rows...++---");

  //   function getValueByPath(obj: any, path: string | undefined) {
  //     if (!path || typeof path !== "string") return null; // Ensure path is valid

  //     console.log(obj, path, "path.........");

  //     const keys = path.split(".");
  //     let result = obj;

  //     for (const key of keys) {
  //       if (Array.isArray(result)) {
  //         // Search inside array for matching record_label
  //         result = result.find((entry: any) => entry.record_label === key);
  //         if (!result) return null;
  //       } else {
  //         result = result?.[key];
  //       }

  //       if (result === undefined || result === null) return null;
  //     }

  //     return (
  //       result?.record_value ??
  //       result?.record_value_text ??
  //       result?.record_value_number ??
  //       result?.record_value_date ??
  //       result // Fallback to result if it's a direct value
  //     );
  //   }

  //   function mapTableDataToRows(tableData: any, tableConfig: any) {
  //     if (!tableData || !tableConfig?.columns) return [];

  //     return tableData.map((row: any) => {
  //       let rowData: Record<string, any> = {};

  //       tableConfig?.columns.forEach((column: any) => {
  //         if (!column?.value || typeof column.value !== "string") {
  //           console.warn(`Skipping column with invalid value:`, column);
  //           return; // Skip invalid columns
  //         }

  //         console.log(column.value, "Processing column...");

  //         const cellValue = getValueByPath(row, column.value);
  //         rowData[column.label] = cellValue ?? ""; // Ensure no undefined values
  //       });

  //       return rowData;
  //     });
  //   }

  //   // Generate table rows
  //   const tableRows = mapTableDataToRows(data, tableconfig);

  //   console.log(tableRows, "table rows...++---");

  return (
    <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableconfig?.columns?.map((col: any) => (
                <TableCell
                  key={col.label}
                  sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row: any, index: any) => (
              <TableRow key={index}>
                {tableconfig?.columns?.map((col: any) => (
                  <TableCell key={col.label}>{row[col.label] ?? ""}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        count={totalCount || 10}
        page={currentPage - 1}
        onPageChange={(_, newPage) => handleNewPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// interface TableConfig {
//   table_name: string;
//   api: {
//     endpoint: string;
//     method: string;
//     headers: Record<string, string>;
//   };
//   columns: ColumnConfig[];
//   pagination: {
//     enabled: boolean;
//     page_size: number;
//     current_page: number;
//   };
//   sorting: {
//     enabled: boolean;
//     default_column: string;
//     default_order: "asc" | "desc";
//   };
// }

// interface ColumnConfig {
//   label: string;
//   value: string;
//   key: string;
//   type: string;
//   sortable: boolean;
//   filterable: boolean;
//   filter_type?: string;
//   options?: string[];
// }

// interface EmployeeRecord {
//   record_status: string;
//   feature_data: {
//     record_data: Array<{
//       record_label: string;
//       record_value?: string;
//       record_value_number?: number;
//       record_value_date?: string;
//     }>;
//   };
//   more_data?: {
//     wildsearch?: string;
//   };
// }

// const EmployeeTable = () => {
//   const [data, setData] = useState<EmployeeRecord[]>([]);
//   const [config, setConfig] = useState<TableConfig | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // Load table configuration
//         const tableConfig = await fetch("/tableconfig.json").then((res) =>
//           res.json()
//         );
//         setConfig(tableConfig.table_config);

//         // Fetch employee data
//         const response = await fetch(tableConfig.table_config.api.endpoint, {
//           method: tableConfig.table_config.api.method,
//           headers: tableConfig.table_config.api.headers,
//         });
//         const jsonData = await response.json();
//         setData(jsonData.records);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   const extractValue = (
//     recordData: EmployeeRecord["feature_data"]["record_data"],
//     label: string
//   ) => {
//     const field = recordData.find((item) => item.record_label === label);
//     return (
//       field?.record_value ||
//       field?.record_value_number ||
//       field?.record_value_date ||
//       ""
//     );
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!config) return <p>Error loading table configuration.</p>;

//   return (
//     <div className="overflow-x-auto p-4">
//       <h2 className="text-xl font-bold mb-4">{config.table_name}</h2>
//       <table className="w-full border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             {config.columns.map((column) => (
//               <th key={column.key} className="border px-4 py-2 text-left">
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((record, rowIndex) => (
//             <tr key={rowIndex} className="border">
//               {config.columns.map((column) => {
//                 let cellData;
//                 if (column.value.startsWith("feature_data.record_data")) {
//                   cellData = extractValue(
//                     record.feature_data.record_data,
//                     column.label
//                   );
//                 } else if (column.value.startsWith("more_data.wildsearch")) {
//                   cellData = record.more_data?.wildsearch || "";
//                 } else {
//                   cellData = (record as any)[column.value] || "";
//                 }

//                 return (
//                   <td key={column.key} className="border px-4 py-2">
//                     {cellData}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EmployeeTable;
