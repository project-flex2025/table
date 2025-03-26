// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";

// interface EditUserDialogProps {
//   open: boolean;
//   onClose: () => void;
//   recordId: string;
//   tableConfig: any;
// }

// const ViewMoreDilog: React.FC<EditUserDialogProps> = ({
//   open,
//   onClose,
//   recordId,
//   tableConfig,
// }) => {
//     const [Loading, setLoading] = useState(false);
//       const fetchUserData = useCallback(async () => {
//           setLoading(true);
//           try {
//             const response = await fetch("/api/proxy", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 "X-API-TYPE": "search",
//               },
//               body: JSON.stringify({
//                 conditions: [
//                   { field: "feature_name", value: "emp2", search_type: "exact" },
//                   { field: "record_id", value: recordId, search_type: "exact" },
//                 ],
//                 dataset: "feature_data",
//                 app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//               }),
//             });

//             if (!response.ok) throw new Error("Failed to fetch data");
//             const jsonData = await response.json();
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//           }
//           setLoading(false);
//       }, [ recordId]);

//       useEffect(() => {

//           fetchUserData();

//       }, [open, fetchUserData]);
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>View User</DialogTitle>

//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewMoreDilog;

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Grid,
//   CircularProgress,
//   Typography,
//   Grid2,
// } from "@mui/material";

// interface ViewMoreDialogProps {
//   open: boolean;
//   onClose: () => void;
//   recordId: string;
//   tableConfig: any;
// }

// const ViewMoreDilog: React.FC<ViewMoreDialogProps> = ({
//   open,
//   onClose,
//   recordId,
//   tableConfig,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [userData, setUserData] = useState<Record<string, string>>({});

//   // Fetch User Data
//   const fetchUserData = useCallback(async () => {
//     if (!recordId) return;
//     setLoading(true);

//     try {
//       const response = await fetch("/api/proxy", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-TYPE": "search",
//         },
//         body: JSON.stringify({
//           conditions: [
//             { field: "feature_name", value: "emp2", search_type: "exact" },
//             { field: "record_id", value: recordId, search_type: "exact" },
//           ],
//           dataset: "feature_data",
//           app_secret: "38475203487kwsdjfvb1023897yfwbhekrfj",
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch data");
//       const jsonData = await response.json();

//       // Extracting user data from API response
//       const data = jsonData?.data?.[0]?.feature_data?.record_data || [];

//       // Map `record_data` into a key-value object for easy lookup
//       const parsedData: Record<string, string> = {};
//       data.forEach((item: any) => {
//         parsedData[item.record_label] =
//           item.record_value || item.record_value_date || "";
//       });

//       setUserData(parsedData);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }

//     setLoading(false);
//   }, [recordId]);

//   useEffect(() => {
//     if (open) fetchUserData();
//   }, [open, fetchUserData]);

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth>
//       <DialogTitle>View User Details</DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <Grid2 container justifyContent="center">
//             <CircularProgress />
//           </Grid2>
//         ) : (
//           <Grid2 container spacing={2} sx={{ mt: 1 }}>
//             {tableConfig.columns
//               .filter((col: any) =>
//                 col?.value_path?.startsWith("feature_data.record_data")
//               )
//               .map((col: any) => (
//                 <Grid item xs={12} sm={6} key={col.label}>
//                   <TextField
//                     fullWidth
//                     label={col.label}
//                     value={userData[col.label] || "N/A"}
//                     InputProps={{ readOnly: true }}
//                     variant="outlined"
//                   />
//                 </Grid>
//               ))}
//           </Grid2>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="contained" color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewMoreDilog;

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";

interface ViewMoreDialogProps {
  open: boolean;
  onClose: () => void;
  recordId: string;
  tableConfig: any;
}

const ViewMoreDilog: React.FC<ViewMoreDialogProps> = ({
  open,
  onClose,
  recordId,
  tableConfig,
}) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Record<string, string>>({});

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    if (!recordId) return;
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
      const record = jsonData?.data?.[0] || {};
      const recordData = record?.feature_data?.record_data || [];

      // Convert record_data array into an object
      const parsedData: Record<string, string> = {};
      recordData.forEach((item: any) => {
        parsedData[item.record_label] =
          item.record_value || item.record_value_date || "";
      });

      // Extracting `record_status` and `more_data.wild_search`
      parsedData["User Status"] = record?.record_status || "N/A";
      parsedData["More Data"] = record?.more_data?.[0]?.wild_search || "N/A";

      setUserData(parsedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    setLoading(false);
  }, [recordId]);

  useEffect(() => {
    if (open) fetchUserData();
  }, [open, fetchUserData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>View User Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            sx={{ mt: 1, border: "1px solid gray", borderRadius: "8px" }}
          >
            {tableConfig.columns
              .filter((col: any) => col.label.toLowerCase() !== "actions") // Ignore "actions" column
              .map((col: any) => (
                <Grid item xs={12} sm={6} key={col.label}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {col.label}
                  </Typography>
                  <Typography fontWeight="bold" color="primary">
                    {userData[col.label] || "N/A"}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewMoreDilog;
