import { Paper } from "@mui/material";
import  { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import urls from './urls.json';
import { useObsLogApi } from "./api";
import { CircularProgress, Link } from "@mui/material";
import { useState} from "react";
import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getCurrentSemester } from "./api";
import type { userInfoApiResponse } from './api';
import { getLastSemesters } from "./api";
import { Main } from './theme';

interface MyLogsProps  {
  open: boolean;
  user: userInfoApiResponse;
};

/**
 * MyObsLogs displays the user's observing logs for a selected semester.
 * Allows switching semesters via dropdown and shows loading/error states.
 */
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
          
          {/* Semester selection dropdown */}
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

          {/* Loading spinner */}
          {loading ? ( 
            <Stack alignItems="center" sx={{ p: 3 }}>
              <CircularProgress size={32} />
              <Typography sx={{ mt: 1 }}>Loading logs...</Typography>
            </Stack>
          ) : hasLogs ? (
            // List of logs as links
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
             // No logs found message
            <Typography sx={{ p: 2, color: "text.secondary" }}>
              No observing logs found for this semester.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Main>
  );
}