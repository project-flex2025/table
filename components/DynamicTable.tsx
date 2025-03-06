"use client";
// import { useState, useEffect } from "react";
// import tableconfig from "@/public/tableconfig.json";
// import tabledata from "@/public/tabledata.json";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";

// export default function DynamicTable() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [config, setConfig] = useState<{
//     pagination: { itemsPerPage: number };
//     columns: { field: string; label: string }[];
//   } | null>(null);
//   const [data, setData] = useState<
//     { id: number; name: string; email: string }[]
//   >([]);

//   useEffect(() => {
//     setConfig(tableconfig);
//     setData(tabledata);
//   }, []);

//   if (!config || data.length === 0) return <p>Loading...</p>;

//   const itemsPerPage = config.pagination.itemsPerPage;
//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const displayedData = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-4">
//       <Table>
//         <TableHead>
//           <TableRow>
//             {config.columns.map((col) => (
//               <TableCell key={col.field} className="font-bold">
//                 {col.label}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {displayedData.map((row, index) => (
//             <TableRow key={index}>
//               {config.columns.map((col) => (
//                 <TableCell key={col.field}>{row[col.field as keyof typeof row]}</TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <div className="flex justify-between mt-4">
//         <Button
//           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <Button
//           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import tableconfig from "@/public/tableconfig.json";
import tabledata from "@/public/tabledata.json";
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

interface TableConfig {
  table_name: string;
  columns: TableColumn[];
  pagination: Pagination;
  sorting: Sorting;
  global_filters?: GlobalFilters;
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

export default function DynamicTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [config, setConfig] = useState<TableConfig | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  console.log(data, "data...");

  useEffect(() => {
    if (tableconfig?.table_config) {
      setConfig({
        ...tableconfig.table_config,
        sorting: {
          ...tableconfig.table_config.sorting,
          default_order: tableconfig.table_config.sorting.default_order as
            | "asc"
            | "desc", // Explicitly cast
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
    if (tabledata) {
      setData(tabledata);
    }
  }, []);

  if (!config || !config.columns || data.length === 0)
    return <Typography>Loading...</Typography>;

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

  // const sortedData = [...filteredData].sort((a, b) => {
  //   const column = config?.sorting?.default_column || "id";
  //   const order = config?.sorting?.default_order === "asc" ? 1 : -1;

  //   return String(a[column as keyof TableRow]) >
  //     String(b[column as keyof TableRow])
  //     ? order
  //     : -order;
  // });

  const sortedData = [...filteredData].sort((a, b) => {
    const column = config?.sorting?.default_column || "id";
    const order = config?.sorting?.default_order === "asc" ? 1 : -1;

    // Ensure numeric sorting for `id`
    if (column === "id") {
      return (a.id - b.id) * order;
    }

    return (
      String(a[column as keyof TableRow]).localeCompare(
        String(b[column as keyof TableRow])
      ) * order
    );
  });

  const itemsPerPage = config?.pagination?.page_size ?? 10;
  const displayedData = sortedData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  console.log(displayedData, "displaydata after function");

  const handleActions = (data: any) => {
    return (
      <Box>
        <EditIcon sx={{ color: "blue", cursor: "pointer" }} />
        <DeleteIcon sx={{ color: "red", ml: 1, cursor: "pointer" }} />
      </Box>
    );
  };

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  // const handleSaveEdit = (updatedData: any) => {
  //   setData((prevData) =>
  //     prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
  //   );
  // };

  const handleSaveEdit = (updatedData: any) => {
    setData((prevData) => {
      const updatedList = prevData.map((row) =>
        row.id === updatedData.id ? updatedData : row
      );

      // Preserve original order by always sorting by `id`
      return updatedList.sort((a, b) => a.id - b.id);
    });
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((row) => row.id !== id));
  };

  return (
    <Paper sx={{ padding: 3, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {config?.table_name ?? "Table"}
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {config.columns
          ?.filter((col) => col.filterable)
          ?.map((col) => (
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
                    {col.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : null}
            </FormControl>
          ))}
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {config.columns?.map((col) => (
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
            {displayedData.map((row: any, index) => (
              <TableRow key={index} hover>
                {config.columns?.map((col) => (
                  <TableCell key={col.key}>
                    {col.type === "date" ? (
                      format(new Date(row[col.key]), "yyyy-MM-dd")
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
        count={sortedData.length}
        page={currentPage}
        onPageChange={(_, newPage) => setCurrentPage(newPage)}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[itemsPerPage]}
      />
      <EditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        rowData={editRow}
        onSave={handleSaveEdit}
      />
    </Paper>
  );
}
