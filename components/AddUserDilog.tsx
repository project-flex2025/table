import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
}

export default function AddUserDialog({
  open,
  onClose,
  onAddUser,
}: AddUserDialogProps) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!newUser.name || !newUser.email)
      return alert("Please fill all fields.");
    onAddUser(newUser);
    setNewUser({ name: "", email: "", role: "User", status: "Active" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={newUser.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={newUser.email}
          onChange={handleChange}
        />
        <TextField
          select
          label="Role"
          name="role"
          fullWidth
          margin="normal"
          value={newUser.role}
          onChange={handleChange}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          name="status"
          fullWidth
          margin="normal"
          value={newUser.status}
          onChange={handleChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="Suspended">Suspended</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
