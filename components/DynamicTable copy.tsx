"use client";
// import tableconfig from "@/public/tableconfig.json";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
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
// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import AddUserDialog from "./AddUserDilog";
// import DownloadCSV from "./DownloadCSV";
// import EditDialog from "./EditDilog";

// interface TableColumn {
//   key: string;
//   label: string;
//   type: string;
//   sortable: boolean;
//   filterable: boolean;
//   filter_type?: string;
//   options?: string[];
//   actions?: { name: string; type: string; icon: string; route: string }[];
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
//   sorting: Sorting;
//   global_filters: GlobalFilters;
// }

// interface Sorting {
//   default_column: string;
//   default_order: "asc" | "desc";
// }

// interface GlobalFilters {
//   date_range?: {
//     label: string;
//     type: string;
//     start_date?: string;
//     end_date?: string;
//   };
//   search?: { label: string; type: string; placeholder: string };
// }

// interface TableRow {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   status: string;
//   created_at: string;
//   actions?: {
//     edit: boolean;
//     delete: boolean;
//   };
// }

// export default function DynamicTable1() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [config, setConfig] = useState<any | null>(null);
//   const [data, setData] = useState<TableRow[]>([]);
//   const [editRow, setEditRow] = useState<any>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState(5);
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [totalcount, setTotalCount] = useState(null);

//   // Fetch data with filters, pagination, and search
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // Construct query parameters
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: pageSize.toString(),
//         ...Object.fromEntries(
//           Object.entries(filters).filter(([_, value]) => value !== "")
//         ), // Exclude empty filters
//       });

//       const res = await fetch(`/api/table?${queryParams.toString()}`);

//       if (!res.ok) throw new Error(`Error: ${res.status}`);

//       const result = await res.json();
//       setTableData(result.data || []);
//       setTotalCount(result.totalRecords);
//     } catch (error) {
//       console.error("Error fetching table data:", error);
//     }
//     setLoading(false);
//   };

//   class Snowflake {
//     machineId: number;
//     lastTimestamp: number;
//     sequence: number;

//     constructor() {
//       this.machineId = Math.floor(Math.random() * 1000); // Random machine ID (0-999)
//       this.lastTimestamp = -1;
//       this.sequence = Math.floor(Math.random() * 4096) & 0xfff; // 12-bit sequence (0-4095)
//     }

//     generate(): string {
//       const timestampMs = Date.now(); // Milliseconds
//       const microseconds = Math.floor((performance.now() % 1000) * 1000); // Microseconds (0-999999)
//       let timestamp = timestampMs * 1000 + Math.floor(microseconds / 1000); // Convert to microseconds

//       if (timestamp === this.lastTimestamp) {
//         this.sequence = (this.sequence + 1) & 0xfff; // 12-bit sequence (0-4095)

//         if (this.sequence === 0) {
//           // Sleep for next millisecond to avoid duplicate timestamps
//           Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
//           return this.generate();
//         }
//       } else {
//         this.sequence = Math.floor(Math.random() * 4096) & 0xfff; // New random sequence
//       }

//       this.lastTimestamp = timestamp;

//       return `${timestamp}${this.machineId
//         .toString()
//         .padStart(3, "0")}${this.sequence.toString().padStart(4, "0")}`;
//     }
//   }

//   // Function to update array with new Snowflake IDs
//   function updateArrayWithSnowflakeIds(dataArray: any) {
//     const snowflake = new Snowflake();
//     return dataArray.map((item: any) => ({
//       ...item,
//       id: snowflake.generate(), // Assign new Snowflake ID
//     }));
//   }

//   // Fetch table data from public/tabledata.json on component mount
//   useEffect(() => {
//     fetchData();
//     setPageSize(config?.pagination?.page_size ?? 5);
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       return alert("Invalid file type! Please upload a CSV or Excel file.");
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       console.log(result?.failedRecords, "Failed Records", result);

//       setLoading(false);

//       if (result.success) {
//         setData(result.data);
//         fetchData();

//         // If there are failed records, download them as CSV
//         if (result.failedRecords.length > 0) {
//           downloadFailedRecords(result.failedRecords);
//         }
//       } else {
//         alert("Upload failed!");
//       }
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert("Error uploading file.");
//       setLoading(false);
//     }
//   };

//   // Function to download failed records as a CSV file
//   const downloadFailedRecords = (failedRecords: any[]) => {
//     const worksheet = XLSX.utils.json_to_sheet(failedRecords);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Records");

