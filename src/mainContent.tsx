import { styled } from '@mui/material/styles';

import { scheduleApi, userInfoApi } from './api';
import { metricsApi } from './api';
import type { ApiResponse, userInfoApiResponse } from './api';
import type { metricsApiResponse } from './api';
import Paper from '@mui/material/Paper';

import { OrderedNightMetricsStrip } from './metrics';
import UserTable from './observerInfo';

import { ObserverInfo } from './observerInfo';

// import Divider from '@mui/material/Divider';
import { Box } from '@mui/material';

import { renderTable } from './telStatus';
import Grid from '@mui/material/Grid';


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

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

export default function MainContent({ open }: MainContentProps) {
  const apiData : ApiResponse[] | null = scheduleApi();
  const metricsData : metricsApiResponse[] | null = metricsApi();
  const userData : userInfoApiResponse[] | null = userInfoApi();

  // Filter instruments by telescope number
  const keckI = apiData?.filter(item => item.TelNr === 1) || [];
  const keckII = apiData?.filter(item => item.TelNr === 2) || [];

  return (
    <Main open={open}>
      <Grid container spacing={2} sx={{ height: "85%" }}>
        <Grid size={4} sx={{ height: "100%"}}>
          <Item>
            <h2>Keck I</h2>
            {renderTable(keckI)}
          </Item>
        </Grid>
        <Grid size={4} sx={{ height: "100%"}}>
          <Item>
            <h2>Keck II</h2>
            {renderTable(keckII)}
          </Item>
        </Grid>
        <Grid size={4} sx={{ height: "100%"}}>
          <Item>
            <h2>Your Information</h2>
            <UserTable users={userData ?? []} />
          </Item>
        </Grid>
      </Grid>
       <Box sx={{ height: 24 }} /> 
        <OrderedNightMetricsStrip data={metricsData?.[0]} />
        <Box sx={{ height: 24 }} /> 
        <ObserverInfo />
    </Main>
  );
}