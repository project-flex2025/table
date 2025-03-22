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
//     tableconfig?.table_config?.pagination?.page_size || 10
//   );
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [totalCount, setTotalCount] = useState<number | null>(null);
//   const [search, setSearch] = useState("");
//   const [searchDepartment, setSearchDepartment] = useState("");

//   const fetchData = async () => {
//     try {
//       const response = await fetch("/api/search", {
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
//           limit: 2,
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
//       setData(res.data || []);
//       setTotalCount(res.total_results || 0);
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

//   function extractCellValue(tableData: any, columnConfig: any) {
//     if (!tableData || !columnConfig) return [];

//     return tableData.map((row: any) => {
//       if (!row) return null;

//       return columnConfig?.map((col: any) => {
//         const valuePath = col?.value?.split(".");
//         if (!valuePath) return null;

//         let dataPointer = row;
//         for (let i = 0; i < valuePath.length - 1; i++) {
//           if (dataPointer?.[valuePath[i]]) {
//             dataPointer = dataPointer[valuePath[i]];
//           } else {
//             return null;
//           }
//         }

//         const lastKey = valuePath[valuePath.length - 1];
//         if (Array.isArray(dataPointer)) {
//           const record = dataPointer.find(
//             (entry) => entry.record_label === lastKey
//           );
//           return record ? record.record_value : null;
//         }

//         return dataPointer?.[lastKey] ?? null;
//       });
//     });
//   }

//   //   function mapTableDataToRows(tableData: any, tableConfig: any) {
//   //     if (!tableData || !tableConfig?.columns) return [];

//   //     return tableData.map((row: any) => {
//   //       let rowData: Record<string, any> = {};

//   //       tableConfig.columns.forEach((column: any) => {
//   //         const valuePath = column?.value?.split(".");
//   //         if (!valuePath) return;

//   //         let dataPointer = row;
//   //         for (let i = 0; i < valuePath.length - 1; i++) {
//   //           if (dataPointer?.[valuePath[i]]) {
//   //             dataPointer = dataPointer[valuePath[i]];
//   //           } else {
//   //             dataPointer = null;
//   //             break;
//   //           }
//   //         }

//   //         console.log(dataPointer, "data pointer 000 ... 111 222 333 444");

//   //         let cellValue = null;
//   //         const lastKey = valuePath[valuePath.length - 1];

//   //         if (Array.isArray(dataPointer)) {
//   //           const record = dataPointer.find(
//   //             (entry) => entry.record_label === lastKey
//   //           );
//   //           cellValue = record
//   //             ? record.record_value ??
//   //               record.record_value_text ??
//   //               record.record_value_number ??
//   //               record.record_value_date
//   //             : null;
//   //         } else {
//   //           cellValue = dataPointer?.[lastKey] ?? null;
//   //         }

//   //         rowData[column.label] = cellValue;
//   //       });

//   //       return rowData;
//   //     });
//   //   }

//   // function mapTableDataToRows(tableData: any, tableConfig: any) {
//   //   if (!tableData || !tableConfig?.columns) return [];

//   //   return tableData.map((row: any) => {
//   //     let rowData: Record<string, any> = {};

//   //     tableConfig.columns.forEach((column: any) => {
//   //       const valuePath = column?.value?.split(".");
//   //       if (!valuePath) return;

//   //       let dataPointer = row;
//   //       for (let i = 0; i < valuePath.length - 1; i++) {
//   //         if (dataPointer?.[valuePath[i]]) {
//   //           dataPointer = dataPointer[valuePath[i]];
//   //         } else {
//   //           dataPointer = null;
//   //           break;
//   //         }
//   //       }

//   //       let cellValue = null;
//   //       const lastKey = valuePath[valuePath.length - 1];

//   //       if (Array.isArray(dataPointer)) {
//   //         const record = dataPointer.find(
//   //           (entry) => entry.record_label === lastKey
//   //         );
//   //         cellValue = record
//   //           ? record.record_value ??
//   //             record.record_value_text ??
//   //             record.record_value_number ??
//   //             record.record_value_date
//   //           : null;
//   //       } else {
//   //         cellValue = dataPointer?.[lastKey] ?? null;
//   //       }

//   //       // **Fix for `more_data.wildsearch` field**
//   //       if (column.value === "more_data.wildsearch") {
//   //         cellValue = row?.more_data?.wild_search ?? "";
//   //       }

//   //       rowData[column.label] = cellValue;
//   //     });

//   //     return rowData;
//   //   });
//   // }

//   // const tableRows = mapTableDataToRows(data, tableconfig);

//   function getValueByPath(obj: any, path: string | undefined) {
//     if (!path || typeof path !== "string") return null; // Ensure path is valid

//     console.log(obj, path, "path.........");

//     const keys = path.split(".");
//     let result = obj;

//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];

//       if (Array.isArray(result)) {
//         // If it's an array, find the matching record_label (last key)
//         if (i === keys.length - 1) {
//           result = result.find((entry: any) => entry.record_label === key);
//           return (
//             result?.record_value ??
//             result?.record_value_text ??
//             result?.record_value_number ??
//             result?.record_value_date ??
//             result // Fallback value
//           );
//         } else {
//           result =
//             result.find((entry: any) => entry.record_label === key) ?? {};
//         }
//       } else {
//         result = result?.[key];
//       }

//       if (result === undefined || result === null) return null;
//     }

