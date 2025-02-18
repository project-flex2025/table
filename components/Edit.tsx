import { Box, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import * as React from 'react';

export default function AlertDialog({ open, setOpen, data }: any) {
  const [record, setRecord] = React.useState({
    username: "",
    role: "",
    email: "",
    status: ""
  });

  // Update the record state whenever `data` changes or dialog opens
  React.useEffect(() => {
    if (data) {
      setRecord({
        username: data?.more_data?.UserName || "",
        role: data?.more_data?.Role || "",
        email: data?.feature_data?.record_data[0]?.record_value_text || "",
        status: data?.more_data?.Status || ""
      });
    }
  }, [data, open]); // Add `open` to ensure it triggers when dialog opens

  const handleChange = (field: string, value: string) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setRecord({
      username: "",
      role: "",
      email: "",
      status: ""
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "data": {
              "record_id": `${data?.record_id}` || "",
              "feature_name": "Staff_managment",
              "fields_to_update": {
                "feature_data.record_data": [
                          {
                              "record_label": "email",
                              "record_type": "type_text",
                              "record_value_text": `${record.email}` || ""
                          },
                      ],
                      "more_data": {
                        "UserName": `${record.username}`,
                        "Role": `${record.role}`,
                        "Status": `${record.status}`  ,
                        "tableheaders": ["email", "UserName", "Role", "Status"]
                      },
                "record_status": "active"
              }
            },
            "dataset": "feature_data",
            "app_secret": "38475203487kwsdjfvb1023897yfwbhekrfj"
          }
      ),
      });
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      const result = await response.json();
    } catch (err) {
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ display: "flex", flexDirection: "column", p: 4 }}>
          <Typography sx={{ mb: 1 }}>Edit User...</Typography>
          <TextField
            onChange={(e) => handleChange("username", e.target.value)}
            value={record.username}
            label="User Name"
            variant="standard"
          />
          <TextField
            onChange={(e) => handleChange("email", e.target.value)}
            value={record.email}
            label="Email"
            variant="standard"
          />
          <TextField
            onChange={(e) => handleChange("role", e.target.value)}
            value={record.role}
            label="Role"
            variant="standard"
          />
          <TextField
            onChange={(e) => handleChange("status", e.target.value)}
            value={record.status}
            label="Status"
            variant="standard"
          />
        </Box>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={
              handleSubmit
        }
            autoFocus
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}