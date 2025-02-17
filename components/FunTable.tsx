import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import * as XLSX from "xlsx";

interface TableProps {
  config: {
    table_headers: { id: string; label: string }[];
    table_data: any[];
    addnewuser: boolean;
    upload: boolean;
    download: boolean;
  };
}

const ReusableTable: React.FC<TableProps> = ({ config }) => {
  const { table_headers, table_data, addnewuser, upload, download } = config;

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log("Uploaded Data:", jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(table_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "table_data.xlsx");
  };

  const handleActions = (row: any) => (
    <Box>
      {row.actions?.edit && <Button size="small">Edit</Button>}
      {row.actions?.view && <Button size="small">View</Button>}
    </Box>
  );

  return (
    <TableContainer component={Paper}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 2, padding: 2 }}
      >
        {upload && (
          <Button variant="outlined" component="label">
            Upload
            <input
              type="file"
              hidden
              accept=".xlsx, .csv"
              onChange={handleUpload}
            />
          </Button>
        )}
        {download && (
          <Button variant="outlined" onClick={handleDownload}>
            Download
          </Button>
        )}
        {addnewuser && <Button variant="contained">Add User</Button>}
      </Box>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {table_headers.map((column) => (
              <TableCell key={column.id} align="center">
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table_data
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {table_headers.map((column) => (
                  <TableCell key={column.id} align="center">
                    {column.id === "actions"
                      ? handleActions(row)
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
        <Pagination
          siblingCount={2}
          count={Math.ceil(table_data.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </TableContainer>
  );
};

export default ReusableTable;
