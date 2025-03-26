// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";

// interface DynamicFormProps {
//   open: boolean;
//   onClose: () => void;
//   mode: "add" | "edit"; // Determines if it's for adding or editing
//   recordId?: string; // Required for edit mode
//   tableConfig: any; // Config JSON defining form fields
// }

// const DynamicForm: React.FC<DynamicFormProps> = ({
//   open,
//   onClose,
//   mode,
//   recordId,
//   tableConfig,
// }) => {
//   const [formData, setFormData] = useState<any>({});
//   const [loading, setLoading] = useState(false);

//   // Function to transform API response to formData for Edit mode
//   const transformApiResponse = (apiResponse: any) => {
//     const transformedData: any = {};

//     tableConfig?.columns?.forEach((column: any) => {
//       const valuePath = column.value_path;
//       const label = column.label;
//       if (!valuePath || !label) return;

//       if (valuePath.startsWith("feature_data.record_data.")) {
//         const recordLabel = valuePath.replace("feature_data.record_data.", "");
//         const record = apiResponse?.feature_data?.record_data?.find(
//           (r: any) => r.record_label === recordLabel
//         );

//         if (record) {
//           transformedData[label] =
//             record.record_value ||
//             record.record_value_date ||
//             record.record_value_number;
//         }
//       } else if (valuePath.startsWith("more_data.")) {
//         transformedData[label] = apiResponse?.more_data?.[0]?.wild_search || "";
//       } else {
//         transformedData[label] = apiResponse?.[valuePath] || "";
//       }
//     });

//     return transformedData;
//   };

//   // Fetch user data for Edit mode
//   const fetchUserData = useCallback(async () => {
//     if (mode === "edit" && recordId) {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/proxy", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-TYPE": "search",
//           },
//           body: JSON.stringify({
//             conditions: [
//               { field: "feature_name", value: "emp2", search_type: "exact" },
//               { field: "record_id", value: recordId, search_type: "exact" },
//             ],
//             dataset: "feature_data",
//             app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//           }),
//         });

//         if (!response.ok) throw new Error("Failed to fetch data");

//         const jsonData = await response.json();
//         if (jsonData?.data?.length > 0) {
//           const userData = transformApiResponse(jsonData.data[0]);
//           setFormData(userData);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//       setLoading(false);
//     }
//   }, [mode, recordId]);

