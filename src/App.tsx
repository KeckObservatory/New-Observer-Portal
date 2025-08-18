import { useState } from 'react'
import { useMemo, useRef} from 'react'
import { Box } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { handleTheme } from './theme'
import TopBar from './TopBar';
import { PersistentSideBar } from './Sidebar';
import MainContent from './mainContent';
import React from 'react';
import useApi from './api';

// theme provider
// css base line
// compondents

function App() {
  // set page to be home when opened for the first time
  const [selectedPage, setSelectedPage] = React.useState<string>('Home');

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const darkMode = false

  const theme = useMemo(() => {
    const newTheme = handleTheme(darkMode)
    console.log('Theme:', newTheme)
    return newTheme
  }, [darkMode])


  const testUser = {
    first_name: 'Ava',
    last_name: 'DeLaGarza',
    email: 'adelagarza@keck.hawaii.edu',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <PersistentSideBar open={open} handleDrawerClose={handleDrawerClose} />
      <MainContent open={open} />
      </ThemeProvider>
    </Box>
  );
}

export default App;

