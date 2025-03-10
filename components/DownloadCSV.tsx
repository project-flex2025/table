import { Button } from "@mui/material";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadCSV({ pageStatus, tableData, pageSize, search }: any) {
  const [downloadformatte, setdownloadformatte] = useState("csv");

  const handleDownload = async () => {
    try {
      let allData = [];

      if (pageStatus === "current") {
        // Fetch only the current page's data
        allData = tableData;
      } else if (pageStatus === "all") {
        let allRecords = [];
        let currentPage = 1;
        let totalPages = 1;

        // First API call to get totalRecords & totalPages
        const firstRes = await fetch(
          `/api/table?page=1&limit=${pageSize}&search=${search}`
        );
        if (!firstRes.ok) throw new Error(`Error: ${firstRes.status}`);
        const firstResult = await firstRes.json();

        totalPages = firstResult.totalPages || 1; // Get total pages
        allRecords.push(...firstResult.data); // Store first page data

        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const res = await fetch(
            `/api/table?page=${page}&limit=${pageSize}&search=${search}`
          );
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const result = await res.json();
          allRecords.push(...result.data);
        }

        allData = allRecords;
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

        const tableData = allData.map((row: any) => [
          row.id,
          row.name,
          row.email,
          row.role,
          row.status,
          row.created_at,
        ]);

        autoTable(doc, {
          head: [["ID", "Name", "Email", "Role", "Status", "Created At"]],
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

  // Convert CSV to JSON
  // const convertToCSV = (csv: string): any[] => {
  //   const lines = csv.split("\n").map((line) => line.trim());
  //   const headers = lines[0].split(",");

  //   return lines.slice(1).map((line) => {
  //     const values = line.split(",");
  //     return headers.reduce((obj, header, index) => {
  //       obj[header] = values[index]?.trim() || "";
  //       return obj;
  //     }, {} as Record<string, string>);
  //   });
  // };

  return (
    <div>
      <Button
        sx={{ height: "100%" }}
        size="medium"
        variant="outlined"
        onClick={handleDownload}
      >
        Download CSV
      </Button>
    </div>
  );
}

export default DownloadCSV;
