"use client";

import DeleteIcon from "@mui/icons-material/Delete";

import EditIcon from "@mui/icons-material/Edit";

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

const DynamicTableFun123 = (config: any) => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(config?.table_config?.api?.endpoint, {
        method: config?.table_config?.api?.method || "GET",

        headers: config?.table_config?.api?.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);

      return { data: [] };
    }
  };

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);

      const res = await fetchData();

      setData(res.data || []);

      setLoading(false);
    };

    fetchTableData();
  }, []);

  const getValueByPath = (obj: any, path: string): any => {
    if (!path || typeof path !== "string") return "-";

    const keys = path.split(".");

    let value = obj;

    for (const key of keys) {
      if (Array.isArray(value)) {
        // Handling arrays dynamically

        value =
          value.find((item) => item.record_label === key)?.record_value ??
          value.find((item) => item.record_label === key)?.record_value_date ??
          value.find((item) => item.record_label === key)
            ?.record_value_number ??
          value.find((item) => item[key]) ??
          "-";
      } else {
        value = value?.[key] ?? "-";
      }
    }

    return value;
  };

  return (
    <div className="p-4">
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              {config?.table_config?.columns.map((col: any) => (
                <TableCell
                  key={col.value_path}
                  sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={config?.table_config?.columns.length}
                  align="center"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {config?.table_config?.columns.map((col: any) => (
                    <TableCell key={col.value_path}>
                      {getValueByPath(row, col.value_path)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicTableFun123;
