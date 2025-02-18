import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Pagination, TablePagination } from "@mui/material";
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
import EditTableUser from "./EditTableUser";
import AddUser from "./EditTableUser";

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
  const [edit, setEdit] = React.useState<any>(false);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);
  const [tableData, settableData] = React.useState<any[]>([]);
  const [recordDelete, setRecordDelete] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10); // Default rows per page
const [add, setAdd] = React.useState(false);

  const handleEdit = (data: any) => {
    console.log(data, "handleEdit");
    setEdit(data);
  };

  const handleDelete = (recordId: any, featurename: any) => {
    // Your existing delete logic
  };
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    };
     const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when rows per page changes
      };

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conditions: [
              {
                field: "feature_name",
                value: "Staff_managment",
                search_type: "exact",
              },
            ],
            limit: 100,
            combination_type: "and",
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });
        const data = await response.json();
        settableData(data || []);
      } catch (err) {
        // Handle error
      }
    };
    fetchCategories();
  }, [recordDelete]);

  const handleActions = (data: any) => (
    <Box>
      <EditIcon
        onClick={() => handleEdit(data)}
        sx={{ color: "blue", cursor: "pointer" }}
      />
      <DeleteIcon
        onClick={() => handleDelete(data?.record_id, data?.feature_name)}
        sx={{ color: "red", ml: 1, cursor: "pointer" }}
      />
    </Box>
  );

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

      // setData(newData);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!tableData || tableData.length === 0) return;
  
    // Extract headers
    const headers = ["email", "UserName", "Role", "Status"];
    
    // Extract data rows
    const csvRows = tableData.map((record: any) => {
      const email = record?.feature_data?.record_data?.find((data: any) => data.record_label === "email")?.record_value_text || "";
      const userName = record?.more_data?.UserName || "";
      const role = record?.more_data?.Role || "";
      const status = record?.more_data?.Status || "";
  
      // Join row data with commas
      return [email, userName, role, status].join(",");
    });
  
    // Construct CSV content
    const csvContent = [headers.join(","), ...csvRows].join("\n");
  
    // Create Blob and trigger download
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
          <Button variant="outlined" 
          onClick={handleDownload}
          >
            Download
          </Button>
        )}{" "}
        {data?.addnewuser && (
          <Button variant="contained" onClick={() => setAdd(true)}>
            Add User
          </Button>
        )}
      </Box>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableData[0]?.more_data?.tableheaders?.map(
              (column: any, index: number) => (
                <StyledTableCell key={index} align="center">
                  {column}
                </StyledTableCell>
              )
            )}
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.map((row: any, rowIndex: any) => (
            <StyledTableRow key={rowIndex}>
              {tableData[0]?.more_data?.tableheaders?.map(
                (column: any, index: any) => (
                  <StyledTableCell key={index} align="center">
                    {column === "email"
                      ? row?.feature_data?.record_data[0]?.record_value_text
                      : row?.more_data?.[column]}
                  </StyledTableCell>
                )
              )}
              <StyledTableCell align="center">
                {handleActions(row)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={tableData.length} // Total number of rows
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Rows per page"
      />

      {/* Edit User Dialog */}
      {edit && (
        <AlertDialog open={!!edit} setOpen={() => setEdit(null)} data={edit} />
      )}
      <AddUser open={add} setOpen={setAdd}></AddUser>
    </TableContainer>
  );
};

export default CustomTable;