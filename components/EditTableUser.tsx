import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

export default function AddUser({ open, setOpen }: any) {
  const [formData, setFormData] = React.useState({
    email: "",
    UserName: "",
    Role: "",
    Status: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Submit form data
  const handleSubmit = async () => {
    try {
      const response = await fetch("api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            data: [
            {
              record_id: "staff_managment06",
              feature_name: "Staff_managment",
              added_by: "flex_admin",
              record_status: "active",
              created_on_date: "2025-02-18",
              feature_data: {
                record_data: [
                  {
                    record_label: "email",
                    record_type: "type_text",
                    record_value_text: formData.email,
                  },
                ],
              },
              more_data: {
                UserName: formData.UserName,
                Role: formData.Role,
                Status: formData.Status,
                tableheaders: ["email", "UserName", "Role", "Status"],
              },
            },
          ],
        }
      ),
      });
      const data = await response.json();
    } catch (err) {
      // Handle error
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-user-dialog"
      >
        <DialogTitle id="add-user-dialog">Add User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <TextField
              name="email"
              label="Email"
              variant="standard"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="UserName"
              label="User Name"
              variant="standard"
              value={formData.UserName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Role"
              label="Role"
              variant="standard"
              value={formData.Role}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="Status"
              label="Status"
              variant="standard"
              value={formData.Status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit} autoFocus>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
