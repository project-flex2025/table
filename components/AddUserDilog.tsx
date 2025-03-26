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
  // onUpdateUser: (updatedUser: any) => void;
}

// onUpdateUser,

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  recordId,
  tableConfig,
}) => {
  const [editedUser, setEditedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updatedValues, setOriginalData] = useState(null);

  console.log(editedUser, "editedUsers...");

  // function transformApiResponse(apiResponse: any, tableConfig: any) {
  //   console.log(apiResponse, tableConfig, "transform api to expected");

  //   const transformedData: any = {};
  //   tableConfig?.forEach((column: any) => {
  //     const valuePath = column.value_path;
  //     const label = column.label;

  //     if (valuePath?.startsWith("feature_data.record_data.")) {
  //       const recordLabel = valuePath.replace("feature_data.record_data.", "");
  //       const record = apiResponse[0]?.feature_data?.record_data?.find(
  //         (r: any) => r.record_label === recordLabel
  //       );

  //       if (record) {
  //         transformedData[label] =
  //           record.record_value ||
  //           record.record_value_date ||
  //           record.record_value_number;
  //       }
  //     } else if (valuePath?.startsWith("more_data.")) {
  //       transformedData[label] = apiResponse[0]?.more_data[0]?.wild_search;
  //     } else {
  //       transformedData[label] = apiResponse[0]?.[valuePath];
  //     }
  //   });

  //   return transformedData;
  // }

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

        // userData.feature_data.record_data.forEach((item: any) => {
        //   formattedData[item.record_label] =
        //     item.record_value ||
        //     item.record_value_date ||
        //     item.record_value_number ||
        //     "";
        // });

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

  // const handleSubmit = async () => {
  //   try {
  //     const updatedPayload = {
  //       data: {
  //         record_id: recordId,
  //         fields_to_update: Object.keys(editedUser).map((key) => ({
  //           record_label: key,
  //           record_value_text: editedUser[key],
  //         })),
  //       },
  //       dataset: "feature_data",
  //       app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
  //     };

  //     const response = await fetch("/api/update", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedPayload),
  //     });

  //     if (response.ok) {
  //       // onUpdateUser(editedUser);
  //       onClose();
  //     } else {
  //       console.error("Update failed");
  //     }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };

  // const handleSubmit = async (updatedValues: any) => {
  //   const transformedData = {
  //     data: {
  //       record_id: "emp_rec_003", // Use the actual record_id dynamically
  //       feature_name: "emp2", // Adjust based on your requirement
  //       record_status: updatedValues["User Status"], // Map directly
  //       fields_to_update: {
  //         "feature_data.record_data": Object.entries(updatedValues)
  //           .filter(([key]) => key !== "More Data" && key !== "User Status")
  //           .map(([label, value]) => ({
  //             record_label: label,
  //             record_value: value,
  //           })),
  //         more_data: [
  //           {
  //             wild_search: updatedValues["More Data"],
  //           },
  //         ],
  //       },
  //     },
  //     dataset: "feature_data",
  //     app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
  //   };

  //   console.log(transformedData, "transformed data ...---+++");

  // try {
  //   const response = await fetch("YOUR_API_ENDPOINT", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(transformedData),
  //   });

  //   const result = await response.json();
  //   console.log("Update Response:", result);
  // } catch (error) {
  //   console.error("Error updating user:", error);
  // }
  // };

  // const handleSubmit = async (
  //   event: React.FormEvent,
  //   updatedValues: any,
  //   recordId: string
  // ) => {
  //   event.preventDefault(); // Prevent form submission behavior

  //   // Ensure the correct transformation of the updated values
  //   const featureDataUpdates = Object?.entries(updatedValues)
  //     .filter(([key]) => key !== "More Data" && key !== "User Status")
  //     ?.map(([label, value]) => ({
  //       record_label: label,
  //       record_value: value,
  //     }));

  //   const moreDataUpdate = updatedValues["More Data"]
  //     ? [{ wild_search: updatedValues["More Data"] }]
  //     : [];

  //   // Construct the API request body
  //   const transformedData = {
  //     data: {
  //       record_id: recordId, // Dynamically pass the record_id
  //       feature_name: "emp2",
  //       record_status: updatedValues["User Status"] || "active", // Ensure status is always included
  //       fields_to_update: {
  //         "feature_data.record_data": featureDataUpdates,
  //         more_data: moreDataUpdate,
  //       },
  //     },
  //     dataset: "feature_data",
  //     app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
  //   };

  //   console.log("Submitting Data:", JSON.stringify(transformedData, null, 2));

  //   try {
  //     const response = await fetch("YOUR_API_ENDPOINT", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(transformedData),
  //     });

  //     const result = await response.json();
  //     console.log("Update Response:", result);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };

  const handleSubmit = async (
    event: React.FormEvent,
    updatedValues: any = {}, // Ensure updatedValues is always initialized
    recordId: string
  ) => {
    event.preventDefault(); // Prevent default form submission

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

      const result = await response.json();
      console.log("Update Response:", result);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

//   const handleSubmit = async (
//     event: React.FormEvent,
//     originalData: any, // Original API response to merge unmodified fields
//     recordId: string
//   ) => {
//     event.preventDefault();
// updatedValues
//     if (
//       ! ||
//       typeof updatedValues !== "object" ||
//       Array.isArray(updatedValues)
//     ) {
//       console.error(
//         "Error: updatedValues is undefined, null, or not an object.",
//         updatedValues
//       );
//       return;
//     }

//     if (!originalData || typeof originalData !== "object") {
//       console.error("Error: originalData is missing or invalid.", originalData);
//       return;
//     }

//     // Extract existing record data from original API response
//     const existingRecordData = originalData?.feature_data?.record_data || [];
//     const existingMoreData = originalData?.more_data?.[0]?.wild_search || "";

//     // Create updated feature_data.record_data
//     const featureDataUpdates = existingRecordData.map((record: any) => ({
//       record_label: record.record_label,
//       record_value: updatedValues[record.record_label] ?? record.record_value, // Use updated value or existing value
//     }));

//     // Ensure More Data is correctly included
//     const moreDataUpdate = [
//       {
//         wild_search: updatedValues["More Data"] ?? existingMoreData,
//       },
//     ];

//     // Construct API request body
//     const transformedData = {
//       data: {
//         record_id: recordId || "", // Ensure record_id is provided
//         feature_name: "emp2",
//         record_status:
//           updatedValues["User Status"] ??
//           originalData.record_status ??
//           "active", // Use updated or existing status
//         fields_to_update: {
//           "feature_data.record_data": featureDataUpdates,
//           more_data: moreDataUpdate,
//         },
//       },
//       dataset: "feature_data",
//       app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//     };

//     console.log("Submitting Data:", JSON.stringify(transformedData, null, 2));

//     try {
//       const response = await fetch("YOUR_API_ENDPOINT", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(transformedData),
//       });

//       const result = await response.json();
//       console.log("Update Response:", result);
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

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

export default EditUserDialog;

// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   MenuItem,
// } from "@mui/material";

// interface EditUserDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onUpdateUser: (updatedUser: any) => void;
// }

// export default function EditUserDialog({
//   open,
//   onClose,
//   onUpdateUser,
// }: EditUserDialogProps) {
//   const [editedUser, setEditedUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await fetch("/api/proxy", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           "X-API-TYPE": "search",
//         },
//         body: JSON.stringify({
//           conditions: [
//             { field: "feature_name", value: "emp2", search_type: "exact" },
//             { field: "record_id", value: "emp_rec_003", search_type: "exact" },
//           ],
//           combination_type: "and",
//           sort: [{ record_id: "asc" }],
//           dataset: "feature_data",
//           app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch data");
//       const jsonData = await response.json();
//       return {
//         data: jsonData.data ?? [],
//       };
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }, []);

