import { Paper } from "@mui/material";
import  { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import urls from './urls.json';
import { useObsLogApi } from "./api";
import { CircularProgress, Link } from "@mui/material";
import { useState} from "react";
import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getCurrentSemester } from "./api";
import type { userInfoApiResponse } from './api';
import { getLastSemesters } from "./api";

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
  user: userInfoApiResponse;
};


export function MyObsLogs({ open, user }: MyLogsProps) {
  const obsid = user?.Id
  const currentSemester = getCurrentSemester();
  const availableSemesters = [currentSemester, ...getLastSemesters(currentSemester, 2)]; // last two semesters

  // to quickly get current semester right when the api returns above
  useEffect(() => {
    if (currentSemester) {
      setSemester(currentSemester);
    }
  }, [currentSemester]);

  // Drop down will auto go to current semester
  const [semester, setSemester] = useState(currentSemester);

  // api call to get logs (or loading state)
  const { data, loading } = useObsLogApi(obsid, semester); 

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
              // When it changes -> reset the semester state -> recall api
              onChange={(e) => setSemester(e.target.value)}
            >
              {availableSemesters.map((s) => ( // Show all avaliable semesters in drop down
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
                const viewUrl = `${urls.PROPOSALS_API}/viewObsLog?filename=${log.filename}&obsid=${obsid}`;
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