// import { Button, IconButton, Menu, MenuItem } from "@mui/material";
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// async function fetchData(downloadformatte: string) {
//   const formData = new FormData();

//   const postJson = {
//     conditions: [
//       {
//         field: "feature_name",
//         value: "employees",
//         search_type: "exact",
//       },
//     ],
//     combination_type: "and",
//     page: 1,
//     limit: 100,
//     dataset: "feature_data",
//     app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//   };

//   formData.append("post_json", JSON.stringify(postJson));
//   formData.append("download_type", downloadformatte);
//   formData.append("user_id", "366");

//   try {
//     const response = await fetch("/api/aws_s3", {
//       method: "POST",
//       headers: {
//         Authorization: "Bearer YOUR_ACCESS_TOKEN", // If required
//         Accept: "application/json", // To accept JSON responses
//       },
//       body: formData,
//     });

//     const data = await response.json();

//     // Destructure `download_url`
//     const { download_url } = data;

//     if (download_url) {
//       window.location.href = download_url; // Automatically start download
//     } else {
//       console.error("Download URL not found in response", data);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// function DownloadCSV({
//   tableData,
//   pageSize,
//   search,
//   totalRecords,
//   downloadrange,
// }: any) {
//   const [downloadformatte, setdownloadformatte] = useState("csv");
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [pagestatus, setPageStatus] = useState("current");

//   console.log(tableData, "tableData in download");

//   const handleDownload = async (pagestatus: string) => {
//     try {
//       let allData = [];

//       if (pagestatus === "current") {
//         allData = tableData;
//       } else if (pagestatus === "all") {
//         fetchData(downloadformatte);
//       }

//       if (allData.length === 0) {
//         console.warn("No data available to download.");
//         return;
//       }

//       if (downloadformatte === "excel") {
//         const downloadExcel = (allData: any) => {
//           const worksheet = XLSX.utils.json_to_sheet(allData);
//           const workbook = XLSX.utils.book_new();
//           XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");
//           XLSX.writeFile(workbook, "TableData.xlsx");
//         };
//         downloadExcel(allData);
//       } else if (downloadformatte === "pdf") {
//         const doc = new jsPDF();
//         doc.text("User Table Data", 14, 16);

//         const tableData = allData.map((row: any) => {
//           const transformedData = row.feature_data.record_data.reduce(
//             (acc: any, field: any) => {
//               acc[field.record_label.toLowerCase()] = field.record_value_text;
//               return acc;
//             },
//             {}
//           );

//           return [
//             transformedData.name,
//             transformedData.email,
//             transformedData.role,
//           ];
//         });

//         // console.log(
//         //   allData.map((row: any) => {
//         //     const transformedData = row.feature_data.record_data.reduce(
//         //       (acc: any, field: any) => {
//         //         acc[field.record_label.toLowerCase()] = field.record_value_text;
//         //         return acc;
//         //       },
//         //       {}
//         //     );

//         //     return [
//         //       transformedData.name,
//         //       transformedData.email,
//         //       transformedData.role,
//         //     ];
//         //   }),
//         //   "new char5t gpt code res"
//         // );

//         autoTable(doc, {
//           head: [["ID", "Name", "Email", "Role"]],
//           body: tableData,
//           startY: 20,
//         });

//         doc.save("UserTable.pdf");
//       } else {
//         // Convert data to CSV format
//         const csvContent = convertToCSV(allData);

//         // Trigger download
//         const blob = new Blob([csvContent], { type: "text/csv" });
//         const link = document.createElement("a");
//         link.href = URL.createObjectURL(blob);
//         link.download = `tabledata.csv`;
//         link.click();
//         URL.revokeObjectURL(link.href);
//       }
//     } catch (error) {
//       console.error("Error downloading table data:", error);
//     }
//   };

//   // Function to convert JSON data to CSV
//   const convertToCSV = (data: any) => {
//     const headers = Object.keys(data[0]).join(",") + "\n";
//     const rows = data
//       .map((row: any) => Object.values(row).join(","))
//       .join("\n");
//     return headers + rows;
//   };

