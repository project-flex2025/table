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
// import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import AddUserDialog from "./AddUserDilog";
// import DownloadCSV from "./DownloadCSV";
// import EditDialog from "./EditDilog";
// import { Add, CloudDownload, CloudUpload } from "@mui/icons-material";

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
//   global_filters: GlobalFilters;
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
//       route?: string;
//     }[];
//   };
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

// const fetchData = async () => {
//   const response = await fetch("api/search", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       conditions: [
//         {
//           field: "feature_name",
//           value: "employees",
//           search_type: "exact",
//         },
//       ],
//       combination_type: "and",
//       dataset: "feature_data",
//       app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return response.json();
// };

// export default function DynamicTable12() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [config, setConfig] = useState<TableConfig | null>(null);
//   const [data, setData] = useState<TableRow[]>([]);
//   const [editRow, setEditRow] = useState<any>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState(5);
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [totalCount, setTotalCount] = useState(null);

//   useEffect(() => {
//     fetchData()
//       .then((res: any) => {
//         setData(res.data);
//         setLoading(false);
//       })
//       .catch((err: any) => {
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   useEffect(() => {
//     if (tableconfig?.table_config) {
//       setConfig(tableconfig?.table_config);
//       setPageSize(tableconfig.table_config.pagination.page_size);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [currentPage, pageSize, filters]);

//   const handleFilterChange = (key: any, value: any) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleEditClick = (row: any) => {
//     setEditRow(row);
//     setIsEditOpen(true);
//   };

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
//     setCurrentPage(newPage + 1);
//   };

//   const handleDataUpload = (uploadedData: any) => {
//     setData(uploadedData); // Update table with uploaded data
//   };

//   const handleDownload = () => {
//     console.log("handle download...");
//   };

//   return (
//     <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
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
//         {config?.columns
//           ?.filter((col: any) => col.filterable)
//           ?.map((col: any) => (
//             <FormControl key={col.key} sx={{ minWidth: 200 }}>
//               {col.filter_type === "search" ? (
//                 <TextField
//                   label={`Search ${col.label}`}
//                   value={filters[col.key] || ""}
//                   size="small"
//                   onChange={(e) => handleFilterChange(col.key, e.target.value)}
//                   variant="outlined"
//                 />
//               ) : col.filter_type === "dropdown" ? (
//                 <>
//                   <>
//                     <FormControl
//                       size="small"
//                       variant="outlined"
//                       sx={{ minWidth: 150 }}
//                     >
//                       <InputLabel>{col.label}</InputLabel>
//                       <Select
//                         value={filters[col.key] || ""}
//                         onChange={(e) =>
//                           handleFilterChange(col.key, e.target.value)
//                         }
//                         label={col.label}
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         <MenuItem value="">All</MenuItem>
//                         {col.options?.map((option: any) => (
//                           <MenuItem key={option} value={option}>
//                             {option}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     </FormControl>
//                   </>
//                 </>
//               ) : null}
//             </FormControl>
//           ))}

//         {/* Toolbar buttons from the updated JSON */}
//         {config?.toolbar?.enabled && (
//           <Box>
//             {config?.toolbar?.buttons.map((button) => (
//               <div>
//                 {button?.type == "download" && (
//                   <DownloadCSV
//                     pageSize={pageSize}
//                     tableData={data}
//                   ></DownloadCSV>
//                 )}
//               </div>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* Table Section */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {config?.columns?.map((col: any) => (
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
//             {data?.map((row: any, index: number) => {
//               // Transform feature_data.record_data into an object for easy access
//               const transformedData = row.feature_data.record_data.reduce(
//                 (acc: any, field: any) => {
//                   acc[field.record_label.toLowerCase()] =
//                     field.record_value_text;
//                   return acc;
//                 },
//                 {}
//               );

//               return (
//                 <TableRow key={index} hover sx={{ padding: 0 }}>
//                   {config?.columns?.map((col: any) => (
//                     <TableCell key={col.key} sx={{ padding: 0.2 }}>
//                       {col.key === "id" ? (
//                         row.record_id // Using record_id as the ID
//                       ) : col.key === "status" ? (
//                         row.record_status // Using record_status for status
//                       ) : col.key === "actions" ? (
//                         <Box>
//                           <IconButton onClick={() => handleEditClick(row)}>
//                             <EditIcon sx={{ color: "blue" }} />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleDelete(row.record_id)}
//                           >
//                             <DeleteIcon sx={{ color: "red" }} />
//                           </IconButton>
//                         </Box>
//                       ) : (
//                         transformedData[col.key] || "" // Fetching values from transformed data
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <TablePagination
//         component="div"
//         count={totalCount || 10}
//         page={currentPage - 1}
//         onPageChange={(_, newPage) => handleNewPage(newPage)}
//         rowsPerPage={pageSize}
//       />
//       <EditDialog
//         open={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         rowData={editRow}
//         onSave={(updatedRow) => {
//           setData((prevData) =>
//             prevData.map((row) =>
//               row.id === updatedRow.id ? { ...row, ...updatedRow } : row
//             )
//           );
//         }}
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

export default function DynamicTable12(tableconfig: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [config, setConfig] = useState<TableConfig | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(
    tableconfig?.tableconfig?.pagination?.page_size || 10
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [totalCount, setTotalCount] = useState(null);

  console.log(data, "data");

  console.log(tableconfig?.tableconfig?.downloadRange, "tableconfig...");

  const fetchData = async () => {
    const response = await fetch("api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conditions: [
          {
            field: "feature_name",
            value: "employees",
            search_type: "exact",
          },
          ...Object.entries(filters).map(([key, value]) => ({
            field: "feature_data.record_data.record_value_text",
            value,
            search_type: "exact",
          })),
        ],
        combination_type: "and",
        page: currentPage,
        limit: pageSize,
        dataset: "feature_data",
        app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const res = await fetchData();
        console.log(res, "api response for empty useEffect..");

        setData(res.data);
        setTotalCount(res?.total_results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchTableData();
    if (tableconfig?.table_config) {
      setConfig(tableconfig?.table_config);
    }
  }, []);

  // useEffect(() => {
  //   if (tableconfig?.table_config) {
  //     setConfig(tableconfig?.table_config);
  //   }
  // }, []);

  useEffect(() => {
    fetchData()
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [currentPage, pageSize, filters]);

  if (loading) return <p>Loading...</p>;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Delete ID:", id);
  };

  const handleAddUser = (newUser: TableRow) => {
    setData((prevData) => [
      ...prevData,
      { ...newUser, id: prevData.length + 1 },
    ]);
  };

  const handleNewPage = (newPage: number) => {
    console.log(newPage, "new page...");
    setCurrentPage(newPage + 1);
  };

  return (
    <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {tableconfig?.tableconfig?.columns
          ?.filter((col:any) => col.filterable)
          ?.map((col:any) => (
            <FormControl key={col.key} sx={{ minWidth: 200 }}>
              {col.filter_type === "search" ? (
                <TextField
                  label={`Search ${col.label}`}
                  value={filters[col.key] || ""}
                  size="small"
                  onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  variant="outlined"
                />
              ) : col.filter_type === "dropdown" ? (
                <FormControl
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 150 }}
                >
                  <InputLabel>{col.label}</InputLabel>
                  <Select
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(col.key, e.target.value)
                    }
                    label={col.label}
                  >
                    <MenuItem value="">All</MenuItem>
                    {col.options?.map((option:any) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </FormControl>
          ))}

        <DownloadCSV
          pageSize={pageSize}
          tableData={data}
          downloadrange={tableconfig?.tableconfig?.downloadRange}
          totalRecords={totalCount}
        ></DownloadCSV>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableconfig?.tableconfig?.columns?.map((col: any) => (
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
            {data?.map((row: any, index: number) => {
              // Transform feature_data.record_data into an object for easy access
              const transformedData = row.feature_data.record_data.reduce(
                (acc: any, field: any) => {
                  acc[field.record_label.toLowerCase()] =
                    field.record_value_text;
                  return acc;
                },
                {}
              );

              return (
                <TableRow key={index} hover sx={{ padding: 0 }}>
                  {tableconfig?.tableconfig?.columns?.map((col: any) => (
                    <TableCell key={col.key} sx={{ padding: 0.2 }}>
                      {col.key === "record_id" ? (
                        row?.record_id // Using record_id as the ID
                      ) : col.key === "status" ? (
                        row.record_status // Using record_status for status
                      ) : col.key == "record_status" ? (
                        row.record_status
                      ) : col.key === "actions" ? (
                        <Box>
                          <IconButton onClick={() => handleEditClick(row)}>
                            <EditIcon sx={{ color: "blue" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.record_id)}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Box>
                      ) : (
                        transformedData[col.key] || "" // Fetching values from transformed data
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount || 10}
        page={currentPage - 1}
        onPageChange={(_, newPage) => handleNewPage(newPage)}
        rowsPerPage={pageSize}
      />
    </Paper>
  );
}
