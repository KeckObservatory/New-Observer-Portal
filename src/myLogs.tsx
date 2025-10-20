import { Paper } from "@mui/material";
// import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import  { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
//import type { obsScheduleApiResponse } from "./api";
// import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@mui/material';
// import  {List} from "@mui/material";
// import ListItem from "@mui/material/ListItem";
// import {Link} from "@mui/material";

import urls from './urls.json';
import { useObsLogApi } from "./api";
import { CircularProgress, Link } from "@mui/material";
// import type { obsLogApiResponse, obsLog } from "./api";


import { useState} from "react";
import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { getCurrentSemester } from "./api";
import type { userInfoApiResponse } from './api';





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

interface MyLogsProps  {
  open: boolean;
  user: userInfoApiResponse | null;
};

// function given current semester calculates previous x semester names -> used in drop down
function getLastSemesters(current: string, count: number): string[] {
  const match = current.match(/(\d{4})([AB])/);
  if (!match) return [];

  let year = parseInt(match[1]);
  let term = match[2];
  const semesters: string[] = [];

  for (let i = 0; i < count; i++) {
    if (term === "A") {
      term = "B";
      year--;
    } else {
      term = "A";
    }
    semesters.push(`${year}${term}`);
  }
  return semesters;
}

export function MyObsLogs({ open, user }: MyLogsProps) {
  const obsid = user?.Id
  console.log("User ID:", obsid)
  const currentSemester = getCurrentSemester();
  const availableSemesters = [currentSemester, ...getLastSemesters(currentSemester, 2)]; // last two semesters

  // to quickly get current semester right when the api returns above
  useEffect(() => {
    if (currentSemester) {
      setSemester(currentSemester);
    }
  }, [currentSemester]);

  // drop down will auto go to current semester
  const [semester, setSemester] = useState(currentSemester);

  // api call to get logs (or loading state)
  const { data, loading } = useObsLogApi(4718, semester); // TODO user.ID

  const logs = data?.logs ?? [];
  const hasLogs = logs.length > 0;
  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">Keck Observing Logs:</Typography>
          </Box>

          <FormControl sx={{ minWidth: 120, m: 2 }}>
            <InputLabel>Semester</InputLabel>
            <Select
              value={semester}
              label="Semester"
              // when it changes -> reset the semester state -> recall api
              onChange={(e) => setSemester(e.target.value)}
            >
              {availableSemesters.map((s) => ( // show all avaliable semesters in drop down
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {loading ? ( // show that is loading
            <Stack alignItems="center" sx={{ p: 3 }}>
              <CircularProgress size={32} />
              <Typography sx={{ mt: 1 }}>Loading logs...</Typography>
            </Stack>
          ) : hasLogs ? (
            <Stack spacing={1} sx={{ p: 2 }}>
              {logs.map((log) => {
                const viewUrl = `${urls.SERVE_LOG}?filename=${log.filename}&obsid=${obsid}`;
                return (
                  <Link
                    key={viewUrl}
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{
                      fontSize: "1rem",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {log.title}
                  </Link>
                );
              })}
            </Stack>
          ) : (
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              No observing logs found for this semester.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Main>
  );
}