//   const handleExcel = (event: React.MouseEvent<HTMLElement>) => {
//     setdownloadformatte("excel");
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCSV = (event: React.MouseEvent<HTMLElement>) => {
//     setdownloadformatte("csv");
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePDF = (event: React.MouseEvent<HTMLElement>) => {
//     setdownloadformatte("pdf");
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleCurrentpage = () => {
//     setAnchorEl(null);
//     handleDownload("current");
//   };

//   const handleAllpages = () => {
//     setAnchorEl(null);
//     handleDownload("all");
//   };

//   return (
//     <div
//       style={{
//         border: "1px solid black",
//         borderRadius: "4px",
//         textAlign: "center",
//       }}
//     >
//       Download
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           gap: "30px",
//           padding: "0px 14px 4px 14px",
//         }}
//       >
//         <i className="fa-solid fa-file-excel" onClick={handleExcel}></i>
//         <i className="fa-solid fa-file-csv" onClick={handleCSV}></i>
//         <i className="fa-solid fa-file-pdf" onClick={handlePDF}></i>
//         <Menu
//           id="menu-appbar"
//           anchorEl={anchorEl}
//           anchorOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           keepMounted
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           <MenuItem onClick={handleCurrentpage}>Current Page</MenuItem>
//           <MenuItem onClick={handleAllpages}>All Pages</MenuItem>
//         </Menu>
//       </div>
//     </div>
//   );
// }

// export default DownloadCSV;

// "use client";

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// interface ColumnConfig {
//   key: string;
//   label: string;
// }

// interface RecordData {
//   record_value_text?: string;
//   record_value_number?: number;
//   record_label: string;
// }

// interface TableData {
//   feature_data: {
//     record_data: RecordData[];
//   };
// }

// interface TableConfig {
//   table_config: {
//     columns: ColumnConfig[];
//   };
// }

// interface ExportXLSXProps {
//   tableData: TableData[];
//   tableConfig: TableConfig;
// }

// const ExportXLSX = ({ tableData, tableConfig }: any) => {
//   const [downloadformate, setDownloadFormate] = useState("xlsx");
//   console.log(tableConfig, "tableconfig...");

//   const exportToExcel = () => {
//     // Extract columns excluding actions
//     const columns = tableConfig?.columns.filter(
//       (col: any) => col.key !== "actions"
//     );

//     const headers = columns.map((col: any) => col.label);
//     const keys = columns.map((col: any) => col.key);

//     // Transform table data to match columns
//     const formattedData = tableData.map((record: any) => {
//       const row: Record<string, any> = {};
//       record.feature_data.record_data.forEach((field: any) => {
//         const value = field.record_value_text ?? field.record_value_number;
//         if (keys.includes(field.record_label)) {
//           row[field.record_label] = value;
//         }
//       });
//       return row;
//     });

//     // Convert JSON data to worksheet
//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

//     // Convert to binary and trigger download
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "EmployeeData.xlsx");
//   };

//   return (
//     <>
//       {/* <button
//       onClick={exportToExcel}
//       className="bg-blue-500 text-white px-4 py-2 rounded-md"
//     >
//       Download XLSX
//     </button> */}
//       <i
//         className="fa-solid fa-file-excel"
//         onClick={() => setDownloadFormate("xlsx")}
//       ></i>
//       <i
//         className="fa-solid fa-file-csv"
//         onClick={() => setDownloadFormate("csv")}
//       ></i>
//       <i
//         className="fa-solid fa-file-pdf"
//         onClick={() => setDownloadFormate("pdf")}
//       ></i>
//     </>
//   );
// };

// export default ExportXLSX;

"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Box, Button, Menu, MenuItem } from "@mui/material";

async function fetchAllData(downloadformatte: string, colums: []) {
  const formData = new FormData();

  const postJson = {
    conditions: [
      {
        field: "feature_name",
        value: "emp",
        search_type: "exact",
      },
    ],
    combination_type: "and",
    page: 1,
    limit: 100,
    dataset: "feature_data",
    app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
  };

  formData.append("post_json", JSON.stringify(postJson));
  formData.append("download_type", downloadformatte);
  formData.append("user_id", "366");
  formData.append("colums", JSON.stringify(colums));

  try {
    const response = await fetch("/api/aws_s3", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_ACCESS_TOKEN", // If required
        Accept: "application/json", // To accept JSON responses
      },
      body: formData,
    });

    const data = await response.json();

    // Destructure `download_url`
    const { download_url } = data;

    if (download_url) {
      window.location.href = download_url; // Automatically start download
    } else {
      console.error("Download URL not found in response", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const extractColumnLabels = (tableConfig: any) => {
  return tableConfig.columns
    .filter((col: any) => col.label !== "Actions") // Exclude "Actions" column
    .map((col: any) => col.label);
};

const ExportXLSX = ({ tableData, tableConfig, total_records }: any) => {
  const [downloadformate, setDownloadFormate] = useState("xlsx");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [data, setData] = useState([]);

  // console.log(data, "data in export xlsx", extractColumnLabels(tableConfig));

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
            value: "emp",
            search_type: "exact",
          },
        ],
        combination_type: "and",
        page: 1,
        limit: 50,
        dataset: "feature_data",
        app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };

  const exportToExcel = () => {
    const columns = tableConfig?.columns.filter(
      (col: any) => col.label !== "actions"
    );
    const headers = columns.map((col: any) => col.label); // Extract headers
    const keys = columns.map((col: any) => col.label);

    // Transform table data to match columns
    const formattedData = tableData.map((record: any) => {
      return keys.map((key: any) => {
        const field = record.feature_data.record_data.find(
          (f: any) => f.record_label === key
        );
        return field
          ? field.record_value ??
              field.record_value_number ??
              field.record_value_text
          : "";
      });
    });

    // Insert headers at the top
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "EmployeeData.xlsx");
  };

  const exporttoExcelForAll = (data: any) => {
    const columns = tableConfig?.columns.filter(
      (col: any) => col.label != "Actions"
    );

    const headers = columns.map((col: any) => col.label);

    // Ensure data is correctly mapped
    const formattedData = data?.map((record: any) => {
      const row: Record<string, any> = {};
      record?.feature_data?.record_data?.forEach((field: any) => {
        const value =
          field.record_value ??
          field.record_value_number ??
          field.record_value_text ??
          field.record_value_date;
        row[field.record_label] = value;
      });
      return row;
    });

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers, // First row as headers
      ...formattedData.map((row: any) =>
        headers.map((header: any) => row[header] || "")
      ), // Map data accordingly
    ]);

    // Create a workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

    // Write file and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "EmployeeData.xlsx");
  };

  const exporttoCSVforAll = (data: any) => {
    const columns = tableConfig?.columns.filter(
      (col: any) => col.label != "Actions"
    );
    const headers = columns.map((col: any) => col.label).join(",") + "\n";

    const csvContent =
      headers +
      data
        .map((record: any) => {
          return columns
            .map((col: any) => {
              const field = record.feature_data.record_data.find(
                (field: any) => field.record_label === col.label
              );
              return (
                field?.record_value ??
                field?.record_value_text ??
                field?.record_value_number ??
                ""
              );
            })
            .join(",");
        })
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "EmployeeData.csv");
  };

  const exporttoPDFforAll = (data: any) => {
    const doc = new jsPDF();
    doc.text("Employee Data", 14, 16);

    const columns = tableConfig?.columns.filter(
      (col: any) => col.label != "Actions"
    );
    const headers = columns.map((col: any) => col.label);

    const rows = data.map((record: any) => {
      return columns.map((col: any) => {
        const field = record.feature_data.record_data.find(
          (field: any) => field.record_label === col.label
        );
        return (
          field?.record_value ??
          field?.record_value_text ??
          field?.record_value_number ??
          ""
        );
      });
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save("EmployeeData.pdf");
  };

  const exportToCSV = () => {
    const columns = tableConfig?.columns.filter(
      (col: any) => col.label !== "actions"
    );
    const headers = columns.map((col: any) => col.label).join(",") + "\n";

    const csvContent =
      headers +
      tableData
        .map((record: any) => {
          return columns
            .map((col: any) => {
              const field = record.feature_data.record_data.find(
                (field: any) => field.record_label === col.label
              );
              return (
                field?.record_value ??
                field?.record_value_number ??
                field?.record_value_text ??
                ""
              );
            })
            .join(",");
        })
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "EmployeeData.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Data", 14, 16);

    const columns = tableConfig?.columns.filter(
      (col: any) => col.label !== "actions"
    );
    const headers = columns.map((col: any) => col.label);

    const rows = tableData.map((record: any) => {
      return columns.map((col: any) => {
        const field = record.feature_data.record_data.find(
          (field: any) => field.record_label === col.label
        );
        return (
          field?.record_value ??
          field?.record_value_text ??
          field?.record_value_number ??
          ""
        );
      });
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save("EmployeeData.pdf");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCurrentpage = () => {
    setAnchorEl(null);
    handleDownload("current");
  };

  const handleAllpages = () => {
    setAnchorEl(null);
    handleDownload("all");
  };

  const handleDownload = async (pagestatus: string) => {
    try {
      if (pagestatus === "current") {
        if (downloadformate === "xlsx") exportToExcel();
        else if (downloadformate === "csv") exportToCSV();
        else if (downloadformate === "pdf") exportToPDF();
      } else if (pagestatus === "all") {
        if (total_records <= 50) {
          const res = await fetchData();
          if (downloadformate === "xlsx") exporttoExcelForAll(res.data);
          else if (downloadformate === "csv") exporttoCSVforAll(res.data);
          else if (downloadformate === "pdf") exporttoPDFforAll(res.data);
        } else {
          fetchAllData(downloadformate, extractColumnLabels(tableConfig));
        }
      }

      // if (allData.length === 0) {
      //   console.warn("No data available to download.");
      //   return;
      // }
    } catch (error) {
      console.error("Error downloading table data:", error);
    }
  };
  const handleXslx = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadFormate("xlsx");
    setAnchorEl(event.currentTarget);
  };
  const handleCSV = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadFormate("csv");
    setAnchorEl(event.currentTarget);
  };
  const handlePDF = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadFormate("pdf");
    setAnchorEl(event.currentTarget);
  };

  // const handleCol = () => {
  //   console.log(extractColumnLabels(tableConfig), "columns");
  // };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 14px 4px 14px",
          border: "1px solid black",
          borderRadius: "12px",
        }}
      >
        Download As
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
          <i className="fa-solid fa-file-excel" onClick={handleXslx}></i>
          <i className="fa-solid fa-file-csv" onClick={handleCSV}></i>
          <i className="fa-solid fa-file-pdf" onClick={handlePDF}></i>
        </Box>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleCurrentpage}>Current Page</MenuItem>
          <MenuItem onClick={handleAllpages}>All Pages</MenuItem>
        </Menu>
      </div>
      {/* <Button onClick={() => handleCol()}>Download</Button> */}
    </div>
  );
};

export default ExportXLSX;