//   useEffect(() => {
//     if (open && mode === "edit") {
//       fetchUserData();
//     } else {
//       setFormData({}); // Reset form for "Add" mode
//     }
//   }, [open, mode, fetchUserData]);

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Handle form submission for Add & Edit
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const featureData = Object.entries(formData).map(([label, value]) => ({
//       record_label: label,
//       ...(typeof value === "number"
//         ? { record_value_number: value, record_type: "type_number" }
//         : typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)
//         ? { record_value_date: value, record_type: "type_date" }
//         : { record_value: value, record_type: "type_text" }),
//     }));

//     // Construct "more_data" field
//     const moreDataUpdate = [
//       {
//         wild_search: featureData
//           .map(
//             (d: any) =>
//               d.record_value || d.record_value_date || d.record_value_number
//           )
//           .join(" "),
//       },
//     ];

//     const payload =
//       mode === "add"
//         ? {
//             record_id: `emp_rec_${Date.now()}`, // Unique ID for new user
//             feature_name: "emp2",
//             added_by: "flex_admin",
//             record_status: "active",
//             created_on_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
//             feature_data: { record_data: featureData },
//             more_data: [
//               {
//                 wild_search: featureData
//                   .map(
//                     (d: any) =>
//                       d.record_value ||
//                       d.record_value_date ||
//                       d.record_value_number
//                   )
//                   .join(" "),
//               },
//             ],
//             doc_position: 0,
//           }
//         : {
//             record_id: recordId,
//             feature_name: "emp2",
//             fields_to_update: {
//               "feature_data.record_data": featureData,
//               more_data: moreDataUpdate, // ✅ Include more_data when updating user
//             },
//           };

//     console.log(JSON.stringify(payload), "JSON.stringify(payload)...");

//     // const endpoint = mode === "add" ? "/api/create" : "/api/update";

//     // try {
//     //   const response = await fetch(endpoint, {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify(payload),
//     //   });

//     //   if (!response.ok) throw new Error("Failed to submit data");

//     //   console.log("Success!", payload);
//     //   onClose();
//     // } catch (error) {
//     //   console.error("Error:", error);
//     // }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           tableConfig?.columns?.map(
//             (config: any) =>
//               config?.label !== "Actions" && (
//                 <TextField
//                   key={config.label}
//                   label={config.label}
//                   name={config.label}
//                   fullWidth
//                   margin="normal"
//                   value={formData?.[config.label] || ""}
//                   onChange={handleChange}
//                   type={
//                     config.type === "number"
//                       ? "number"
//                       : config.type === "date"
//                       ? "date"
//                       : "text"
//                   }
//                 />
//               )
//           )
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           {mode === "add" ? "Create User" : "Update User"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DynamicForm;

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";

// interface DynamicFormProps {
//   open: boolean;
//   onClose: () => void;
//   mode: "add" | "edit";
//   recordId?: string;
//   tableConfig: any;
// }

// const DynamicForm: React.FC<DynamicFormProps> = ({
//   open,
//   onClose,
//   mode,
//   recordId,
//   tableConfig,
// }) => {
//   const [formData, setFormData] = useState<any>({});
//   const [loading, setLoading] = useState(false);

//   const transformApiResponse = (apiResponse: any) => {
//     const transformedData: any = {};

//     tableConfig?.columns?.forEach((column: any) => {
//       const valuePath = column.value_path;
//       const label = column.label;
//       if (!valuePath || !label) return;

//       if (valuePath.startsWith("feature_data.record_data.")) {
//         const recordLabel = valuePath.replace("feature_data.record_data.", "");
//         const record = apiResponse?.feature_data?.record_data?.find(
//           (r: any) => r.record_label === recordLabel
//         );

//         if (record) {
//           transformedData[label] =
//             record.record_value ||
//             record.record_value_date ||
//             record.record_value_number;
//         }
//       } else if (valuePath.startsWith("more_data.")) {
//         transformedData[label] = apiResponse?.more_data?.[0]?.wild_search || "";
//       } else {
//         transformedData[label] = apiResponse?.[valuePath] || "";
//       }
//     });

//     return transformedData;
//   };

//   const fetchUserData = useCallback(async () => {
//     if (mode === "edit" && recordId) {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/proxy", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-API-TYPE": "search",
//           },
//           body: JSON.stringify({
//             conditions: [
//               { field: "feature_name", value: "emp2", search_type: "exact" },
//               { field: "record_id", value: recordId, search_type: "exact" },
//             ],
//             dataset: "feature_data",
//             app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//           }),
//         });

//         if (!response.ok) throw new Error("Failed to fetch data");

//         const jsonData = await response.json();
//         if (jsonData?.data?.length > 0) {
//           const userData = transformApiResponse(jsonData.data[0]);
//           setFormData(userData);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//       setLoading(false);
//     }
//   }, [mode, recordId]);

//   useEffect(() => {
//     if (open && mode === "edit") {
//       fetchUserData();
//     } else {
//       setFormData({});
//     }
//   }, [open, mode, fetchUserData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const featureData = Object.entries(formData)
//       .filter(([label]) => !label.includes("More Data"))
//       .map(([label, value]) => ({
//         record_label: label,
//         ...(typeof value === "number"
//           ? { record_value_number: value, record_type: "type_number" }
//           : typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)
//           ? { record_value_date: value, record_type: "type_date" }
//           : { record_value: value, record_type: "type_text" }),
//       }));

//     const moreData = [
//       {
//         wild_search: Object.values(formData).join(" "),
//       },
//     ];

//     const payload =
//       mode === "add"
//         ? {
//             record_id: `emp_rec_${Date.now()}`,
//             feature_name: "emp2",
//             added_by: "flex_admin",
//             record_status: "active",
//             created_on_date: new Date().toISOString().split("T")[0],
//             feature_data: { record_data: featureData },
//             more_data: moreData,
//             doc_position: 0,
//           }
//         : {
//             record_id: recordId,
//             feature_name: "emp2",
//             fields_to_update: {
//               "feature_data.record_data": featureData,
//               more_data: moreData,
//             },
//           };

//     console.log(JSON.stringify(payload), "JSON.stringify(payload)...");
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           tableConfig?.columns?.map(
//             (config: any) =>
//               config?.label !== "Actions" && (
//                 <TextField
//                   key={config.label}
//                   label={config.label}
//                   name={config.label}
//                   fullWidth
//                   margin="normal"
//                   value={formData?.[config.label] || ""}
//                   onChange={handleChange}
//                   type={
//                     config.type === "number"
//                       ? "number"
//                       : config.type === "date"
//                       ? "date"
//                       : "text"
//                   }
//                 />
//               )
//           )
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           {mode === "add" ? "Create User" : "Update User"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DynamicForm;

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface DynamicFormProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  recordId?: string;
  tableConfig: any;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  open,
  onClose,
  mode,
  recordId,
  tableConfig,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  console.log(mode, "Mode...", recordId, "recId");

  const transformApiResponse = (apiResponse: any) => {
    const transformedData: any = {};
    tableConfig?.columns?.forEach((column: any) => {
      const valuePath = column.value_path;
      const label = column.label;
      if (!valuePath || !label) return;

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
  };

  const fetchUserData = useCallback(async () => {
    if (mode === "edit" && recordId) {
      setLoading(true);
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-TYPE": "search",
          },
          body: JSON.stringify({
            conditions: [
              { field: "feature_name", value: "emp2", search_type: "exact" },
              { field: "record_id", value: recordId, search_type: "exact" },
            ],
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const jsonData = await response.json();
        if (jsonData?.data?.length > 0) {
          const userData = transformApiResponse(jsonData.data[0]);
          setFormData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    }
  }, [mode, recordId]);

  useEffect(() => {
    if (open && mode === "edit") {
      fetchUserData();
    } else {
      setFormData({});
    }
  }, [open, mode, fetchUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const featureData = Object.entries(formData)
      .filter(([label]) => label !== "More Data" && label !== "More Data2")
      .map(([label, value]) => ({
        record_label: label,
        ...(typeof value === "number"
          ? { record_value_number: value, record_type: "type_number" }
          : typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)
          ? { record_value_date: value, record_type: "type_date" }
          : { record_value: value, record_type: "type_text" }),
      }));

    const wildSearchString = featureData
      .map(
        (d: any) =>
          d.record_value || d.record_value_date || d.record_value_number
      )
      .join(" ");

    const moreDataUpdate = [{ wild_search: wildSearchString }];

    const payload =
      mode == "add"
        ? {
            record_id: `emp_rec_${Date.now()}`,
            feature_name: "emp2",
            added_by: "flex_admin",
            record_status: "active",
            created_on_date: new Date().toISOString().split("T")[0],
            feature_data: { record_data: featureData },
            more_data: moreDataUpdate,
          }
        : {
            record_id: recordId,
            feature_name: "emp2",
            fields_to_update: {
              "feature_data.record_data": featureData,
              more_data: moreDataUpdate,
            },
          };

    console.log(JSON.stringify(payload), "JSON.stringify(payload)...");
    if (mode == "add") {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-TYPE": "create",
          },
          body: JSON.stringify({
            data: payload,
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        if (!response.ok) throw new Error("Failed to update data");

        console.log("Data updated successfully");
        onClose(); // Close the dialog on success
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else if (mode == "edit") {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-TYPE": "update",
          },
          body: JSON.stringify({
            data: payload,
            dataset: "feature_data",
            app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
          }),
        });

        if (!response.ok) throw new Error("Failed to update data");

        console.log("Data updated successfully");
        onClose(); // Close the dialog on success
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          tableConfig?.columns?.map(
            (config: any) =>
              config?.label !== "Actions" && (
                <TextField
                  key={config.label}
                  label={config.label}
                  name={config.label}
                  fullWidth
                  margin="normal"
                  value={formData?.[config.label] || ""}
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
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "add" ? "Create User" : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicForm;
