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

export default function DynamicTable12({ tableconfig, config1 }: any) {
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
  const [search, setSearch] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");

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
            value: "emp2",
            search_type: "exact",
          },
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

  const fetchData1 = async (search: any, searchDepartment: any) => {
    const response = await fetch("api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conditions: [
          { field: "feature_name", value: "emp", search_type: "exact" },
          {
            field: "more_data.wild_search",
            value: `*${
              search.toLowerCase() + "*" + searchDepartment.toLowerCase()
            }*`,
            search_type: "wildcard",
          },
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
    fetchData1(search, searchDepartment)
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData1(search, searchDepartment)
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [search, searchDepartment]);

  useEffect(() => {
    // fun();
    data?.map((row: any, index: number) => (
      <TableRow key={index} hover sx={{ padding: 0 }}>
        {tableconfig?.columns?.map((col: any) => {
          console.log(row`${col?.value}`, "fun function");
        })}
      </TableRow>
    ));
  }, []);

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
    console.log(newPage, "new page");

    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (e: any) => {
    setPageSize(e.target.value);
  };

  // const fun = () => {
  //   {
  //     data?.map((row: any, index: number) => (
  //       <TableRow key={index} hover sx={{ padding: 0 }}>
  //         {tableconfig?.columns?.map((col: any) => {
  //           console.log(row`${col?.value}`, "fun function");
  //         })}
  //       </TableRow>
  //     ));
  //   }
  // };
  // useEffect(() => {
  //   // fun();
  //   data?.map((row: any, index: number) => (
  //     <TableRow key={index} hover sx={{ padding: 0 }}>
  //       {tableconfig?.columns?.map((col: any) => {
  //         console.log(row`${col?.value}`, "fun function");
  //       })}
  //     </TableRow>
  //   ));
  // }, []);

  console.log(data, config1, tableconfig?.columns, "data and config1");

  return (
    <Paper sx={{ padding: "8px 4px 0px 12px", boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {/* {tableconfig?.columns
          ?.filter((col: any) => col.filterable)
          ?.map((col: any) => (
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
                    {col.options?.map((option: any) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </FormControl>
          ))} */}
        <FormControl sx={{ minWidth: 200 }}>
          <TextField
            label="Search Name"
            value={search || ""}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by Department</InputLabel>
          <Select
            size="small"
            value={searchDepartment || ""}
            onChange={(e) => setSearchDepartment(e.target.value)}
            label="Sort by Department"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </Select>
        </FormControl>

        {/* <DownloadCSV
          pageSize={pageSize}
          tableData={data}
          downloadrange={tableconfig?.tableconfig?.downloadRange}
          totalRecords={totalCount}
        ></DownloadCSV> */}
        <ExportXLSX
          tableData={data}
          tableConfig={tableconfig}
          total_records={totalCount}
        ></ExportXLSX>
      </Box>

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
            {data?.map((row: any, index: number) => (
              <TableRow key={index} hover sx={{ padding: 0 }}>
                {tableconfig?.columns?.map((col: any) => {
                  let cellValue = "";

                  const recordData1 = row`${col?.value}`;

                  console.log(recordData1, "recorddata1");

                  if (col?.value?.startsWith("feature_data.record_data")) {
                    const recordData = row?.feature_data?.record_data?.find(
                      (item: any) => item.record_label === col.label
                    );

                    if (recordData) {
                      cellValue =
                        recordData.record_value ??
                        recordData.record_value_date ??
                        recordData.record_value_number ??
                        "";
                    }
                  } else if (col?.value?.startsWith("more_data")) {
                    cellValue = row?.more_data?.wild_search;
                  } else {
                    cellValue = row?.[col.value] ?? "";
                  }

                  return (
                    <TableCell key={col.label} sx={{ padding: 0.2 }}>
                      {cellValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount || 10}
        page={currentPage - 1}
        onPageChange={(_, newPage) => handleNewPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
