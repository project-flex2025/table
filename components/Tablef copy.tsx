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
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";

const DynamicTableFun2 = (config: any) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conditions: [
            { field: "feature_name", value: "emp2", search_type: "exact" },
          ],
          combination_type: "and",
          page: 1,
          limit: 100,
          sort: [
            {
              record_id: "asc",
            },
          ],
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return { data: [], total_results: 0 };
    }
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      const res = await fetchData();
      setData(res.data || []);
      setTotalCount(res.total_results || 0);
      setLoading(false);
    };
    fetchTableData();
  }, [fetchData]);

  /**
   * Function to get the value dynamically based on value_path.
   * It navigates through objects and arrays as defined by the path.
   */
  const getValueByPath = (obj: any, path: string): any => {
    if (!path || typeof path !== "string") return null;
    const keys = path.split(".");
    let value = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (Array.isArray(value)) {
        // Optimize lookup by stopping at the first match
        const foundItem = value.find((item) => item.record_label === key);
        if (foundItem) {
          value =
            foundItem.record_value ??
            foundItem.record_value_text ??
            foundItem.record_value_date ??
            foundItem.record_value_number;
        } else {
          // If no record_label match, check if key exists directly in any object
          value = value.find((item) => item[key])?.[key];
        }
      } else if (typeof value === "object" && value !== null) {
        value = value[key];
      } else {
        return "-"; // Default fallback if value is not found
      }
    }

    return value ?? "-"; // Return the value or fallback
  };

  return (
    <Box p={4}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {config?.tableconfig?.columns.map((col: any) => (
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={config?.tableconfig?.columns.length}
                  align="center"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {config?.tableconfig?.columns.map((col: any) => (
                    <TableCell key={col.key}>
                      {getValueByPath(row, col.value_path)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DynamicTableFun2;
