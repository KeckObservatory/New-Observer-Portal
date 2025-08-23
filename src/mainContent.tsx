import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import { scheduleApi } from './api';
import { metricsApi } from './api';
import type { ApiResponse } from './api';
import type { metricsApiResponse } from './api';
import { Table } from '@mui/material';
import { TableBody } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableContainer } from '@mui/material';
import { TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
// new
import { Stack, Box, Typography} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from "@mui/icons-material/AccessTime";


// new
// ---- a simple Paper style ----
const StatPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(4),
  minHeight: 120,
}));


// updating clock
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function MetricItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 90 }}>
      <Box>{icon}</Box>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="body2" fontWeight="bold">
        {value}
      </Typography>
    </Stack>
  );
}

export function NightMetricsStrip({ data }: { data?: metricsApiResponse }) {
  const now = useClock();

  const ut = now.toISOString().slice(11, 19);
  const hstDate = new Date(now.getTime() - 10 * 60 * 60 * 1000);
  const hst = hstDate.toISOString().slice(11, 19);

  if (!data) return null;

  return (
    <StatPaper elevation={3}>
      {/* Big clock section */}
      <Stack alignItems="center">
        <AccessTimeIcon fontSize="large" />
        <Typography variant="h4">{ut}</Typography>
        <Typography variant="body2">UT</Typography>
        <Typography variant="body2">HST: {hst}</Typography>
      </Stack>

      {/* Metrics row */}
      <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
        <MetricItem icon={<WbSunnyIcon />} label="Sunset" value={data.sunset} />
        <MetricItem icon={<WbSunnyIcon />} label="Sunrise" value={data.sunrise} />
        <MetricItem icon={<NightsStayIcon />} label="Dusk 12°" value={data.dusk_12deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dawn 12°" value={data.dawn_12deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dusk 18°" value={data.dusk_18deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dawn 18°" value={data.dawn_18deg} />
        <MetricItem icon={<NightsStayIcon />} label="Midpoint" value={data.midpoint} />
        <MetricItem icon={<Brightness2Icon />} label="Moonrise" value={data.moonrise} />
        <MetricItem icon={<Brightness2Icon />} label="Moonset" value={data.moonset} />
        <MetricItem icon={<Brightness2Icon />} label="Illumination" value={(data.moonillumination)} />
      </Stack>
    </StatPaper>
  );
}

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

  // Filter instruments by telescope number
  const keckI = apiData?.filter(item => item.TelNr === 1) || [];
  const keckII = apiData?.filter(item => item.TelNr === 2) || [];

const renderTable = (instruments: ApiResponse[]) => (
  <TableContainer component={Paper}>
    <Table size="small">
      {/* table header -> col names */}
      <TableHead>
        <TableRow>
          <TableCell>Instrument</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Ready</TableCell>
        </TableRow>
      </TableHead>

      {/* actual table data */}
      <TableBody>
        {instruments.map((inst, idx) => {
          const isReady = inst.State === "Scheduled" || inst.State === "TDA Ready";
          // if this ? then this : else this
          return (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: isReady ? "#95EFA3" : "#f8d7da", // green if ready, red if not
              }}
            >
              <TableCell>{inst.Instrument}</TableCell>
              <TableCell>{inst.State || "Unknown"}</TableCell>
              <TableCell>
                {isReady ? <CheckIcon sx={{ color: "green" }} /> : <CheckIcon sx={{ color: "red", visibility: "hidden" }} />}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

   return (
    <Main open={open}>
      <h1>Welcome to the Observer Portal!</h1>
      <Grid container spacing={2} sx={{ height: "85%" }}>
        <Grid size={6} sx={{ height: "100%" }}>
          <Item>
            <h2>Keck I</h2>
            {renderTable(keckI)}
          </Item>
        </Grid>
        <Grid size={6} sx={{ height: "100%" }}>
          <Item>
            <h2>Keck II</h2>
            {renderTable(keckII)}
          </Item>
        </Grid>
        <NightMetricsStrip data={metricsData?.[0]} />
      </Grid>
    </Main>
  );
}