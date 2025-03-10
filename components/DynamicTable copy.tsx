"use client";
import tableconfig from "@/public/tableconfig.json";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { format } from "date-fns";
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
  actions?: { name: string; type: string; icon: string; route: string }[];
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
  sorting: Sorting;
  global_filters: GlobalFilters;
}

interface Sorting {
  default_column: string;
  default_order: "asc" | "desc";
}

interface GlobalFilters {
  date_range?: {
    label: string;
    type: string;
    start_date?: string;
    end_date?: string;
  };
  search?: { label: string; type: string; placeholder: string };
}

interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  actions?: {
    edit: boolean;
    delete: boolean;
  };
}

export default function DynamicTable1() {
  const [currentPage, setCurrentPage] = useState(1);
  const [config, setConfig] = useState<any | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalcount, setTotalCount] = useState(null);
  const [pageSelection, setPageSelection] = useState("current");

  console.log(config?.columns, "config...", tableData);

  console.log(filters, "filters");

  const fetchData = async () => {
    setLoading(true);
    try {
      // const res = await fetch(
      //   `/api/table?page=${currentPage}&limit=${pageSize}&search=${
      //     filters?.name || ""
      //   }&role=${filters?.role || ""}&status=${filters?.status || ""}`
      // );

      const res = await fetch(
        `/api/table?page=${currentPage}&limit=${pageSize}&search=${
          filters?.name || ""
        }`
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const result = await res.json();

      console.log(result, "res....0000");

      setTableData(result.data || []);
      setTotalCount(result.totalRecords);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    setLoading(false);
  };

  console.log(tableData, "tabledata...");

  // useEffect(() => {
  //   if (tableconfig?.table_config) {
  //     setConfig({
  //       ...tableconfig.table_config,
  //       sorting: {
  //         ...tableconfig.table_config.sorting,
  //         default_order: tableconfig.table_config.sorting.default_order as
  //           | "asc"
  //           | "desc", // Explicitly cast
  //       },
  //       global_filters: {
  //         ...tableconfig.table_config.global_filters,
  //         date_range: {
  //           ...tableconfig.table_config.global_filters?.date_range,
  //           start_date:
  //             tableconfig.table_config.global_filters?.date_range?.start_date ??
  //             undefined,
  //           end_date:
  //             tableconfig.table_config.global_filters?.date_range?.end_date ??
  //             undefined,
  //         },
  //       },
  //     });
  //   }
  // if (tabledata) {
  //   setData(tabledata);
  // }
  // }, []);

  class Snowflake {
    machineId: number;
    lastTimestamp: number;
    sequence: number;

    constructor() {
      this.machineId = Math.floor(Math.random() * 1000); // Random machine ID (0-999)
      this.lastTimestamp = -1;
      this.sequence = Math.floor(Math.random() * 4096) & 0xfff; // 12-bit sequence (0-4095)
    }

    generate(): string {
      const timestampMs = Date.now(); // Milliseconds
      const microseconds = Math.floor((performance.now() % 1000) * 1000); // Microseconds (0-999999)
      let timestamp = timestampMs * 1000 + Math.floor(microseconds / 1000); // Convert to microseconds

      if (timestamp === this.lastTimestamp) {
        this.sequence = (this.sequence + 1) & 0xfff; // 12-bit sequence (0-4095)

        if (this.sequence === 0) {
          // Sleep for next millisecond to avoid duplicate timestamps
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
          return this.generate();
        }
      } else {
        this.sequence = Math.floor(Math.random() * 4096) & 0xfff; // New random sequence
      }

      this.lastTimestamp = timestamp;

      return `${timestamp}${this.machineId
        .toString()
        .padStart(3, "0")}${this.sequence.toString().padStart(4, "0")}`;
    }
  }

  // Function to update array with new Snowflake IDs
  function updateArrayWithSnowflakeIds(dataArray: any) {
    const snowflake = new Snowflake();
    return dataArray.map((item: any) => ({
      ...item,
      id: snowflake.generate(), // Assign new Snowflake ID
    }));
  }

  // Fetch table data from public/tabledata.json on component mount
  useEffect(() => {
    fetchData();
    setPageSize(config?.pagination?.page_size ?? 5);
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let newData = [];

        if (file.name.endsWith(".json")) {
          newData = JSON.parse(e.target?.result as string);
        } else if (file.name.endsWith(".csv")) {
          newData = csvToJson(e.target?.result as string);
        } else {
          alert("Unsupported file type. Upload JSON or CSV.");
          return;
        }

        var updatedData = updateArrayWithSnowflakeIds(newData);

        if (!Array.isArray(newData)) {
          alert("Invalid format. Expected an array.");
          return;
        }

        updatedData = [...data, ...newData];
        setData(updatedData); // ✅ Update UI immediately
        await fetch("/api/update-tabledata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        alert("Data uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Ensure the file is a valid JSON or CSV.");
      }
    };

    reader.readAsText(file);
  };

  // Convert CSV to JSON
  const csvToJson = (csv: string): any[] => {
    const lines = csv.split("\n").map((line) => line.trim());
    const headers = lines[0].split(",");

    return lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() || "";
        return obj;
      }, {} as Record<string, string>);
    });
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  var sortedData = [...tableData].sort((a: any, b: any) => {
    return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data on page load & when dependencies change
  useEffect(() => {
    fetchData();
  }, [pageSize, search, filters]);

  useEffect(() => {
    if (tableconfig?.table_config) {
      setConfig({
        ...tableconfig.table_config,
        sorting: {
          ...tableconfig.table_config.sorting,
          default_order: sortOrder,
        },
        global_filters: {
          ...tableconfig.table_config.global_filters,
          date_range: {
            ...tableconfig.table_config.global_filters?.date_range,
            start_date:
              tableconfig.table_config.global_filters?.date_range?.start_date ??
              undefined,
            end_date:
              tableconfig.table_config.global_filters?.date_range?.end_date ??
              undefined,
          },
        },
      });
    }
  }, []);

  if (tableData.length === 0) return <Typography>Loading...</Typography>;

  const handleFilterChange = (key: any, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData =
    data?.filter((row: any) => {
      return config.columns?.every((col: any) => {
        if (!col.filterable || !filters[col.key]) return true;
        if (col.filter_type === "search") {
          return row[col.key]
            ?.toLowerCase()
            .includes(filters[col.key]?.toLowerCase());
        }
        if (col.filter_type === "dropdown") {
          return row[col.key] === filters[col.key];
        }
        return true;
      });
    }) || [];

  // const itemsPerPage = config?.pagination?.page_size ?? 10;
  // const displayedData = sortedData.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (updatedRow: TableRow) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      )
    );
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  const handleAddUser = (newUser: TableRow) => {
    setData((prevData) => [
      ...prevData,
      { ...newUser, id: prevData.length + 1 },
    ]);
  };

  const handleNewPage = (newPage: any) => {
    console.log(newPage);

    setCurrentPage(newPage + 1);
  };

  const handleDataUpload = (uploadedData: any) => {
    console.log(uploadedData, "upload dataata");

    setData(uploadedData); // Update table with uploaded data
  };

  return (
    <Paper sx={{ padding: 3, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        {config.columns
          ?.filter((col: any) => col.filterable)
          ?.map((col: any) => (
            <FormControl key={col.key} sx={{ minWidth: 200 }}>
              {col.filter_type === "search" ? (
                <TextField
                  label={`Search ${col.label}`}
                  value={filters[col.key] || ""}
                  onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  variant="outlined"
                />
              ) : col.filter_type === "dropdown" ? (
                <>
                  <InputLabel>{col.label}</InputLabel>
                  <Select
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(col.key, e.target.value)
                    }
                    label={` ${col.label}`}
                    variant="outlined"
                  >
                    <MenuItem value="">All</MenuItem>
                    {col.options?.map((option: any) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : null}
            </FormControl>
          ))}
        <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>
          Add User
        </Button>
        <Select
          size="small"
          value={pageSelection}
          onChange={(e) => setPageSelection(e.target.value)}
          label="Select Page"
        >
          <MenuItem value="current">Current Page</MenuItem>
          <MenuItem value="all">All Pages</MenuItem>
        </Select>
        <DownloadCSV
          pageSize={pageSize}
          search={search}
          pageStatus={pageSelection}
          tableData={tableData}
        ></DownloadCSV>
        {/* <UploadFile onDataUpload={handleDataUpload} /> */}
        {/* 
        <Button variant="outlined" component="label">
          Upload CSV
          <input type="file" hidden accept=".csv" onChange={handleUpload} />
        </Button> */}
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {config.columns?.map((col: any) => (
                <TableCell
                  key={col.key}
                  sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                >
                  {col.label}
                  {col.key === "id" && (
                    <IconButton size="small" onClick={handleSort}>
                      {sortOrder === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )}
                    </IconButton>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData?.map((row: any, index: number) => (
              <TableRow key={index} hover sx={{ padding: 0 }}>
                {config.columns?.map((col: any) => (
                  <TableCell key={col.key} sx={{ padding: 0.5 }}>
                    {col.type === "date" ? (
                      format(new Date(row[col.key]), "yyyy-MM-dd") || ""
                    ) : col.type === "actions" ? (
                      <Box>
                        <IconButton onClick={() => handleEditClick(row)}>
                          <EditIcon sx={{ color: "blue" }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.id)}>
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Box>
                    ) : (
                      row[col.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalcount || 10}
        page={currentPage - 1}
        onPageChange={(_, newPage) => handleNewPage(newPage)}
        rowsPerPage={pageSize}
      />
      <EditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        rowData={editRow}
        onSave={handleSaveEdit}
      />
      <AddUserDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddUser={handleAddUser}
      />
    </Paper>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   TablePagination,
//   Paper,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Button,
//   Typography,
//   Box,
//   IconButton,
// } from "@mui/material";
// import { format } from "date-fns";
// import tableconfig from "@/public/tableconfig.json";
// import tabledata from "@/public/tabledata.json";
// import EditDialog from "./EditDilog";
// import AddUserDialog from "./AddUserDilog";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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

// export default function DynamicTable() {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [config, setConfig] = useState<TableConfig | null>(null);
//   const [data, setData] = useState<TableRow[]>([]);
//   const [editRow, setEditRow] = useState<any>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   const handleSort = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   const sortedData = [...data].sort((a, b) => {
//     return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
//   });

//   useEffect(() => {
//     if (tableconfig?.table_config) {
//       setConfig({
//         ...tableconfig.table_config,
//         sorting: {
//           ...tableconfig.table_config.sorting,
//           default_order: tableconfig.table_config.sorting.default_order as
//             | "asc"
//             | "desc",
//         },
//       });
//     }
//     if (tabledata) {
//       setData(tabledata);
//     }
//   }, []);

//   if (!config || !config.columns || data.length === 0)
//     return <Typography>Loading...</Typography>;

//   return (
//     <Paper sx={{ padding: 3, boxShadow: 3 }}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {config.columns?.map((col) => (
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
//             {sortedData.map((row, index) => (
//               <TableRow key={index} hover>
//                 {config.columns?.map((col) => (
//                   <TableCell key={col.key}>
//                     {col.type === "date"
//                       ? format(new Date(row[col.key]), "yyyy-MM-dd")
//                       : row[col.key]}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }
