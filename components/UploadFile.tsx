"use client";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const UploadFile = ({ onDataUpload }: any) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const data = e.target.result;
      let parsedData = [];

      if (file.name.endsWith(".csv")) {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            parsedData = result.data;
            uploadToServer(parsedData);
          },
        });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(sheet);
        console.log(parsedData, "parsedata...");

        uploadToServer(parsedData);
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const uploadToServer = async (data: any) => {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Ensure JSON format
      });

      if (!res.ok) {
        const errorText = await res.text(); // Read text response for debugging
        console.error("Upload Error Response:", errorText);
        throw new Error(errorText || "Upload failed");
      }

      const result = await res.json();
      alert("Upload Successful!");
      onDataUpload(data);
    } catch (error: any) {
      console.error("Error uploading data:", error);
      alert("Upload Error: " + error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          hidden
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
      </Button>
      {fileName && (
        <Typography variant="body2">Uploaded: {fileName}</Typography>
      )}
    </Box>
  );
};

export default UploadFile;