//     // Convert workbook to a Blob and create a download link
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "failed_records.xlsx";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleSort = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   var sortedData = [...tableData].sort((a: any, b: any) => {
//     return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Fetch data on page load & when dependencies change
//   useEffect(() => {
//     fetchData();
//   }, [pageSize, search, filters]);

//   useEffect(() => {
//     if (tableconfig?.table_config) {
//       setConfig({
//         ...tableconfig.table_config,
//         sorting: {
//           ...tableconfig.table_config.sorting,
//           default_order: sortOrder,
//         },
//         global_filters: {
//           ...tableconfig.table_config.global_filters,
//           date_range: {
//             ...tableconfig.table_config.global_filters?.date_range,
//             start_date:
//               tableconfig.table_config.global_filters?.date_range?.start_date ??
//               undefined,
//             end_date:
//               tableconfig.table_config.global_filters?.date_range?.end_date ??
//               undefined,
//           },
//         },
//       });
//     }
//   }, []);

//   if (tableData.length === 0) return <Typography>Loading...</Typography>;

//   const handleFilterChange = (key: any, value: any) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const filteredData =
//     data?.filter((row: any) => {
//       return config.columns?.every((col: any) => {
//         if (!col.filterable || !filters[col.key]) return true;
//         if (col.filter_type === "search") {
//           return row[col.key]
//             ?.toLowerCase()
//             .includes(filters[col.key]?.toLowerCase());
//         }
//         if (col.filter_type === "dropdown") {
//           return row[col.key] === filters[col.key];
//         }
//         return true;
//       });
//     }) || [];

//   const handleEditClick = (row: any) => {
//     setEditRow(row);
//     setIsEditOpen(true);
//   };

//   const handleSaveEdit = (updatedRow: TableRow) => {
//     setData((prevData) =>
//       prevData.map((row) =>
//         row.id === updatedRow.id ? { ...row, ...updatedRow } : row
//       )
//     );
//   };

//   // Handle Delete
//   const handleDelete = (id: number) => {
//     console.log(id, "id......");
//   };

//   const handleAddUser = (newUser: TableRow) => {
//     setData((prevData) => [
//       ...prevData,
//       { ...newUser, id: prevData.length + 1 },
//     ]);
//   };

//   const handleNewPage = (newPage: any) => {
//     console.log(newPage);

//     setCurrentPage(newPage + 1);
//   };

//   const handleDataUpload = (uploadedData: any) => {
//     console.log(uploadedData, "upload dataata");

//     setData(uploadedData); // Update table with uploaded data
//   };

//   return (
//     <Paper sx={{ padding: 3, boxShadow: 3 }}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 2,
//           mb: 2,
//         }}
//       >
//         {config.columns
//           ?.filter((col: any) => col.filterable)
//           ?.map((col: any) => (
//             <FormControl key={col.key} sx={{ minWidth: 200 }}>
//               {col.filter_type === "search" ? (
//                 <TextField
//                   label={`Search ${col.label}`}
//                   value={filters[col.key] || ""}
//                   onChange={(e) => handleFilterChange(col.key, e.target.value)}
//                   variant="outlined"
//                 />
//               ) : col.filter_type === "dropdown" ? (
//                 <>
//                   <InputLabel>{col.label}</InputLabel>
//                   <Select
//                     value={filters[col.key] || ""}
//                     onChange={(e) =>
//                       handleFilterChange(col.key, e.target.value)
//                     }
//                     label={` ${col.label}`}
//                     variant="outlined"
//                   >
//                     <MenuItem value="">All</MenuItem>
//                     {col.options?.map((option: any) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </>
//               ) : null}
//             </FormControl>
//           ))}
//         <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>
//           Add User
//         </Button>
//         <DownloadCSV
//           pageSize={pageSize}
//           search={search}
//           tableData={tableData}
//         ></DownloadCSV>
//         {/* <UploadFile onDataUpload={handleDataUpload} /> */}

//         <Button variant="outlined" component="label">
//           Upload CSV
//           <input type="file" hidden accept=".csv" onChange={handleUpload} />
//         </Button>
//       </Box>

//       {/* Table Section */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {config.columns?.map((col: any) => (
//                 <TableCell
//                   key={col.key}
//                   sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
//                 >
//                   {col.label}
//                   {col.key === "id" && (
//                     <IconButton size="small" onClick={handleSort}>
//                       {sortOrder === "asc" ? (
//                         <ArrowUpwardIcon />
//                       ) : (
//                         <ArrowDownwardIcon />
//                       )}
//                     </IconButton>
//                   )}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tableData?.map((row: any, index: number) => (
//               <TableRow key={index} hover sx={{ padding: 0 }}>
//                 {config.columns?.map((col: any) => (
//                   <TableCell key={col.key} sx={{ padding: 0.5 }}>
//                     {col.type === "date" ? (
//                       format(new Date(row[col.key]), "yyyy-MM-dd") || ""
//                     ) : col.type === "actions" ? (
//                       <Box>
//                         <IconButton onClick={() => handleEditClick(row)}>
//                           <EditIcon sx={{ color: "blue" }} />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(row.id)}>
//                           <DeleteIcon sx={{ color: "red" }} />
//                         </IconButton>
//                       </Box>
//                     ) : (
//                       row[col.key]
//                     )}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <TablePagination
//         component="div"
//         count={totalcount || 10}
//         page={currentPage - 1}
//         onPageChange={(_, newPage) => handleNewPage(newPage)}
//         rowsPerPage={pageSize}
//       />
//       <EditDialog
//         open={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         rowData={editRow}
//         onSave={handleSaveEdit}
//       />
//       <AddUserDialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         onAddUser={handleAddUser}
//       />
//     </Paper>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  CloudDownload,
  CloudUpload,
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

interface ColumnConfig {
  key: string;
  label: string;
  type: string;
  sortable?: boolean;
  filterable?: boolean;
  filter_type?: string;
  options?: string[];
  actions?: { name: string; type: string; icon: string; route: string }[];
}

interface TableConfig {
  table_name: string;
  api?: {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
  };
  columns: ColumnConfig[];
  pagination?: { enabled?: boolean; page_size: number; current_page: number };
  sorting?: {
    enabled?: boolean;
    default_column?: string;
    default_order?: "asc" | "desc";
  };
  global_filters?: {
    search?: { enabled?: boolean; placeholder?: string };
  };
  toolbar?: {
    enabled?: boolean;
    buttons?: {
      name: string;
      type: string;
      icon: string;
      action: string;
      route?: string;
    }[];
  };
}

const DynamicTable = ({ tableConfig }: { tableConfig: TableConfig }) => {
  // States
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    tableConfig.pagination?.current_page ?? 1
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    tableConfig.pagination?.page_size ?? 10
  );
  const [orderBy, setOrderBy] = useState<string>(
    tableConfig.sorting?.default_column ?? ""
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    tableConfig.sorting?.default_order ?? "asc"
  );
  const [filters, setFilters] = useState<Record<string, string | null>>({});

  // Fetch data from API with filters, pagination, and sorting
  const fetchData = async () => {
    if (!tableConfig.api?.endpoint) return;

    setLoading(true);
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        sort_by: orderBy,
        order: order,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ), // Exclude empty filters
      });

      const res = await fetch(
        `${tableConfig.api.endpoint}?${queryParams.toString()}`,
        {
          method: tableConfig.api.method ?? "GET",
          headers: tableConfig.api.headers ?? {},
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    setLoading(false);
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, orderBy, order, filters]);

  console.log(data, "data...");

  // Sorting handler
  const handleSort = (column: string) => {
    if (!tableConfig.sorting?.enabled) return;
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  // Pagination handlers
  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter change handler
  const handleFilterChange = (column: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    setPage(0); // Reset to first page on filter change
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Toolbar */}
      {tableConfig.toolbar?.enabled && (
        <Toolbar>
          {tableConfig.toolbar.buttons?.map((button) => (
            <Button
              key={button.name}
              startIcon={
                button.type === "download" ? (
                  <CloudDownload />
                ) : button.type === "upload" ? (
                  <CloudUpload />
                ) : (
                  <Add />
                )
              }
              onClick={() => alert(button.action)}
            >
              {button.name}
            </Button>
          ))}
        </Toolbar>
      )}

      {/* Filters */}
      {tableConfig.global_filters?.search?.enabled && (
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{ m: 1 }}
          placeholder={tableConfig.global_filters.search.placeholder}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      )}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableConfig.columns.map((column) => (
                <TableCell key={column.key}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={order}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={tableConfig.columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {tableConfig.columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.type === "actions" && column.actions
                        ? column.actions.map((action) => (
                            <IconButton
                              key={action.name}
                              onClick={() => alert(action.route)}
                            >
                              {action.type === "edit" ? <Edit /> : <Delete />}
                            </IconButton>
                          ))
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {tableConfig.pagination?.enabled && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </Paper>
  );
};

export default DynamicTable;