//     return result; // Return value if it's not in an array
//   }

//   function mapTableDataToRows(tableData: any, tableConfig: any) {
//     if (!tableData || !tableConfig?.columns) return [];

//     return tableData.map((row: any) => {
//       let rowData: Record<string, any> = {};

//       tableConfig?.columns.forEach((column: any) => {
//         if (!column?.value_path || typeof column.value_path !== "string") {
//           console.warn(`Skipping column with invalid value_path:`, column);
//           return; // Skip invalid columns
//         }

//         console.log(column.value_path, "Processing column...");

//         const cellValue = getValueByPath(row, column.value_path);
//         rowData[column.label] = cellValue ?? ""; // Ensure no undefined values
//       });

//       return rowData;
//     });
//   }

//   // Generate table rows dynamically
//   const tableRows = mapTableDataToRows(data, tableconfig?.table_config);

//   console.log(tableRows, "Generated Table Rows");

//   return (
//     <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>

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
//             {tableRows.map((row: any, index: any) => (
//               <TableRow key={index}>
//                 {tableconfig?.columns?.map((col: any) => (
//                   <TableCell key={col.label}>{row[col.label] ?? ""}</TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         count={totalCount || 10}
//         page={currentPage - 1}
//         onPageChange={(_, newPage) => handleNewPage(newPage)}
//         rowsPerPage={pageSize}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }

// "use client";

// // import tableconfig from "@/public/tableconfig.json";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import * as XLSX from "xlsx";
// import {
//   Box,
//   Button,
//   CircularProgress,
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

// const DynamicTableFun2 = (config: any) => {
//   const [data, setData] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const rowsPerPage = 10;

//   console.log(data, "table data", config?.tableconfig);

//   const fetchData = async () => {
//     try {
//       const response = await fetch("/api/search", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           conditions: [
//             {
//               field: "feature_name",
//               value: "emp2",
//               search_type: "exact",
//             },
//           ],
//           combination_type: "and",
//           page: 1,
//           limit: 2,
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
//       return { data: [], total_results: 0 };
//     }
//   };

//   useEffect(() => {
//     const fetchTableData = async () => {
//       setLoading(true);
//       const res = await fetchData();
//       setData(res.data || []);
//       setTotalCount(res.total_results || 0);
//       setLoading(false);
//     };

//     fetchTableData();
//   }, [currentPage]);

//   // const getValueByPath = (obj: any, path: string): any => {
//   //   if (!path || typeof path !== "string") return null;
//   //   return path.split(".").reduce((acc, key) => acc?.[key] ?? null, obj);
//   // };

//   const getValueByPath = (obj: any, path: string): any => {
//     if (!path || typeof path !== "string") return null;

//     const keys = path.split(".");
//     let value = obj;

//     for (const key of keys) {
//       if (Array.isArray(value)) {
//         // If the current value is an array, find the object with matching record_label
//         value = value.find((item) => item.record_label === key)?.record_value ??
//                 value.find((item) => item.record_label === key)?.record_value_date ??
//                 value.find((item) => item.record_label === key)?.record_value_number ??
//                 "-";
//       } else {
//         value = value?.[key] ?? "-";
//       }
//     }
//     return value;
//   };

//   return (
//     <div className="p-4">
//       <Table>
//         <TableHead>
//           <TableRow>
//             {config?.tableconfig?.columns.map((col: any) => (
//               <TableCell
//                 key={col.key}
//                 sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {loading ? (
//             <TableRow>
//               <TableCell colSpan={config?.tableconfig?.columns.length} align="center">
//                 <CircularProgress />
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((row, index) => (
//               <TableRow key={index}>
//                 {config?.tableconfig?.columns.map((col: any) => (
//                   <TableCell key={col.key}>
//                     {getValueByPath(row, col.value_path) ?? "-"}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//       {/* <TablePagination
//         page={currentPage}
//         count={totalCount}
//         rowsPerPage={rowsPerPage}
//         onPageChange={handleNewPage}
//       /> */}
//     </div>
//   );
// };

// export default DynamicTableFun2;

"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";

const DynamicTableFun2 = (config: any) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conditions: [
            { field: "feature_name", value: "emp2", search_type: "exact" },
          ],
          combination_type: "and",
          page: 1,
          limit: 2,
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total_results: 0 };
    }
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      const res = await fetchData();
      setData(res.data || []);
      setTotalCount(res.total_results || 0);
      setLoading(false);
    };
    fetchTableData();
  }, [fetchData]);

  const getValueByPath = (obj: any, path: string): any => {
    if (!path || typeof path !== "string") return null;
    const keys = path.split(".");
    let value = obj;

    console.log(keys, "keys", value);

    for (const key of keys) {
      if (Array.isArray(value)) {
        value =
          value.find((item) => item.record_label === key)?.record_value ??
          value.find((item) => item.record_label === key)?.record_value_date ??
          value.find((item) => item.record_label === key)
            ?.record_value_number ??
          "-";
      } else {
        value = value?.[key] ?? "-";
      }
    }
    return value;
  };

  return (
    <Box p={4}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {config?.tableconfig?.columns.map((col: any) => (
                <TableCell
                  key={col.key}
                  sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={config?.tableconfig?.columns.length}
                  align="center"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {config?.tableconfig?.columns.map((col: any) => (
                    <TableCell key={col.key}>
                      {getValueByPath(row, col.value_path)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DynamicTableFun2;
