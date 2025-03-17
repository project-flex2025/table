import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

async function fetchData(downloadformatte: string) {
  const formData = new FormData();

  const postJson = {
    conditions: [
      {
        field: "feature_name",
        value: "employees",
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
      console.log("Download URL:", download_url);
      window.location.href = download_url; // Automatically start download
    } else {
      console.error("Download URL not found in response", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function DownloadCSV({
  tableData,
  pageSize,
  search,
  totalRecords,
  downloadrange,
}: any) {
  const [downloadformatte, setdownloadformatte] = useState("csv");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [pagestatus, setPageStatus] = useState("current");

  console.log(totalRecords, downloadrange, "totalRecords,downloadRange");

  const handleDownload = async (pagestatus: string) => {
    try {
      let allData = [];

      if (pagestatus === "current") {
        // Fetch only the current page's data
        allData = tableData;
      } else if (pagestatus === "all") {
        fetchData(downloadformatte);
        // let allRecords = [];
        // let currentPage = 1;
        // let totalPages = 1;

        // // First API call to get totalRecords & totalPages
        // const firstRes = await fetch(
        //   `/api/table?page=1&limit=${pageSize}&search=${search}`
        // );
        // if (!firstRes.ok) throw new Error(`Error: ${firstRes.status}`);
        // const firstResult = await firstRes.json();

        // totalPages = firstResult.totalPages || 1; // Get total pages
        // allRecords.push(...firstResult.data); // Store first page data

        // // Fetch remaining pages
        // for (let page = 2; page <= totalPages; page++) {
        //   const res = await fetch(
        //     `/api/table?page=${page}&limit=${pageSize}&search=${search}`
        //   );
        //   if (!res.ok) throw new Error(`Error: ${res.status}`);
        //   const result = await res.json();
        //   allRecords.push(...result.data);
        // }

        // allData = allRecords;
      }

      if (allData.length === 0) {
        console.warn("No data available to download.");
        return;
      }

      if (downloadformatte === "excel") {
        const downloadExcel = (allData: any) => {
          const worksheet = XLSX.utils.json_to_sheet(allData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");

          XLSX.writeFile(workbook, "TableData.xlsx");
        };
        downloadExcel(allData);
      } else if (downloadformatte === "pdf") {
        const doc = new jsPDF();
        doc.text("User Table Data", 14, 16);

        console.log(allData, "allData...");

        const tableData = allData.map((row: any) => {
          const transformedData = row.feature_data.record_data.reduce(
            (acc: any, field: any) => {
              acc[field.record_label.toLowerCase()] = field.record_value_text;
              return acc;
            },
            {}
          );

          return [
            transformedData.name,
            transformedData.email,
            transformedData.role,
          ];
        });

        console.log(
          allData.map((row: any) => {
            const transformedData = row.feature_data.record_data.reduce(
              (acc: any, field: any) => {
                acc[field.record_label.toLowerCase()] = field.record_value_text;
                return acc;
              },
              {}
            );

            return [
              transformedData.name,
              transformedData.email,
              transformedData.role,
            ];
          }),
          "new char5t gpt code res"
        );

        autoTable(doc, {
          head: [["ID", "Name", "Email", "Role"]],
          body: tableData,
          startY: 20,
        });

        doc.save("UserTable.pdf");
      } else {
        // Convert data to CSV format
        const csvContent = convertToCSV(allData);

        // Trigger download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `tabledata.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error("Error downloading table data:", error);
    }
  };

  // Function to convert JSON data to CSV
  const convertToCSV = (data: any) => {
    const headers = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map((row: any) => Object.values(row).join(","))
      .join("\n");
    return headers + rows;
  };

  const handleExcel = (event: React.MouseEvent<HTMLElement>) => {
    setdownloadformatte("excel");
    setAnchorEl(event.currentTarget);
  };

  const handleCSV = (event: React.MouseEvent<HTMLElement>) => {
    setdownloadformatte("csv");
    setAnchorEl(event.currentTarget);
  };

  const handlePDF = (event: React.MouseEvent<HTMLElement>) => {
    setdownloadformatte("pdf");
    setAnchorEl(event.currentTarget);
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

  return (
    <div
      style={{
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      Download
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
          padding: "0px 14px 4px 14px",
        }}
      >
        <i className="fa-solid fa-file-excel" onClick={handleExcel}></i>
        <i className="fa-solid fa-file-csv" onClick={handleCSV}></i>
        <i className="fa-solid fa-file-pdf" onClick={handlePDF}></i>
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
    </div>
  );
}

export default DownloadCSV;
