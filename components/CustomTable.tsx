import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Box, Button } from "@mui/material";
import AlertDialog from "./Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f1f4f9",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CustomTable2 = ({ data }: any) => {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [edit, setEdit] = React.useState(false);

  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActions = (data: any) => {
    return (
      <Box>
        {data?.edit == true && <Button size="small">Edit</Button>}
        {data?.view == true && <Button size="small">View</Button>}{" "}
      </Box>
    );
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      if (orderBy) {
        return order === "asc"
          ? a[orderBy] > b[orderBy]
            ? 1
            : -1
          : a[orderBy] < b[orderBy]
          ? 1
          : -1;
      }
      return 0;
    });
  }, [data, order, orderBy]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {data?.table_.map((column: any) => (
                <StyledTableCell key={column.id} align={column.align || "left"}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column:any) => (
                  <StyledTableCell key={column.id} align={column.align || 'left'}>
                                      {column.id == 'actions' ?  handleActions(row[column.id]) : row[column.id]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody> */}
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <TablePagination
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <AlertDialog open={edit} setOpen={setEdit}></AlertDialog>
    </>
  );
};

export default CustomTable2;

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

// interface TableConfig {
//   table_name: string;
//   columns: TableColumn[];
//   pagination: Pagination;
//   sorting: Sorting;
//   global_filters?: GlobalFilters;
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
//   const [filters, setFilters] = useState<Record<string, any>>({});
//   const [editingRow, setEditingRow] = useState<number | null>(null);
//   const [editedRow, setEditedRow] = useState<TableRow | null>(null);

//   useEffect(() => {
//     if (tableconfig?.table_config) {
//       setConfig({
//         ...tableconfig.table_config,
//         sorting: {
//           ...tableconfig.table_config.sorting,
//           default_order: tableconfig.table_config.sorting.default_order as
//             | "asc"
//             | "desc", // Explicitly cast
//         },
//       });
//     }
//     if (tabledata) {
//       setData(tabledata);
//     }
//   }, []);

//   if (!config || !config.columns || data.length === 0)
//     return <Typography>Loading...</Typography>;

//   // Handle Filtering
//   const handleFilterChange = (key: any, value: any) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const filteredData = data.filter((row) => {
//     return config.columns.every((col) => {
//       if (!col.filterable || !filters[col.key]) return true;
//       if (col.filter_type === "search") {
//         return row[col.key]
//           ?.toString()
//           .toLowerCase()
//           .includes(filters[col.key]?.toLowerCase());
//       }
//       if (col.filter_type === "dropdown") {
//         return row[col.key] === filters[col.key];
//       }
//       return true;
//     });
//   });

//   // Handle Sorting
//   const sortedData = [...filteredData].sort((a, b) => {
//     const column = config?.sorting?.default_column || "id";
//     const order = config?.sorting?.default_order === "asc" ? 1 : -1;
//     return String(a[column as keyof TableRow]) >
//       String(b[column as keyof TableRow])
//       ? order
//       : -order;
//   });

//   // Pagination
//   const itemsPerPage = config.pagination.page_size;
//   const displayedData = sortedData.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   // Handle Edit
//   const handleEditClick = (row: TableRow) => {
//     setEditingRow(row.id);
//     setEditedRow({ ...row });
//   };

//   const handleEditChange = (field: keyof TableRow, value: string) => {
//     if (editedRow) {
//       setEditedRow((prev) => ({ ...prev!, [field]: value }));
//     }
//   };

//   const handleSave = () => {
//     if (editedRow) {
//       setData((prevData) =>
//         prevData.map((row) => (row.id === editedRow.id ? editedRow : row))
//       );
//       setEditingRow(null);
//       setEditedRow(null);
//     }
//   };

//   // Handle Delete
//   const handleDelete = (id: number) => {
//     setData((prevData) => prevData.filter((row) => row.id !== id));
//   };

//   // Render Actions
//   const renderActions = (row: TableRow) => (
//     <Box>
//       <IconButton onClick={() => handleEditClick(row)}>
//         <EditIcon sx={{ color: "blue" }} />
//       </IconButton>
//       <IconButton onClick={() => handleDelete(row.id)}>
//         <DeleteIcon sx={{ color: "red" }} />
//       </IconButton>
//     </Box>
//   );

//   return (
//     <Paper sx={{ padding: 3, boxShadow: 3 }}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>
//         {config?.table_name ?? "Table"}
//       </Typography>

//       {/* Filters */}
//       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
//         {config.columns
//           ?.filter((col) => col.filterable)
//           ?.map((col) => (
//             <FormControl key={col.key} sx={{ minWidth: 200 }}>
//               <TextField
//                 label={`Search ${col.label}`}
//                 value={filters[col.key] || ""}
//                 onChange={(e) => handleFilterChange(col.key, e.target.value)}
//                 variant="outlined"
//               />
//             </FormControl>
//           ))}
//       </Box>

//       {/* Table */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               {config.columns.map((col) => (
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
//             {displayedData.map((row) => (
//               <TableRow key={row.id}>
//                 {config.columns.map((col) => (
//                   <TableCell key={col.key}>
//                     {col.key === "actions" ? (
//                       <Box>
//                         <IconButton onClick={() => handleEditClick(row)}>
//                           <EditIcon sx={{ color: "blue" }} />
//                         </IconButton>
//                         <IconButton onClick={() => handleDelete(row.id)}>
//                           <DeleteIcon sx={{ color: "red" }} />
//                         </IconButton>
//                       </Box>
//                     ) : (
//                       row[col.key as keyof TableRow]?.toString() // Ensure rendering valid JSX
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
//         count={sortedData.length}
//         page={currentPage}
//         onPageChange={(_, newPage) => setCurrentPage(newPage)}
//         rowsPerPage={itemsPerPage}
//         rowsPerPageOptions={[itemsPerPage]}
//       />
//     </Paper>
//   );
// }
