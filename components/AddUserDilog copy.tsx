import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { config } from "process";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  recordId: string;
  tableConfig: any;
}

const EditUserDialogt1: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  recordId,
  tableConfig,
}) => {
  const [editedUser, setEditedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updatedValues, setOriginalData] = useState(null);

  function transformApiResponse(apiResponse: any, tableConfig: any) {
    // Ensure tableConfig is an object (parse it if it's a string)
    if (typeof tableConfig === "string") {
      try {
        tableConfig = JSON.parse(tableConfig);
      } catch (e) {
        console.error("Invalid tableConfig JSON", e);
        return {};
      }
    }

    const transformedData: any = {};

    tableConfig?.forEach((column: any) => {
      const valuePath = column.value_path;
      const label = column.label;

      if (!valuePath || !label) return; // Skip invalid entries

      if (valuePath.startsWith("feature_data.record_data.")) {
        const recordLabel = valuePath.replace("feature_data.record_data.", "");
        const record = apiResponse?.feature_data?.record_data?.find(
          (r: any) => r.record_label === recordLabel
        );

        if (record) {
          transformedData[label] =
            record.record_value ||
            record.record_value_date ||
            record.record_value_number;
        }
      } else if (valuePath.startsWith("more_data.")) {
        transformedData[label] = apiResponse?.more_data?.[0]?.wild_search || "";
      } else {
        transformedData[label] = apiResponse?.[valuePath] || "";
      }
    });

    return transformedData;
  }

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-TYPE": "search",
        },
        body: JSON.stringify({
          conditions: [
            {
              field: "feature_name",
              value: "emp2",
              search_type: "exact",
            },
            { field: "record_id", value: recordId, search_type: "exact" },
          ],
          dataset: "feature_data",
          app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const jsonData = await response.json();
      setOriginalData(jsonData?.data[0] || {});

      if (jsonData?.data?.length > 0) {
        const userData = jsonData?.data[0];
        let formattedData: any = {};
        formattedData = transformApiResponse(userData, tableConfig?.columns);
        setEditedUser(formattedData);
      } else {
        setEditedUser({});
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setEditedUser({});
    }
    setLoading(false);
  }, [recordId]);

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open, fetchUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent,
    updatedValues: any = {}, // Ensure updatedValues is always initialized
    recordId: string
  ) => {
    event.preventDefault(); // Prevent default form submission

    console.log(
      updatedValues,
      recordId,
      "updated values in handlesubmit function"
    );

    // Ensure updatedValues is a valid object
    if (
      !updatedValues ||
      typeof updatedValues !== "object" ||
      Array.isArray(updatedValues)
    ) {
      console.error(
        "Error: updatedValues is undefined, null, or not an object.",
        updatedValues
      );
      return;
    }

    // Extract and transform updated values for feature_data.record_data
    const featureDataUpdates = Object.entries(updatedValues)
      .filter(([key]) => key !== "More Data" && key !== "User Status") // Exclude non-feature fields
      .map(([label, value]) => ({
        record_label: label,
        record_value: value,
      }));

    // Extract more_data field if available
    const moreDataUpdate =
      updatedValues["More Data"] &&
      typeof updatedValues["More Data"] === "string"
        ? [{ wild_search: updatedValues["More Data"] }]
        : [];

    // Construct API request body
    const transformedData = {
      data: {
        record_id: recordId || "", // Ensure record_id is provided
        feature_name: "emp2",
        record_status: updatedValues["User Status"] || "active", // Default to active if undefined
        fields_to_update: {
          "feature_data.record_data": featureDataUpdates,
          more_data: moreDataUpdate,
        },
      },
      dataset: "feature_data",
      app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
    };

    console.log("Submitting Data:", JSON.stringify(transformedData, null, 2));
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-TYPE": "update",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) throw new Error("Failed to update data");

      console.log("Data updated successfully");
      onClose(); // Close the dialog on success
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          tableConfig?.columns?.map(
            (config: any) =>
              config?.label != "Actions" && (
                <TextField
                  key={config.label}
                  label={config.label}
                  name={config.label}
                  fullWidth
                  margin="normal"
                  value={editedUser?.[config.label] || ""}
                  onChange={handleChange}
                  type={
                    config.type === "number"
                      ? "number"
                      : config.type === "date"
                      ? "date"
                      : "text"
                  }
                />
              )
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={(event) => handleSubmit(event, editedUser, recordId)}
        >
          Update User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialogt1;
