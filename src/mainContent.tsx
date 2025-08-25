import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { scheduleApi } from './api';
import { metricsApi } from './api';
import type { ApiResponse } from './api';
import type { metricsApiResponse } from './api';

import { NightMetricsStrip } from './metrics';
import TelStatus from './telStatus';

// import Divider from '@mui/material/Divider';
import { Box } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.mixins.toolbar.minHeight, // so the main content is below the topbar
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface MainContentProps  {
  open: boolean;
};


export default function MainContent({ open }: MainContentProps) {
  const apiData : ApiResponse[] | null = scheduleApi();
  const metricsData : metricsApiResponse[] | null = metricsApi();

  // Filter instruments by telescope number
  const keckI = apiData?.filter(item => item.TelNr === 1) || [];
  const keckII = apiData?.filter(item => item.TelNr === 2) || [];

  return (
    <Main open={open}>
      <h1>Welcome to the Observer Portal!</h1>
      <TelStatus keckI={keckI} keckII={keckII} />
       <Box sx={{ height: 24 }} /> 
        <NightMetricsStrip data={metricsData?.[0]} />
    </Main>
  );
}