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

// "use client";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import {
//   Box,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useEffect, useState, useCallback } from "react";

// const DynamicTableFun2 = (config: any) => {
//   const [data, setData] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [search, setSearch] = useState("");
//   const [searchDepartment, setSearchDepartment] = useState("");

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await fetch("/api/search", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           conditions: [
//             { field: "feature_name", value: "emp2", search_type: "exact" },
//             {
//               field: "more_data.wild_search",
//               value: `*${
//                 search.toLowerCase().trim() +
//                 "*" +
//                 searchDepartment.toLowerCase()
//               }*`,
//               search_type: "wildcard",
//             },
//           ],
//           combination_type: "and",
//           page: 1,
//           limit: 100,
//           sort: [
//             {
//               record_id: "asc",
//             },
//           ],
//           dataset: "feature_data",
//           app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to fetch data");
//       return response.json();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       return { data: [], total_results: 0 };
//     }
//   }, []);

//   useEffect(() => {
//     const fetchTableData = async () => {
//       setLoading(true);
//       const res = await fetchData();
//       setData(res.data || []);
//       setTotalCount(res.total_results || 0);
//       setLoading(false);
//     };
//     fetchTableData();
//   }, []);

//   useEffect(() => {
//     const fetchTableData = async () => {
//       setLoading(true);
//       const res = await fetchData();
//       setData(res.data || []);
//       setTotalCount(res.total_results || 0);
//       setLoading(false);
//     };
//     fetchTableData();
//   }, [search, searchDepartment]);

//   /**
//    * Function to get the value dynamically based on value_path.
//    * It navigates through objects and arrays as defined by the path.
//    *
//    *
//    */

//   console.log(search, "search searchdepartment", searchDepartment);

//   const getValueByPath = (obj: any, path: string): any => {
//     if (!path || typeof path !== "string") return null;
//     const keys = path.split(".");
//     let value = obj;

//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];

//       if (Array.isArray(value)) {
//         // Optimize lookup by stopping at the first match
//         const foundItem = value.find((item) => item.record_label === key);
//         if (foundItem) {
//           value =
//             foundItem.record_value ??
//             foundItem.record_value_text ??
//             foundItem.record_value_date ??
//             foundItem.record_value_number;
//         } else {
//           // If no record_label match, check if key exists directly in any object
//           value = value.find((item) => item[key])?.[key];
//         }
//       } else if (typeof value === "object" && value !== null) {
//         value = value[key];
//       } else {
//         return "-"; // Default fallback if value is not found
//       }
//     }

//     return value ?? "-"; // Return the value or fallback.
//   };

//   const handleFilterChange = (key: any, value: any) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>
//       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
//         {config?.columns
//           ?.filter((col: any) => col.filterable)
//           .map((col: any) => (
//             <FormControl key={col.key} sx={{ minWidth: 200 }}>
//               <TextField
//                 label={`Search ${col.label}`}
//                 value={filters[col?.label] || ""}
//                 size="small"
//                 onChange={(e) => handleFilterChange(col.key, e.target.value)}
//               />
//             </FormControl>
//           ))}
//       </Box>
//       <FormControl sx={{ minWidth: 200 }}>
//         <TextField
//           label="Search Name"
//           value={search || ""}
//           size="small"
//           onChange={(e) => setSearch(e.target.value)}
//           variant="outlined"
//         />
//       </FormControl>
//       <FormControl sx={{ minWidth: 200 }}>
//         <InputLabel>Sort by Department</InputLabel>
//         <Select
//           size="small"
//           value={searchDepartment || ""}
//           onChange={(e) => setSearchDepartment(e.target.value)}
//           label="Sort by Department"
//         >
//           <MenuItem value="">All</MenuItem>
//           <MenuItem value="HR">HR</MenuItem>
//           <MenuItem value="IT">IT</MenuItem>
//           <MenuItem value="Finance">Finance</MenuItem>
//         </Select>
//       </FormControl>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {config?.tableconfig?.columns.map((col: any) => (
//                 <TableCell
//                   key={col.key}
//                   sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
//                 >
//                   {col.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={config?.tableconfig?.columns.length}
//                   align="center"
//                 >
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data.map((row, index) => (
//                 <TableRow key={index}>
//                   {config?.tableconfig?.columns.map((col: any) => (
//                     <TableCell key={col.key}>
//                       {getValueByPath(row, col.value_path)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default DynamicTableFun2;

"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import ExportXLSX from "./DownloadCSV";
import AddUserDialog from "./AddUserDilog";
import EditUserDialogt1 from "./AddUserDilog copy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DynamicForm from "./AddUserDilog";
import ViewMoreDilog from "./ViewMoreDilog";

const DynamicTableFun2 = (config: any) => {
  interface RowData {
    record_id: number;
    [key: string]: any; // Adjust this to match the structure of your row data
  }

  const [data, setData] = useState<RowData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "add">("edit");
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-TYPE": "search",
        },
        body: JSON.stringify({
          conditions: [
            { field: "feature_name", value: "emp2", search_type: "exact" },
            {
              field: "more_data.wild_search",
              value: `*${search
                .toLowerCase()
                .trim()}*${searchDepartment.toLowerCase()}*`,
              search_type: "wildcard",
            },
          ],
          combination_type: "and",
          page: 1,
          limit: 100,
          sort: [{ record_id: "asc" }],
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const jsonData = await response.json();
      return {
        data: jsonData.data ?? [],
        total_results: jsonData.total_results ?? 0,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total_results: 0 };
    }
  }, [search, searchDepartment]); // ✅ Added dependencies

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      const res = await fetchData();
      setData(res.data || []);
      setTotalCount(res.total_results || 0);
      setLoading(false);
    };
    fetchTableData();
  }, [fetchData]); // ✅ Ensures latest values are used

  const getValueByPath = (obj: any, path: string): any => {
    if (!path || typeof path !== "string") return null;
    const keys = path.split(".");
    let value = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (Array.isArray(value)) {
        const foundItem = value.find((item) => item.record_label === key);
        if (foundItem) {
          value =
            foundItem.record_value ??
            foundItem.record_value_text ??
            foundItem.record_value_date ??
            foundItem.record_value_number;
        } else {
          value = value.find((item) => item[key])?.[key];
        }
      } else if (typeof value === "object" && value !== null) {
        value = value[key];
      } else {
        return "-";
      }
    }

    return value ?? "-";
  };

  const handleFilterChange = (key: any, value: any) => {
    // setFilters((prev) => ({ ...prev, [key]: value }));
    setSearchDepartment(value);
  };

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    // console.log("Delete ID:", id);
  };

  const handleView = (id: number) => {
    console.log("view id", id);
    setSelectedRecordId(id);
    setViewMoreOpen(true);
  };

  const handleClose = () => {
    setIsEditOpen(false);
  };

  const handleNewUser = () => {
    setIsEditOpen(true);
    setMode("add");
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <TextField
            label="Search Name"
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)} 
            variant="outlined"
          />
        </FormControl>
        {config?.tableconfig?.columns
          ?.filter((col: any) => col.filterable)
          ?.map((col: any) => (
            <FormControl key={col.key}>
              {col.filter_type === "dropdown" ? (
                <FormControl
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 200 }}
                >
                  <InputLabel>{col.label}</InputLabel>
                  <Select
                    value={searchDepartment || ""}
                    onChange={(e) => setSearchDepartment(e.target.value)}
                    label={col.label}
                  >
                    <MenuItem value="">All</MenuItem>
                    {col.options?.map((option: any) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </FormControl>
          ))}
        <ExportXLSX
          tableData={data}
          tableConfig={config?.tableconfig}
          total_records={totalCount}
        ></ExportXLSX>
        <Button onClick={handleNewUser}>Add User</Button>
      </Box>

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
                      {col.label == "Actions" ? (
                        <Box>
                          <IconButton onClick={() => handleEditClick(row)}>
                            <EditIcon sx={{ color: "blue" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleView(row?.record_id ?? "")}
                          >
                            <VisibilityIcon sx={{ color: "blue" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row?.record_id ?? "")}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Box>
                      ) : (
                        getValueByPath(row, col.value_path)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <AddUserDialog
        open={isEditOpen}
        onClose={handleClose}
        recordId={editRow?.record_id}
        tableConfig={config?.tableconfig}
      ></AddUserDialog> */}
      {/* <EditUserDialogt1
        open={isEditOpen}
        onClose={handleClose}
        recordId={editRow?.record_id}
        tableConfig={config?.tableconfig}
      ></EditUserDialogt1> */}
      <DynamicForm
        open={isEditOpen}
        onClose={handleClose}
        mode={mode}
        recordId={editRow?.record_id}
        tableConfig={config?.tableconfig}
      />
      <ViewMoreDilog
        open={viewMoreOpen}
        onClose={() => setViewMoreOpen(false)}
        recordId={String(selectedRecordId || "")}
        tableConfig={config?.tableconfig}
      />
    </Box>
  );
};

export default DynamicTableFun2;
