import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Pagination,
  TablePagination,
  Typography,
} from "@mui/material";
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
  const [tableData, settableData] = React.useState<any>(null);
  const [recordDelete, setRecordDelete] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [add, setAdd] = React.useState(false);
  const [bulkUploadData, setBulkUploadData] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Call an API or load new data based on the new page if necessary
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
            page: page,
            limit: 5,
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
  };


  console.log(bulkUploadData, "bulkUploadData");

  console.log(tableData?.total_results, "tableData...");

  const handleEdit = (data: any) => {
    console.log(data, "handleEdit");
    setEdit(data);
  };

  const handleDelete = async (recordId: any, featurename: any) => {
    console.log(recordId, featurename, "inside delete...");
    try {
      const response = await fetch("api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            record_id: `${recordId}`,
            feature_name: `${featurename}`,
            delete_entire_document: true,
          },
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });
      const data = await response.json();
      console.log(data, "response delete data");
      if (response.ok) {
        console.log("Record deleted successfully");
        setRecordDelete((prev) => !prev); // Trigger re-fetch
      } else {
        console.error("Failed to delete the record", data);
      }
    } catch (err) {
      // Handle error
    }
  };
  // const handlePageChange = (
  //   event: React.MouseEvent<HTMLButtonElement> | null,
  //   newPage: number
  // ) => {
  //   setPage(newPage);
  // };

  // const handleRowsPerPageChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0); // Reset to the first page when rows per page changes
  // };

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
            limit: 5,
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

  // const handleUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const content = e.target?.result;
  //     const rows = (typeof content === "string" ? content : "")
  //       .split("\n")
  //       .map((row) => row.split(","));
  //     const headers = rows[0];
  //     const newData = rows.slice(1).map((row) => {
  //       let obj: { [key: string]: any } = {};
  //       headers.forEach((header, index) => {
  //         obj[header.trim()] = row[index]?.trim() || "";
  //       });
  //       return obj;
  //     });

  //     // setData(newData);
  //   };
  //   reader.readAsText(file);
  // };

  // Helper function to convert CSV content to the desired API format
  const convertCSVToAPIFormat = (csvData: any[]) => {
    return csvData.map((row, index) => ({
      record_id: `staff_managment00${index + 20}`, // Generate unique record IDs
      feature_name: "Staff_managment",
      added_by: "flex_admin",
      record_status: "active",
      created_on_date: new Date().toISOString().split("T")[0],
      feature_data: {
        record_data: [
          {
            record_label: "email",
            record_type: "type_text",
            record_value_text: row["email"],
          },
        ],
      },
      more_data: {
        UserName: row["UserName"],
        Role: row["Role"],
        Status: row["Status"],
        tableheaders: ["email", "UserName", "Role", "Status"],
      },
    }));
  };

  // const BulkUpload = () => {
  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      const rows = (typeof content === "string" ? content : "")
        .split("\n")
        .map((row) => row.split(","));
      const headers = rows[0]; // First row is the headers
      const newData = rows.slice(1).map((row) => {
        let obj: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = row[index]?.trim() || "";
        });
        return obj;
      });

      // Convert the parsed CSV data to the API structure
      const formattedData = convertCSVToAPIFormat(newData);
      setBulkUploadData(formattedData);
    };
    reader.readAsText(file);
    // handleBulkUpload();
  };

  const handleBulkUpload = async () => {
    console.log("api upload bulk upload..");
    if (bulkUploadData.length > 0) {
      const apiData = {
        data: bulkUploadData,
        dataset: "features_data",
        app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj", // Ensure this is correct
      };
      try {
        console.log("inside try block api");

        const response = await fetch("api/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Bulk upload successful:", result);
          alert("Bulk upload completed successfully!");
        } else {
          console.error("Bulk upload failed:", response.statusText);
          alert("Bulk upload failed.");
        }
      } catch (error) {
        console.error("Error uploading data:", error);
        alert("An error occurred during the upload.");
      }
    } else {
      console.log("else part..");
    }
  };

  const handleDownload = () => {
    if (!tableData || tableData.data.length === 0) return;

    // Extract headers
    const headers = ["email", "UserName", "Role", "Status"];

    // Extract data rows
    const csvRows = tableData?.data?.map((record: any) => {
      const email =
        record?.feature_data?.record_data?.find(
          (data: any) => data.record_label === "email"
        )?.record_value_text || "";
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
  // return(
  //   <>hello world..</>
  // )

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
        <Button onClick={handleBulkUpload}>upload to api</Button>
        {/* <Box>
      <Typography variant="h6">Bulk Upload</Typography>
      <input type="file" accept=".csv" onChange={handleUpload} />
      {bulkUploadData.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleBulkUpload}
          style={{ marginTop: "16px" }}
        >
          Upload Data
        </Button>
      )}
    </Box> */}
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
          <Button variant="contained" onClick={() => setAdd(true)}>
            Add User
          </Button>
        )}
      </Box>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableData?.data[0]?.more_data?.tableheaders?.map(
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
          {tableData?.data?.map((row: any, rowIndex: any) => (
            <StyledTableRow key={rowIndex}>
              {tableData?.data[0]?.more_data?.tableheaders?.map(
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
      {/* <TablePagination
        component="div"
        count={tableData.length} // Total number of rows
        page={page}
        onPageChange={}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Rows per page"
      /> */}
      {/* <TablePagination sx={{display:"flex",justifyContent:"center",alignItems:"center"}}
        component="div"
        count={100}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      /> */}
      <Box sx={{justifyItems:"end",p:2}}>
      {/* <Pagination count={tableData?.total_results/5} defaultPage={1}  />  */}
      <Pagination
          count={Math.ceil(tableData?.total_results / 5)}
          page={currentPage}
          onChange={handlePageChange}
          defaultPage={1}
        />
      </Box>
      {edit && (
        <AlertDialog open={!!edit} setOpen={() => setEdit(null)} data={edit} />
      )}
      <AddUser open={add} setOpen={setAdd}></AddUser>
    </TableContainer>
  );
};

export default CustomTable;
