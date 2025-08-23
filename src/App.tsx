import { useState } from 'react'
import { useMemo} from 'react'
import { Box } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material'
import { handleTheme } from './theme'
import TopBar from './topBar';
import { PersistentSideBar } from './sidebar';
import MainContent from './mainContent';
import React from 'react';
import ObjectEmbed from './frame'

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
    console.log('Theme:', newTheme)
    return newTheme
  }, [darkMode])


  // const testUser = {
  //   first_name: 'Ava',
  //   last_name: 'DeLaGarza',
  //   email: 'adelagarza@keck.hawaii.edu',
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
        <PersistentSideBar
          open={open}
          handleDrawerClose={handleDrawerClose}
          setSelectedPage={setSelectedPage}
          setSelectedUrl={setSelectedUrl}
        />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* if selected page is home ... open the main content */}
          {selectedPage === 'Home' ? (
            <MainContent open={open} />
          ) : (
            // otherwise use the other url
            selectedUrl && <ObjectEmbed url={selectedUrl} open={open} />
          )}
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;

