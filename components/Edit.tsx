import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, TextField, Typography } from '@mui/material';

export default function AlertDialog({open,setOpen}:any) {
//   const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{display:"flex",flexDirection:"column",p:4}}>
        <Typography>Add User...</Typography>
     <TextField id="standard-basic" label="name" variant="standard" />
     <TextField id="standard-basic" label="calories" variant="standard" />
     <TextField id="standard-basic" label="fat" variant="standard" />
     <TextField id="standard-basic" label="Carbs" variant="standard" />
     <TextField id="standard-basic" label="Protein" variant="standard" />
        </Box>
    
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleClose} autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
