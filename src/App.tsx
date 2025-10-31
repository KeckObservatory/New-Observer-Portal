import { useState } from 'react'
import { useMemo} from 'react'
import { Box } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { handleTheme } from './theme'
import TopBar from './topBar';
import { PersistentSideBar } from './sideBar';
import MainContent from './mainContent';
import React from 'react';
import ObjectEmbed from './frame'

import { MyObsSchedule } from './my_schedule';
import { MyObsLogs } from './myLogs';
import { userInfoApi } from './api';
import { MyRequests } from './myRequests';
import { MyCoverSheets } from './myCoverSheets';

/**
 * Main App component for the Observer Portal.
 * This is the top level component.
 * User info is fetched here first. 
 * Sets the main page to be opened first.
 */

function App() {
  // Track which page is selected -> is Home by default
  const [selectedPage, setSelectedPage] = React.useState<string>('Home');
  // Track what url is opened in the main area -> nothing by default
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null)

  // State for sidebar open/close
  const [open, setOpen] = useState(true);

  // Functions to open and close the sidebar
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // State for dark mode on or off -> of by default
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => {
    const newTheme = handleTheme(darkMode)
    return newTheme
  }, [darkMode])

  // Fetch user info ONCE ONLY -> to send to all child components
  const userData = userInfoApi(); 

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {userData && (
          <>
            <TopBar 
              open={open} 
              handleDrawerOpen={handleDrawerOpen} 
              user={userData} 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <PersistentSideBar
              open={open}
              handleDrawerClose={handleDrawerClose}
              setSelectedPage={setSelectedPage}
              setSelectedUrl={setSelectedUrl}
              user={userData}
            />
            {/* Main content area */} 
            {/* Checks if its a new page -> if so open specific */} 
            <Box sx={{ flexGrow: 1, p: 3 }}>
              {selectedPage === "My Observing Schedule (new)" ? (
                <MyObsSchedule
                  open={open}
                  user={userData}
                  setSelectedPage={setSelectedPage}
                  setSelectedUrl={setSelectedUrl}
                />
              ) : selectedPage === "My Observing Logs (new)" ? (
                <MyObsLogs open={open} user={userData} />
              ) : selectedPage === "My Observing Requests (to add)" ? (
                <MyRequests open={open} />
              ) : selectedPage === "My Cover Sheets (to add)" ? (
                <MyCoverSheets
                  open={open}
                  user={userData}
                  setSelectedPage={setSelectedPage}
                  setSelectedUrl={setSelectedUrl}
                />
              ) : selectedUrl ? (
                <ObjectEmbed url={selectedUrl} open={open} />
              ) : (
                <MainContent                 
                  open={open}
                  user={userData}
                  setSelectedPage={setSelectedPage}
                  setSelectedUrl={setSelectedUrl}
                />
              )}
            </Box>
          </>
        )}
      </ThemeProvider>
    </Box>
  );
}

export default App;

