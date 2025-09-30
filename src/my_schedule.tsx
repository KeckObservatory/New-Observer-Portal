import { Paper } from "@mui/material";
// import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import  { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import { obsScheduleApi } from "./api";
//import type { obsScheduleApiResponse } from "./api";
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';
import  {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Link} from "@mui/material";

import urls from './urls.json';



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

interface MyScheduleProps  {
  open: boolean;
  //obsSchedule: obsScheduleApiResponse;
};

export function MyObsSchedule({ open }: MyScheduleProps) {
    //const telescopeSchedData = scheduleApi();           // ApiResponse[] | null
    const schedule = obsScheduleApi(4718) || []
    const isObserving = schedule.length > 0 // if returns something, then they have observing nights

    return (
    <Main open={open}>
        <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
            <Stack spacing={2}>
                <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
                    <Typography>Your Upcoming Keck Observing Nights:</Typography>

                    {/* are they observing? */}
                    {!isObserving ? (
                    // if not... there is nothing to show
                    <Typography sx={{ p: 2 }}></Typography>
                    ) : (
                    // case: render table
                <Box sx={{ mt: 2 }}>
                <TableContainer component={Paper}
                sx={{
                maxHeight: 331, // set max height, so when new items are added it will scroll
                }}
                >
                <Table size="small" stickyHeader>
                    <TableHead>
                    <TableRow>
                      <TableCell><b>Date</b></TableCell>
                      <TableCell><b>Start Time</b></TableCell>
                      <TableCell><b>End Time</b></TableCell>
                      <TableCell><b>Telescope</b></TableCell>
                      <TableCell><b>Principle</b></TableCell>
                      <TableCell><b>Observers</b></TableCell>
                      <TableCell><b>Instrument</b></TableCell>
                      <TableCell><b>Project Code</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* map through each scheduled night as index */}
                   {schedule.map((night, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{night.Date}</TableCell>
                        <TableCell>{night.StartTime}</TableCell>
                        <TableCell>{night.EndTime}</TableCell>
                        <TableCell>{night.TelNr}</TableCell>
                        <TableCell>{night.Principal}</TableCell>
                        <TableCell>{night.Observers}</TableCell>
                        <TableCell>{night.Instrument}</TableCell>
                        <TableCell>{night.ProjCode}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                  </Box>
                    )}
                </Box>

                {/* Second row */}
                <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
                <Typography>Helpful Links:</Typography>
                  <List dense>
                    <ListItem >
                    <Link href={urls.INSTRUMENTS_HOME} target="_blank" rel="noopener" underline="hover">
                        Learn more about instruments
                    </Link>
                    </ListItem>
                    <ListItem >
                    <Link href={urls.OBSERVING_REQUEST} target="_blank" rel="noopener" underline="hover">
                        Create an observing request
                    </Link>
                    </ListItem>
                </List>
                <Typography>Explore "Pre-Observing Support" for more information and links</Typography>
                </Box>
            </Stack>
        </Paper>
    </Main>
  );
}