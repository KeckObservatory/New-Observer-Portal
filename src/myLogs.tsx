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

// import urls from './urls.json';
import { obsLogApi } from "./api";
import { CircularProgress, Link } from "@mui/material";
import type { obsLogApiResponse } from "./api";



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
  //obsSchedule: obsScheduleApiResponse;
};

export function MyObsLogs({ open }: MyLogsProps) {
  // your existing data hook
  const data = (obsLogApi(4718, "2025A") as obsLogApiResponse) || { logs: [] };

  const isLoading = !data; // before fetch completes
  const logs = data?.logs ?? [];
  const hasLogs = logs.length > 0;

  // Base backend URL for viewing log HTMLs
  const BASE_URL = "https://www3build.keck.hawaii.edu/api/proposals/view/";

  return (
    <Main open={open}>
      <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderBottom: 2, borderColor: "divider" }}>
            <Typography variant="h6">Keck Observing Logs:</Typography>
          </Box>

          {isLoading ? (
            <Stack alignItems="center" sx={{ p: 3 }}>
              <CircularProgress size={32} />
              <Typography sx={{ mt: 1 }}>Loading logs...</Typography>
            </Stack>
          ) : hasLogs ? (
            <Stack spacing={1} sx={{ p: 2 }}>
              {logs.map((log) => {
                // build full Flask URL for each file
                const viewUrl = `${BASE_URL}${encodeURIComponent(log.filename)}`;
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
