import { styled } from '@mui/material/styles';

import { scheduleApi} from './api';
import { metricsApi } from './api';
import Paper from '@mui/material/Paper';
import { OrderedNightMetricsStrip } from './metrics';
import UserTable from './observerInfo';
import { Box } from '@mui/material';
import { renderTable } from './telStatus';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ObserverInfoBannerWithSchedule } from './observerInfo';
import type { userInfoApiResponse } from './api';


const drawerWidth = 240;

/**
 * Styled main content area that shifts right when the sidebar is open.
 */
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
  user: userInfoApiResponse | null;
  setSelectedPage?: (page: string) => void;
  setSelectedUrl?: (url: string) => void;
};

/**
 * Styled Paper component for grid items.
 */
const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

/**
 * MainContent component displays the dashboard with:
 * - Observer info banner
 * - Keck I and Keck II instrument status tables
 * - User information
 * - Night metrics strip
 */
export default function MainContent({ open, user, setSelectedPage, setSelectedUrl }: MainContentProps) {
    // Fetch telescope schedule and metrics data
  const telescopeSchedData = scheduleApi();          
  const metricsData = metricsApi();       

  // Filter instruments by telescope number 
  const keckI = telescopeSchedData?.filter(item => item.TelNr === 1) || [];
  const keckII = telescopeSchedData?.filter(item => item.TelNr === 2) || [];

  return (
    <Main open={open}>
      {/* Banner with welcome and checklist */}
      <ObserverInfoBannerWithSchedule
        user={user}
        setSelectedPage={setSelectedPage}
        setSelectedUrl={setSelectedUrl}
      />

      {/* Main dashboard grid with status tables */}
      <Grid container spacing={2} sx={{ height: "85%" }}>
      {/* Keck I instrument status */}
        <Grid size={{ xs: 12, sm: 4, md: 4 }} sx={{ height: "100%" }}>
          <Item>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Keck I
          </Typography>
            {keckI.length > 0 ? renderTable(keckI) : <div>Loading Keck I...</div>}
          </Item>
        </Grid>

        {/* Keck II instrument status */}
        <Grid size={{ xs: 12, sm: 4, md: 4 }} sx={{ height: "100%" }}>
          <Item>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Keck II
          </Typography>
            {keckII.length > 0 ? renderTable(keckII) : <div>Loading Keck II...</div>}
          </Item>
        </Grid>

        {/* User information */}
        <Grid size={{ xs: 12, sm: 4, md: 4 }} sx={{ height: "100%" }}>
          <Item>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Your Information
          </Typography>
            {user ? (
              <UserTable user={user} />
            ) : (
              <div>Loading your information...</div>
            )}
          </Item>
        </Grid>
      </Grid>

      {/* Night metrics strip */}
      <Box sx={{ height: 24 }} /> 
      {metricsData?.[0] ? (
        <OrderedNightMetricsStrip data={metricsData[0]} />
      ) : (
        <div>Loading metrics...</div>
      )}
      <Box sx={{ height: 24 }} /> 
    </Main>
  );
}