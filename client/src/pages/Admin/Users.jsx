 
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

const Users = () => {
  // Sample data - replace with real data from your backend
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@unza.zm', role: 'admin', lastLogin: '2024-05-18' },
    { id: 2, name: 'Operator 1', email: 'operator1@unza.zm', role: 'operator', lastLogin: '2024-05-17' },
  ];

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 0.5 },
    { field: 'lastLogin', headerName: 'Last Login', flex: 0.5 },
    { 
      field: 'actions', 
      headerName: 'Actions',
      flex: 0.5,
      renderCell: () => (
        <>
          <Button size="small" color="primary">Edit</Button>
          <Button size="small" color="error">Delete</Button>
        </>
      )
    },
  ];

  return (
    <Box sx={{ height: 600, p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add New User
        </Button>
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </Box>
  );
};

export default Users; // Proper default export