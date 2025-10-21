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

function App() {
  // set page to be home when opened for the first time
  const [selectedPage, setSelectedPage] = React.useState<string>('Home');
  // url for selected webpage to open in main section
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null)

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const darkMode = false

  const theme = useMemo(() => {
    const newTheme = handleTheme(darkMode)
    //console.log('Theme:', newTheme)
    return newTheme
  }, [darkMode])

  const userData = userInfoApi(); // fetch user info ONCE

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      {userData && (
        <TopBar 
          open={open} 
          handleDrawerOpen={handleDrawerOpen} 
          user={userData} 
        />
      )}
        <PersistentSideBar
          open={open}
          handleDrawerClose={handleDrawerClose}
          setSelectedPage={setSelectedPage}
          setSelectedUrl={setSelectedUrl}
          user={userData}
        />
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
              <MainContent open={open} user={userData} />
            )}
          </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;

