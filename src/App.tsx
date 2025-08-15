import { useState } from 'react'
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TopBar from './TopBar';
import { PersistentSideBar } from './Sidebar';
import MainContent from './mainContent';
import React from 'react';



function App() {
  // set page to be home when opened for the first time
  const [selectedPage, setSelectedPage] = React.useState<string>('Home');

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);


  const testUser = {
    first_name: 'Ava',
    last_name: 'DeLaGarza',
    email: 'adelagarza@keck.hawaii.edu',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <PersistentSideBar open={open} handleDrawerClose={handleDrawerClose} />
      <MainContent open={open} />
    </Box>
  );
}

export default App;

