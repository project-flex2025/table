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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import AddUserDialog from "./AddUserDilog";
import DownloadCSV from "./DownloadCSV";
import EditDialog from "./EditDilog";
import { Add, CloudDownload, CloudUpload } from "@mui/icons-material";

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
  global_filters: GlobalFilters;
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
      route?: string;
    }[];
  };
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

export default function DynamicTable12() {
  const [currentPage, setCurrentPage] = useState(1);
  const [config, setConfig] = useState<TableConfig | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [editRow, setEditRow] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [totalCount, setTotalCount] = useState(null);

  // Fetch data with filters, pagination, and search
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const res = await fetch(
        `${config?.api.endpoint}?${queryParams.toString()}`,
        {
          method: config?.api.method ?? "GET",
          headers: config?.api.headers,
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const result = await res.json();
      setData(result.data || []);
      setTotalCount(result.totalRecords);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tableconfig?.table_config) {
      setConfig(tableconfig?.table_config);
      setPageSize(tableconfig.table_config.pagination.page_size);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, filters]);

  const handleFilterChange = (key: any, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log(id, "id......");
  };

  const handleAddUser = (newUser: TableRow) => {
    setData((prevData) => [
      ...prevData,
      { ...newUser, id: prevData.length + 1 },
    ]);
  };

  const handleNewPage = (newPage: any) => {
    setCurrentPage(newPage + 1);
  };

  const handleDataUpload = (uploadedData: any) => {
    setData(uploadedData); // Update table with uploaded data
  };

  const handleDownload = () => {
    console.log("handle download...");
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
        {config?.columns
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

        {/* Toolbar buttons from the updated JSON */}
        {config?.toolbar?.enabled && (
          <Box>
            {config?.toolbar?.buttons.map((button) => (
              <div>
                {button?.type == "download" && (
                  <DownloadCSV
                    pageSize={pageSize}
                    tableData={data}
                  ></DownloadCSV>
                )}
              </div>
            ))}
          </Box>
        )}
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {config?.columns?.map((col: any) => (
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
            {data?.map((row: any, index: number) => (
              <TableRow key={index} hover sx={{ padding: 0 }}>
                {config?.columns?.map((col: any) => (
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
        count={totalCount || 10}
        page={currentPage - 1}
        onPageChange={(_, newPage) => handleNewPage(newPage)}
        rowsPerPage={pageSize}
      />
      <EditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        rowData={editRow}
        onSave={(updatedRow) => {
          setData((prevData) =>
            prevData.map((row) =>
              row.id === updatedRow.id ? { ...row, ...updatedRow } : row
            )
          );
        }}
      />
      <AddUserDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddUser={handleAddUser}
      />
    </Paper>
  );
}
