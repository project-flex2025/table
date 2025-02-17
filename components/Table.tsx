import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Pagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import AlertDialog from "./Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "	#D0D0D0",
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

const CustomTable = ({ data, setData }: any) => {
  const [page, setPage] = React.useState(1);
  const [edit, setEdit] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleActions = (data: any) => {
    console.log(data?.edit, "handleActions ", data?.view);
    return (
      <Box>
        {data?.edit == true && (
          <EditIcon sx={{ variant: "outlined", color: "blue" }}></EditIcon>
        )}
        {data?.view == true && (
          <DeleteIcon sx={{ color: "red", ml: 1 }}></DeleteIcon>
        )}{" "}
      </Box>
    );
  };

  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      const rows = (typeof content === "string" ? content : "")
        .split("\n")
        .map((row) => row.split(","));
      const headers = rows[0];
      const newData = rows.slice(1).map((row) => {
        let obj: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index]?.trim() || "";
        });
        return obj;
      });

      setData(newData);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const csvContent = [
      data?.table_headers.map((col: any) => col.label).join(","),
      ...data?.table_data.map((row: any) =>
        data?.table_headers.map((col: any) => row[col.id] || "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <TableContainer component={Paper}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          paddingBottom: 1,
        }}
      >
        {data?.upload && (
          <React.Fragment>
            <input
              type="file"
              accept=".csv"
              onChange={handleUpload}
              style={{ display: "none" }}
              id="upload-file"
            />
            <label htmlFor="upload-file">
              <Button variant="outlined" component="span">
                Upload
              </Button>
            </label>
          </React.Fragment>
        )}
        {data?.download && (
          <Button variant="outlined" onClick={handleDownload}>
            Download
          </Button>
        )}{" "}
        {data?.addnewuser && (
          <Button variant="contained" onClick={() => setEdit(true)}>
            Add User
          </Button>
        )}
      </Box>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {data?.table_headers.map((column: any) => (
              <StyledTableCell key={column.id} align="center">
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.table_data.map((row: any, rowIndex: any) => (
            <StyledTableRow key={rowIndex}>
              {data?.table_headers.map((column: any) => (
                <StyledTableCell sx={{ p: 0.6 }} key={column.id} align="center">
                  {column.id == "actions"
                    ? handleActions(row[column.id])
                    : row[column.id]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.6 }}>
        <Pagination
          variant="outlined"
          color="primary"
          count={10}
          page={page}
          onChange={handleChange}
        />
      </Box>
      <AlertDialog open={edit} setOpen={setEdit}></AlertDialog>
    </TableContainer>
  );
};

export default CustomTable;
