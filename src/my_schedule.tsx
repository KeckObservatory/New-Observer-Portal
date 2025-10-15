import {  Paper } from "@mui/material";
// import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import  { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
//import { obsScheduleApi } from "./api";
//import type { obsScheduleApiResponse } from "./api";
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';
import  {List} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import {Link} from "@mui/material";

import urls from './urls.json';
import type { userInfoApiResponse } from './api';

import { CircularProgress } from "@mui/material";
import { useCombinedSchedule } from "./api";


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
  user: userInfoApiResponse | null;
};


export function MyObsSchedule({ open, user }: MyScheduleProps) {
  const obsid = user?.Id;
  //const { data: schedule, loading, error } = useCombinedSchedule(obsid || 0); //TODO fix this 0
  const { data: schedule, loading, error } = useCombinedSchedule(4718); 

  const isObserving = !!schedule && schedule.length > 0;

  console.log("User ID:", obsid);
  console.log("Combined schedule:", schedule);

  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          {/* Top Section */}
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">Your Upcoming Keck Observing Nights:</Typography>
          </Box>
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Typography color="error" sx={{ p: 2 }}>
                Error loading schedule: {error}
              </Typography>
            )}

            {!loading && !isObserving && (
              <Typography sx={{ p: 2 }}>No upcoming observing nights found.</Typography>
            )}

            {!loading && isObserving && schedule && (
              <Box sx={{ mt: 2 }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: 331,
                  }}
                >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    tableLayout: "fixed",      
                    width: "100%",             
                  }}
                >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 115}}><b>Date</b></TableCell>
                        <TableCell sx={{ width: 75 }}><b>Start Time</b></TableCell>
                        <TableCell sx={{ width: 75 }}><b>End Time</b></TableCell>
                        <TableCell sx={{ width: 55 }}><b>TelNr</b></TableCell>
                        <TableCell sx={{ width: 100 }}><b>Principal</b></TableCell>
                        <TableCell
                          sx={{
                            width: 300,
                            whiteSpace: "normal",       // allows multiple lines
                            wordBreak: "break-word",    // breaks long words
                            //overflowWrap: "anywhere",   // modern browsers
                          }}
                        >
                          <b>Observers</b>
                        </TableCell>
                        <TableCell sx={{ width: 100 }}><b>Instrument</b></TableCell>
                        <TableCell sx={{ width: 75 }}><b>Project Code</b></TableCell>
                        <TableCell sx={{ width: 100 }}><b>Staff</b></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {schedule.map((night, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ width: 150 }}>{night.Date}</TableCell>
                          <TableCell sx={{ width: 100 }}>{night.StartTime}</TableCell>
                          <TableCell sx={{ width: 100 }}>{night.EndTime}</TableCell>
                          <TableCell>{night.TelNr}</TableCell>
                          <TableCell>{night.Principal}</TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                              py: 1, // spacing between rows
                            }}
                          >
                            {night.Observers}
                          </TableCell>
                          <TableCell>{night.Instrument}</TableCell>
                          <TableCell>{night.ProjCode}</TableCell>
                          <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word", py: 1 }}>
                            {night.staff && night.staff.length > 0 ? (
                              night.staff
                                .filter((s) => ["oa", "sa"].includes(s.Type)) // only show oa and sa
                                .map((s, i) => (
                                  <div key={i}>
                                    {s.FirstName} ({s.Type})
                                  </div>
                                ))
                            ) : (
                              <em>–</em>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>

          {/* Helpful Links Section */}
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">Helpful Links:</Typography>
            <List dense>
              <ListItem>
                <Link
                  href={urls.INSTRUMENTS_HOME}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                >
                  Learn more about instruments
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href={urls.OBSERVING_REQUEST}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                >
                  Create an observing request
                </Link>
              </ListItem>
            </List>
            <Typography>
              Explore "Pre-Observing Support" for more information and links
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Main>
  );
}