//   useEffect(() => {
//     // if (open) fetchData();
//     const fetchTableData = async () => {
//       setLoading(true);
//       const res = await fetchData();
//       console.log(res, "response ...---+++");
//       setEditedUser(res ?? []);
//       setLoading(false);
//     };
//     fetchTableData();
//   }, [fetchData, open]);

//   console.log(editedUser, "edit user usestate");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setEditedUser({
//       ...editedUser,
//       feature_data: {
//         ...editedUser.feature_data,
//         record_data: editedUser.feature_data.record_data.map((field: any) =>
//           field.record_label === e.target.name
//             ? { ...field, record_value: e.target.value }
//             : field
//         ),
//       },
//     });
//   };

//   const handleSubmit = async () => {
//     const updatedFields = editedUser.feature_data.record_data.map(
//       (field: any) => ({
//         record_label: field.record_label,
//         record_value_text: field.record_value,
//       })
//     );

//     const updatedPayload = {
//       data: {
//         record_id: editedUser.record_id,
//         feature_name: editedUser.feature_name,
//         fields_to_update: {
//           "feature_data.record_data": updatedFields,
//           more_data: editedUser.more_data || {},
//           record_status: editedUser.record_status,
//         },
//       },
//       dataset: "feature_data",
//       app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//     };

//     try {
//       const response = await fetch("/api/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedPayload),
//       });

//       if (!response.ok) throw new Error("Update failed");

//       onUpdateUser(editedUser);
//       onClose();
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Edit User</DialogTitle>
//       <DialogContent>
//         {/* {editedUser &&
//           editedUser.feature_data.record_data.map((field: any) => (
//             <TextField
//               key={field.record_label}
//               label={field.record_label}
//               name={field.record_label}
//               fullWidth
//               margin="normal"
//               value={field.record_value || ""}
//               onChange={handleChange}
//             />
//           ))} */}
//           {
//             editedUser &&
//             editedUser?.data[0]

//           }
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           Update User
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
